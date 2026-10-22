import Anthropic from "@anthropic-ai/sdk";

import { briefToPrompt, DEMO_INSTRUCTIONS, extractHtml } from "../../src/lib/demo-prompt.js";
import { DESIGN_TOOL_DESCRIPTION, DESIGN_TOOL_NAME, DESIGN_TOOL_SCHEMA, runDesignTool } from "../../src/lib/design-search.js";
import type { DemoRequest } from "./validate.js";

const MODEL = "claude-opus-5-5";
// Design searches happen in the first few turns; the last turn writes the page.
const MAX_TURNS = 6;

const TOOLS: Anthropic.Beta.BetaTool[] = [
  {
    name: DESIGN_TOOL_NAME,
    description: DESIGN_TOOL_DESCRIPTION,
    input_schema: DESIGN_TOOL_SCHEMA,
    // Inputs stream as generated; runDesignTool validates them itself.
    eager_input_streaming: true,
  },
];

export type GenerateResult =
  | { ok: true; html: string; inputTokens: number; outputTokens: number; searches: number }
  | { ok: false; reason: string };

export async function generateDemo(req: DemoRequest): Promise<GenerateResult> {
  const client = new Anthropic();
  const messages: Anthropic.Beta.BetaMessageParam[] = [{ role: "user", content: briefToPrompt(req) }];
  let inputTokens = 0;
  let outputTokens = 0;
  let searches = 0;
  let jsonRetries = 0;

  try {
    for (let turn = 0; turn < MAX_TURNS; turn++) {
      const stream = client.beta.messages.stream({
        model: MODEL,
        max_tokens: 32000,
        thinking: { type: "adaptive" },
        output_config: { effort: "medium" },
        // On a safety decline, let the API retry on the recommended fallback model.
        betas: ["server-side-fallback-2026-07-01"],
        fallbacks: "default",
        system: DEMO_INSTRUCTIONS,
        tools: TOOLS,
        messages,
      });
      let message: Anthropic.Beta.BetaMessage;
      try {
        message = await stream.finalMessage();
        jsonRetries = 0;
      } catch (error) {
        // Only an unparseable streamed tool input is retried; API errors go to the outer catch.
        if (error instanceof Anthropic.APIError || jsonRetries++ >= 2) throw error;
        turn--;
        continue;
      }
      inputTokens += message.usage.input_tokens;
      outputTokens += message.usage.output_tokens;

      if (message.stop_reason === "refusal") {
        return { ok: false, reason: `refusal (${message.stop_details?.category ?? "unknown"})` };
      }
      if (message.stop_reason === "max_tokens") {
        return { ok: false, reason: "output hit max_tokens" };
      }

      const toolUses = message.content.filter((b): b is Anthropic.Beta.BetaToolUseBlock => b.type === "tool_use");
      if (message.stop_reason !== "tool_use" || toolUses.length === 0) {
        const text = message.content.flatMap((b) => (b.type === "text" ? [b.text] : [])).join("");
        const html = extractHtml(text);
        if (!html) return { ok: false, reason: "no valid HTML in the response" };
        return { ok: true, html, inputTokens, outputTokens, searches };
      }

      // Keep the assistant turn exactly as returned (thinking blocks included).
      messages.push({ role: "assistant", content: message.content });
      const results: Anthropic.Beta.BetaToolResultBlockParam[] = toolUses.map((use) => {
        if (use.name !== DESIGN_TOOL_NAME) {
          return { type: "tool_result", tool_use_id: use.id, is_error: true, content: `Unknown tool ${use.name}` };
        }
        searches++;
        try {
          return { type: "tool_result", tool_use_id: use.id, content: runDesignTool(use.input) };
        } catch (error) {
          return { type: "tool_result", tool_use_id: use.id, is_error: true, content: String((error as Error).message) };
        }
      });
      messages.push({ role: "user", content: results });
    }
    return { ok: false, reason: `no page after ${MAX_TURNS} turns` };
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
