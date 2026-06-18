"use client";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import type { CSSProperties } from "react";
import type { WorkDescriptionBlock } from "@/app/models/sanityTypes";

// Renders Sanity Portable Text (block content) with the site's look.
//
// Structural styling — paragraph spacing, list markers, link treatment — lives in
// the `.ms-richtext` rules in globals.css (Tailwind's preflight strips list markers
// and block margins, so they have to be restored there). Color, font-family,
// font-size and line-height are inherited from the wrapper's inline `style`, so each
// call site controls its own typography without a separate component variant.
const components: PortableTextComponents = {
  marks: {
    link: ({ value, children }) => {
      const href = (value as { href?: string } | undefined)?.href ?? "";
      const external = /^https?:\/\//i.test(href);
      return (
        <a
          href={href}
          {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        >
          {children}
        </a>
      );
    },
  },
};

export default function RichText({
  value,
  style,
}: {
  value?: WorkDescriptionBlock[] | null;
  style?: CSSProperties;
}) {
  if (!value || value.length === 0) return null;
  return (
    <div className="ms-richtext" style={style}>
      <PortableText value={value} components={components} />
    </div>
  );
}
