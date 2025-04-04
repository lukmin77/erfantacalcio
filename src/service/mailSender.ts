import { env } from 'process'
import Logger from '~/lib/logger'
import { Resend } from 'resend'

const resend = new Resend(env.MAIL_API_KEY)

export async function ReSendMailAsync(
  to: string,
  subject: string,
  htmlMessage: string,
) {
  const { data, error } = await resend.emails.send({
    from: env.MAIL_FROM ?? 'notify@erfantacalcio.com',
    to: to,
    subject: subject,
    html: htmlMessage,
  })

  if (error) {
    return Logger.error({ error })
  }

  Logger.info({ data })
}
