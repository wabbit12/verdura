import { useState, type FormEvent } from "react";
import { assets } from "../data/content";
import { FacebookIcon, LinkedInIcon, XIcon } from "./Icons";
import "./Footer.css";

export function Footer() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "ok" | "err">("idle");

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    if (!valid) {
      setStatus("err");
      return;
    }
    setStatus("ok");
    setEmail("");
  };

  return (
    <footer className="footer" id="contact">
      <div className="container footer-grid">
        <div className="footer-brand">
          <a href="#top" className="footer-logo">
            <img src={assets.logo} alt="" width={94} height={94} />
            <span>Verdura.</span>
          </a>
          <p>
            Verdura helps you bring nature indoors with healthy plants, thoughtful
            pots, and care that fits real homes — not greenhouse fantasies.
          </p>
          <div className="socials">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
            >
              <FacebookIcon size={20} />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noreferrer"
              aria-label="X"
            >
              <XIcon size={20} />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
            >
              <LinkedInIcon size={20} />
            </a>
          </div>
        </div>

        <div className="footer-links">
          <h3>Quick Link’s</h3>
          <a href="#top">Home</a>
          <a href="#top-selling">Type’s Of plant’s</a>
          <a href="#contact">Contact</a>
          <a href="#contact">Privacy</a>
        </div>

        <div className="footer-news">
          <h3>For Every Update.</h3>
          <form className="subscribe" onSubmit={onSubmit}>
            <label className="sr-only" htmlFor="email">
              Enter Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setStatus("idle");
              }}
            />
            <button type="submit">Subscribe</button>
          </form>
          {status === "ok" && (
            <p className="form-msg ok">Thanks — you’re on the list.</p>
          )}
          {status === "err" && (
            <p className="form-msg err">Please enter a valid email.</p>
          )}
          <p className="copyright">verdura © all right reserve</p>
        </div>
      </div>
    </footer>
  );
}
