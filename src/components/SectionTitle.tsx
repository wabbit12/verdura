export function SectionTitle({ children }: { children: string }) {
  return (
    <div className="section-title">
      <span className="corner corner-tl" aria-hidden="true" />
      <h2>{children}</h2>
      <span className="corner corner-br" aria-hidden="true" />
    </div>
  );
}
