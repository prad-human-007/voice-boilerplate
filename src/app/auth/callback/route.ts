import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  // The `/auth/callback` route is required for the server-side auth flow implemented
  // by the SSR package. It exchanges an auth code for the user's session.
  // https://supabase.com/docs/guides/auth/server-side/nextjs
  console.log("Openning /auth/callback");
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const origin = requestUrl.origin;
  const redirectTo = requestUrl.searchParams.get("redirect_to")?.toString();
  console.log("GET /auth/callback Thisis the code: ", code);
  if (code) {
    const supabase = await createClient();
    const {data: {session} }  = await supabase.auth.exchangeCodeForSession(code);
    const token = session?.access_token;
    if(token) {
      const response = await fetch(`${origin}/api/createUser`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const res = await response.json();
      console.log("Response of the fetch: ", res);
    }
  }

  if (redirectTo) {
    return NextResponse.redirect(`${origin}${redirectTo}`);
  }

  // URL to redirect to after sign up process completes
  return NextResponse.redirect(`${origin}/`);
}