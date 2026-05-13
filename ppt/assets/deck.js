// Slide deck navigation: arrow keys / page up-down / space jump between separate HTML files.
const SLIDES = [
  { file: '01-cover.html',        title: '封面' },
  { file: '02-purpose-scope.html',title: '项目目的与范围' },
  { file: '03-business-value.html',title:'业务价值' },
  { file: '04-architecture.html', title: '方案架构' },
  { file: '05-tech-stack.html',   title: '关键技术选型' },
  { file: '06-estimation.html',   title: '工作量评估 · 概览' },
  { file: '07-ai-savings.html',   title: 'AI 节省与 Epic 分布' },
  { file: '08-work-plan.html',    title: '工作计划' },
  { file: '09-risks.html',        title: '风险分析' },
  { file: '10-next-steps.html',   title: '下一步行动' },
];

(function(){
  const path = location.pathname.split('/').pop() || '01-cover.html';
  const idx = Math.max(0, SLIDES.findIndex(s => s.file === path));
  const prev = idx > 0 ? SLIDES[idx - 1].file : null;
  const next = idx < SLIDES.length - 1 ? SLIDES[idx + 1].file : null;

  // Progress bar
  const bar = document.createElement('div');
  bar.className = 'progress';
  bar.style.width = ((idx + 1) / SLIDES.length * 100) + '%';
  document.body.appendChild(bar);

  // Navbar
  const nav = document.createElement('div');
  nav.className = 'navbar';
  nav.innerHTML = `
    <a href="${prev || '#'}" class="${prev ? '' : 'disabled'}" id="navPrev">◀ 上一页</a>
    <span class="counter">${idx + 1} / ${SLIDES.length}</span>
    <a href="${next || '#'}" class="${next ? '' : 'disabled'}" id="navNext">下一页 ▶</a>
  `;
  document.body.appendChild(nav);

  // TOC
  const toc = document.createElement('details');
  toc.className = 'toc';
  toc.innerHTML = `
    <summary>📑 目录</summary>
    <ol>${SLIDES.map((s,i) => `<li><a href="${s.file}" class="${i===idx?'current':''}">${s.title}</a></li>`).join('')}</ol>
  `;
  document.body.appendChild(toc);

  // Keyboard navigation
  document.addEventListener('keydown', e => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    if (['ArrowRight','PageDown',' '].includes(e.key) && next) { e.preventDefault(); location.href = next; }
    else if (['ArrowLeft','PageUp'].includes(e.key) && prev)   { e.preventDefault(); location.href = prev; }
    else if (e.key === 'Home') location.href = SLIDES[0].file;
    else if (e.key === 'End')  location.href = SLIDES[SLIDES.length - 1].file;
  });
})();

// Chart.js global defaults (loaded conditionally per slide)
if (window.Chart) {
  Chart.defaults.color = '#cdd5ff';
  Chart.defaults.borderColor = '#2a3470';
  Chart.defaults.font.family = '"Segoe UI","PingFang SC","Microsoft YaHei",Arial,sans-serif';
}
window.PALETTE = { accent:'#7c8cff', cyan:'#22d3ee', pink:'#f472b6', amber:'#fbbf24', green:'#34d399', red:'#f87171' };
