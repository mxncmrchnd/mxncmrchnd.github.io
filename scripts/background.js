    (function () {
      /* ── Paramètres ────────────────────────────────────────── */
      const COLS        = 24;      // colonnes de la grille
      const ROWS        = 18;      // lignes
      const GAP         = 1;       // px entre les carreaux
      const FLIP_MS     = 750;     // durée du retournement par carreau (ms)
      const EASING      = 'cubic-bezier(0.4, 0, 0.2, 1)';
      const WAVE_STEP   = 52;      // délai entre chaque diagonale (ms)
      const PAUSE_AFTER = 2200;    // pause après la fin de la vague (ms)
 
      /* Couleurs : blanc cassé → bleu profond */
      const WHITE = [245, 250, 255];
      const BLUE  = [14,  70, 148];
      /* ───────────────────────────────────────────────────────── */
 
      function lerp(a, b, t) {
        t = Math.max(0, Math.min(1, t));
        return a.map((v, i) => Math.round(v + (b[i] - v) * t));
      }
      function toRgb(arr) { return `rgb(${arr.join(',')})`; }
 
      const bg = document.getElementById('bg');
      const maxD = ROWS + COLS - 2;
 
      bg.style.gridTemplateColumns = `repeat(${COLS}, 1fr)`;
      bg.style.gridTemplateRows    = `repeat(${ROWS}, 1fr)`;
      bg.style.gap                 = `${GAP}px`;
 
      const cells = [];
 
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          const t      = (r + c) / maxD;
          const frontC = lerp(WHITE, BLUE, t);      // blanc → bleu
          const backC  = lerp(WHITE, BLUE, 1 - t);  // bleu  → blanc (inversé)
 
          const cell = document.createElement('div');
          cell.className = 'cell';
 
          const inner = document.createElement('div');
          inner.className = 'cell-inner';
          inner.style.transition = `transform ${FLIP_MS}ms ${EASING}`;
 
          const front = document.createElement('div');
          front.className = 'face face-front';
          front.style.background = toRgb(frontC);
 
          const back = document.createElement('div');
          back.className = 'face face-back';
          back.style.background = toRgb(backC);
 
          inner.appendChild(front);
          inner.appendChild(back);
          cell.appendChild(inner);
          bg.appendChild(cell);
 
          cells.push({ inner, r, c });
        }
      }
 
      /* ── Animation de vague ───────────────────────────────── */
      let waveCount = 0;
 
      function launchWave() {
        waveCount++;
        const odd = waveCount % 2 === 1;
 
        /* La vague part du coin haut-gauche les fois impaires,
           du coin bas-droite les fois paires — elle suit donc
           toujours le sens du dégradé en cours. */
        for (const { inner, r, c } of cells) {
          const d     = odd ? (r + c) : (maxD - r - c);
          const delay = d * WAVE_STEP;
          setTimeout(() => {
            inner.style.transform = odd ? 'rotateY(180deg)' : 'rotateY(0deg)';
          }, delay);
        }
 
        /* Planifier la prochaine vague après que la vague actuelle
           se soit terminée + PAUSE_AFTER */
        const waveDuration = maxD * WAVE_STEP + FLIP_MS;
        setTimeout(launchWave, waveDuration + PAUSE_AFTER);
      }
 
      /* Première vague après un court délai visuel */
      setTimeout(launchWave, 1200);
 
    })();