"use client";

import { useEffect, useState } from "react";
import { Check, ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import { reorder } from "@/app/admin/actions";
import { IconSubmit } from "@/components/admin/form";

type Collection = "projects" | "stack" | "path";

/** Up / down / delete controls shared by every admin list. */
export function RowActions({
  collection,
  id,
  index,
  total,
  onDelete,
  label,
}: {
  collection: Collection;
  id: string;
  index: number;
  total: number;
  onDelete: (formData: FormData) => Promise<void>;
  label: string;
}) {
  // Two-step delete rather than window.confirm: a native dialog blocks the
  // page, and pairing onSubmit with a function `action` breaks React's form
  // handling. The armed state disarms itself so a stray click can't linger.
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    if (!armed) return;
    const id = setTimeout(() => setArmed(false), 5000);
    return () => clearTimeout(id);
  }, [armed]);

  return (
    <div className="flex shrink-0 items-center gap-1.5">
      <form action={reorder}>
        <input type="hidden" name="collection" value={collection} />
        <input type="hidden" name="id" value={id} />
        <input type="hidden" name="direction" value="up" />
        <fieldset disabled={index === 0} className="contents">
          <IconSubmit label="Move up">
            <ChevronUp className="h-4 w-4" />
          </IconSubmit>
        </fieldset>
      </form>

      <form action={reorder}>
        <input type="hidden" name="collection" value={collection} />
        <input type="hidden" name="id" value={id} />
        <input type="hidden" name="direction" value="down" />
        <fieldset disabled={index === total - 1} className="contents">
          <IconSubmit label="Move down">
            <ChevronDown className="h-4 w-4" />
          </IconSubmit>
        </fieldset>
      </form>

      {armed ? (
        <form action={onDelete} className="flex items-center gap-1.5">
          <input type="hidden" name="id" value={id} />
          <span className="font-mono text-[10px] tracking-[0.12em] text-rose uppercase">
            Sure?
          </span>
          <IconSubmit label={`Confirm deleting ${label}`} danger>
            <Check className="h-4 w-4" />
          </IconSubmit>
          <button
            type="button"
            onClick={() => setArmed(false)}
            className="flex h-8 items-center rounded-lg border border-white/10 px-2.5 font-mono text-[10px] tracking-[0.12em] text-mute uppercase transition-colors hover:border-white/25 hover:text-ink"
          >
            No
          </button>
        </form>
      ) : (
        <button
          type="button"
          onClick={() => setArmed(true)}
          title={`Delete ${label}`}
          aria-label={`Delete ${label}`}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-mute transition-colors hover:border-rose/40 hover:text-rose"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}
