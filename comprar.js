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
