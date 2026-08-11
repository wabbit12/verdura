import { motion } from "framer-motion";
import { reviews } from "../data/content";
import { Stars } from "./Icons";
import { SectionTitle } from "./SectionTitle";
import "./Reviews.css";

export function Reviews() {
  return (
    <section className="section reviews" id="reviews">
      <div className="container">
        <SectionTitle>Customer Review</SectionTitle>
        <div className="review-grid">
          {reviews.map((review, index) => (
            <motion.article
              key={review.id}
              className="review-card glass"
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.45, delay: index * 0.08 }}
              whileHover={{ y: -6 }}
            >
              <div className="review-head">
                <img
                  src={review.avatar}
                  alt=""
                  width={88}
                  height={88}
                  loading="lazy"
                  decoding="async"
                />
                <div>
                  <h3>{review.name}</h3>
                  <Stars rating={review.rating} />
                </div>
              </div>
              <p>{review.text}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
