// ⚔ Pon aquí la invitación de Discord de la hermandad (p. ej. https://discord.gg/xxxx)
const DISCORD_URL = 'https://discord.gg/k7qS5BpNjv';

document.querySelectorAll('.js-discord').forEach((a) => {
  a.href = DISCORD_URL;
  if (DISCORD_URL !== '#') { a.target = '_blank'; a.rel = 'noopener'; }
});

const reducido = matchMedia('(prefers-reduced-motion: reduce)').matches;

// Cabecera sólida al bajar
const cabecera = document.querySelector('.cabecera');
addEventListener('scroll', () => cabecera.classList.toggle('is-solida', scrollY > 40), { passive: true });

// Revelado al entrar en pantalla
const io = new IntersectionObserver((entradas) => {
  entradas.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target); } });
}, { threshold: 0.2 });
document.querySelectorAll('[data-revelar]').forEach((el) => io.observe(el));

// "Ver la cinemática": baja al reproductor y lo arranca con sonido
const cine = document.getElementById('video-cinematica');
document.querySelector('[data-play-cinematica]').addEventListener('click', () => {
  document.getElementById('cinematica').scrollIntoView({ behavior: reducido ? 'auto' : 'smooth' });
  cine.muted = false;
  cine.play().catch(() => {});
});

// Brasas que suben, como el fuego del vídeo
(function brasas() {
  const c = document.getElementById('brasas');
  if (reducido || !c.getContext) return;
  const ctx = c.getContext('2d');
  let w, h, dpr, chispas = [];
  const nueva = (y) => ({
    x: Math.random() * w,
    y: y ?? h + Math.random() * 40,
    r: (Math.random() * 1.6 + 0.6) * dpr,
    vy: (Math.random() * 0.6 + 0.35) * dpr,
    vx: (Math.random() - 0.5) * 0.3 * dpr,
    fase: Math.random() * Math.PI * 2,
    vida: Math.random() * 0.5 + 0.5,
  });
  function medir() {
    dpr = Math.min(devicePixelRatio || 1, 2);
    w = c.width = innerWidth * dpr;
    h = c.height = innerHeight * dpr;
    const n = Math.round(Math.min(70, innerWidth / 18));
    chispas = Array.from({ length: n }, () => nueva(Math.random() * h));
  }
  function frame(t) {
    ctx.clearRect(0, 0, w, h);
    ctx.globalCompositeOperation = 'lighter';
    for (const p of chispas) {
      p.y -= p.vy;
      p.x += p.vx + Math.sin(t / 900 + p.fase) * 0.25 * dpr;
      if (p.y < -10) Object.assign(p, nueva());
      const brillo = p.vida * (0.55 + 0.45 * Math.sin(t / 220 + p.fase)) * Math.min(1, p.y / (h * 0.25));
      const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 4);
      g.addColorStop(0, `rgba(255,190,120,${brillo})`);
      g.addColorStop(0.35, `rgba(255,106,43,${brillo * 0.7})`);
      g.addColorStop(1, 'rgba(179,18,27,0)');
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r * 4, 0, Math.PI * 2); ctx.fill();
    }
    raf = requestAnimationFrame(frame);
  }
  let raf;
  medir();
  addEventListener('resize', medir);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(raf); else raf = requestAnimationFrame(frame);
  });
  raf = requestAnimationFrame(frame);
})();
