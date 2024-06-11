import {type NextRequest, NextResponse } from "next/server";
import { RuoloUtente } from "~/utils/enums";
import { getToken } from "next-auth/jwt";

export const middleware = async (req: NextRequest) => {
  const adminPages = [
    "/presidenti",
    "/uploadVoti",
    "/calendario",
    "/risultati",
    "/giocatori",
    "/voti"
  ];
  
  const reservedPages = [
    "/foto",
    "/stat_giocatori"
  ];

  const { nextUrl } = req;
  const pathname = nextUrl.pathname;
  const loginUrl = new URL("/login", req.url);
  const homeUrl = new URL("/", req.url);

  const token = await getToken({req : req, secret: process.env.JWT_SECRET})
  
  //utente NON CONNESSO sta puntando a pagine riservate
  if ((!token || token === null) && (reservedPages.includes(pathname) || adminPages.includes(pathname))) {
    return NextResponse.redirect(loginUrl);
  }

  //utente contributor CONNESSO ma su una pagina riservata ad admin
  if (token?.ruolo === RuoloUtente.contributor && adminPages.includes(pathname)) {
    return NextResponse.redirect(homeUrl);
  }

};

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|images|login).*)"],
};
