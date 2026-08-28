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
}

renderPost();