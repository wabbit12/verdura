import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { assets, heroCarousel } from "../data/content";
import { useCart } from "../hooks/useCart";
import { Stars } from "./Icons";
import "./Hero.css";

export function Hero() {
  const { addItem } = useCart();
  const [index, setIndex] = useState(0);
  const plant = heroCarousel[index];
  const total = heroCarousel.length;

  const next = () => setIndex((i) => (i + 1) % total);

  return (
    <>
      <div className="hero-bg" aria-hidden="true">
        <img src={assets.heroBg} alt="" />
        <div className="hero-veil" />
      </div>

      <section className="hero" id="top" aria-label="Hero">
        <div className="container hero-stage">
          <motion.div
            className="hero-copy"
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <h1>Breathe Natural.</h1>
            <p>
              Bring calm, living greenery into your home. Discover house plants
              chosen for beauty, cleaner air, and everyday ease.
            </p>
            <div className="hero-cta">
              <a className="btn" href="#trendy">
                Explore
              </a>
              <a className="live-demo" href="#best-o2">
                <span className="play" aria-hidden="true" />
                Live Demo...
              </a>
            </div>
          </motion.div>

          <motion.aside
            className="hero-card glass"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.75, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            aria-roledescription="carousel"
            aria-label="Featured plants"
          >
            <div className="hero-plant-wrap">
              <AnimatePresence mode="wait">
                <motion.img
                  key={plant.id}
                  className="hero-plant plant-cutout"
                  src={plant.image}
                  alt={plant.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.35 }}
                />
              </AnimatePresence>
            </div>
            <div className="hero-card-body">
              <AnimatePresence mode="wait">
                <motion.div
                  key={plant.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.28 }}
                >
                  <p className="eyebrow">{plant.tag}</p>
                  <h3>{plant.name}</h3>
                </motion.div>
              </AnimatePresence>
              <div className="hero-card-actions">
                <button
                  type="button"
                  className="btn hero-buy"
                  onClick={() => addItem(plant)}
                >
                  Buy Now
                </button>
                <div className="hero-pager">
                  <div className="dots" role="tablist" aria-label="Featured plant slides">
                    {heroCarousel.map((item, i) => (
                      <button
                        key={item.id}
                        type="button"
                        role="tab"
                        className={`dot ${i === index ? "active" : ""}`}
                        aria-label={`Show ${item.name}`}
                        aria-selected={i === index}
                        onClick={() => setIndex(i)}
                      />
                    ))}
                  </div>
                  <button
                    type="button"
                    className="hero-next"
                    aria-label="Next featured plant"
                    onClick={next}
                  >
                    ›
                  </button>
                </div>
              </div>
            </div>
          </motion.aside>

          <motion.article
            className="review-snip glass"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.35 }}
          >
            <div className="review-snip-head">
              <img src={assets.avatarAlena} alt="" width={64} height={64} />
              <div>
                <strong>Alena Patel</strong>
                <Stars />
              </div>
            </div>
            <p>
              My living room finally feels alive. The plants arrived healthy, and
              the styling tips made setup effortless.
            </p>
          </motion.article>
        </div>
      </section>
    </>
  );
}
