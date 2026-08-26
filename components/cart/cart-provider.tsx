"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { FREE_SHIPPING_THRESHOLD, type Product, type SizeLabel } from "@/lib/catalog";

/**
 * Cart and drawer state for the whole prototype.
 *
 * This is the only global store in the project. Everything else is local. It
 * lives here because three unrelated surfaces write to it: the header counter,
 * the PLP quick-size control, and the PDP purchase panel.
 */

export interface CartLine {
  /** Stable key. One product in two sizes is two lines. */
  readonly id: string;
  readonly slug: string;
  readonly name: string;
  readonly line: string;
  readonly colour: string;
  readonly size: SizeLabel;
  readonly price: number;
  readonly quantity: number;
  readonly image?: string;
}

interface RemovedLine {
  readonly line: CartLine;
  readonly index: number;
}

interface CartState {
  readonly lines: ReadonlyArray<CartLine>;
  readonly lastRemoved: RemovedLine | null;
}

type CartAction =
  | { type: "hydrate"; lines: ReadonlyArray<CartLine> }
  | { type: "add"; product: Product; size: SizeLabel; quantity: number }
  | { type: "setQuantity"; id: string; quantity: number }
  | { type: "remove"; id: string }
  | { type: "restore" }
  | { type: "dismissUndo" }
  | { type: "clear" };

const MAX_PER_LINE = 10;
const STORAGE_KEY = "modasquare.cart.v1";

function lineId(slug: string, size: SizeLabel): string {
  return `${slug}--${size}`;
}

function reducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "hydrate":
      return { ...state, lines: action.lines };

    case "add": {
      const id = lineId(action.product.slug, action.size);
      const existing = state.lines.find((line) => line.id === id);

      if (existing) {
        return {
          lastRemoved: null,
          lines: state.lines.map((line) =>
            line.id === id
              ? { ...line, quantity: Math.min(MAX_PER_LINE, line.quantity + action.quantity) }
              : line,
          ),
        };
      }

      const next: CartLine = {
        id,
        slug: action.product.slug,
        name: action.product.name,
        line: action.product.line,
        colour: action.product.colour,
        size: action.size,
        price: action.product.price,
        quantity: Math.min(MAX_PER_LINE, action.quantity),
        image: action.product.gallery[0]?.image,
      };

      return { lastRemoved: null, lines: [...state.lines, next] };
    }

    case "setQuantity": {
      // Stepping to zero is a removal, so it goes through the same undo path.
      if (action.quantity <= 0) return reducer(state, { type: "remove", id: action.id });

      return {
        ...state,
        lines: state.lines.map((line) =>
          line.id === action.id
            ? { ...line, quantity: Math.min(MAX_PER_LINE, action.quantity) }
            : line,
        ),
      };
    }

    case "remove": {
      const index = state.lines.findIndex((line) => line.id === action.id);
      if (index === -1) return state;

      return {
        lines: state.lines.filter((line) => line.id !== action.id),
        lastRemoved: { line: state.lines[index], index },
      };
    }

    case "restore": {
      if (!state.lastRemoved) return state;
      const { line, index } = state.lastRemoved;
      const lines = [...state.lines];
      lines.splice(Math.min(index, lines.length), 0, line);
      return { lines, lastRemoved: null };
    }

    case "dismissUndo":
      return { ...state, lastRemoved: null };

    case "clear":
      return { lines: [], lastRemoved: null };

    default:
      return state;
  }
}

interface CartContextValue {
  readonly lines: ReadonlyArray<CartLine>;
  readonly lastRemoved: RemovedLine | null;
  readonly itemCount: number;
  readonly subtotal: number;
  readonly remainingForFreeShipping: number;
  readonly shippingProgress: number;
  readonly isDrawerOpen: boolean;
  /** False until the client has read persisted state, so SSR stays stable. */
  readonly isReady: boolean;
  readonly addLine: (product: Product, size: SizeLabel, quantity?: number) => void;
  readonly setQuantity: (id: string, quantity: number) => void;
  readonly removeLine: (id: string) => void;
  readonly restoreLine: () => void;
  readonly dismissUndo: () => void;
  readonly openDrawer: () => void;
  readonly closeDrawer: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

function isCartLine(value: unknown): value is CartLine {
  if (typeof value !== "object" || value === null) return false;
  const line = value as Record<string, unknown>;
  return (
    typeof line.id === "string" &&
    typeof line.slug === "string" &&
    typeof line.name === "string" &&
    typeof line.size === "string" &&
    typeof line.price === "number" &&
    typeof line.quantity === "number"
  );
}

export function CartProvider({ children }: { readonly children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { lines: [], lastRemoved: null });
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [isReady, setReady] = useState(false);

  // Read persisted state after mount. Reading during render would make the
  // server and client markup disagree on the badge count.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: unknown = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          dispatch({ type: "hydrate", lines: parsed.filter(isCartLine) });
        }
      }
    } catch {
      // A private-mode or quota failure must not take the page down.
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!isReady) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state.lines));
    } catch {
      // Same tolerance as above.
    }
  }, [state.lines, isReady]);

  const undoTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // The undo affordance is a window, not a permanent row.
  useEffect(() => {
    if (!state.lastRemoved) return;
    undoTimer.current = setTimeout(() => dispatch({ type: "dismissUndo" }), 8000);
    return () => {
      if (undoTimer.current) clearTimeout(undoTimer.current);
    };
  }, [state.lastRemoved]);

  const addLine = useCallback((product: Product, size: SizeLabel, quantity = 1) => {
    dispatch({ type: "add", product, size, quantity });
    setDrawerOpen(true);
  }, []);

  const setQuantity = useCallback((id: string, quantity: number) => {
    dispatch({ type: "setQuantity", id, quantity });
  }, []);

  const removeLine = useCallback((id: string) => {
    dispatch({ type: "remove", id });
  }, []);

  const restoreLine = useCallback(() => dispatch({ type: "restore" }), []);
  const dismissUndo = useCallback(() => dispatch({ type: "dismissUndo" }), []);
  const openDrawer = useCallback(() => setDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  const value = useMemo<CartContextValue>(() => {
    const itemCount = state.lines.reduce((sum, line) => sum + line.quantity, 0);
    const subtotal = state.lines.reduce((sum, line) => sum + line.price * line.quantity, 0);
    const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
    const progress =
      FREE_SHIPPING_THRESHOLD === 0
        ? 1
        : Math.min(1, subtotal / FREE_SHIPPING_THRESHOLD);

    return {
      lines: state.lines,
      lastRemoved: state.lastRemoved,
      itemCount,
      subtotal,
      remainingForFreeShipping: remaining,
      shippingProgress: progress,
      isDrawerOpen,
      isReady,
      addLine,
      setQuantity,
      removeLine,
      restoreLine,
      dismissUndo,
      openDrawer,
      closeDrawer,
    };
  }, [
    state.lines,
    state.lastRemoved,
    isDrawerOpen,
    isReady,
    addLine,
    setQuantity,
    removeLine,
    restoreLine,
    dismissUndo,
    openDrawer,
    closeDrawer,
  ]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used inside <CartProvider>.");
  }
  return context;
}
