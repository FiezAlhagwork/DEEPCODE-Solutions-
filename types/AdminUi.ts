import type {
  ComponentProps,
  DragEvent,
  ElementType,
  ReactNode,
} from "react";

/**
 * Props and variant unions for the admin component library in
 * `components/admin/ui/`. Mirrors how `components/shared/` takes its props from
 * `types/Shared.ts` — a component file declares no types of its own.
 */

// --- Button ----------------------------------------------------------------

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "danger";

export type ButtonSize = "sm" | "md";

type ButtonBaseProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children?: ReactNode;
  className?: string;
};

type ButtonAsButton = ButtonBaseProps &
  Omit<ComponentProps<"button">, "className" | "children"> & {
    href?: never;
    /** Shows a spinner and blocks interaction while a mutation is in flight. */
    loading?: boolean;
  };

type ButtonAsLink = ButtonBaseProps &
  Omit<ComponentProps<"a">, "className" | "children" | "href"> & {
    /**
     * Renders a link instead of a `<button>`. Internal paths go through the
     * locale-aware `Link` so they keep the current language; anything starting
     * with http(s) is treated as external and opens in a new tab.
     */
    href: string;
  };

export type ButtonProps = ButtonAsButton | ButtonAsLink;

// --- IconButton ------------------------------------------------------------

export type IconButtonVariant = "ghost" | "outline" | "danger";
export type IconButtonSize = "sm" | "md";

type IconButtonBaseProps = {
  "aria-label": string;
  variant?: IconButtonVariant;
  size?: IconButtonSize;
  children: ReactNode;
  className?: string;
};

type IconButtonAsButton = IconButtonBaseProps &
  Omit<ComponentProps<"button">, "className" | "children"> & { href?: never };

type IconButtonAsLink = IconButtonBaseProps &
  Omit<ComponentProps<"a">, "className" | "children" | "href"> & {
    href: string;
  };

export type IconButtonProps = IconButtonAsButton | IconButtonAsLink;

// --- Surfaces --------------------------------------------------------------

export type PanelProps = {
  children: ReactNode;
  className?: string;
  /** Removes the inner padding — for panels whose child is a full-bleed table. */
  flush?: boolean;
};

export type PanelHeaderProps = {
  title: ReactNode;
  description?: ReactNode;
  /** Right-hand slot for the panel's own actions. */
  actions?: ReactNode;
  className?: string;
};

export type EmptyStateProps = {
  icon?: ElementType;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
};

export type BadgeTone = "neutral" | "success" | "warning" | "danger" | "brand";

export type BadgeProps = {
  tone?: BadgeTone;
  dot?: boolean;
  children: ReactNode;
  className?: string;
};

export type AvatarProps = {
  name: string;
  imageUrl?: string;
  icon?: ElementType;
  size?: "sm" | "md";
  className?: string;
};

export type TooltipProps = {
  label: string;
  /**
   * `end` sits beside the trigger (used by the rail), `top` above it, and
   * `start` on the other side — which is what a trigger pinned to the far edge
   * of the header needs, so the bubble opens inward instead of off-screen.
   */
  side?: "end" | "start" | "top";
  /** Set false to render the trigger without any tooltip behaviour. */
  enabled?: boolean;
  children: ReactNode;
  className?: string;
};

export type ModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children?: ReactNode;
  /** Action row pinned to the bottom of the panel. */
  footer?: ReactNode;
  closeLabel: string;
  className?: string;
};

// --- Data grid -------------------------------------------------------------

export type Column<T> = {
  id: string;
  header: ReactNode;
  cell: (row: T) => ReactNode;
  align?: "start" | "end" | "center";
  /**
   * Applied to both the `<th>` and every `<td>` — use it for column widths.
   * Only reaches the table at `md` and up; the mobile cards size themselves.
   */
  className?: string;
};

export type DataTableProps<T> = {
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  /** Trailing actions cell. Omit for read-only tables. */
  rowActions?: (row: T) => ReactNode;
  actionsLabel?: string;
  /** Rendered instead of `<tbody>` when there are no rows. */
  empty?: ReactNode;
  /** Distance the sticky header keeps from the top — matches the admin header. */
  stickyOffset?: string;
};

export type PrimaryCellProps = {
  media?: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
};

export type TableToolbarProps = {
  /** Search field — grows to fill the free space. */
  search?: ReactNode;
  /** Filter controls, kept at their natural width. */
  filters?: ReactNode;
  /** Trailing slot, e.g. a result count or a bulk action. */
  trailing?: ReactNode;
  className?: string;
};

export type PaginationProps = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onLimitChange?: (limit: number) => void;
  className?: string;
};

// --- Form controls ---------------------------------------------------------

/** Handed to a `Field`'s render-prop child so the control can wire itself up. */
export type FieldRenderProps = {
  id: string;
  "aria-describedby": string | undefined;
  "aria-invalid": boolean | undefined;
};

/**
 * Named `FormFieldProps`, not `FieldProps`: `features/home/types/Home.ts`
 * already exports a differently-shaped `FieldProps` for the public contact
 * form, and two same-named props types would be a trap.
 */
export type FormFieldProps = {
  htmlFor: string;
  label: ReactNode;
  hint?: ReactNode;
  error?: string;
  required?: boolean;
  className?: string;
  children: ReactNode | ((props: FieldRenderProps) => ReactNode);
};

export type TextInputProps = ComponentProps<"input"> & {
  /** Optional leading icon component (e.g. lucide's `Search`). */
  icon?: ElementType;
};

export type TextAreaProps = ComponentProps<"textarea">;

export type SelectInputProps = ComponentProps<"select">;

export type FileDropzoneProps = {
  id: string;
  label: string;
  hint?: string;
  multiple?: boolean;
  accept?: string;
  disabled?: boolean;
  onFilesAdded: (files: File[]) => void;
  className?: string;
  describedBy?: string;
  invalid?: boolean;
};

/** Drop handler signature, kept here so `FileDropzone` declares nothing itself. */
export type FileDropEvent = DragEvent<HTMLLabelElement>;

// --- Form layout -----------------------------------------------------------

export type FormLayoutProps = {
  /** Settings column. Omit for a simple single-column form. */
  aside?: ReactNode;
  children: ReactNode;
  className?: string;
};

export type FormSectionProps = {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
};

export type FormActionsProps = {
  children: ReactNode;
};
