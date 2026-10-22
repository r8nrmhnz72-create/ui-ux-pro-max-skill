"use client";

import { useState, useRef, useEffect, useCallback, type ReactNode } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  ImageIcon,
  FileUp,
  MonitorIcon,
  CircleUserRound,
  ArrowUpIcon,
  Paperclip,
  Code2,
  Palette,
  Layers,
  Rocket,
} from "lucide-react";

interface AutoResizeProps {
  minHeight: number;
  maxHeight?: number;
}

function useAutoResizeTextarea({ minHeight, maxHeight }: AutoResizeProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = useCallback(
    (reset?: boolean) => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      if (reset) {
        textarea.style.height = `${minHeight}px`;
        return;
      }

      textarea.style.height = `${minHeight}px`; // reset first
      const newHeight = Math.max(
        minHeight,
        Math.min(textarea.scrollHeight, maxHeight ?? Infinity)
      );
      textarea.style.height = `${newHeight}px`;
    },
    [minHeight, maxHeight]
  );

  useEffect(() => {
    if (textareaRef.current) textareaRef.current.style.height = `${minHeight}px`;
  }, [minHeight]);

  return { textareaRef, adjustHeight };
}

export interface QuickActionItem {
  icon: ReactNode;
  label: string;
  /** Text placed in the input when the chip is tapped. Defaults to the label. */
  prompt?: string;
}

export interface RuixenMoonChatProps {
  title?: ReactNode;
  /** Small line above the title, e.g. a badge. */
  eyebrow?: ReactNode;
  /** Darkens the background photo for contrast. Turn off for backgrounds that are already dark. */
  overlay?: boolean;
  description?: string;
  placeholder?: string;
  sendLabel?: string;
  attachLabel?: string;
  backgroundImageUrl?: string;
  quickActions?: QuickActionItem[];
  /** Called with the trimmed message. Without it the send button stays disabled. */
  onSubmit?: (message: string) => void;
  /** Shows the paperclip button when provided. */
  onAttach?: () => void;
  className?: string;
  id?: string;
}

const DEFAULT_ACTIONS: QuickActionItem[] = [
  { icon: <Code2 className="w-4 h-4" />, label: "Generate Code" },
  { icon: <Rocket className="w-4 h-4" />, label: "Launch App" },
  { icon: <Layers className="w-4 h-4" />, label: "UI Components" },
  { icon: <Palette className="w-4 h-4" />, label: "Theme Ideas" },
  { icon: <CircleUserRound className="w-4 h-4" />, label: "User Dashboard" },
  { icon: <MonitorIcon className="w-4 h-4" />, label: "Landing Page" },
  { icon: <FileUp className="w-4 h-4" />, label: "Upload Docs" },
  { icon: <ImageIcon className="w-4 h-4" />, label: "Image Assets" },
];

export default function RuixenMoonChat({
  title = "Ruixen AI",
  description = "Build something amazing — just start typing below.",
  placeholder = "Type your request...",
  sendLabel = "Send",
  attachLabel = "Attach file",
  backgroundImageUrl = "https://cdn.21st.dev/assets/mirror/c3/c333918af688a4a8a3d004652e6c0ee219457a9d84d380eeb31f513d4b59a09f.png",
  quickActions = DEFAULT_ACTIONS,
  onSubmit,
  onAttach,
  className,
  id,
  eyebrow,
  overlay = true,
}: RuixenMoonChatProps) {
  const [message, setMessage] = useState("");
  const { textareaRef, adjustHeight } = useAutoResizeTextarea({
    minHeight: 76,
    maxHeight: 180,
  });

  const canSend = Boolean(onSubmit) && message.trim().length > 0;

  function send() {
    if (!canSend) return;
    onSubmit?.(message.trim());
    setMessage("");
    adjustHeight(true);
  }

  function applyQuickAction(item: QuickActionItem) {
    setMessage(item.prompt ?? item.label);
    // Wait for the new value to render before measuring.
    requestAnimationFrame(() => {
      adjustHeight();
      textareaRef.current?.focus();
    });
  }

  return (
    <div
      id={id}
      className={cn(
        "relative w-full h-screen bg-cover bg-center md:bg-fixed flex flex-col items-center px-4",
        className
      )}
      style={{ backgroundImage: `url('${backgroundImageUrl}')` }}
    >
      {/* Keeps text readable on any photo */}
      {overlay ? <div aria-hidden className="pointer-events-none absolute inset-0 bg-black/40" /> : null}

      {/* Centered AI Title */}
      <div className="relative flex-1 w-full flex flex-col items-center justify-center py-12">
        <div className="text-center">
          {eyebrow ? <div className="mb-5 flex justify-center">{eyebrow}</div> : null}
          <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-white drop-shadow-sm text-balance">
            {title}
          </h2>
          <p className="mt-2 text-neutral-200 max-w-xl mx-auto">{description}</p>
        </div>
      </div>

      {/* Input Box Section */}
      <div className="relative w-full max-w-3xl mb-16 md:mb-24">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send();
          }}
          className="relative bg-black/60 backdrop-blur-md rounded-xl border border-neutral-700 focus-within:border-neutral-400 transition-colors"
        >
          <label htmlFor={id ? `${id}-input` : "ruixen-input"} className="sr-only">
            {placeholder}
          </label>
          <Textarea
            id={id ? `${id}-input` : "ruixen-input"}
            ref={textareaRef}
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              adjustHeight();
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
                e.preventDefault();
                send();
              }
            }}
            placeholder={placeholder}
            className={cn(
              "w-full px-4 py-3 resize-none border-none",
              "bg-transparent text-white text-base sm:text-sm",
              "focus-visible:ring-0 focus-visible:ring-offset-0",
              "placeholder:text-neutral-400 min-h-[76px]"
            )}
            style={{ overflow: "hidden" }}
          />

          {/* Footer Buttons */}
          <div className={cn("flex items-center p-3", onAttach ? "justify-between" : "justify-end")}>
            {onAttach ? (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={onAttach}
                aria-label={attachLabel}
                className="text-white hover:bg-neutral-700"
              >
                <Paperclip className="w-4 h-4" />
              </Button>
            ) : null}

            <Button
              type="submit"
              disabled={!canSend}
              className={cn(
                "flex items-center gap-1 px-3 py-2 rounded-lg transition-colors",
                canSend
                  ? "bg-white text-neutral-900 hover:bg-neutral-200 cursor-pointer"
                  : "bg-neutral-700 text-neutral-400 cursor-not-allowed"
              )}
            >
              <ArrowUpIcon className="w-4 h-4" />
              <span className="sr-only">{sendLabel}</span>
            </Button>
          </div>
        </form>

        {/* Quick Actions */}
        <div className="flex items-center justify-center flex-wrap gap-3 mt-6">
          {quickActions.map((item) => (
            <QuickAction key={item.label} icon={item.icon} label={item.label} onClick={() => applyQuickAction(item)} />
          ))}
        </div>
      </div>
    </div>
  );
}

interface QuickActionProps {
  icon: ReactNode;
  label: string;
  onClick?: () => void;
}

function QuickAction({ icon, label, onClick }: QuickActionProps) {
  return (
    <Button
      type="button"
      variant="outline"
      onClick={onClick}
      className="flex items-center gap-2 rounded-full border-neutral-700 bg-black/50 text-neutral-300 hover:text-white hover:bg-neutral-700 cursor-pointer"
    >
      {icon}
      <span className="text-xs">{label}</span>
    </Button>
  );
}
