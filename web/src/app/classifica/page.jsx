'use client'

import { useState, useRef, useCallback } from "react";

const BATCH_SIZE = 50;
const DELAY_MS = 800;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function classifyBatch(taxa) {
    const names = taxa.map((t) => t.descricao);
    const prompt = `You are a microbiologist. Classify each taxon based on scientific literature.
    Use EXACTLY one of these labels for each taxon:
    - "benefico" — clearly beneficial to human/animal health (probiotics, commensals with documented benefit, nitrogen fixers, biocontrol agents, plant growth promoters)
    - "patogeno" — causes disease in humans or animals (confirmed pathogen in at least one host)
    - "desconhecido" — ambiguous, context-dependent, environmental only, no clear health role documented, or insufficient data

    Rules:
    - Species/genus with "sp." or strain codes: classify based on genus-level knowledge if available; otherwise "desconhecido"
    - Candidatus, uncultured, environmental organisms: mostly "desconhecido" unless well-documented
    - Return ONLY a valid JSON object. Keys = exact taxon names, values = the label string. No extra text, no markdown, no code block.

    Taxa to classify:
    ${JSON.stringify(names)}`;

    const resp = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 2000,
        messages: [{ role: "user", content: prompt }],
    }),
    });

  if (!resp.ok) {
    const err = await resp.text();
    throw new Error(`API error ${resp.status}: ${err}`);
  }

  const data = await resp.json();
  const text = data.content?.[0]?.text ?? "";

  // Try to parse JSON from the response
  let cleaned = text.trim();
  // Remove markdown code blocks if present
  cleaned = cleaned.replace(/^```(?:json)?\s*/i, "").replace(/\s*```\s*$/, "");
  
  return JSON.parse(cleaned);
}

const LABEL_COLORS = {
  benefico: { bg: "#e8f5e9", text: "#2e7d32", border: "#66bb6a" },
  patogeno: { bg: "#ffebee", text: "#c62828", border: "#ef5350" },
  desconhecido: { bg: "#fff8e1", text: "#ef6c00", border: "#ffca28" },
  fallback: { bg: "#eceff1", text: "#455a64", border: "#90a4ae" }
};

const LABEL_PT = {
  benefico: "Benéfico",
  patogeno: "Patogênico",
  desconhecido: "Desconhecido",
  fallback: "FALLBACK"
};

