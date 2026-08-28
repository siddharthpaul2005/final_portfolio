async function renderPost() {
  const res = await fetch('./content.md');
  const raw = await res.text();

  let meta = {};
  let body = raw;
  const fmMatch = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (fmMatch) {
    fmMatch[1].split('\n').forEach(line => {
      const idx = line.indexOf(':');
      if (idx > -1) meta[line.slice(0, idx).trim()] = line.slice(idx + 1).trim();
    });
    body = fmMatch[2];
  }

  document.title = (meta.title || 'Writing') + ' - Siddharth Paul';
  document.getElementById('post-title').textContent = meta.title || '';
  document.getElementById('post-meta').textContent =
    [meta.date, meta.readingTime].filter(Boolean).join(' · ');

  marked.setOptions({ html: true, breaks: false });
  document.getElementById('post-body').innerHTML = marked.parse(body);

  document.querySelectorAll('pre code').forEach(block => {
    hljs.highlightElement(block);
  });

  document.getElementById('post-body').innerHTML = marked.parse(body);

  document.querySelectorAll('pre code').forEach(block => {
    hljs.highlightElement(block);
  });

  scaleDemoEmbeds();   

}


function scaleDemoEmbeds() {
  document.querySelectorAll('.demo-embed').forEach(wrapper => {
    const iframe = wrapper.querySelector('iframe');
    const designWidth = parseInt(wrapper.dataset.width, 10) || 800;
    const designHeight = parseInt(wrapper.dataset.height, 10) || 560;

    const containerWidth = wrapper.clientWidth || wrapper.parentElement.clientWidth;

    // Only boost size on wider screens where there's room to spare.
    // Below 500px, fit exactly so nothing clips off the edge.
    const SIZE_MULTIPLIER = containerWidth < 500 ? 1.0 : 1.15;

    const scale = (containerWidth / designWidth) * SIZE_MULTIPLIER;

    iframe.style.width = designWidth + 'px';
    iframe.style.height = designHeight + 'px';
    iframe.style.transform = `scale(${scale})`;

    wrapper.style.height = (designHeight * scale) + 'px';
  });
}
window.addEventListener('resize', scaleDemoEmbeds);

renderPost();