// ======== IMPORTS DE MÚSICAS ========
import tokyoCity from './sounds/musicas/tokyo-city-lofi-365949.mp3';
import cozyEvening from './sounds/musicas/cozy-evening-chill-lofi-beats-365936.mp3';
import moonlitPathways from './sounds/musicas/moonlit-pathways-skyrim-lofi-journey-406715.mp3';
import dreamInLoops from './sounds/musicas/dream-in-loops-lofi-music-351758.mp3';
import rainyDay from './sounds/musicas/rainy-day-lofi-356060.mp3';
import ambientLofi1 from './sounds/musicas/ambient-lofi-lofi-music-1.mp3';
import coffeeLofi2 from './sounds/musicas/coffee-lofi-lofi-music-2.mp3';
import dreamWaves from './sounds/musicas/dream-waves-ambient-lofi-400370.mp3';
import lofi3 from './sounds/musicas/lofi-3.mp3';
import lofi4 from './sounds/musicas/lofi-background-music-4.mp3';
import lofi5 from './sounds/musicas/lofi-girl-5.mp3';
import lofi6 from './sounds/musicas/lofi-girl-lofi-ambient-music-6.mp3';
import lofi7 from './sounds/musicas/lofi-girl-lofi-hiphop-beats-7.mp3';
import springLofi9 from './sounds/musicas/spring-lofi-vibes-lofi-music-9.mp3';

// ======== IMPORTS DE SONS ========
import buttonPressSound from './sounds/button-press.mp3';
import clockAlarmSound from './sounds/clock-alarm.mp3';

// ======== MÚSICA DE FUNDO ========
const musicasFoco = [
  tokyoCity, cozyEvening, moonlitPathways, dreamInLoops, rainyDay,
  ambientLofi1, coffeeLofi2, dreamWaves, lofi3, lofi4,
  lofi5, lofi6, lofi7, springLofi9
];

const musicaFoco = new Audio();
musicaFoco.volume = 0.25;
musicaFoco.loop = false;

function proximaMusicaAleatoria() {
  const index = Math.floor(Math.random() * musicasFoco.length);
  musicaFoco.src = musicasFoco[index];
  musicaFoco.play();
}

musicaFoco.addEventListener("ended", () => {
  if (somAtivo) proximaMusicaAleatoria();
});

// ======== SELETORES ========
const btnsStartPause = document.querySelector(".btns-start-pause");
const html = document.querySelector("html");
const minutosTela = document.getElementById("minutos");
const segundosTela = document.getElementById("segundos");
const pauseStart = document.getElementById("start-pause-img");
const modo = document.querySelector(".modo");
const favicon = document.getElementById("favicon");

const btnFocoCurto = document.querySelector(".btn-foco-curto");
const btnFocoLongo = document.querySelector(".btn-foco-longo");
const btnCurto = document.querySelector(".btn-curto");
const btnLongo = document.querySelector(".btn-longo");

const alerta = document.querySelector(".overlay");
const alertParagrafo = document.querySelector(".alert-p");

const audioPlay = new Audio(buttonPressSound);
const alarm = new Audio(clockAlarmSound);
alarm.loop = true;
alarm.volume = 0.7;

let intervalo = null;
let tempoEmSegundos = 1500;

// ======== NOTIFICAÇÕES ========
if (Notification.permission === "default") {
  Notification.requestPermission();
}

function mostrarNotificacao(titulo, corpo) {
  if (Notification.permission === "granted") {
    new Notification(titulo, { body: corpo, icon: "./img/logo_focus.svg" });
  }
}

// ======== ICONES ========
const playIcon = '<path d="M8 5v14l11-7z"/>';
const pauseIcon = '<path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>';

// ======== DARK MODE ========
const toggleDark = document.getElementById("toggle-dark");
let darkAtivo = JSON.parse(localStorage.getItem("darkMode")) ?? toggleDark.checked;
toggleDark.checked = darkAtivo;

(function aplicarModoInicial() {
  const modoAtual = html.dataset.modo;
  if (darkAtivo && !modoAtual.includes("-dark")) {
    trocarDeModo(`${modoAtual}-dark`, false);
  } else if (!darkAtivo && modoAtual.includes("-dark")) {
    trocarDeModo(modoAtual.replace("-dark", ""), false);
  }
})();

toggleDark.addEventListener("change", () => {
  darkAtivo = toggleDark.checked;
  localStorage.setItem("darkMode", JSON.stringify(darkAtivo));
  const modoAtual = html.dataset.modo;
  if (darkAtivo && !modoAtual.includes("-dark")) {
    trocarDeModo(`${modoAtual}-dark`, false);
  } else if (!darkAtivo && modoAtual.includes("-dark")) {
    trocarDeModo(modoAtual.replace("-dark", ""), false);
  }
});

// ======== TOGGLE SOM ========
const toggleSound = document.getElementById("toggle-sound");
let somAtivo = toggleSound.checked;

toggleSound.addEventListener("change", () => {
  somAtivo = toggleSound.checked;
  if (somAtivo) {
    if (!musicaFoco.src || musicaFoco.src.endsWith("#")) proximaMusicaAleatoria();
    else musicaFoco.play();
  } else {
    musicaFoco.pause();
  }
});

// ======== ALERTA ========
const btnAlert = document.getElementById("alert-button");
btnAlert.addEventListener("click", () => {
  alerta.classList.remove("active");
  alarm.pause();
  alarm.currentTime = 0;
});

