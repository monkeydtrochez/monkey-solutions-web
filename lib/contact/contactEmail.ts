import { isLocale, type Locale } from "@/lib/i18n/config";

export type ContactPayload = {
  name: string;
  email: string;
  budget: string;
  project: string;
  lang: Locale | "unknown";
};

const field = (body: Record<string, unknown>, key: string) =>
  String(body[key] ?? "").trim();

// Returns null when a required field (name, email, project) is missing.
export function parseContactBody(body: unknown): ContactPayload | null {
  if (!body || typeof body !== "object") return null;
  const b = body as Record<string, unknown>;
  const payload: ContactPayload = {
    name: field(b, "name"),
    email: field(b, "email"),
    budget: field(b, "budget"),
    project: field(b, "project"),
    lang: typeof b.lang === "string" && isLocale(b.lang) ? b.lang : "unknown",
  };
  if (!payload.name || !payload.email || !payload.project) return null;
  return payload;
}

export function contactEmailText(p: ContactPayload): string {
  return `Name: ${p.name}\nEmail: ${p.email}\nBudget: ${p.budget}\nLanguage: ${p.lang}\n\n${p.project}`;
}
