const TAB_TITLES = {
  photos: "Fotos",
  shorts: "Shorts",
  free: "Freezão",
  premium: "Night Premium",
};

let currentTab = "photos";
let catalog = { photos: [], shorts: [], free: [], premium: [] };

const grid = document.getElementById("grid");
const empty = document.getElementById("empty");
const title = document.getElementById("title");
const statusEl = document.getElementById("status");
const tabLabel = document.getElementById("tabLabel");
const shown = document.getElementById("shown");
const total = document.getElementById("total");
const search = document.getElementById("search");
const clear = document.getElementById("clear");
const reloadBtn = document.getElementById("reload");
const errorBox = document.getElementById("errorBox");

const lightbox = document.getElementById("lightbox");
const closeLightbox = document.getElementById("closeLightbox");
const lightboxBody = document.getElementById("lightboxBody");
const lightboxName = document.getElementById("lightboxName");

document.querySelectorAll(".tab").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach((t) => t.classList.remove("active"));
    btn.classList.add("active");
    currentTab = btn.dataset.tab;
    render();
  });
});

search.addEventListener("input", render);
clear.addEventListener("click", () => { search.value = ""; render(); });
reloadBtn.addEventListener("click", () => loadCatalog(true));

closeLightbox.addEventListener("click", hideLightbox);
lightbox.addEventListener("click", (e) => { if (e.target === lightbox) hideLightbox(); });
document.addEventListener("keydown", (e) => { if (e.key === "Escape") hideLightbox(); });

async function loadCatalog(bustCache = false) {
  try {
    errorBox.classList.add("hidden");
    statusEl.textContent = "Carregando catálogo…";

    const url = bustCache ? `media.json?ts=${Date.now()}` : "media.json";
    const res = await fetch(url, { cache: "no-store" });

    if (!res.ok) {
      throw new Error(`Não achei media.json (HTTP ${res.status}).`);
    }

    catalog = await res.json();

    // garante chaves
    for (const k of ["photos", "shorts", "free", "premium"]) {
      if (!Array.isArray(catalog[k])) catalog[k] = [];
    }

    statusEl.textContent = "Online ✅";
    render();
  } catch (e) {
    statusEl.textContent = "Erro.";
    grid.innerHTML = "";
    empty.classList.remove("hidden");
    empty.textContent = "Nada para mostrar.";
    errorBox.textContent =
      `Falha ao carregar media.json. Confere se ele existe na raiz do repo e abre em: /media.json. Detalhe: ${String(e.message || e)}`;
    errorBox.classList.remove("hidden");
  }
}

function render() {
  title.textContent = TAB_TITLES[currentTab] || "Conteúdo";
  tabLabel.textContent = TAB_TITLES[currentTab] || "Conteúdo";

  const list = catalog[currentTab] || [];
  total.textContent = String(list.length);

  const q = (search.value || "").toLowerCase().trim();
  const filtered = list.filter((item) => !q || (item.name || "").toLowerCase().includes(q));

  shown.textContent = String(filtered.length);
  empty.classList.toggle("hidden", filtered.length !== 0);
  empty.textContent = "Nada encontrado.";

  grid.innerHTML = filtered.map(cardHTML).join("");

  grid.querySelectorAll("[data-open]").forEach((el) => {
    el.addEventListener("click", () => {
      const payload = el.getAttribute("data-open");
      if (!payload) return;
      const item = JSON.parse(payload);
      showLightbox(item);
    });
  });
}

function cardHTML(item) {
  const tag = (item.bucket || currentTab).toUpperCase();
  const badge = tag;
  const payload = escAttr(JSON.stringify(item));
  const name = esc(item.name || "");

  let media = "";
  if (item.type === "photo") {
    media = `<img src="${escAttr(item.url)}" alt="${name}" loading="lazy">`;
  } else {
    media = `
      <video muted playsinline preload="metadata">
        <source src="${escAttr(item.url)}" type="video/mp4">
      </video>
    `;
  }

  return `
    <article class="card" data-open="${payload}">
      <div class="media">
        <span class="badge">${esc(badge)}</span>
        ${media}
      </div>
      <div class="meta">
        <div class="fname" title="${name}">${name}</div>
        <span class="tag">${esc(tag)}</span>
      </div>
    </article>
  `;
}

function showLightbox(item) {
  lightboxBody.innerHTML = "";
  lightboxName.textContent = item.name || "";

  if (item.type === "photo") {
    lightboxBody.innerHTML = `<img src="${escAttr(item.url)}" alt="${esc(item.name || "")}">`;
  } else {
    lightboxBody.innerHTML = `
      <video controls autoplay playsinline preload="metadata">
        <source src="${escAttr(item.url)}" type="video/mp4">
      </video>
    `;
  }

  lightbox.classList.remove("hidden");
}

function hideLightbox() {
  const v = lightbox.querySelector("video");
  if (v) { try { v.pause(); } catch {} }
  lightbox.classList.add("hidden");
}

function esc(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;",
    '"': "&quot;", "'": "&#39;",
  }[c]));
}
function escAttr(s) { return esc(s).replace(/`/g, ""); }

loadCatalog(true);