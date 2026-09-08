"use client";

import { ChevronDown, FileText, Pencil } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

/**
 * The dashboard header's "+ Create New" split button: a primary link to the
 * page flow, plus a dropdown for the two content types `/content/new`
 * already supports.
 *
 * @param {{ siteId: string }} props
 */
export function CreateNewMenu({ siteId }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    function onClick(event) {
      if (!ref.current?.contains(event.target)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  return (
    <div className="user-menu" ref={ref}>
      <div style={{ display: "flex" }}>
        <Link
          className="btn btn-primary"
          href={`/sites/${siteId}/content/new`}
          style={{ borderRadius: "var(--radius) 0 0 var(--radius)" }}
        >
          + Create New
        </Link>
        <button
          aria-expanded={open}
          aria-label="More create options"
          className="btn btn-primary"
          onClick={() => setOpen((value) => !value)}
          style={{
            borderLeft: "1px solid var(--accent-hover)",
            borderRadius: "0 var(--radius) var(--radius) 0",
            paddingInline: "var(--space-2)",
          }}
          type="button"
        >
          <ChevronDown size={14} />
        </button>
      </div>
      {open ? (
        <div className="user-menu-panel">
          <Link
            className="site-switcher-item"
            href={`/sites/${siteId}/content/new?type=page`}
            style={{ alignItems: "center", display: "flex", gap: "var(--space-2)" }}
          >
            <FileText size={14} strokeWidth={1.75} />
            New page
          </Link>
          <Link
            className="site-switcher-item"
            href={`/sites/${siteId}/content/new?type=post`}
            style={{ alignItems: "center", display: "flex", gap: "var(--space-2)" }}
          >
            <Pencil size={14} strokeWidth={1.75} />
            New post
          </Link>
        </div>
      ) : null}
    </div>
  );
}
