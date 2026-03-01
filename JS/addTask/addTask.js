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
  try {
    // 1. Alle vorhandenen Tasks holen
    const existingTasks = (await DataGET("Tasks")) || {};
    const taskKeys = Object.keys(existingTasks);

    // 2. Neue Task-ID berechnen: vorhandene Tasks + count
    const taskID = taskKeys.length + count;
    const taskKey = `Task${taskID}`; // Task0, Task1, ...

    // 3. Task in Firebase speichern (PUT an eindeutigen Key)
    await DataPUT(`Tasks/${taskKey}`, {
      ...task,
      id: taskID,
      field: "field1", // default field
    });

    console.log("Task saved with ID:", taskKey);

    count++; // lokaler Zähler hochsetzen
    return taskKey;
  } catch (error) {
    console.error("Fehler beim Speichern:", error);
    return null;
  }
}

async function createTask() {
  const titleInput = document.getElementById("taskName");
  const descInput = document.getElementById("taskDesc");
  const dateInput = document.getElementById("DueDate");

  task.title = titleInput.value;
  task.description = descInput.value;
  task.dueDate = dateInput.value;

  task.category = selectedCategory;

  errorMessage();
  if (!task.title || !task.description || !task.dueDate) return;

  // Task speichern → bekommt Key wie Task0, Task1 …
  const taskKey = await saveTask(task);

  if (taskKey) {
    showToast();
    clearForm();

    // Optional direkt ins UI rendern (wie loadTaskTamplate)
    renderNewTask(taskKey, task);
  }
}

function clearForm() {
  // Formular zurücksetzen
  document.getElementById("taskForm").reset();

  // Task-Objekt auf Standardwerte zurücksetzen
  task = {
    title: "",
    description: "",
    dueDate: "",
    priority: "",
    assignedTo: [],
    category: "",
    subtasks: [],
    field: "1",
    createdAt: null,
  };

  // Subtasks + Vorschau leeren
  document.getElementById("subtaskInput").value = "";
  renderSubtasks();

  // Kategorie zurücksetzen
  selectedCategory = "";
  document.getElementById("categoryLabel").textContent = "Select category";

  // Ausgewählte Kontakte zurücksetzen
  document.getElementById("assignedPreviewContainer").innerHTML = "";
  renderSelectedContactsBelowInput();

  // Alle Priorität-Buttons zurücksetzen und Standard setzen
  document
    .querySelectorAll(".priorityButton")
    .forEach((b) => b.classList.remove("active"));
  setDefaultPriority();
}
function showToast() {
  const toast = document.getElementById("toast");
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 2000);
}
