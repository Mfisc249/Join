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
    const existingTasks = (await DataGET("Tasks")) || {};
    const taskKeys = Object.keys(existingTasks);

    const taskID = taskKeys.length + count;
    const taskKey = `Task${taskID}`;

    await DataPUT(`Tasks/${taskKey}`, {
      ...task,
      id: taskID,

      field: {
        field: "field1",
      },

      subTasks: task.subtasks.join(","),

      subTasksReview: [new Array(task.subtasks.length).fill("O").join(",")],
    });

    console.log("Task saved:", taskKey);

    count++;
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

  const taskKey = await saveTask(task);

  if (taskKey) {
    // 🔹 HIER speichern
    await DataPUT(`subtaskReview/${taskKey}`, task.subtasks);

    showToast();
    clearForm();
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
