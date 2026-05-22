export async function api<T>(url: string, options?: RequestInit): Promise<T> {
    const response = await fetch(
        url, options
    );
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message);
    }
    return data;
}