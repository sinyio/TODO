// DOM elements
const todoForm = document.querySelector(".todo-form");
const mainInput = document.querySelector(".main-input");
const remainingTasks = document.querySelector(".remaining-tasks");
const completedTasks = document.querySelector(".completed-tasks");
const totalTasks = document.querySelector(".total-tasks");
const todoList = document.querySelector(".todos");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

if (localStorage.getItem("tasks")) {
  tasks.map((task) => {
    createTask(task);
  });
}

todoForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const inputValue = mainInput.value;

  if (inputValue === "") {
    return;
  }

  const task = {
    id: new Date().getTime(),
    name: inputValue,
    isCompleted: false,
  };

  // Creating task in LocalStorage
  tasks.push(task);
  localStorage.setItem("tasks", JSON.stringify(tasks));

  // Creating task in DOM
  createTask(task);

  todoForm.reset();
  mainInput.focus();
});

// Creating task
function createTask(task) {
  const taskEl = document.createElement("li");

  taskEl.setAttribute("id", task.id);

  if (task.isCompleted) {
    taskEl.classList.add("complete");
  }

  const taskElMarkup = `
    <div>
    <input type="checkbox" id="${task.id}" ${task.isCompleted ? "checked" : ""}>
    <span ${!task.isCompleted ? "contenteditable" : ""}>${task.name}</span>
    </div>
    <button class="remove-task" title="Remove task">
        <svg width="12" height="12" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0.758294 8C0.976303 8 1.16588 7.91469 1.30806 7.76303L3.99052 5.06161L6.69194 7.76303C6.83412 7.90521 7.01422 8 7.23223 8C7.64929 8 7.99052 7.64929 7.99052 7.23223C7.99052 7.01422 7.91469 6.83412 7.76303 6.69194L5.07109 4L7.77251 1.2891C7.93365 1.12796 8 0.966825 8 0.758294C8 0.331754 7.65877 0 7.24171 0C7.04265 0 6.88152 0.0663507 6.72038 0.227488L3.99052 2.93839L1.2891 0.236967C1.14692 0.0853081 0.976303 0.0189573 0.758294 0.0189573C0.341232 0.0189573 0 0.341232 0 0.767772C0 0.976303 0.0853081 1.1564 0.227488 1.29858L2.91943 4L0.227488 6.70142C0.0853081 6.83412 0 7.0237 0 7.23223C0 7.64929 0.341232 8 0.758294 8Z" fill="rgb(176, 186, 255)"/>
        </svg>                            
    </button>
    `;

  taskEl.innerHTML = taskElMarkup;

  todoList.appendChild(taskEl);

  countTasks();
}

// Counting tasks
function countTasks() {
  const completedTasksArray = tasks.filter((task) => task.isCompleted === true);

  totalTasks.textContent = tasks.length;
  completedTasks.textContent = completedTasksArray.length;
  remainingTasks.textContent = tasks.length - completedTasksArray.length;
}

// Removing tasks
todoList.addEventListener("click", (e) => {
  if (e.target.classList.contains("remove-task")) {
    const taskId = e.target.closest("li").id;
    console.log(taskId);
    removeTask(taskId);
  }
});

function removeTask(taskId) {
  tasks = tasks.filter((task) => task.id !== parseInt(taskId));
  localStorage.setItem("tasks", JSON.stringify(tasks));
  document.getElementById(taskId).remove();
  countTasks();
}

// Updating & completing
todoList.addEventListener("input", (e) => {
  const taskId = e.target.closest("li").id;
  updateTask(taskId, e.target);
});

function updateTask(taskId, el) {
  const task = tasks.find((task) => task.id === parseInt(taskId));

  if (el.hasAttribute("contenteditable")) {
    task.name = el.textContent;
  } else {
    const span = el.nextElementSibling;
    const parent = el.closest("li");
    task.isCompleted = !task.isCompleted;

    if (task.isCompleted) {
      span.removeAttribute("contenteditable");
      parent.classList.add("complete");
    } else {
      span.setAttribute("contenteditable", "true");
      parent.classList.remove("complete");
    }
  }

  localStorage.setItem("tasks", JSON.stringify(tasks));

  countTasks();
}

// Pushing enter stops editing
todoList.addEventListener("keydown", (e) => {
  if (e.keyCode === 13) {
    e.target.blur();
  }
});
