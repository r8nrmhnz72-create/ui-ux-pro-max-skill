"use client";

import * as React from "react";

type Selection = {
  /** Id of the template the visitor picked from the belt, or null. */
  selectedId: string | null;
  select: (id: string | null) => void;
};

const SelectionContext = React.createContext<Selection | null>(null);

/** Shares the picked template between the conveyor belt, the selection bar and the quote form. */
export function SelectionProvider({ children }: { children: React.ReactNode }) {
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const value = React.useMemo(() => ({ selectedId, select: setSelectedId }), [selectedId]);
  return <SelectionContext value={value}>{children}</SelectionContext>;
}

export function useSelection(): Selection {
  const context = React.use(SelectionContext);
  if (!context) throw new Error("useSelection must be used inside <SelectionProvider>");
  return context;
}
