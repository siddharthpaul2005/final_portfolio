// Fixed background behind the whole site. The base colour (porcelain / obsidian) is the surface;
// the glows are small, faint and kept toward the edges so they give the glass depth without
// competing with the content column in the middle.
const blobs = [
  { color: 'var(--w-1)', size: '40vw', top: '-16%', left: '-14%', delay: '0s' },
  { color: 'var(--w-2)', size: '34vw', top: '-12%', left: '70%', delay: '-9s' },
  { color: 'var(--w-3)', size: '32vw', top: '52%', left: '-12%', delay: '-17s' },
  { color: 'var(--w-4)', size: '36vw', top: '62%', left: '68%', delay: '-25s' },
  { color: 'var(--w-5)', size: '22vw', top: '30%', left: '82%', delay: '-13s' },
];

const Wallpaper = () => (
  <div className="wallpaper" aria-hidden="true">
    {blobs.map((b, i) => (
      <div
        key={i}
        className="wallpaper-blob"
        style={{
          background: b.color,
          width: b.size,
          height: b.size,
          minWidth: 260,
          minHeight: 260,
          top: b.top,
          left: b.left,
          animationDelay: b.delay,
        }}
      />
    ))}
    <div className="wallpaper-dots" />
    <div className="wallpaper-noise" />
  </div>
);

export default Wallpaper;
