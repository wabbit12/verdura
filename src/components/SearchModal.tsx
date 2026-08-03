import { useEffect, useMemo, useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  formatPrice,
  topSelling,
  trendyPlants,
  type Plant,
} from "../data/content";
import { useCart } from "../hooks/useCart";
import "./SearchModal.css";

type Props = {
  open: boolean;
  onClose: () => void;
};

export function SearchModal({ open, onClose }: Props) {
  const { addItem } = useCart();
  const [query, setQuery] = useState("");
  const catalog = useMemo(
    () => [...trendyPlants, ...topSelling],
    [],
  );

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return catalog.slice(0, 6);
    return catalog.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q),
    );
  }, [catalog, query]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) setQuery("");
  }, [open]);

  const onSubmit = (e: FormEvent) => e.preventDefault();

  const pick = (plant: Plant) => {
    addItem(plant);
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            type="button"
            className="search-backdrop"
            aria-label="Close search"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="search-modal"
            role="dialog"
            aria-modal="true"
            aria-label="Search plants"
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
          >
            <form onSubmit={onSubmit}>
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search plants…"
                aria-label="Search plants"
              />
            </form>
            <ul>
              {results.map((plant) => (
                <li key={plant.id}>
                  <button type="button" onClick={() => pick(plant)}>
                    <img src={plant.image} alt="" />
                    <span>
                      <strong>{plant.name}</strong>
                      <em>{formatPrice(plant.price)}</em>
                    </span>
                  </button>
                </li>
              ))}
              {results.length === 0 && <li className="empty">No plants found.</li>}
            </ul>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
