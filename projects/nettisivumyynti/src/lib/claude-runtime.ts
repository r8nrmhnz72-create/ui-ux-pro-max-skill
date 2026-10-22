// Minimal types for the claude.ai artifact runtime (window.claude). It only
// exists when the page is opened as a Claude artifact; on the real site it is
// absent and every helper here returns null.

export interface SampleError {
  code: string;
  message: string;
  text?: string;
}

export interface SampleTool {
  name: string;
  description: string;
  inputSchema?: { type: "object"; [k: string]: unknown };
  execute(input: { [name: string]: unknown }, context: { signal: AbortSignal }): unknown;
}

export interface SampleOptions {
  onText?: (u: { text: string; delta: string }) => void;
  signal?: AbortSignal;
  modelTier?: "default" | "complex" | "quick";
  cache?: boolean;
  tools?: SampleTool[];
}

export type SampleFn = ((input: string, options?: SampleOptions) => Promise<{ text: string; truncated: boolean }>) & {
  json<T = unknown>(input: string, options?: SampleOptions): Promise<T>;
  limits(): Promise<{ maxPromptBytes: number; tools?: { maxCount: number } }>;
};

export interface DownloadsNs {
  save(req: { filename: string; data: string | Blob }): Promise<{ status: string }>;
}

interface ClaudeRuntime {
  use(name: "sample"): Promise<SampleFn | null>;
  use(name: "downloads"): Promise<DownloadsNs | null>;
}

function runtime(): ClaudeRuntime | null {
  const c = (window as unknown as { claude?: ClaudeRuntime }).claude;
  return c && typeof c.use === "function" ? c : null;
}

export async function getSample(): Promise<SampleFn | null> {
  return (await runtime()?.use("sample")) ?? null;
}

export async function getDownloads(): Promise<DownloadsNs | null> {
  return (await runtime()?.use("downloads")) ?? null;
}

export function isSampleError(e: unknown): e is SampleError {
  return typeof e === "object" && e !== null && "code" in e;
}
