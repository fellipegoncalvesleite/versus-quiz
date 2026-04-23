import { NextResponse } from "next/server";
import { SupabaseConfigError } from "./env";

type SupabaseLikeError = {
  code?: string;
  message?: string;
};

function isInvalidApiKeyError(error: SupabaseLikeError | null | undefined): boolean {
  const message = error?.message?.toLowerCase() ?? "";
  return error?.code === "PGRST301" || message.includes("invalid api key");
}

export function supabaseConfigResponse(error: unknown): NextResponse | null {
  if (!(error instanceof SupabaseConfigError)) return null;
  return NextResponse.json({ error: error.message }, { status: 503 });
}

export function supabaseQueryErrorResponse(
  error: SupabaseLikeError | null | undefined,
  fallback: string,
): NextResponse {
  if (isInvalidApiKeyError(error)) {
    return NextResponse.json(
      {
        error:
          "Supabase rejected the server API key. Check SUPABASE_SERVICE_ROLE_KEY or SUPABASE_SECRET_KEY in .env.local.",
      },
      { status: 503 },
    );
  }

  return NextResponse.json({ error: error?.message ?? fallback }, { status: 500 });
}
