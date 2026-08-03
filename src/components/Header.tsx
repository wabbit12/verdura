import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { assets, plantTypes } from "../data/content";
import { useCart } from "../hooks/useCart";
import { BagIcon, SearchIcon } from "./Icons";
import "./Header.css";

type HeaderProps = {
  onSearch: () => void;
};

export function Header({ onSearch }: HeaderProps) {
  const { count, openCart } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [typesOpen, setTypesOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const next = window.scrollY > 24;
      setScrolled(next);
      if (next) setTypesOpen(false);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const closeMenu = () => {
    setMenuOpen(false);
    setTypesOpen(false);
  };

  const hidden = scrolled && !menuOpen;

  return (
    <header className={`header ${hidden ? "is-hidden" : ""}`}>
      <div className="container header-inner">
        <a href="#top" className="brand" onClick={closeMenu}>
          <img src={assets.logo} alt="" width={48} height={48} />
          <span>Verdura.</span>
        </a>

        <nav className="nav-desktop" aria-label="Primary">
          <a href="#top">Home</a>
          <div
            className="nav-dropdown"
            onMouseEnter={() => setTypesOpen(true)}
            onMouseLeave={() => setTypesOpen(false)}
          >
            <button
              type="button"
              className="nav-link"
              aria-expanded={typesOpen}
              onClick={() => setTypesOpen((v) => !v)}
            >
              Plants Type
              <span className={`chevron ${typesOpen ? "open" : ""}`} />
            </button>
            <AnimatePresence>
              {typesOpen && (
                <motion.ul
                  className="dropdown glass"
                  initial={{ opacity: 0, y: 8, x: "-50%" }}
                  animate={{ opacity: 1, y: 0, x: "-50%" }}
                  exit={{ opacity: 0, y: 8, x: "-50%" }}
                  transition={{ duration: 0.2 }}
                >
                  {plantTypes.map((type) => (
                    <li key={type}>
                      <a href="#top-selling" onClick={() => setTypesOpen(false)}>
                        {type}
                      </a>
                    </li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>
          <a href="#reviews">More</a>
          <a href="#contact">Contact</a>
        </nav>

        <div className="header-actions">
          <button
            type="button"
            className="icon-btn"
            aria-label="Search"
            onClick={onSearch}
          >
            <SearchIcon size={24} />
          </button>
          <button
            type="button"
            className="icon-btn cart-btn"
            aria-label={`Open cart, ${count} items`}
            onClick={openCart}
          >
            <BagIcon size={24} />
            {count > 0 && <span className="badge">{count}</span>}
          </button>
          <button
            type="button"
            className="menu-toggle"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="mobile-menu glass"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
          >
            <a href="#top" onClick={closeMenu}>
              Home
            </a>
            <button
              type="button"
              onClick={() => setTypesOpen((v) => !v)}
              className="mobile-types-btn"
            >
              Plants Type
            </button>
            {typesOpen && (
              <div className="mobile-types">
                {plantTypes.map((type) => (
                  <a key={type} href="#top-selling" onClick={closeMenu}>
                    {type}
                  </a>
                ))}
              </div>
            )}
            <a href="#reviews" onClick={closeMenu}>
              More
            </a>
            <a href="#contact" onClick={closeMenu}>
              Contact
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