export default function TaxonClassifier() {
  const [taxons, setTaxons] = useState([]);
  const [results, setResults] = useState({});
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | processing | done | paused
  const [progress, setProgress] = useState({ done: 0, total: 0, batch: 0 });
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const pauseRef = useRef(false);
  const fileRef = useRef(null);

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target.result;
      const lines = text.split(/\r?\n/).filter(Boolean);
      // Detect separator
      const sep = lines[0].includes(";") ? ";" : "\t";
      const parsed = [];
      for (let i = 1; i < lines.length; i++) {
        const parts = lines[i].split(sep);
        if (parts.length >= 2) {
          parsed.push({ cod_ncbi: parts[0].trim(), descricao: parts.slice(1).join(sep).trim() });
        }
      }
      setTaxons(parsed);
      setResults({});
      setErrors({});
      setStatus("idle");
      setProgress({ done: 0, total: parsed.length, batch: 0 });
    };
    reader.readAsText(file, "UTF-8");
  };

  const startProcessing = useCallback(async () => {
    if (!taxons.length) return;
    setStatus("processing");
    pauseRef.current = false;

    const pending = taxons.filter((t) => !results[t.cod_ncbi]);
    const total = taxons.length;
    let done = Object.keys(results).length;

    for (let i = 0; i < pending.length; i += BATCH_SIZE) {
      if (pauseRef.current) {
        setStatus("paused");
        return;
      }

      const batch = pending.slice(i, i + BATCH_SIZE);
      const batchNum = Math.floor(i / BATCH_SIZE) + 1;
      setProgress((p) => ({ ...p, batch: batchNum, done, total }));

      try {
        const classified = await classifyBatch(batch);
        setResults((prev) => {
          const next = { ...prev };
          for (const t of batch) {
            const label = classified[t.descricao];
            if (label && ["benefico", "patogeno", "desconhecido"].includes(label)) {
              next[t.cod_ncbi] = label;
            } else {
              next[t.cod_ncbi] = "fallback";
            }
          }
          return next;
        });
        done += batch.length;
        setProgress((p) => ({ ...p, done }));
      } catch (err) {
        // Mark batch as error, continue
        setErrors((prev) => {
          const next = { ...prev };
          for (const t of batch) next[t.cod_ncbi] = err.message;
          return next;
        });
        setResults((prev) => {
          const next = { ...prev };
          for (const t of batch) next[t.cod_ncbi] = "fallback";
          return next;
        });
        done += batch.length;
      }

      if (i + BATCH_SIZE < pending.length) await sleep(DELAY_MS);
    }

    setStatus("done");
    setProgress((p) => ({ ...p, done: total }));
  }, [taxons, results]);

  const pause = () => {
    pauseRef.current = true;
  };

  const downloadCSV = () => {
    const header = "cod_ncbi;descricao;classificacao";
    const rows = taxons.map(
      (t) =>
        `${t.cod_ncbi};${t.descricao.replace(/;/g, ",")};"${results[t.cod_ncbi] || ""}"`
    );
    const csv = [header, ...rows].join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "taxons_classificados.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  // Stats
  const counts = { benefico: 0, patogeno: 0, desconhecido: 0, total: 0 };
  for (const v of Object.values(results)) {
    counts[v] = (counts[v] || 0) + 1;
    counts.total++;
  }

  const filtered = taxons.filter((t) => {
    const matchFilter = filter === "all" || results[t.cod_ncbi] === filter || (filter === "pending" && !results[t.cod_ncbi]);
    const matchSearch =
      !search ||
      t.descricao.toLowerCase().includes(search.toLowerCase()) ||
      t.cod_ncbi.includes(search);
    return matchFilter && matchSearch;
  });

  const pct = progress.total ? Math.round((progress.done / progress.total) * 100) : 0;

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", background: "#f8f9fa", minHeight: "100vh", padding: "24px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#1a1a2e", margin: 0 }}>
            🧬 Classificador de Táxons
          </h1>
          <p style={{ color: "#666", fontSize: 13, marginTop: 4 }}>
            Classifica automaticamente táxons bacterianos como Benéfico, Patogênico ou Desconhecido usando literatura científica.
          </p>
        </div>

        {/* Upload */}
        <div
          style={{
            background: "#fff",
            borderRadius: 12,
            padding: 20,
            marginBottom: 20,
            border: "1px solid #e0e0e0",
            display: "flex",
            alignItems: "center",
            gap: 16,
            flexWrap: "wrap",
          }}
        >
          <button
            onClick={() => fileRef.current.click()}
            style={{
              background: "#1a1a2e",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              padding: "10px 18px",
              cursor: "pointer",
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            📂 Carregar arquivo CSV/TXT
          </button>
          <input
            ref={fileRef}
            type="file"
            accept=".csv,.txt"
            style={{ display: "none" }}
            onChange={handleFile}
          />
          {taxons.length > 0 && (
            <span style={{ color: "#555", fontSize: 13 }}>
              ✅ {taxons.length.toLocaleString()} táxons carregados
            </span>
          )}
          <div style={{ marginLeft: "auto", display: "flex", gap: 10 }}>
            {taxons.length > 0 && status !== "processing" && (
              <button
                onClick={startProcessing}
                style={{
                  background: "#2e7d32",
                  color: "#fff",
                  border: "none",
                  borderRadius: 8,
                  padding: "10px 18px",
                  cursor: "pointer",
                  fontSize: 14,
                  fontWeight: 600,
                }}
              >
                {status === "paused" ? "▶ Retomar" : "▶ Iniciar Classificação"}
              </button>
            )}
            {status === "processing" && (
              <button
                onClick={pause}
                style={{
                  background: "#e65100",
                  color: "#fff",
                  border: "none",
                  borderRadius: 8,
                  padding: "10px 18px",
                  cursor: "pointer",
                  fontSize: 14,
                  fontWeight: 600,
                }}
              >
                ⏸ Pausar
              </button>
            )}
            {counts.total > 0 && (
              <button
                onClick={downloadCSV}
                style={{
                  background: "#1565c0",
                  color: "#fff",
                  border: "none",
                  borderRadius: 8,
                  padding: "10px 18px",
                  cursor: "pointer",
                  fontSize: 14,
                  fontWeight: 600,
                }}
              >
                ⬇ Baixar CSV
              </button>
            )}
          </div>
        </div>

        {/* Progress */}
        {(status === "processing" || status === "paused" || status === "done") && (
          <div
            style={{
              background: "#fff",
              borderRadius: 12,
              padding: 20,
              marginBottom: 20,
              border: "1px solid #e0e0e0",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: "#333" }}>
                {status === "done"
                  ? "✅ Classificação concluída!"
                  : status === "paused"
                  ? "⏸ Pausado"
                  : `⚙️ Processando lote ${progress.batch}…`}
              </span>
              <span style={{ fontSize: 14, color: "#666" }}>
                {progress.done.toLocaleString()} / {progress.total.toLocaleString()} ({pct}%)
              </span>
            </div>
            <div style={{ background: "#e8eaf6", borderRadius: 6, height: 10, overflow: "hidden" }}>
              <div
                style={{
                  width: `${pct}%`,
                  height: "100%",
                  background: status === "done" ? "#2e7d32" : "#3f51b5",
                  transition: "width 0.3s",
                  borderRadius: 6,
                }}
              />
            </div>
            {/* Stats chips */}
            <div style={{ display: "flex", gap: 12, marginTop: 14, flexWrap: "wrap" }}>
              {Object.entries(LABEL_COLORS).map(([k, c]) => (
                <div
                  key={k}
                  style={{
                    background: c.bg,
                    color: c.text,
                    border: `1px solid ${c.border}`,
                    borderRadius: 20,
                    padding: "4px 14px",
                    fontSize: 13,
                    fontWeight: 600,
                  }}
                >
                  {LABEL_PT[k]}: {(counts[k] || 0).toLocaleString()}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Table */}
        {taxons.length > 0 && (
          <div
            style={{
              background: "#fff",
              borderRadius: 12,
              border: "1px solid #e0e0e0",
              overflow: "hidden",
            }}
          >
            {/* Filters */}
            <div
              style={{
                padding: "14px 20px",
                borderBottom: "1px solid #eee",
                display: "flex",
                gap: 10,
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              <input
                type="text"
                placeholder="🔍 Buscar táxon ou código NCBI…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  border: "1px solid #ddd",
                  borderRadius: 8,
                  padding: "7px 12px",
                  fontSize: 13,
                  width: 260,
                  outline: "none",
                }}
              />
              {["all", "benefico", "patogeno", "desconhecido",'fallback', "pending"].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  style={{
                    padding: "6px 14px",
                    borderRadius: 20,
                    border: `1px solid ${filter === f ? "#3f51b5" : "#ddd"}`,
                    background: filter === f ? "#e8eaf6" : "#fff",
                    color: filter === f ? "#3f51b5" : "#555",
                    cursor: "pointer",
                    fontSize: 12,
                    fontWeight: filter === f ? 700 : 400,
                  }}
                >
                  {f === "all"
                    ? `Todos (${taxons.length.toLocaleString()})`
                    : f === "pending"
                    ? `Pendentes (${(taxons.length - counts.total).toLocaleString()})`
                    : `${LABEL_PT[f]} (${(counts[f] || 0).toLocaleString()})`}
                </button>
              ))}
            </div>

            {/* Table header */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "120px 1fr 160px",
                padding: "10px 20px",
                background: "#f5f5f5",
                borderBottom: "1px solid #eee",
                fontSize: 12,
                fontWeight: 700,
                color: "#444",
                textTransform: "uppercase",
                letterSpacing: 0.5,
              }}
            >
              <span>Cód. NCBI</span>
              <span>Táxon</span>
              <span>Classificação</span>
            </div>

            {/* Table rows - virtualized manually (show max 200) */}
            <div style={{ maxHeight: 500, overflowY: "auto" }}>
              {filtered.slice(0, 300).map((t) => {
                const label = results[t.cod_ncbi];
                const colors = label ? LABEL_COLORS[label] : null;
                return (
                  <div
                    key={t.cod_ncbi}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "120px 1fr 160px",
                      padding: "9px 20px",
                      borderBottom: "1px solid #f0f0f0",
                      alignItems: "center",
                      fontSize: 13,
                    }}
                  >
                    <span style={{ color: "#888", fontFamily: "monospace", fontSize: 11 }}>
                      {t.cod_ncbi}
                    </span>
                    <span style={{ color: "#222", fontStyle: "italic" }}>{t.descricao}</span>
                    <span>
                      {label ? (
                        <span
                          style={{
                            background: colors.bg,
                            color: colors.text,
                            border: `1px solid ${colors.border}`,
                            borderRadius: 12,
                            padding: "3px 10px",
                            fontSize: 12,
                            fontWeight: 600,
                          }}
                        >
                          {LABEL_PT[label]}
                        </span>
                      ) : (
                        <span style={{ color: "#bbb", fontSize: 12 }}>aguardando…</span>
                      )}
                    </span>
                  </div>
                );
              })}
              {filtered.length > 300 && (
                <div
                  style={{
                    padding: "12px 20px",
                    textAlign: "center",
                    color: "#888",
                    fontSize: 13,
                    background: "#fafafa",
                  }}
                >
                  Exibindo 300 de {filtered.length.toLocaleString()} resultados. Use filtros ou baixe o CSV completo.
                </div>
              )}
              {filtered.length === 0 && (
                <div style={{ padding: "30px", textAlign: "center", color: "#aaa", fontSize: 14 }}>
                  Nenhum resultado encontrado.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Instructions */}
        {taxons.length === 0 && (
          <div
            style={{
              background: "#fff",
              borderRadius: 12,
              padding: 32,
              border: "1px dashed #ccc",
              textAlign: "center",
              color: "#888",
            }}
          >
            <div style={{ fontSize: 40, marginBottom: 12 }}>🦠</div>
            <p style={{ fontSize: 15, fontWeight: 600, color: "#555", margin: "0 0 8px" }}>
              Carregue seu arquivo de táxons
            </p>
            <p style={{ fontSize: 13, margin: 0 }}>
              Formato esperado: arquivo <code>.csv</code> ou <code>.txt</code> com colunas separadas por <strong>;</strong>
              <br />
              Cabeçalho: <code>cod_ncbi;descricao</code>
            </p>
          </div>
        )}

        <p style={{ fontSize: 11, color: "#aaa", textAlign: "center", marginTop: 16 }}>
          Classificação em lotes de {BATCH_SIZE} táxons • Baseado em literatura científica via Claude Sonnet
        </p>
      </div>
    </div>
  );
}