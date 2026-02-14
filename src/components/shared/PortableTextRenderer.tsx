"use client";

import React, { useMemo } from "react";
import { PortableText } from "@portabletext/react";
import type { PortableTextBlock } from "@/lib/sanity/types";

function isExternalHref(href: string | undefined): boolean {
  if (!href) return false;
  return href.startsWith("http://") || href.startsWith("https://");
}

const portableTextComponents = {
  block: {
    normal: ({ children }: { children?: React.ReactNode }) => (
      <p className="mb-2 last:mb-0">{children}</p>
    ),
    h1: ({ children }: { children?: React.ReactNode }) => (
      <h1 className="mb-2 mt-4 text-2xl font-semibold first:mt-0">
        {children}
      </h1>
    ),
    h2: ({ children }: { children?: React.ReactNode }) => (
      <h2 className="mb-2 mt-4 text-xl font-semibold first:mt-0">{children}</h2>
    ),
    h3: ({ children }: { children?: React.ReactNode }) => (
      <h3 className="mb-2 mt-3 text-lg font-medium first:mt-0">{children}</h3>
    ),
    blockquote: ({ children }: { children?: React.ReactNode }) => (
      <blockquote className="my-3 border-l-4 border-border pl-4">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }: { children?: React.ReactNode }) => (
      <ul className="list-disc pl-5 my-3 [&>li]:my-1">{children}</ul>
    ),
    number: ({ children }: { children?: React.ReactNode }) => (
      <ol className="list-decimal pl-5 my-3 [&>li]:my-1">{children}</ol>
    ),
  },
  listItem: {
    bullet: ({ children }: { children?: React.ReactNode }) => (
      <li className="pl-1">{children}</li>
    ),
    number: ({ children }: { children?: React.ReactNode }) => (
      <li className="pl-1">{children}</li>
    ),
  },
  marks: {
    strong: ({ children }: { children?: React.ReactNode }) => (
      <strong className="font-semibold">{children}</strong>
    ),
    em: ({ children }: { children?: React.ReactNode }) => (
      <em className="italic">{children}</em>
    ),
    underline: ({ children }: { children?: React.ReactNode }) => (
      <u>{children}</u>
    ),
    link: ({
      children,
      value,
    }: {
      children?: React.ReactNode;
      value?: { href?: string; blank?: boolean };
    }) => {
      const href = value?.href ?? "#";
      const external = isExternalHref(href);
      return (
        <a
          href={href}
          target={external ? "_blank" : undefined}
          rel={external ? "noopener noreferrer" : undefined}
          className="text-primary underline hover:no-underline"
        >
          {children}
        </a>
      );
    },
  },
  hardBreak: () => <br />,
};

export function PortableTextRenderer({
  value,
}: {
  value: PortableTextBlock[] | null | undefined;
}) {
  const components = useMemo(() => portableTextComponents, []);

  const blocks = Array.isArray(value) ? value : [];
  if (blocks.length === 0) return null;

  return (
    <div className="rich-text max-w-none text-muted-foreground">
      <PortableText value={blocks} components={components} />
    </div>
  );
}
