import type { JevProvider, JevRequest, JevResponse } from './jev-provider.js';
import { postJson } from './http.js';

/**
 * OpenJEV community-gateway adapter — a free public gateway to the same Jev model
 * built by TypeSafe. Use this when you don't have a TypeSafe API key; anyone with a
 * TypeSafe key should keep using `TypeSafeProvider` (the unchanged default).
 *
 * Verified against https://openjev.sh/docs (2026-09):
 *   POST https://api.openjev.sh/v1/systemone
 *   body:     { model: "openjev", state, questions }
 *   response: { model, answers, usage, id, provider }
 *   auth:     Authorization: Bearer {OPENJEV_API_KEY}
 *
 * Same request/response contract as `TypeSafeProvider`; `postJson` applies the
 * 429/503/529 backoff. Get a free key at https://openjev.sh/dashboard.
 *
 * OpenJEV never replaces or hides TypeSafe — Jev is TypeSafe's model; OpenJEV is
 * a community gateway to it. This adapter is additive and optional.
 */
export class OpenJevProvider implements JevProvider {
  constructor(
    private readonly apiKey: string,
    private readonly model = 'openjev',
    private readonly baseUrl = 'https://api.openjev.sh/v1',
  ) {}

  async evaluate(req: JevRequest): Promise<JevResponse> {
    const json = await postJson(
      `${this.baseUrl}/systemone`,
      { Authorization: `Bearer ${this.apiKey}` },
      { model: this.model, state: req.state, questions: req.questions },
    );
    return json as JevResponse;
  }
}
