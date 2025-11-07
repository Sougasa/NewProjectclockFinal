// ==========================================
// Tema Dark / Light
// ==========================================
function alternarTema() {
  document.body.classList.toggle('darkmode');
  localStorage.setItem('tema', document.body.classList.contains('darkmode') ? 'dark' : 'light');
}
if (localStorage.getItem('tema') === 'dark') document.body.classList.add('darkmode');

// ==========================================
// Menu Mobile
// ==========================================
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
if(navToggle){
  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('nav-open');
    navToggle.classList.toggle('open');
  });
}

// ==========================================
// Digitação aleatória do Hero
// ==========================================
function initHeroTyping() {
  const heroTitle = document.querySelector('.hero h1');
  if (!heroTitle) return;
  const text = heroTitle.textContent;
  heroTitle.textContent = '';
  text.split('').forEach((char, index) => {
    const span = document.createElement('span');
    if (char === ' ') span.innerHTML = '&nbsp;';
    else {
      span.textContent = char;
      if (Math.random() > 0.5) span.classList.add('gradient');
    }
    heroTitle.appendChild(span);
    setTimeout(() => span.classList.add('show'), index * 50 + Math.random() * 150);
  });
}

// ==========================================
// Scroll Reveal + Parallax
// ==========================================
function initScrollAnimation() {
  const scrollElements = document.querySelectorAll('.scroll-animate');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('show');
    });
  }, { threshold: 0.1 });

  scrollElements.forEach(el => observer.observe(el));
}

// ==========================================
// SPA (Single Page Application) com fade
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
  initHeroTyping();
  initScrollAnimation();
  marcarLinkAtivo();

  const links = document.querySelectorAll('.spa-link');
  const main = document.getElementById('spa-content');

  async function carregarPagina(url, linkClicado = null) {
    try {
      const absoluteURL = new URL(url, location.origin).href;

      const res = await fetch(absoluteURL);
      const text = await res.text();

      const parser = new DOMParser();
      const doc = parser.parseFromString(text, 'text/html');
      const newMain = doc.getElementById('spa-content');

      if (!newMain) {
        window.location.href = url;
        return;
      }

      main.classList.add('fade-out');

      setTimeout(() => {
        main.innerHTML = newMain.innerHTML;

        // Reaplicar animações
        initHeroTyping();
        initScrollAnimation();

        main.classList.remove('fade-out');
        main.classList.add('fade-in');

        // Atualizar link ativo
        if (linkClicado) {
          links.forEach(l => l.classList.remove('active'));
          linkClicado.classList.add('active');
        } else {
          marcarLinkAtivo();
        }

        setTimeout(() => main.classList.remove('fade-in'), 500);
      }, 300);

    } catch (err) {
      console.error('Erro ao carregar a página SPA:', err);
      window.location.href = url; // fallback caso dê erro
    }
  }

  links.forEach(link => {
    link.addEventListener('click', e => {
      const url = link.getAttribute('href');
      if (!url.endsWith('.html')) return;

      e.preventDefault();
      carregarPagina(url, link);
      history.pushState({ url }, '', url);
    });
  });

  // Voltar/Avançar do navegador
  window.addEventListener('popstate', e => {
    if (e.state && e.state.url) {
      carregarPagina(e.state.url);
    }
  });
});



// =======================================
// Marcar link ativo na topbar
// ========================================
function marcarLinkAtivo() {
  const links = document.querySelectorAll('.nav-links a');
  const path = window.location.pathname; // Pega o caminho do arquivo atual, ex: "/sobre.html"

  links.forEach(link => {
    const linkPath = new URL(link.href).pathname; // Pega o caminho do arquivo do link
    
    // Remove a classe 'active' de todos os links antes de verificar qual deve ser ativado
    link.classList.remove('active');
    
    // Adiciona a classe se o caminho do link for igual ao caminho da URL
    // Inclui uma verificação para a página inicial, que pode ser apenas "/"
    if (path === linkPath || (path === '/' && linkPath === '/index.html')) {
      link.classList.add('active');
    }
  });
}