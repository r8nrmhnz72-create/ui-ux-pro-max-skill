// Minimal types for the claude.ai artifact runtime (window.claude). It only
// exists when the page is opened as a Claude artifact; on the real site it is
// absent and every helper here returns null.

export interface SampleError {
  code: string;
  message: string;
  text?: string;
}

export type SampleFn = (
  input: string,
  options?: {
    onText?: (u: { text: string; delta: string }) => void;
    signal?: AbortSignal;
    modelTier?: "default" | "complex" | "quick";
    cache?: boolean;
  },
) => Promise<{ text: string; truncated: boolean }>;

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
