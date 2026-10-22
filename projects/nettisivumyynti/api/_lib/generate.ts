import Anthropic from "@anthropic-ai/sdk";

import { briefToPrompt, DEMO_SYSTEM_PROMPT, extractHtml } from "../../src/lib/demo-prompt.js";
import type { DemoRequest } from "./validate.js";

const MODEL = "claude-opus-5-5";

export type GenerateResult =
  | { ok: true; html: string; inputTokens: number; outputTokens: number }
  | { ok: false; reason: string };

export async function generateDemo(req: DemoRequest): Promise<GenerateResult> {
  const client = new Anthropic();

  try {
    const stream = client.beta.messages.stream({
      model: MODEL,
      max_tokens: 32000,
      thinking: { type: "adaptive" },
      output_config: { effort: "medium" },
      // On a safety decline, let the API retry on the recommended fallback model.
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
      system: DEMO_SYSTEM_PROMPT,
      messages: [{ role: "user", content: briefToPrompt(req) }],
    });
    const message = await stream.finalMessage();

    if (message.stop_reason === "refusal") {
      return { ok: false, reason: `refusal (${message.stop_details?.category ?? "unknown"})` };
    }
    if (message.stop_reason === "max_tokens") {
      return { ok: false, reason: "output hit max_tokens" };
    }

    const text = message.content
      .flatMap((block) => (block.type === "text" ? [block.text] : []))
      .join("");
    const html = extractHtml(text);
    if (!html) return { ok: false, reason: "no valid HTML in the response" };

    return {
      ok: true,
      html,
      inputTokens: message.usage.input_tokens,
      outputTokens: message.usage.output_tokens,
    };
  } catch (error) {
    if (error instanceof Anthropic.AuthenticationError) {
      return { ok: false, reason: "Anthropic API key missing or invalid" };
    }
    if (error instanceof Anthropic.RateLimitError) {
      return { ok: false, reason: "Anthropic rate limit hit" };
    }
    if (error instanceof Anthropic.APIError) {
      return { ok: false, reason: `Anthropic API error ${error.status}: ${error.message}` };
    }
    return { ok: false, reason: `unexpected error: ${String(error)}` };
  }
}
