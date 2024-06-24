import Logger from "~/lib/logger";
import { SendMail } from "~/service/mailSender";

import {
  createTRPCRouter,
  publicProcedure
} from "~/server/api/trpc";




export const testRouter = createTRPCRouter({

  sendMail: publicProcedure
    .query(async (opts) => {

      Logger.info("sending mail");
      await SendMail('ErFantacalcio: test', 'lucianominni@gmail.com', 'Notifica automatica da erFantacalcio.com');
      Logger.info("mail sent"); 
    }
})