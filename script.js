let demoarray = [];
let currentDay = 'monday';

function renderTodo(todo) {
  localStorage.setItem("demoarray", JSON.stringify(demoarray));

  const list = document.querySelector(".todo-list");
  const item = document.querySelector(`[data-key='${todo.id}']`);

  if (todo.deleted) {
    if (item) item.remove();
    return;
  }

  if (todo.day !== currentDay) return;

  const isChecked = todo.checked ? "done" : "";
  const newlist = document.createElement("li");
  newlist.setAttribute("class", `todo-item ${isChecked}`);
  newlist.setAttribute("data-key", todo.id);

  newlist.innerHTML = `
    <div class="tick js-tick"></div>
    <span>${todo.text}</span>
    <button class="delete-todo js-delete-todo">
      <svg style="pointer-events: none;" fill="currentColor" xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24">
        <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
      </svg>
    </button>
  `;

  if (item) {
    list.replaceChild(newlist, item);
  } else {
    list.append(newlist);
  }
}

function myFunction(text) {
  const todoobject = {
    text,
    checked: false,
    id: Date.now(),
    day: currentDay
  };
  demoarray.push(todoobject);
  renderTodo(todoobject);
}

function toggleDone(key) {
  const index = demoarray.findIndex((item) => item.id === Number(key));
  if (index !== -1) {
    demoarray[index].checked = !demoarray[index].checked;
    renderTodo(demoarray[index]);
  }
}

function deleteTodo(key) {
  const index = demoarray.findIndex((item) => item.id === Number(key));
  if (index !== -1) {
    const emptytodo = { ...demoarray[index], deleted: true };
    demoarray = demoarray.filter((item) => item.id !== Number(key));
    renderTodo(emptytodo);
  }
}

const form = document.querySelector(".formselect");
form.addEventListener("submit", (event) => {
  event.preventDefault();
  const input = document.querySelector(".inputselect");
  const text = input.value.trim();
  if (text !== "") {
    myFunction(text);
    input.value = "";
  }
});

const list = document.querySelector(".todo-list");
list.addEventListener("click", (event) => {
  if (event.target.classList.contains("js-tick")) {
    const itemKey = event.target.parentElement.dataset.key;
    toggleDone(itemKey);
  }

  const deleteBtn = event.target.closest(".js-delete-todo");
  if (deleteBtn) {
    const itemKey = deleteBtn.parentElement.dataset.key;
    deleteTodo(itemKey);
  }
});

const emojiBtn = document.getElementById('theme-emoji');

function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem("theme", theme);
  if (emojiBtn) {
    emojiBtn.textContent = theme === 'dark' ? '☀️' : '🌙';
  }
}

if (emojiBtn) {
  emojiBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    setTheme(currentTheme === 'dark' ? 'light' : 'dark');
  });
}

function renderAllTodos() {
  const list = document.querySelector(".todo-list");
  list.innerHTML = '';
  
  demoarray
    .filter(todo => todo.day === currentDay && !todo.deleted)
    .forEach(todo => renderTodo(todo));
}

let days = document.querySelectorAll("#days li");
days.forEach(day => {
  day.addEventListener("click", function() {
    days.forEach(d => d.classList.remove("active"));
    this.classList.add("active");
    
    currentDay = this.textContent.toLowerCase().trim();
    renderAllTodos();
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("theme") || "light";
  setTheme(savedTheme);

  const ref = localStorage.getItem("demoarray");
  if (ref) {
    demoarray = JSON.parse(ref);
    renderAllTodos();
  }
});
