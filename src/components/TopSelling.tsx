import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { formatPrice, topSelling, type Plant } from "../data/content";
import { useCart } from "../hooks/useCart";
import { BagIcon } from "./Icons";
import { PlantImage, plantSizes } from "./PlantImage";
import { SectionTitle } from "./SectionTitle";
import "./TopSelling.css";

function ProductCard({ plant, index }: { plant: Plant; index: number }) {
  const { addItem } = useCart();

  return (
    <motion.article
      role="listitem"
      className={`product-card glass${plant.tag === "large-plant" ? " is-large-plant" : ""}`}
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.45, delay: (index % 3) * 0.08 }}
      whileHover={{ y: -8 }}
    >
      <div className="product-media">
        <PlantImage
          className="plant-cutout"
          src={plant.image}
          srcSet={plant.imageSrcSet}
          sizes={plantSizes.product}
          alt={plant.name}
        />
      </div>
      <div className="product-body">
        <h3>{plant.name}</h3>
        <p>{plant.description}</p>
        <div className="product-foot">
          <strong>{formatPrice(plant.price)}</strong>
          <button
            type="button"
            className="bag-square"
            aria-label={`Add ${plant.name} to cart`}
            onClick={() => addItem(plant)}
          >
            <BagIcon size={27} />
          </button>
        </div>
      </div>
    </motion.article>
  );
}

export function TopSelling() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const syncScrollState = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;

    const cards = Array.from(el.querySelectorAll<HTMLElement>(".product-card"));
    if (!cards.length) return;

    const mid = el.scrollLeft + el.clientWidth / 2;
    let closest = 0;
    let best = Number.POSITIVE_INFINITY;
    cards.forEach((card, i) => {
      const center = card.offsetLeft + card.offsetWidth / 2;
      const dist = Math.abs(center - mid);
      if (dist < best) {
        best = dist;
        closest = i;
      }
    });

    setActive(closest);
    setCanPrev(el.scrollLeft > 8);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 8);
  }, []);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    syncScrollState();
    el.addEventListener("scroll", syncScrollState, { passive: true });
    window.addEventListener("resize", syncScrollState);
    return () => {
      el.removeEventListener("scroll", syncScrollState);
      window.removeEventListener("resize", syncScrollState);
    };
  }, [syncScrollState]);

  const scrollToIndex = (index: number) => {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.querySelectorAll<HTMLElement>(".product-card")[index];
    if (!card) return;
    const left =
      card.offsetLeft - (el.clientWidth - card.offsetWidth) / 2;
    el.scrollTo({ left: Math.max(0, left), behavior: "smooth" });
  };

  const scrollByCard = (dir: -1 | 1) => {
    scrollToIndex(Math.min(topSelling.length - 1, Math.max(0, active + dir)));
  };

  return (
    <section className="section top-selling" id="top-selling">
      <div className="container">
        <SectionTitle>Our Top Selling</SectionTitle>
        <div
          ref={scrollerRef}
          className="product-grid"
          role="list"
          aria-label="Top selling plants"
        >
          {topSelling.map((plant, index) => (
            <ProductCard key={plant.id} plant={plant} index={index} />
          ))}
        </div>

        <div className="product-pager" aria-label="Top selling controls">
          <button
            type="button"
            className="pager-btn"
            aria-label="Previous plant"
            disabled={!canPrev}
            onClick={() => scrollByCard(-1)}
          >
            ‹
          </button>
          <div className="product-dots" role="tablist" aria-label="Plant slides">
            {topSelling.map((plant, i) => (
              <button
                key={plant.id}
                type="button"
                role="tab"
                className={`product-dot ${i === active ? "active" : ""}`}
                aria-label={`Show ${plant.name}`}
                aria-selected={i === active}
                onClick={() => scrollToIndex(i)}
              />
            ))}
          </div>
          <button
            type="button"
            className="pager-btn"
            aria-label="Next plant"
            disabled={!canNext}
            onClick={() => scrollByCard(1)}
          >
            ›
          </button>
        </div>
      </div>
    </section>
  );
}
