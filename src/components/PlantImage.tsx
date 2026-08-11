type PlantImageProps = {
  src: string;
  srcSet?: string;
  sizes?: string;
  alt: string;
  className?: string;
  /** Eager + high fetch priority for LCP / above-the-fold images. */
  priority?: boolean;
  width?: number;
  height?: number;
};

export const plantSizes = {
  hero: "(max-width: 700px) 75vw, 400px",
  trendy: "(max-width: 900px) 80vw, 460px",
  product: "(max-width: 700px) 45vw, 360px",
  o2: "(max-width: 900px) 70vw, 480px",
} as const;

/** Shared attrs for plant <img> / motion.img (srcset + lazy by default). */
export function plantImgAttrs({
  src,
  srcSet,
  sizes = plantSizes.product,
  alt,
  className,
  priority = false,
  width,
  height,
}: PlantImageProps) {
  return {
    src,
    srcSet,
    sizes: srcSet ? sizes : undefined,
    alt,
    className,
    width,
    height,
    loading: (priority ? "eager" : "lazy") as "eager" | "lazy",
    decoding: (priority ? "sync" : "async") as "sync" | "async",
    fetchPriority: (priority ? "high" : "auto") as "high" | "auto" | "low",
  };
}

export function PlantImage(props: PlantImageProps) {
  return <img {...plantImgAttrs(props)} />;
}
