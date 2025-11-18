// ===== CONFIG: cole aqui suas URLs =====
// URL do convite do BOT (copie do Discord Developer Portal ou do convite do servidor)
const BOT_INVITE_URL = "https://discord.com/oauth2/authorize?client_id=1439907381386547276";

// Link do servidor de suporte (informe um link de convite do servidor)
const DISCORD_SERVER_INVITE = "COLE_AQUI_O_LINK_DO_SERVIDOR";

// Link do painel (se tiver painel web)
const PAINEL_URL = "#";

// =======================================
document.getElementById('year').textContent = new Date().getFullYear();

// setar links (se usuário esqueceu de trocar, deixará "#")
function setLink(id, url){
  const el = document.getElementById(id);
  if(!el) return;
  if(!url || url === "#" || url.includes("COLE_AQUI")){
    el.removeAttribute('href');
    el.classList.add('btn-ghost');
    el.style.opacity = 0.8;
    el.title = "Cole o link nas configurações (arquivo script.js)";
  } else {
    el.href = url;
  }
}

setLink('inviteHeaderBtn', BOT_INVITE_URL);
setLink('discordBtn', DISCORD_SERVER_INVITE);
setLink('discordSupport', DISCORD_SERVER_INVITE);
setLink('supportInvite', DISCORD_SERVER_INVITE);
setLink('openPanelBtn', PAINEL_URL);
setLink('buyBtn', '#produtos');
