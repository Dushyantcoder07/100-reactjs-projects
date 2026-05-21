"use client";

import { useEffect, useState } from "react";

export default function EntryAnimation({
  children,
}: {
  children: React.ReactNode;
}) {
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    // trigger after mount so the transition runs on hydration
    const id = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div className={`entry ${entered ? "entered" : ""}`}>{children}</div>
  );
}