// ======== TIMER ========
function iniciarOuPausarContagem() {
  minutosTela.classList.add("ativo");
  segundosTela.classList.add("ativo");
  audioPlay.play();
  const modoBase = html.dataset.modo.replace("-dark", "");

  if (tempoEmSegundos === 0) {
    alerta.classList.add("active");
    alertParagrafo.textContent = modoBase === "foco" ? "Escolha uma pausa curta ou longa!" : "Hora de voltar para o foco!";
    return;
  }

  if (intervalo) {
    clearInterval(intervalo);
    intervalo = null;
    pauseStart.innerHTML = playIcon;
    minutosTela.classList.remove("ativo");
    segundosTela.classList.remove("ativo");
    return;
  }

  pauseStart.innerHTML = pauseIcon;
  intervalo = setInterval(() => {
    tempoEmSegundos -= 1;
    mostrarNaTela();
  }, 1000);
}

function mostrarNaTela() {
  const minutos = Math.floor(tempoEmSegundos / 60);
  const segundos = tempoEmSegundos % 60;

  if (tempoEmSegundos <= 0) {
    if (intervalo !== null) {
      alarm.play();
      clearInterval(intervalo);
      intervalo = null;
      pauseStart.innerHTML = playIcon;
      minutosTela.classList.remove("ativo");
      segundosTela.classList.remove("ativo");
      minutosTela.textContent = "00";
      segundosTela.textContent = "00";

      const modoBase = html.dataset.modo.replace("-dark", "");
      alerta.classList.add("active");
      alertParagrafo.textContent = modoBase === "foco" ? "Escolha uma pausa curta ou longa!" : "Hora de voltar para o foco!";
      mostrarNotificacao(modoBase === "foco" ? "Pomodoro finalizado 🍅" : "A hora da pausa acabou 🍅",
        modoBase === "foco" ? "Hora de fazer uma pausa!" : "Hora de voltar para o foco!");
    }
    return;
  }

  minutosTela.textContent = minutos.toString().padStart(2, "0");
  segundosTela.textContent = segundos.toString().padStart(2, "0");
}

btnsStartPause.addEventListener("click", iniciarOuPausarContagem);

// ======== BOTÕES MODO ========
btnCurto.addEventListener("click", () => {
  trocarDeModo(darkAtivo ? "curto-dark" : "curto", true);
});
btnLongo.addEventListener("click", () => {
  trocarDeModo(darkAtivo ? "longo-dark" : "longo", true);
});
btnFocoCurto.addEventListener("click", () => {
  trocarDeModo(darkAtivo ? "foco-dark" : "foco", true);
});
btnFocoLongo.addEventListener("click", () => {
  trocarDeModo(darkAtivo ? "foco-dark" : "foco", true);
});

// ======== FUNÇÃO DE TROCA DE MODO ========
function trocarDeModo(novoModo, atualizarTempo = true) {
  html.dataset.modo = novoModo;
  const modoBase = novoModo.replace("-dark", "");

  if (atualizarTempo) {
    clearInterval(intervalo);
    intervalo = null;
    pauseStart.innerHTML = playIcon;
    alarm.pause();
    alarm.currentTime = 0;
    minutosTela.classList.remove("ativo");
    segundosTela.classList.remove("ativo");

    switch (modoBase) {
      case "foco": tempoEmSegundos = 1500; break;
      case "curto": tempoEmSegundos = 300; break;
      case "longo": tempoEmSegundos = 900; break;
    }
  } else if (tempoEmSegundos <= 0) {
    switch (modoBase) {
      case "foco": tempoEmSegundos = 1500; break;
      case "curto": tempoEmSegundos = 300; break;
      case "longo": tempoEmSegundos = 900; break;
    }
  }

  // Atualiza ícones e visibilidade dos botões
  switch (novoModo) {
    case "foco":
      modo.innerHTML = '<img src="/img/ph_brain-fill.svg" />Focus';
      favicon.href = "img/logo_focus.svg";
      btnFocoCurto.style.display = "none";
      btnFocoLongo.style.display = "none";
      btnCurto.style.display = "block";
      btnLongo.style.display = "block";
      break;

    case "foco-dark":
      modo.innerHTML = '<img src="/img/ph_brain-fill-focus-dark.svg" />Focus';
      favicon.href = "img/logo_focus.svg";
      btnFocoCurto.style.display = "none";
      btnFocoLongo.style.display = "none";
      btnCurto.style.display = "block";
      btnLongo.style.display = "block";
      break;

    case "curto":
      modo.innerHTML = `<img src="/img/ph_coffee_green.svg" />Short Break`;
      favicon.href = "img/logo_short_break.svg";
      btnFocoCurto.style.display = "block";
      btnFocoLongo.style.display = "none";
      btnCurto.style.display = "none";
      btnLongo.style.display = "block";
      break;

    case "curto-dark":
      modo.innerHTML = `<img src="/img/ph_coffee-green-dark.svg" />Short Break`;
      favicon.href = "img/logo_short_break.svg";
      btnFocoCurto.style.display = "block";
      btnFocoLongo.style.display = "none";
      btnCurto.style.display = "none";
      btnLongo.style.display = "block";
      break;

    case "longo":
      modo.innerHTML = `<img src="/img/ph_coffee_blue.svg" />Long Break`;
      favicon.href = "img/logo_long_break.svg";
      btnFocoCurto.style.display = "none";
      btnFocoLongo.style.display = "block";
      btnCurto.style.display = "block";
      btnLongo.style.display = "none";
      break;

    case "longo-dark":
      modo.innerHTML = `<img src="/img/ph_coffee-blue-dark.svg" />Long Break`;
      favicon.href = "img/logo_long_break.svg";
      btnFocoCurto.style.display = "none";
      btnFocoLongo.style.display = "block";
      btnCurto.style.display = "block";
      btnLongo.style.display = "none";
      break;
  }


  mostrarNaTela();
}

// ======== INICIALIZAÇÃO ========
mostrarNaTela();
