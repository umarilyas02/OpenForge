"use client";

import { useState } from "react";

export function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button
      className="rounded-md bg-slate-950 px-4 py-2 text-white"
      onClick={() => setCount((value) => value + 1)}
      type="button"
    >
      Count: {count}
    </button>
  );
}
