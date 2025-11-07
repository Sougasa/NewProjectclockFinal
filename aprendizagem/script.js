const data = [
  {
    module: 'Módulo 1 — Fundamentos',
    lessons: [
      {
        title: 'Apresentação e objetivos',
        src: 'https://www.youtube.com/embed/4OiMOHRDs14',
        desc: 'Conheça o instrutor, o formato do curso e os principais objetivos. Entenda o que você será capaz de fazer ao final do treinamento.'
      },
      {
        title: 'Ferramentas e segurança',
        src: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        desc: 'Veja quais ferramentas são essenciais para montagem e manutenção de PCs, além de dicas de segurança, cuidados antiestáticos e boas práticas para evitar danos aos componentes.'
      },
      {
        title: 'Componentes do PC (placa-mãe, CPU, RAM)',
        src: '',
        desc: 'Aprenda a identificar e entender a função dos principais componentes de um computador: placa-mãe, processador (CPU), memória RAM e outros periféricos.'
      },
      {
        title: 'Entendendo mais os componentes',
        src: '',
        desc: 'Aprofunde-se nos detalhes de cada componente, aprendendo sobre diferentes gerações, compatibilidades e como escolher peças adequadas para cada necessidade.',
        locked: true
      }
    ]
  },
  {
    module: 'Módulo 2 — Montagem',
    lessons: [
      {
        title: 'Preparando o gabinete',
        src: '',
        desc: 'Aprenda a organizar o espaço interno do gabinete, remover tampas, instalar espaçadores (standoffs) e preparar o ambiente para receber os componentes.'
      },
      {
        title: 'Instalando a placa-mãe',
        src: '',
        desc: 'Veja como posicionar corretamente a placa-mãe, fixá-la com segurança e conectar os primeiros cabos.'
      },
      {
        title: 'Instalando o processador e cooler',
        src: '',
        desc: 'Passo a passo para instalar o processador (CPU), aplicar pasta térmica e fixar o cooler, garantindo o funcionamento e a refrigeração adequada.'
      },
      {
        title: 'Instalando memória RAM',
        src: '',
        desc: 'Entenda os tipos de memória RAM, como identificar os slots corretos e instalar os módulos de forma segura.'
      },
      {
        title: 'Instalando a placa de vídeo',
        src: '',
        desc: 'Aprenda a instalar placas de vídeo em slots PCIe, conectar cabos de alimentação e fixar corretamente no gabinete.'
      },
      {
        title: 'Instalando armazenamento (SSD/HDD)',
        src: '',
        desc: 'Veja como instalar discos rígidos (HDD) e unidades de estado sólido (SSD), conectando cabos SATA ou M.2 conforme o tipo de armazenamento.'
      },
      {
        title: 'Conectando cabos de energia e dados',
        src: '',
        desc: 'Organize e conecte todos os cabos de energia e dados, garantindo um fluxo de ar eficiente e evitando erros de montagem.'
      }
    ]
  },
  {
    module: 'Módulo 3 — Primeira inicialização e BIOS',
    lessons: [
      {
        title: 'Primeira inicialização e BIOS',
        src: '',
        desc: 'Aprenda a ligar o computador pela primeira vez, acessar a BIOS/UEFI, configurar opções básicas e realizar testes iniciais para garantir que tudo está funcionando corretamente.'
      }
    ]
  }
];


    // estado
    const state = {moduleIndex:0, lessonIndex:0};

    // localStorage keys
    const STORAGE_KEY = 'curso_pc_progress_v1';
    const QA_KEY_PREFIX = 'curso_pc_qa_'; // + lessonId
    const RATINGS_KEY_PREFIX = 'curso_pc_ratings_'; // + lessonId

    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    const COLLAPSE_KEY = 'curso_pc_modules_collapsed';
    let collapsedModules = JSON.parse(localStorage.getItem(COLLAPSE_KEY) || '{}');

    // elementos
    const moduleListEl = document.getElementById('moduleList');
    const lessonTitle = document.getElementById('lessonTitle');
    const lessonDesc = document.getElementById('lessonDesc');
    const videoFrame = document.getElementById('videoFrame');
    const progressBar = document.getElementById('progressBar');
    const stepsText = document.getElementById('stepsText');
    const markBtn = document.getElementById('markBtn');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const themeBtn = document.getElementById('themeBtn');
    const backToModule = document.getElementById('backToModule');
    const qInput = document.getElementById('qInput');
    const qSend = document.getElementById('qSend');
    const qaList = document.getElementById('qaList');
    const simulateAnswer = document.getElementById('simulateAnswer');
    const starsWrap = document.getElementById('stars');
    const avgRatingEl = document.getElementById('avgRating');
    const totalRatingsEl = document.getElementById('totalRatings');
    const feedbackArea = document.getElementById('feedbackArea');
    const feedbackText = document.getElementById('feedbackText');
    const sendFeedback = document.getElementById('sendFeedback');
    const feedbackList = document.getElementById('feedbackList');

    // helper: id atual da aula
    function lessonId(mi, li){ return `m${mi}l${li}`; }

    // criar estrutura do sidebar
    function renderSidebar(){
      moduleListEl.innerHTML='';
      data.forEach((mod, mi)=>{
        const modWrap = document.createElement('div');
        modWrap.className='module';

        // Flechinha para expandir/minimizar
        const isCollapsed = !!collapsedModules[mi];
        const arrow = document.createElement('span');
        arrow.textContent = isCollapsed ? '▶' : '⬇️'; // Troque aqui pelo emoji/ícone desejado
        arrow.style.cursor = 'pointer';
        arrow.style.marginRight = '6px';
        arrow.setAttribute('aria-label', isCollapsed ? 'Expandir módulo' : 'Minimizar módulo');
        arrow.addEventListener('click', (e)=>{
          collapsedModules[mi] = !collapsedModules[mi];
          localStorage.setItem(COLLAPSE_KEY, JSON.stringify(collapsedModules));
          renderSidebar();
          e.stopPropagation();
        });

        const title = document.createElement('div');
        title.className = 'module-title';
        title.appendChild(arrow);

        const strong = document.createElement('strong');
        strong.textContent = mod.module;
        title.appendChild(strong);

        // Evento de clique para expandir/minimizar ao clicar no título OU na flechinha
        title.addEventListener('click', (e) => {
          collapsedModules[mi] = !collapsedModules[mi];
          localStorage.setItem(COLLAPSE_KEY, JSON.stringify(collapsedModules));
          renderSidebar();
          e.stopPropagation();
        });

        modWrap.appendChild(title);

        const lessonsWrap = document.createElement('div');
        lessonsWrap.className = 'lessons';
        if(isCollapsed) lessonsWrap.style.display = 'none';

        mod.lessons.forEach((ls, li)=>{
          const id = lessonId(mi,li);
          const lesson = document.createElement('div');
          lesson.className='lesson';
          lesson.setAttribute('role','button');
          lesson.setAttribute('tabindex','0');
          if(saved[id] && saved[id].completed) lesson.classList.add('completed');
          if(mi===state.moduleIndex && li===state.lessonIndex) lesson.classList.add('current');

          // Se for bloqueada, adiciona classe e ícone de cadeado
          if(ls.locked){
            lesson.classList.add('locked');
            lesson.innerHTML = `
              <span class="dot" style="background:#eee;color:#aaa;border:none"><span style="font-size:14px">🔒</span></span>
              <div style="flex:1">
                <div class="title">${ls.title}</div>
                <div class="meta">${ls.desc || ''}</div>
              </div>
            `;
            lesson.addEventListener('click', (e)=>{
              e.stopPropagation();
              e.preventDefault();
              document.getElementById('payModal').style.display = 'flex';
            });
          } else {
            lesson.innerHTML = `<span class="dot">${li+1}</span><div style="flex:1"><div class="title">${ls.title}</div><div class="meta">${ls.desc || ''}</div></div>`;
            lesson.addEventListener('click', ()=>{ selectLesson(mi,li); });
            lesson.addEventListener('keypress', (e)=>{ if(e.key==='Enter' || e.key===' ') selectLesson(mi,li); });
          }

          lessonsWrap.appendChild(lesson);
        });

        modWrap.appendChild(lessonsWrap); // <-- sempre adicione ao DOM
        moduleListEl.appendChild(modWrap);
      });

      updateProgressUI();
    }

    function selectLesson(mi, li){
      state.moduleIndex = mi; state.lessonIndex = li;
      renderSidebar();
      loadLesson();
      if(window.innerWidth < 980){ window.scrollTo({top:0,behavior:'smooth'}); }
    }

    function loadLesson(){
      const lesson = data[state.moduleIndex].lessons[state.lessonIndex];
      lessonTitle.textContent = lesson.title;
      lessonDesc.textContent = lesson.desc || '';
      if(lesson.src){ videoFrame.src = lesson.src; videoFrame.setAttribute('title', lesson.title); }
      else{ videoFrame.src = ''; videoFrame.setAttribute('title', 'Aula sem vídeo (substitua o src)'); }

      // atualizar botão marcar
      const id = lessonId(state.moduleIndex, state.lessonIndex);
      const completed = saved[id] && saved[id].completed;
      markBtn.textContent = completed ? 'Desmarcar como concluído' : 'Marcar como concluído ✓';
      markBtn.classList.toggle('mark', !completed);

      // atualizar prev/next
      prevBtn.disabled = (state.moduleIndex===0 && state.lessonIndex===0);
      nextBtn.disabled = (state.moduleIndex===data.length-1 && state.lessonIndex===data[data.length-1].lessons.length-1);

      // carregar QA e ratings da aula
      renderQA();
      renderRatings();
      renderFeedbacks();
    }

    // ===== Q&A (local simulation) =====
    function getQAStore(){
      const key = QA_KEY_PREFIX + lessonId(state.moduleIndex,state.lessonIndex);
      return JSON.parse(localStorage.getItem(key) || '[]');
    }
    function setQAStore(arr){
      const key = QA_KEY_PREFIX + lessonId(state.moduleIndex,state.lessonIndex);
      localStorage.setItem(key, JSON.stringify(arr));
    }

    function renderQA(){
      const arr = getQAStore();
      qaList.innerHTML = '';
      if(arr.length===0) qaList.innerHTML = '<div class="small" style="padding:8px">Nenhuma dúvida ainda. Seja o primeiro a perguntar!</div>';
      arr.forEach((q, idx)=>{
        const el = document.createElement('div'); el.className='qa-item';
        el.innerHTML = `<div class="qa-meta"><div><strong>Pergunta</strong></div><div class="small">${new Date(q.ts).toLocaleString()}</div></div><div class="qa-body">${escapeHtml(q.text)}</div>`;
        if(q.answer){ const r = document.createElement('div'); r.className='reply'; r.innerHTML = `<div class="qa-meta"><div class="small">Resposta</div><div class="small">${new Date(q.answeredAt).toLocaleString()}</div></div><div class="qa-body">${escapeHtml(q.answer)}</div>`; el.appendChild(r); }

        // botão de marcar como respondido (apenas no protótipo)
        const ctrl = document.createElement('div'); ctrl.style.display='flex'; ctrl.style.gap='8px'; ctrl.style.justifyContent='flex-end'; ctrl.style.marginTop='8px';
        const btn = document.createElement('button'); btn.className='btn ghost'; btn.textContent = q.answer ? 'Editar resposta' : 'Responder (protótipo)';
        btn.addEventListener('click', ()=>{
          const ans = prompt('Digite a resposta (protótipo):', q.answer||'');
          if(ans!==null){ arr[idx].answer = ans; arr[idx].answeredAt = Date.now(); setQAStore(arr); renderQA(); }
        });
        ctrl.appendChild(btn);

        const delBtn = document.createElement('button');
        delBtn.className = 'btn ghost';
        delBtn.textContent = 'Excluir';
        delBtn.style.color = 'var(--danger)';
        delBtn.addEventListener('click', () => {
          if(confirm('Tem certeza que deseja excluir esta sugestão?')) {
            arr.splice(idx, 1);
            setQAStore(arr);
            renderQA();
          }
        });
        ctrl.appendChild(delBtn);

        el.appendChild(ctrl);

        qaList.appendChild(el);
      });
    }

    qSend.addEventListener('click', ()=>{ sendQuestion(); });
    qInput.addEventListener('keypress', (e)=>{ if(e.key==='Enter') sendQuestion(); });

    function sendQuestion(){
      const text = qInput.value && qInput.value.trim();
      if(!text) return alert('Escreva sua dúvida antes de enviar.');
      const arr = getQAStore();
      arr.unshift({text, ts: Date.now(), answer: null});
      setQAStore(arr);
      qInput.value = '';
      renderQA();

      // FUTURO: enviar para backend
      // fetch('/api/questions', {method:'POST', body: JSON.stringify({lesson: lessonId(...), text})})
    }

    simulateAnswer.addEventListener('click', ()=>{ // responder a primeira que esteja sem resposta
      const arr = getQAStore();
      const idx = arr.findIndex(x=>!x.answer);
      if(idx===-1){ alert('Não há perguntas sem resposta (protótipo).'); return; }
      const ans = prompt('Digite a resposta (protótipo):');
      if(ans===null) return;
      arr[idx].answer = ans; arr[idx].answeredAt = Date.now(); setQAStore(arr); renderQA();
    });

    // ===== Ratings & Feedback (local simulation) =====
    function getRatingsStore(){
      const key = RATINGS_KEY_PREFIX + lessonId(state.moduleIndex,state.lessonIndex);
      return JSON.parse(localStorage.getItem(key) || '[]');
    }
    function setRatingsStore(arr){ const key = RATINGS_KEY_PREFIX + lessonId(state.moduleIndex,state.lessonIndex); localStorage.setItem(key, JSON.stringify(arr)); }

    function renderRatings(){
      const arr = getRatingsStore();
      const total = arr.length;
      const avg = total ? (arr.reduce((s,r)=>s+r.score,0)/total) : 0;
      avgRatingEl.textContent = `⭐ ${avg.toFixed(1)} / 5`;
      totalRatingsEl.textContent = `${total} avaliação${total!==1?'es':''}`;

      // marcar estrelas de acordo com usuário local (simulação: última avaliação local)
      const last = arr.find(a=>a.local) || arr[arr.length-1];
      highlightStars(last ? last.score : 0);
    }

    function highlightStars(n){
      [...starsWrap.children].forEach(s=>{ const v = Number(s.dataset.value); s.textContent = v<=n ? '★' : '☆'; s.classList.toggle('filled', v<=n); });
    }

    // clique nas estrelas
    [...starsWrap.children].forEach(s=>{
      s.addEventListener('click', ()=>{
        const val = Number(s.dataset.value);
        // mostrar area de feedback
        feedbackArea.classList.add('visible');
        highlightStars(val);
        feedbackArea.dataset.pendingScore = val;
      });
    });

    sendFeedback.addEventListener('click', ()=>{
      const score = Number(feedbackArea.dataset.pendingScore || 0);
      if(!score){ alert('Escolha a quantidade de estrelas antes.'); return; }
      const text = feedbackText.value.trim();
      const arr = getRatingsStore();
      arr.push({score, text, ts: Date.now(), local: true});
      setRatingsStore(arr);
      feedbackText.value = '';
      feedbackArea.classList.remove('visible');
      renderRatings();
      renderFeedbacks();

      // FUTURO: enviar para backend
      // fetch('/api/ratings', {method:'POST', body: JSON.stringify({lesson: lessonId(...), score, text})})
    });

    function renderFeedbacks(){
      const arr = getRatingsStore().slice().reverse();
      feedbackList.innerHTML = '';
      if(arr.length===0) feedbackList.innerHTML = '<div class="small">Seja o primeiro a deixar um feedback.</div>';
      arr.slice(0,6).forEach(f=>{
        const div = document.createElement('div'); div.style.padding='8px 0';
        div.innerHTML = `<div style="font-weight:600">${'★'.repeat(f.score)}${'☆'.repeat(5-f.score)}</div><div class="small">${f.text ? escapeHtml(f.text) : '<i>Sem comentário</i>'}</div><div class="small" style="color:var(--muted)">${new Date(f.ts).toLocaleString()}</div>`;
        feedbackList.appendChild(div);

        const delBtn = document.createElement('button');
        delBtn.className = 'btn ghost';
        delBtn.textContent = 'Excluir';
        delBtn.style.color = 'var(--danger)';
        delBtn.style.marginLeft = '8px';
        delBtn.addEventListener('click', () => {
          if(confirm('Tem certeza que deseja excluir esta avaliação?')) {
            const all = getRatingsStore();
            // Remove pelo timestamp
            const idx = all.findIndex(x => x.ts === f.ts);
            if(idx !== -1) {
              all.splice(idx, 1);
              setRatingsStore(all);
              renderFeedbacks();
              renderRatings();
            }
          }
        });
        div.appendChild(delBtn);
      });
    }

    // ===== Progress & course functions =====
    function updateProgressUI(){
      const total = data.reduce((s,m)=>s+m.lessons.length,0);
      let done = 0;
      data.forEach((m,mi)=>m.lessons.forEach((l,li)=>{ if(saved[`m${mi}l${li}`] && saved[`m${mi}l${li}`].completed) done++; }));
      const pct = Math.round((done/total)*100);
      progressBar.style.width = pct + '%';
      stepsText.textContent = `${pct}% concluído`;
    }

    markBtn.addEventListener('click', ()=>{
      const id = lessonId(state.moduleIndex, state.lessonIndex);
      saved[id] = saved[id] || {};
      saved[id].completed = !saved[id].completed;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
      renderSidebar();
      loadLesson();
    });

    prevBtn.addEventListener('click', ()=>{
      window.scrollTo({top: 0, behavior: 'smooth'});
      // Sempre expande o módulo atual
      collapsedModules[state.moduleIndex] = false;
      localStorage.setItem(COLLAPSE_KEY, JSON.stringify(collapsedModules));
      if(state.lessonIndex>0) selectLesson(state.moduleIndex, state.lessonIndex-1);
      else if(state.moduleIndex>0){
        const pm = state.moduleIndex-1;
        collapsedModules[pm] = false; // Expande o módulo anterior também
        localStorage.setItem(COLLAPSE_KEY, JSON.stringify(collapsedModules));
        selectLesson(pm, data[pm].lessons.length-1);
      }
    });
    nextBtn.addEventListener('click', ()=>{
      window.scrollTo({top: 0, behavior: 'smooth'});
      // Sempre expande o módulo atual
      collapsedModules[state.moduleIndex] = false;
      localStorage.setItem(COLLAPSE_KEY, JSON.stringify(collapsedModules));
      const curMod = data[state.moduleIndex];
      if(state.lessonIndex < curMod.lessons.length-1) selectLesson(state.moduleIndex, state.lessonIndex+1);
      else if(state.moduleIndex < data.length-1){
        collapsedModules[state.moduleIndex+1] = false; // Expande o próximo módulo também
        localStorage.setItem(COLLAPSE_KEY, JSON.stringify(collapsedModules));
        selectLesson(state.moduleIndex+1, 0);
      }
    });

    // theme toggle
    themeBtn.addEventListener('click', ()=>{
      const root = document.documentElement;
      const isDark = root.getAttribute('data-theme') === 'dark';
      if(isDark){ root.removeAttribute('data-theme'); themeBtn.textContent = 'Modo Escuro'; }
      else{ root.setAttribute('data-theme','dark'); themeBtn.textContent = 'Modo Claro'; }
    });

    // back to module - volta para inicio do modulo
    backToModule.addEventListener('click', ()=>{ selectLesson(state.moduleIndex, 0); });

    // mobile toggle
    document.getElementById('mobileToggle').addEventListener('click', ()=>{ document.getElementById('sidebar').classList.toggle('open'); });

    // inicialização
    (function init(){
      if(saved.last){ state.moduleIndex = saved.last.mi || 0; state.lessonIndex = saved.last.li || 0; }
      renderSidebar();
      loadLesson();
      const originalSelect = selectLesson;
      selectLesson = function(mi,li){ originalSelect(mi,li); saved.last = {mi,li}; localStorage.setItem(STORAGE_KEY, JSON.stringify(saved)); };
      setInterval(updateProgressUI,1500);
    })();

    // simples escaper
    function escapeHtml(str){ return String(str).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;'); }
    // ===== NOVO: alternar visibilidade de QA e Rating =====
    const toggleQA = document.getElementById('toggleQA');
    const toggleRating = document.getElementById('toggleRating');
    const qaPanel = document.getElementById('qaPanel');
    const ratingPanel = document.getElementById('ratingPanel');

    toggleQA.addEventListener('click', ()=>{
      qaPanel.classList.toggle('hidden');
      if(!qaPanel.classList.contains('hidden')) ratingPanel.classList.add('hidden'); // fecha o outro
    });

    toggleRating.addEventListener('click', ()=>{
      ratingPanel.classList.toggle('hidden');
      if(!ratingPanel.classList.contains('hidden')) qaPanel.classList.add('hidden'); // fecha o outro
    });

document.getElementById('closePayModal').onclick = function() {
  document.getElementById('payModal').style.display = 'none';
};
// Fechar ao clicar fora do conteúdo
document.getElementById('payModal').onclick = function(e) {
  if(e.target === this) this.style.display = 'none';
};

// ...após o carregamento do DOM...

document.addEventListener('DOMContentLoaded', function() {
  const stars = document.querySelectorAll('#stars .star');
  let selected = 0;

  stars.forEach(star => {
    // Ilumina as estrelas ao passar o mouse
    star.addEventListener('mouseenter', function() {
      const val = parseInt(this.getAttribute('data-value'));
      highlightStars(val);
    });
    // Remove o highlight ao sair do mouse
    star.addEventListener('mouseleave', function() {
      highlightStars(selected);
    });
    // Seleciona a nota ao clicar
    star.addEventListener('click', function() {
      selected = parseInt(this.getAttribute('data-value'));
      highlightStars(selected);
    });
  });

  function highlightStars(val) {
    stars.forEach(star => {
      if (parseInt(star.getAttribute('data-value')) <= val) {
        star.classList.add('on');
      } else {
        star.classList.remove('on');
      }
    });
  }
});

setTimeout(() => {
  const currentLesson = document.querySelector('.lesson.current');
  if (currentLesson) {
    currentLesson.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }
}, 50);

