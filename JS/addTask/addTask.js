const BASE_URL =
  "https://join-6f9cc-default-rtdb.europe-west1.firebasedatabase.app/";

let subtasks = [];
let contacts = [];
let editingSubtaskIndex = null;
let assignedPreviewMode = false;

const mediumBtn = document.querySelector(".importanceLevel:nth-child(2)");
const lowBtn = document.querySelector(".importanceLevel:nth-child(3)");

let task = {
  title: "",
  description: "",
  dueDate: "",
  priority: "",
  assignedTo: [],
  category: "",
  subtasks: [],
  field: "1",
};

async function init() {
  renderTemplate();
  setupSubtaskEnter();
  setupAssignedDropdownClose(); // <<< HIER
  setupLiveValidation();
  setupPriorityButtons();
  setDefaultPriority();
  setupDueDateInput();
  await loadContacts();
}

function renderTemplate() {
  document.getElementById("mainContent").innerHTML = createTaskTemplate();
}

async function saveTask(task) {
  const taskKey = `addTask${Date.now()}`;

  try {
    const response = await fetch(`${BASE_URL}Tasks/${taskKey}.json`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(task),
    });

    if (!response.ok) {
      throw new Error("Firebase save failed");
    }

    return true;
  } catch (error) {
    return false;
  }
}

async function createTask() {
  const titleInput = document.getElementById("taskName");
  const descInput = document.getElementById("taskDesc");
  const categoryInput = document.getElementById("category");
  const dateInput = document.getElementById("DueDate");

  task.category = categoryInput.value;
  task.title = titleInput.value;
  task.description = descInput.value;
  task.dueDate = dateInput.value;

  errorMessage();
  if (!task.title || !task.description || !task.dueDate || !task.category) {
    return;
  }
  const success = await saveTask(task);

  if (success) {
    showToast();
    clearForm();
  }
}

function clearForm() {
  document.getElementById("taskForm").reset();
  task.title = "";
  task.description = "";
  task.dueDate = "";
  task.priority = "";
  task.assignedTo = [];
  task.category = "";
  task.subtasks = [];
  task.field = "1";
  task.createdAt = null;

  const subtaskInput = document.getElementById("subtaskInput");
  if (subtaskInput) subtaskInput.value = "";

  console.log("Formular + Task-Objekt + Subtasks zurückgesetzt ✅");
}

function showToast() {
  const toast = document.getElementById("toast");
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 2000);
}
