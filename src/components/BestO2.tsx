import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { bestO2Slides } from "../data/content";
import { PlantImage, plantSizes } from "./PlantImage";
import { SectionTitle } from "./SectionTitle";
import "./BestO2.css";

export function BestO2() {
  const [index, setIndex] = useState(0);
  const slide = bestO2Slides[index];
  const total = bestO2Slides.length;

  const prev = () => setIndex((i) => (i - 1 + total) % total);
  const next = () => setIndex((i) => (i + 1) % total);

  return (
    <section className="section best-o2" id="best-o2">
      <div className="container">
        <SectionTitle>Our Best o2</SectionTitle>

        <div className="o2-shell glass">
          <AnimatePresence mode="wait">
            <motion.div
              key={slide.id}
              className="o2-slide"
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.35 }}
            >
              <div className="o2-media">
                <PlantImage
                  className="plant-cutout"
                  src={slide.image}
                  srcSet={slide.imageSrcSet}
                  sizes={plantSizes.o2}
                  alt=""
                />
              </div>
              <div className="o2-copy">
                <h3>{slide.title}</h3>
                {slide.body.map((para, i) => (
                  <p key={`${slide.id}-${i}`}>{para}</p>
                ))}
                <div className="o2-actions">
                  <a className="btn" href="#trendy">
                    Explore
                  </a>
                  <div className="o2-pager">
                    <button
                      type="button"
                      className="pager-btn"
                      aria-label="Previous slide"
                      onClick={prev}
                    >
                      ‹
                    </button>
                    <span>
                      {String(index + 1).padStart(2, "0")}/{String(total).padStart(2, "0")}
                    </span>
                    <button
                      type="button"
                      className="pager-btn"
                      aria-label="Next slide"
                      onClick={next}
                    >
                      ›
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="o2-dots" aria-hidden="true">
          {bestO2Slides.map((s, i) => (
            <button
              key={s.id}
              type="button"
              className={`o2-dot ${i === index ? "active" : ""}`}
              onClick={() => setIndex(i)}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
