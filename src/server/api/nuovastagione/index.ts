import { createTRPCRouter } from '~/server/api/trpc'
import { getFaseAvvioProcedure } from './procedures/getFaseAvvio'
import { chiudiStagioneProcedure } from './procedures/chiudiStagione'
import { preparaStagioneProcedure } from './procedures/preparaStagione'
import { preparaIdSquadreProcedure } from './procedures/preparaIdSquadre'
import { creaClassificheProcedure } from './procedures/creaClassifiche'
import { creaPartiteProcedure } from './procedures/creaPartite'

export const nuovastagioneRouter = createTRPCRouter({
  getFaseAvvio: getFaseAvvioProcedure,
  chiudiStagione: chiudiStagioneProcedure,
  preparaStagione: preparaStagioneProcedure,
  preparaIdSquadre: preparaIdSquadreProcedure,
  creaClassifiche: creaClassificheProcedure,
  creaPartite: creaPartiteProcedure,
})
