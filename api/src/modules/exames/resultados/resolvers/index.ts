// resolvers/index.ts
import { RequestExames } from '../DTO/RequestExamesDTO';
import { resolverVisaoGeralShotgun, resolverPainelGeralShotgun } from './shotgun';
// import { resolver16s } from './bioneutro';
// import { resolverGenetico } from './genetico';
// import { resolverPoligenico } from './poligenico';

export const resolversVisaoGeral: Record<number, (req: RequestExames) => Promise<unknown>> = {
    2: resolverVisaoGeralShotgun,
    // 2: resolver16s,
    // 3: resolverGenetico,
    // 4: resolverPoligenico
};

export const resolverPainelGeral: Record<number, (req: RequestExames) => Promise<unknown>> = {
    2: resolverPainelGeralShotgun
}