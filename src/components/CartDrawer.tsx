import { AnimatePresence, motion } from "framer-motion";
import { formatPrice } from "../data/content";
import { useCart } from "../hooks/useCart";
import "./CartDrawer.css";

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, setQty, total, clear } =
    useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.button
            type="button"
            className="cart-backdrop"
            aria-label="Close cart"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
          />
          <motion.aside
            className="cart-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Shopping cart"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
          >
            <div className="cart-head">
              <h2>Your Bag</h2>
              <button type="button" onClick={closeCart} aria-label="Close">
                ✕
              </button>
            </div>

            {items.length === 0 ? (
              <p className="cart-empty">Your bag is empty. Explore plants to add one.</p>
            ) : (
              <ul className="cart-list">
                {items.map((item) => (
                  <li key={item.id}>
                    <img
                      src={item.thumb}
                      alt=""
                      width={72}
                      height={96}
                      loading="lazy"
                      decoding="async"
                    />
                    <div>
                      <h3>{item.name}</h3>
                      <p>{formatPrice(item.price)}</p>
                      <div className="qty">
                        <button
                          type="button"
                          onClick={() => setQty(item.id, item.qty - 1)}
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>
                        <span>{item.qty}</span>
                        <button
                          type="button"
                          onClick={() => setQty(item.id, item.qty + 1)}
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="remove"
                      onClick={() => removeItem(item.id)}
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            )}

            <div className="cart-foot">
              <div className="cart-total">
                <span>Total</span>
                <strong>{formatPrice(total)}</strong>
              </div>
              <button type="button" className="btn checkout" disabled={!items.length}>
                Checkout
              </button>
              {items.length > 0 && (
                <button type="button" className="clear" onClick={clear}>
                  Clear bag
                </button>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
