import React from "react";
import type {
  PortableTextBlock,
  PortableTextLinkMark,
  PortableTextSpan,
} from "@/lib/sanity/types";

function getBlockTag(style: string | undefined): keyof JSX.IntrinsicElements {
  switch (style) {
    case "h2":
      return "h2";
    case "h3":
      return "h3";
    case "bullet":
    case "number":
      return "li";
    default:
      return "p";
  }
}

function renderSpans(
  children: PortableTextSpan[] | undefined,
  markDefs: PortableTextLinkMark[] | undefined,
): React.ReactNode {
  if (!children?.length) return null;
  const defMap = new Map((markDefs ?? []).map((d) => [d._key, d]));
  return children.map((span, i) => {
    let node: React.ReactNode = span.text ?? "";
    const marks = span.marks ?? [];
    for (const mark of marks) {
      const def = defMap.get(mark);
      if (def != null && "href" in def && def.href) {
        const target = def.blank ? "_blank" : undefined;
        const rel = def.blank ? "noopener noreferrer" : undefined;
        node = (
          <a
            key={i}
            href={def.href}
            target={target}
            rel={rel}
            className="text-primary underline hover:no-underline"
          >
            {node}
          </a>
        );
      } else if (mark === "strong") {
        node = <strong key={i}>{node}</strong>;
      } else if (mark === "em") {
        node = <em key={i}>{node}</em>;
      } else if (mark === "underline") {
        node = <u key={i}>{node}</u>;
      }
    }
    return <React.Fragment key={span._key ?? i}>{node}</React.Fragment>;
  });
}

export function PortableTextRenderer({ value }: { value: unknown }) {
  const blocks = (Array.isArray(value) ? value : []) as PortableTextBlock[];
  if (!blocks.length) return null;

  const elements: React.ReactNode[] = [];
  let listItems: React.ReactNode[] = [];
  let listKind: "ul" | "ol" | null = null;

  function flushList() {
    if (listItems.length && listKind) {
      const ListTag = listKind;
      elements.push(
        <ListTag
          key={`list-${elements.length}`}
          className={
            listKind === "ul"
              ? "list-disc pl-6 space-y-1"
              : "list-decimal pl-6 space-y-1"
          }
        >
          {listItems}
        </ListTag>,
      );
      listItems = [];
      listKind = null;
    }
  }

  for (const block of blocks) {
    if (block._type !== "block") continue;
    const style = block.style ?? "normal";
    const isListItem = style === "bullet" || style === "number";

    if (isListItem) {
      const nextKind = style === "bullet" ? "ul" : "ol";
      if (listKind && listKind !== nextKind) flushList();
      listKind = nextKind;
      listItems.push(
        <li key={block._key ?? listItems.length}>
          {renderSpans(block.children, block.markDefs)}
        </li>,
      );
    } else {
      flushList();
      const Tag = getBlockTag(style);
      const className =
        style === "h2"
          ? "text-xl font-semibold mt-4"
          : style === "h3"
            ? "text-lg font-medium mt-3"
            : "mb-2";
      elements.push(
        <Tag key={block._key ?? elements.length} className={className}>
          {renderSpans(block.children, block.markDefs)}
        </Tag>,
      );
    }
  }
  flushList();

  return (
    <div className="prose prose-sm max-w-none dark:prose-invert text-muted-foreground">
      {elements}
    </div>
  );
}
