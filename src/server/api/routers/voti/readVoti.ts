import Logger from '~/lib/logger.server'
import { adminProcedure } from '../../trpc'
import { z } from 'zod'
import { parse } from 'csv-parse'
import { Configurazione } from '~/config'
import { normalizeNomeGiocatore } from '~/utils/helper'
import { formatToDecimalValue } from '~/utils/numberUtils'
import { iVotoGiocatore } from '~/types/voti'

export const readVotiProcedure = adminProcedure
  .input(
    z.object({
      fileUrl: z.string(),
    }),
  )
  .mutation(async (opts) => {
    try {
      return await readFileVotiVercel(opts.input.fileUrl)
    } catch (error) {
      Logger.error('Si è verificato un errore', error)
      throw error
    }
  })

async function readFileVotiVercel(fileUrl: string): Promise<iVotoGiocatore[]> {
  const voti: iVotoGiocatore[] = []
  const headers: string[] = []
  for (let i = 1; i <= Configurazione.pfColumns; i++) {
    headers.push(`Col${i}`)
  }

  try {
    Logger.info('fileUrl:', { fileUrl: fileUrl })
    const response = await fetch(fileUrl)
    if (!response.ok) {
      throw new Error(`Failed to fetch file: ${response.statusText}`)
    }
    const fileContent = await response.text()

    return new Promise((resolve, reject) => {
      parse(
        fileContent,
        {
          delimiter: '\t',
          columns: headers,
          on_record: (line: Record<string, string>) => {
            if (
              isNaN(
                parseFloat(
                  line[`Col${Configurazione.pfColumnIdGiocatore}`] ?? '0',
                ),
              )
            ) {
              return
            } else {
              voti.push({
                id_pf: line[`Col${Configurazione.pfColumnIdGiocatore}`]
                  ? parseInt(
                      line[`Col${Configurazione.pfColumnIdGiocatore}`] ?? '0',
                    )
                  : null,
                Nome: normalizeNomeGiocatore(
                  line[`Col${Configurazione.pfColumnNome}`] ?? '',
                ),
                Ruolo: normalizeNomeGiocatore(
                  line[`Col${Configurazione.pfColumnRuolo}`] ?? '',
                ),
                Squadra: line[`Col${Configurazione.pfColumnSquadra}`] ?? '',
                Voto: formatToDecimalValue(
                  line[`Col${Configurazione.pfColumnVoto}`] ?? '0',
                ),
                GolSegnati: formatToDecimalValue(
                  line[`Col${Configurazione.pfColumnGolFatti}`] ?? '0',
                ),
                GolSubiti: formatToDecimalValue(
                  line[`Col${Configurazione.pfColumnGolSubiti}`] ?? '0',
                ),
                Assist: formatToDecimalValue(
                  line[`Col${Configurazione.pfColumnAssist}`] ?? '0',
                ),
                Ammonizione: formatToDecimalValue(
                  line[`Col${Configurazione.pfColumnAmmo}`] ?? '0',
                ),
                Espulsione: formatToDecimalValue(
                  line[`Col${Configurazione.pfColumnEspu}`] ?? '0',
                ),
                Autogol: formatToDecimalValue(
                  line[`Col${Configurazione.pfColumnAutogol}`] ?? '0',
                ),
                RigoriErrati: formatToDecimalValue(
                  line[`Col${Configurazione.pfColumnRigErrato}`] ?? '0',
                ),
                RigoriParati: formatToDecimalValue(
                  line[`Col${Configurazione.pfColumnRigParato}`] ?? '0',
                ),
              })
              //Logger.info('voti:', { voti: voti });
            }
          },
        },
        (error) => {
          if (error) {
            console.error(error)
            reject(error)
          } else {
            console.log(voti.length)
            resolve(voti)
          }
        },
      )
    })
  } catch (error) {
    console.error(error)
    throw new Error('Failed to fetch file data')
  }
}
