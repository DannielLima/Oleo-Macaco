let tentativas = 0;
const cursor = document.getElementById("cursor");
const img = document.getElementById("img-macaco");

document.addEventListener("mousemove", (e) => {
  if (window.matchMedia("(pointer: fine)").matches) {
    if (cursor) {
      cursor.style.transform = `translate(${e.clientX - 20}px, ${e.clientY - 20}px)`;
      cursor.style.opacity = "1";
    }

    if (img) {
      const xAxis = (window.innerWidth / 2 - e.clientX) / 25;
      const yAxis = (window.innerHeight / 2 - e.clientY) / 25;
      img.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
    }
  }
});

document.addEventListener("mousemove", (e) => {
  const gota = document.createElement("div");

  gota.className = "fixed pointer-events-none z-[80] gota-oleo";

  const tamanho = Math.random() * 12 + 4;
  gota.style.width = `${tamanho}px`;
  gota.style.height = `${tamanho + Math.random() * 5}px`;

  gota.style.left = `${e.clientX}px`;
  gota.style.top = `${e.clientY}px`;

  document.body.appendChild(gota);

  const driftX = (Math.random() - 0.5) * 30;
  const quedaY = Math.random() * 100 + 50;

  const anima = gota.animate(
    [
      {
        transform: "translate(0, 0) scale(1)",
        opacity: 0.8,
      },
      {
        transform: `translate(${driftX}px, ${quedaY}px) scale(0)`,
        opacity: 0,
      },
    ],
    {
      duration: Math.random() * 1000 + 1000,
      easing: "cubic-bezier(0.5, 0, 0.7, 0.5)",
    },
  );

  anima.onfinish = () => gota.remove();
});

const konamiCode = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];
let konamiIndex = 0;

document.addEventListener("keydown", (e) => {
  if (e.key === konamiCode[konamiIndex]) {
    konamiIndex++;
    if (konamiIndex === konamiCode.length) {
      ativarDerretimento();
      konamiIndex = 0;
    }
  } else {
    konamiIndex = 0;
  }
});

function ativarDerretimento() {
  document.body.style.transition = "filter 2s ease-in-out";
  document.body.style.filter = "url(#metaball) blur(2px) contrast(1.2)";

  document.querySelector("main").classList.add("animate-melt");

  setTimeout(() => {
    document.body.style.filter = "none";
    document.querySelector("main").classList.remove("animate-melt");
  }, 5000);
}

document.addEventListener(
  "wheel",
  (e) => {
    const delta = e.deltaY;
    const title = document.querySelector("h1");
    const badge = document.querySelector(".animate-fade-in");

    if (title) title.style.transform = `translateY(${delta * 0.2}px)`;
    if (badge) badge.style.transform = `translateY(${delta * -0.5}px)`;

    setTimeout(() => {
      if (title) title.style.transform = "translateY(0)";
      if (badge) badge.style.transform = "translateY(0)";
    }, 500);
  },
  { passive: true },
);

function comprar() {
  const btn = document.getElementById("comprar");
  const barra = document.getElementById("barra-progresso");
  const barraCont = document.getElementById("barra-container");

  if (tentativas >= 2) {
    modoBossFight();
    return;
  }

  tentativas++;

  if (navigator.vibrate) navigator.vibrate([10, 30, 10]);

  btn.innerText = "SINTETIZANDO...";
  btn.classList.add("opacity-50", "pointer-events-none");
  barraCont.classList.remove("hidden");

  let p = 0;
  const interval = setInterval(() => {
    p += Math.random() * 10;
    if (p > 98) p = 98;
    barra.style.width = p + "%";

    if (p > 70 && Math.random() > 0.8) {
      document.body.style.filter = "invert(0.1)";
      setTimeout(() => (document.body.style.filter = "none"), 50);
    }
  }, 100);

  setTimeout(() => {
    clearInterval(interval);

    Swal.fire({
      title: '<span class="tracking-widest">FALHA NA EXTRAÇÃO</span>',
      text: "Seu sistema biológico não atingiu a frequência necessária.",
      background: "#050505",
      color: "#fff",
      confirmButtonText: "RE-TENTAR",
      confirmButtonColor: "#fff",
      customClass: {
        confirmButton: "text-black font-bold px-8 py-2",
      },
    }).then(() => {
      btn.innerText = "INICIAR EXTRAÇÃO";
      btn.classList.remove("opacity-50", "pointer-events-none");
      barra.style.width = "0%";
      barraCont.classList.add("hidden");
    });
  }, 1500);
}

function modoBossFight() {
  let clicks = 0;
  let tempo = 10.0;

  const bossOverlay = document.createElement("div");
  bossOverlay.className =
    "fixed inset-0 bg-black z-[200] flex flex-col items-center justify-center p-6 text-white text-center";

  bossOverlay.innerHTML = `
        <div class="mb-6 animate-pulse">
            <img src="images/macaco-boss.gif" alt="Macaco Boss" class="w-40 h-40 md:w-56 md:h-56 object-contain drop-shadow-[0_0_20px_rgba(255,0,0,0.5)]" />
        </div>
        <h2 class="text-4xl font-black italic mb-2 text-red-600">MODO PRIMATA</h2>
        <p class="text-zinc-500 tracking-[.3em] text-[10px] mb-6 uppercase animate-pulse">Sobrecarga de DNA detectada</p>
        <div class="text-6xl font-mono mb-8" id="boss-timer">10.00</div>
        <button id="atacar" class="w-full max-w-xs aspect-square rounded-full border-4 border-white/20 bg-white/5 text-white font-black text-2xl uppercase active:scale-95 transition-all shadow-[0_0_30px_rgba(255,255,255,0.1)]">GOLPEAR</button>
        <p class="mt-8 text-[10px] opacity-50 uppercase tracking-[0.4em]">Sincronia: <span id="click-count">0</span> / 25</p>
    `;
  document.body.appendChild(bossOverlay);

  const timerDisplay = document.getElementById("boss-timer");
  const clickDisplay = document.getElementById("click-count");
  const btnAtacar = document.getElementById("atacar");

  const countdown = setInterval(() => {
    tempo -= 0.01;
    timerDisplay.innerText = tempo.toFixed(2);
    if (tempo <= 0) {
      clearInterval(countdown);
      finalizarBoss(clicks >= 25, bossOverlay);
    }
  }, 10);

  btnAtacar.addEventListener("click", () => {
    clicks++;
    clickDisplay.innerText = clicks;
    if (navigator.vibrate) navigator.vibrate(20);
    bossOverlay.style.filter = `hue-rotate(${clicks * 15}deg) brightness(${1 + clicks * 0.02})`;
    setTimeout(() => {
      bossOverlay.style.filter = `hue-rotate(${clicks * 15}deg)`;
    }, 50);
  });
}

function finalizarBoss(vitoria, overlay) {
  overlay.remove();
  if (vitoria) {
    Swal.fire({
      icon: "success",
      title: "SÍNTESE CONCLUÍDA",
      text: "O Óleo de Macaco agora corre em suas veias.",
      background: "#000",
      color: "#fff",
    });
    tentativas = 0;
  } else {
    Swal.fire({
      icon: "error",
      title: "EVOLUÇÃO INTERROMPIDA",
      text: "Você não sobreviveu ao processo.",
      background: "#000",
      color: "#fff",
    });
    tentativas = 1;
  }
}
