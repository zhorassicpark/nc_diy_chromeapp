import "./styles.css";

const bgWP = [
  `url('https://c4.wallpaperflare.com/wallpaper/186/917/313/dunkirk-dunkirk-nolan-war-wallpaper-preview.jpg')`,
  `url('https://i.pinimg.com/originals/bd/e6/28/bde628fc9bc2d680b20b37b29751a877.jpg')`,
  `url('https://c4.wallpaperflare.com/wallpaper/998/740/945/batman-the-dark-knight-rises-christopher-nolan-christian-bale-wallpaper-preview.jpg')`,
  `url('https://c4.wallpaperflare.com/wallpaper/361/274/512/inception-time-totem-wallpaper-preview.jpg')`,
  `url('https://c4.wallpaperflare.com/wallpaper/1022/109/129/movie-the-prestige-wallpaper-preview.jpg')`
];

const body = document.body;

//setting random wallpaper part
function setRandomWallPaper() {
  const randNum = Math.floor(Math.random() * bgWP.length);
  body.style.backgroundImage = bgWP[randNum];
}

setRandomWallPaper();

const btn = document.querySelector("#btnWP");
btn.addEventListener("click", setRandomWallPaper);

//clock update part
function formatAMPM(date) {
  let hours = date.getHours();
  let mins = date.getMinutes();
  let ampm = hours >= 12 ? "pm" : "am";
  let secs = date.getSeconds();
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  hours = String(hours).padStart(2, "0");
  mins = String(mins).padStart(2, "0");
  secs = String(secs).padStart(2, "0");
  const strTime = `${hours}:${mins}:${secs} ${ampm}`;
  return strTime;
}

function updateTime() {
  const clock = document.querySelector("#clock");
  const date = new Date();
  const time = `${date.getFullYear()}/${date.getMonth()}/${date.getDate()}  ${formatAMPM(
    date
  )}`;
  clock.innerText = time;
}

updateTime();
setInterval(updateTime, 1000);

// UserLogin Part

const loginform = document.querySelector("#login-form");
const logininput = document.querySelector("#login-form input");
const greetingsdiv = document.querySelector("#greetingsdiv");
const greetings = document.querySelector("#greetings");

function nameSubmit(e) {
  e.preventDefault();
  const username = logininput.value;
  loginform.classList.add("hidden");
  greetingsdiv.classList.remove("hidden");
  greetings.innerText = `Hi ${username}`;

  localStorage.setItem("username", username);

  //console.log(username);
}
loginform.addEventListener("submit", nameSubmit);

//todo handling part

const todoform = document.querySelector("#todo-form");
const todoinput = document.querySelector("#todo-form input");
const todoList = document.querySelector("#todos");

let todosli = [];
//console.log(todosli);

function deleteHandler(e) {
  const li = e.target.parentElement;
  todosli = todosli.filter((todo) => String(todo.id) !== String(li.id));
  localStorage.setItem("todosli", JSON.stringify(todosli));
  li.remove();
}

function saveTodos(newTodo) {
  todosli.push(newTodo);
  console.log(todosli);
  localStorage.setItem("todosli", JSON.stringify(todosli));
}

function addTodo(newTodo) {
  const li = document.createElement("li");
  li.id = newTodo.id;
  const span = document.createElement("span");
  const btn = document.createElement("button");
  btn.innerText = "❌";
  span.innerText = newTodo.text;
  li.appendChild(span);
  li.appendChild(btn);
  todoinput.value = "";
  todoList.appendChild(li);

  //adding delete function to the "X" button
  btn.addEventListener("click", deleteHandler);
}

function handleTodoSubmit(e) {
  e.preventDefault();
  const newTodo = {
    id: Date.now(),
    text: todoinput.value
  };
  addTodo(newTodo);
  saveTodos(newTodo);
}

todoform.addEventListener("submit", handleTodoSubmit);

if (localStorage.getItem("todosli")) {
  const savedTodos = localStorage.getItem("todosli");
  todosli = JSON.parse(savedTodos);
  todosli.forEach((todo) => {
    addTodo(todo);
  });
}

// geolocation part
const API_KEY = "bc93019a3efd12cc7b4e180099078094";
function onGeoOk(position) {
  const lat = position.coords.latitude;
  const lng = position.coords.longitude;
  // console.log("You live in ", lng, lat);
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${API_KEY}`;
  // console.log(url);
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      const city = document.querySelector("#weather span:first-child");
      const weather = document.querySelector("#weather span:last-child");
      city.innerText = data.name + ", ";
      weather.innerText = data.weather[0].main;
    });
}

function onGeoError() {
  alert("Can't find you. No weather for you.");
}
navigator.geolocation.getCurrentPosition(onGeoOk, onGeoError);
