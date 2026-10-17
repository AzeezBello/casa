// src/components/Img.tsx
"use client";

import Image, { ImageProps } from "next/image";

type Props = ImageProps & {
  /** Alt text is required for accessibility */
  alt: string;
};

export function Img({ alt, ...rest }: Props) {
  return <Image alt={alt} {...rest} />;
}
