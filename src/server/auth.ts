import Logger from "~/lib/logger";
import { type GetServerSidePropsContext } from "next";
import { getServerSession, type DefaultSession, type NextAuthOptions, type DefaultUser } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { computeMD5Hash } from '~/utils/hashPassword';
import { RuoloUtente } from "~/utils/enums";
import prisma from "~/utils/db";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 */
interface IUser extends DefaultUser {
  ruolo?: RuoloUtente
  idSquadra: number;
  squadra: string;
  presidente: string;
}

declare module "next-auth" {
  interface User extends IUser {
    idSquadra: number;
  }

  interface Session extends DefaultSession {
    user?: User;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends IUser {
    idSquadra: number;
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 */
export const authOptions: NextAuthOptions = {
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      /* Step 1: update the token based on the user object */
      if (user) {
        token.ruolo = user.ruolo;
        token.squadra = user.squadra;
        token.idSquadra = user.idSquadra;
        token.email = user.email;
        token.image = user.image;
        token.presidente = user.presidente;
      }
      if (trigger === "update" && session) {
        /* eslint-disable */
        token.image = session?.user.image as string;
        /* eslint-enable */
      }
      return token;
    },
    async session({ session, token }) {
      const updatedSession = {
        ...session,
        user: {
          ...session.user,
          id: token.sub,
          ruolo: token.ruolo,
          idSquadra: token.idSquadra,
          squadra: token.squadra,
          email: token.email,
          presidente: token.presidente,
          image: token.image?.toString()
        }
      };
      return updatedSession;
    }
  },
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      id: "erFantacalcio",
      name: "erFantacalcio",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "username" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        const apiResponse = await authenticate({
          username: credentials?.username ?? '',
          password: credentials?.password ?? ''
        });

        if (apiResponse) {
          const user: IUser = {
            id: apiResponse.idUtente.toString(),
            ruolo: apiResponse.adminLevel ? RuoloUtente.admin : RuoloUtente.contributor,
            idSquadra: apiResponse.idUtente,
            squadra: apiResponse.nomeSquadra,
            presidente: apiResponse.presidente,
            email: apiResponse.mail,
            image: apiResponse.foto
          };
          Logger.info(`autenticato:${apiResponse.presidente}`);
          return { ...user };
        } else {
          return null;
        }
      }
    })
    // Add more providers here if needed
  ],
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 */
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};

async function authenticate(input: { username: string; password: string }) {
  Logger.info('authenticate: ' + input.username);
  try {
    const hashedPassword = computeMD5Hash(input.password);
    return await prisma.utenti.findUnique({
      where: {
        username_pwd: { username: input.username.toLowerCase(), pwd: hashedPassword}
      }
    });
  } 
  catch (error) 
  {
    Logger.error('Si è verificato un errore', error);
    return null;
  }
}