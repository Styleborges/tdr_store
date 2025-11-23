// elementos principais
const loginPage = document.getElementById("loginPage");
const chatPage = document.getElementById("chatPage");

const googleBtn = document.getElementById("googleBtn");
const guestBtn = document.getElementById("guestBtn");
const emailForm = document.getElementById("emailForm");

const userNameSpan = document.getElementById("userName");
const userEmailSpan = document.getElementById("userEmail");
const userAvatar = document.getElementById("userAvatar");

const logoutBtn = document.getElementById("logoutBtn");

const messagesDiv = document.getElementById("messages");
const userInput = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");

let currentUser = null;
let history = [];

// firebase auth (vem do firebase-auth.js)
const { auth, signInWithGoogle, onAuthStateChanged, signOut } = window.borgesAuth;

// backend
const backendUrl = "http://localhost:3000/api/chat";

// helpers UI
function setUser(user) {
  currentUser = user;
  userNameSpan.textContent = user.name;
  userEmailSpan.textContent = user.email;
  userAvatar.textContent = user.name.charAt(0).toUpperCase();
}

function showChat() {
  loginPage.classList.add("hidden");
  chatPage.classList.remove("hidden");
  userInput.focus();
}

function showLogin() {
  chatPage.classList.add("hidden");
  loginPage.classList.remove("hidden");
  messagesDiv.innerHTML = "";
  currentUser = null;
  history = [];
}

function addMessage(text, sender) {
  const div = document.createElement("div");
  div.classList.add("msg", sender);
  div.textContent = text;
  messagesDiv.appendChild(div);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

function addWelcome() {
  const name = currentUser?.name || "Usuário";
  addMessage(`Fala, ${name}! 👋 Eu sou o Borges IA.`, "bot");
}

// login google real
googleBtn.addEventListener("click", async () => {
  try {
    const result = await signInWithGoogle();
    const u = result.user;

    setUser({
      name: u.displayName || "Usuário Google",
      email: u.email || "sem e-mail",
      provider: "google"
    });

    showChat();
    addWelcome();
  } catch (err) {
    console.error("Erro Google:", err);
    addMessage("Erro ao entrar com Google.", "bot");
  }
});

// login convidado
guestBtn.addEventListener("click", () => {
  setUser({
    name: "Convidado",
    email: "convidado@borges.dev",
    provider: "guest"
  });
  showChat();
  addWelcome();
});

// login por email (demo local)
emailForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("emailInput").value.trim();
  const password = document.getElementById("passwordInput").value.trim();
  if (!email || !password) return;

  const baseName = email.split("@")[0] || "Usuário";
  const name = baseName.charAt(0).toUpperCase() + baseName.slice(1);

  setUser({
    name,
    email,
    provider: "email"
  });

  showChat();
  addWelcome();
});

// manter sessão google se já estiver logado
onAuthStateChanged(auth, (user) => {
  if (user && !currentUser) {
    setUser({
      name: user.displayName || "Usuário Google",
      email: user.email || "sem e-mail",
      provider: "google"
    });
    showChat();
    addWelcome();
  }
});

// logout
logoutBtn.addEventListener("click", async () => {
  try {
    if (currentUser?.provider === "google") {
      await signOut();
    }
  } catch (err) {
    console.error("Erro ao sair:", err);
  }
  showLogin();
});

// chat
async function sendMessage() {
  const text = userInput.value.trim();
  if (!text) return;

  if (!currentUser) {
    addMessage("Faça login antes de conversar com o Borges IA.", "bot");
    return;
  }

  addMessage(text, "user");
  userInput.value = "";

  try {
    const res = await fetch(backendUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text, history })
    });

    const data = await res.json();

    if (data.error) {
      addMessage("Erro no servidor: " + data.error, "bot");
      return;
    }

    const reply = data.reply || "Não consegui responder agora.";
    addMessage(reply, "bot");

    history.push({ role: "user", content: text });
    history.push({ role: "assistant", content: reply });
  } catch (err) {
    console.error("Erro no fetch:", err);
    addMessage("Não consegui falar com o backend.", "bot");
  }
}

sendBtn.addEventListener("click", sendMessage);
userInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    sendMessage();
  }
});
