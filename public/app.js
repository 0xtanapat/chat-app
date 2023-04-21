const socket = io();

const joinPage = document.querySelector(".join-screen");
const chatPage = document.querySelector(".chat-screen");

const msgContainer = document.querySelector(".messages");

const usernameInput = document.querySelector("#username");
const msgInput = document.querySelector("#message-input");

const joinBtn = document.querySelector("#join-btn");
const sendBtn = document.querySelector("#send-btn");
const exitBtn = document.querySelector("#exit-chat");

let username;

usernameInput.addEventListener("keyup", e => {
  e.preventDefault();
  if (e.key === "Enter") joinBtn.click();
});

msgInput.addEventListener("keyup", e => {
  e.preventDefault();
  if (e.key === "Enter") sendBtn.click();
});

document.body.addEventListener("keyup", e => {
  e.preventDefault();
  if (e.key === "Escape") exitBtn.click();
});

joinBtn.addEventListener("click", () => {
  let usernameInputVal = usernameInput.value;

  if (usernameInputVal.length == 0) {
    return;
  }

  socket.emit("newUser", usernameInputVal);
  username = usernameInputVal;

  joinPage.classList.remove("active");
  chatPage.classList.add("active");

  msgInput.focus();
});

exitBtn.addEventListener("click", () => {
  socket.emit("exitChat", username);
  window.location.href = window.location.href;
  location.reload();
});

sendBtn.addEventListener("click", () => {
  let msg = msgInput.value;

  if (msg.length == 0) {
    return;
  }

  renderMessage("my", {
    username: username,
    text: msg,
  });

  socket.emit("chat", {
    username: username,
    text: msg,
  });

  msgInput.value = "";
});

socket.on("update", update => {
  renderMessage("update", update);
});

socket.on("chat", message => {
  renderMessage("other", message);
});

const renderMessage = (type, message) => {
  let el = document.createElement("div");

  switch (type) {
    case "my":
      el.setAttribute("class", "message my-message");
      el.innerHTML = `
                <div>
                    <div class="name">You</div>
                    <div class="text">${message.text}</div>
                </div>
            `;
      msgContainer.appendChild(el);
      break;
    case "other":
      el.setAttribute("class", "message other-message");
      el.innerHTML = `
                <div>
                    <div class="name">${message.username}</div>
                    <div class="text">${message.text}</div>
                </div>
            `;
      msgContainer.appendChild(el);
      break;
    case "update":
      el.setAttribute("class", "update");
      el.innerHTML = message;
      msgContainer.appendChild(el);
      break;
    default:
      break;
  }

  msgContainer.scrollTop =
    msgContainer.scrollHeight - msgContainer.clientHeight;
};
