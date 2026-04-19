type EnvCandidate = {
  name: string;
  value: string | undefined;
};

export class SupabaseConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SupabaseConfigError";
  }
}

function isPlaceholder(value: string): boolean {
  const normalized = value.trim().toLowerCase();
  return (
    normalized === "your-anon-key" ||
    normalized === "your-publishable-key" ||
    normalized === "your-secret-key" ||
    normalized === "your-service-role-key" ||
    normalized.includes("your-project") ||
    normalized.startsWith("replace-") ||
    normalized.startsWith("changeme")
  );
}

function readConfiguredValue(kind: string, candidates: EnvCandidate[]): { name: string; value: string } {
  const present = candidates
    .map((candidate) => ({
      name: candidate.name,
      value: candidate.value?.trim(),
    }))
    .filter((candidate): candidate is { name: string; value: string } => Boolean(candidate.value));

  if (present.length === 0) {
    throw new SupabaseConfigError(`Missing ${kind}. Set ${candidates.map((candidate) => candidate.name).join(" or ")}.`);
  }

  const configured = present.find((candidate) => !isPlaceholder(candidate.value));
  if (!configured) {
    throw new SupabaseConfigError(
      `${present[0].name} still contains a placeholder value. Replace it with a real Supabase ${kind}.`,
    );
  }

  return configured;
}

function looksLikeLegacyJwt(value: string): boolean {
  return /^eyJ[A-Za-z0-9_-]*\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/.test(value);
}

function looksLikePublishableKey(value: string): boolean {
  return value.startsWith("sb_publishable_");
}

function looksLikeSecretKey(value: string): boolean {
  return value.startsWith("sb_secret_");
}

export function getSupabaseUrl(): string {
  const { value: url } = readConfiguredValue("project URL", [
    { name: "NEXT_PUBLIC_SUPABASE_URL", value: process.env.NEXT_PUBLIC_SUPABASE_URL },
  ]);

  try {
    new URL(url);
  } catch {
    throw new SupabaseConfigError("NEXT_PUBLIC_SUPABASE_URL must be a valid Supabase project URL.");
  }

  return url;
}

export function getSupabaseBrowserKey(): string {
  const { name, value: key } = readConfiguredValue("browser key", [
    { name: "NEXT_PUBLIC_SUPABASE_ANON_KEY", value: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY },
    { name: "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", value: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY },
  ]);

  if (looksLikeSecretKey(key)) {
    throw new SupabaseConfigError(`${name} is a secret key. Use an anon or publishable key for browser access.`);
  }

  if (!looksLikePublishableKey(key) && !looksLikeLegacyJwt(key)) {
    throw new SupabaseConfigError(
      `${name} does not look like a Supabase anon/publishable API key. Use the project's anon public key or publishable key.`,
    );
  }

  return key;
}

export function getSupabaseServerKey(): string {
  const { name, value: key } = readConfiguredValue("server key", [
    { name: "SUPABASE_SERVICE_ROLE_KEY", value: process.env.SUPABASE_SERVICE_ROLE_KEY },
    { name: "SUPABASE_SECRET_KEY", value: process.env.SUPABASE_SECRET_KEY },
  ]);

  if (looksLikePublishableKey(key)) {
    throw new SupabaseConfigError(`${name} is a publishable key. Use a service-role key or secret API key on the server.`);
  }

  if (!looksLikeSecretKey(key) && !looksLikeLegacyJwt(key)) {
    throw new SupabaseConfigError(
      `${name} does not look like a Supabase server API key. Do not use the project's JWT secret; use the service_role key or secret API key.`,
    );
  }

  return key;
}
