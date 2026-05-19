"use client";

import { useEffect, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";

function useMountedReveal(trigger: unknown) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(false);

    const frame = window.requestAnimationFrame(() => {
      setIsVisible(true);
    });

    return () => window.cancelAnimationFrame(frame);
  }, [trigger]);

  return isVisible;
}

export function PageEnter({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isVisible = useMountedReveal(pathname);

  return (
    <div
      key={pathname}
      className={`w-full transform-gpu transition-[opacity,transform,filter] duration-900 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none motion-reduce:transform-none motion-reduce:filter-none ${
        isVisible
          ? "translate-y-0 scale-100 opacity-100 blur-0"
          : "translate-y-4 scale-[0.992] opacity-0 blur-sm"
      }`}
    >
      {children}
    </div>
  );
}

export function FadeIn({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const isVisible = useMountedReveal(delay);

  return (
    <div
      className={className}
    >
      <div
        className={`transform-gpu transition-[opacity,transform,filter] duration-900 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none motion-reduce:transform-none motion-reduce:filter-none ${
          isVisible
            ? "translate-y-0 scale-100 opacity-100 blur-0"
            : "translate-y-4 scale-[0.992] opacity-0 blur-sm"
        }`}
        style={{ transitionDelay: `${delay}s` }}
      >
        {children}
      </div>
    </div>
  );
}

export function StaggerContainer({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const isVisible = useMountedReveal(className);

  return (
    <div
      className={className}
      data-visible={isVisible}
    >
      {children}
    </div>
  );
}

export function StaggerItem({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const isVisible = useMountedReveal(delay);

  return (
    <div
      className={className}
    >
      <div
        className={`transform-gpu transition-[opacity,transform,filter] duration-900 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none motion-reduce:transform-none motion-reduce:filter-none ${
          isVisible
            ? "translate-y-0 scale-100 opacity-100 blur-0"
            : "translate-y-4 scale-[0.992] opacity-0 blur-sm"
        }`}
        style={{ transitionDelay: `${delay}s` }}
      >
        {children}
      </div>
    </div>
  );
}