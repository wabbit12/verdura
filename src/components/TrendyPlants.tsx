import { motion } from "framer-motion";
import { formatPrice, trendyPlants, type Plant } from "../data/content";
import { useCart } from "../hooks/useCart";
import { BagIcon } from "./Icons";
import { SectionTitle } from "./SectionTitle";
import "./TrendyPlants.css";

function TrendyCard({
  plant,
  reverse,
}: {
  plant: Plant;
  reverse?: boolean;
}) {
  const { addItem } = useCart();

  return (
    <motion.article
      className={`trendy-card glass ${reverse ? "is-reverse" : ""}`}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.55 }}
    >
      <div className="trendy-media">
        <img className="plant-cutout" src={plant.image} alt={plant.name} />
      </div>
      <div className="trendy-body">
        <h3>{plant.name}</h3>
        <p>{plant.description}</p>
        <strong>{formatPrice(plant.price)}</strong>
        <div className="trendy-actions">
          <a className="btn" href="#top-selling">
            Explore
          </a>
          <button
            type="button"
            className="btn-icon"
            aria-label={`Add ${plant.name} to cart`}
            onClick={() => addItem(plant)}
          >
            <BagIcon size={34} />
          </button>
        </div>
      </div>
    </motion.article>
  );
}

export function TrendyPlants() {
  return (
    <section className="section trendy" id="trendy">
      <div className="container">
        <SectionTitle>Our Trendy plants</SectionTitle>
        <div className="trendy-list">
          <TrendyCard plant={trendyPlants[0]} />
          <TrendyCard plant={trendyPlants[1]} reverse />
        </div>
      </div>
    </section>
  );
}
