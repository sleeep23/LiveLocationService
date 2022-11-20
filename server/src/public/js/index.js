const socket = io();

const nickname = document.getElementById("nickname");
const form = nickname.querySelector("form");
const mainP = document.getElementById("mainPage");
const nickList = mainP.querySelector("#nickList");

mainP.hidden = true;

function showmain(name) {
    nickname.hidden = true;
    mainP.hidden = false;
    const h3 = document.getElementById("myname");
    h3.innerText += " " + name;
}

function addNicknameList(name, id) {
    const label = document.createElement("label");
    const input = document.createElement("input");
    input.setAttribute("type", "checkbox");
    input.setAttribute("value", id);
    label.appendChild(input);
    label.setAttribute("id", id);
    label.innerHTML += " " + name;
    nickList.appendChild(label);
}

function deleteNicknameList(id) {
    const label = document.getElementById(id);
    if (label !== null) {
        label.remove(label);
    }
}

function handlerNicknameSubmit(event) {
    event.preventDefault();
    const input = form.querySelector("input");
    const val = input.value;
    socket.emit("nickname", input.value, () => {
        showmain(val);
    });
    input.value = "";
}

nickname.addEventListener("submit", handlerNicknameSubmit);

socket.on("addNick", (name, id) => {
    addNicknameList(name, id);    
});

socket.on("bye", id => {
    deleteNicknameList(id);
})