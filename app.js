// Selectors (already provided)
const themeBtn = document.querySelector(".themeToggle");
themeBtn.classList.add("fa-solid", "fa-moon");

const taskInput = document.getElementById("task-input");
const addTaskBtn = document.getElementById("add-task-btn");
const taskList = document.getElementById("task-list");
const emptyImage = document.querySelector(".empty");
const todoContainer = document.querySelector(".todo-container");

// Load tasks from Local Storage on page load
window.addEventListener("DOMContentLoaded", loadTasksFromStorage);

// Theme toggle logic
themeBtn.addEventListener("click", () => {
  const isDark = document.body.classList.toggle("dark-theme");
  if (isDark) {
    themeBtn.classList.remove("fa-moon");
    themeBtn.classList.add("fa-sun");
    localStorage.setItem("theme", "dark");
  } else {
    themeBtn.classList.remove("fa-sun");
    themeBtn.classList.add("fa-moon");
    localStorage.setItem("theme", "light");
  }
});

// Apply saved theme on page load
const savedTheme = localStorage.getItem("theme");
if (savedTheme === "dark") {
  document.body.classList.add("dark-theme");
  themeBtn.classList.remove("fa-moon");
  themeBtn.classList.add("fa-sun");
}


// Save to Local Storage
function saveTasksToStorage() {
  const tasks = [];
  taskList.querySelectorAll("li").forEach((li) => {
    tasks.push({
      text: li.querySelector("span").textContent,
      completed: li.querySelector(".checkbox").checked,
    });
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Load from Local Storage
function loadTasksFromStorage() {
  const storedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
  storedTasks.forEach(({ text, completed }) => {
    createTaskElement(text, completed);
  });
  toggleEmptyState();
}

// Create task DOM element
function createTaskElement(taskText, completed = false) {
  const li = document.createElement("li");
  li.innerHTML = `
    <input type="checkbox" class="checkbox" ${completed ? 'checked' : ''}>
    <span>${taskText}</span>
    <div class="task-buttons">
      <button class="edit"><i class="fa-solid fa-pen"></i></button>
      <button class="delete"><i class="fa-solid fa-trash"></i></button>
    </div>
  `;

  const checkbox = li.querySelector(".checkbox");
  const editBtn = li.querySelector(".edit");

  if (completed) {
    li.classList.add("completed");
    editBtn.disabled = true;
    editBtn.style.opacity = "0.5";
    editBtn.style.pointerEvents = "none";
  }

  checkbox.addEventListener("change", () => {
    const isChecked = checkbox.checked;
    li.classList.toggle("completed", isChecked);
    editBtn.disabled = isChecked;
    editBtn.style.opacity = isChecked ? "0.5" : "1";
    editBtn.style.pointerEvents = isChecked ? "none" : "auto";
    saveTasksToStorage();
  });

  editBtn.addEventListener("click", () => {
    if (!checkbox.checked) {
      taskInput.value = li.querySelector("span").textContent;
      li.remove();
      toggleEmptyState();
      saveTasksToStorage();
    }
  });

  li.querySelector(".delete").addEventListener("click", () => {
    li.remove();
    toggleEmptyState();
    saveTasksToStorage();
  });

  taskList.appendChild(li);
}

// Add task
const addTask = (event) => {
  event.preventDefault();
  const taskText = taskInput.value.trim();
  if (!taskText) return;
  createTaskElement(taskText);
  taskInput.value = "";
  toggleEmptyState();
  saveTasksToStorage();
};

// Toggle empty state
const toggleEmptyState = () => {
  emptyImage.style.display = taskList.children.length === 0 ? "block" : "none";
  todoContainer.style.width = taskList.children.length > 0 ? "100%" : "50%";
};

// Event listeners
addTaskBtn.addEventListener("click", addTask);
taskInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    addTask(e);
  }
});
