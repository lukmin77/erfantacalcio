import Logger from "~/lib/logger";
import { SendMail } from "~/service/mailSender";

import {
    createTRPCRouter,
    publicProcedure
} from "~/server/api/trpc";




export const testRouter = createTRPCRouter({

    sendMail: publicProcedure
        .query(async () => {

            try {
                Logger.info("sending mail");
                SendMail('ErFantacalcio: test', 'lucianominni@gmail.com', 'Notifica automatica da erFantacalcio.com');
                Logger.info("mail sent");
            } catch (error) {
                Logger.error('Si è verificato un errore', error);
                throw error;
            }
        }),
});
