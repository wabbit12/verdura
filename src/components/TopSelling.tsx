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
  return (
    <section className="section top-selling" id="top-selling">
      <div className="container">
        <SectionTitle>Our Top Selling</SectionTitle>
        <div className="product-grid">
          {topSelling.map((plant, index) => (
            <ProductCard key={plant.id} plant={plant} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
