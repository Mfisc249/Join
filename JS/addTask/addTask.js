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
  setupAssignedDropdownClose();
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
    const { taskID, taskKey } = generateTaskKey(existingTasks);

    return await saveTaskToFirebase(task, taskID, taskKey);
  } catch (error) {
    console.error("Fehler beim Speichern:", error);
    return null;
  }
}

async function saveTaskToFirebase(task, taskID, taskKey) {
  const payload = {
    ...task,
    id: taskID,
    field: { field: "field1" }, // Standard-Spalte
    assignedTo: task.assignedTo, // ✅ als Array
    subtasks: task.subtasks, // ✅ als Array
    subTasksReview: {
      0: task.subtasks.map(() => "U").join(","), // Subtask Status als String okay
    },
  };

  await DataPUT(`Tasks/${taskKey}`, payload);
  console.log("Task saved:", taskKey);
  count++;
  return taskKey;
}

function generateTaskKey(existingTasks) {
  const keys = Object.keys(existingTasks || {}); // alle vorhandenen Tasks
  const lastIndex =
    keys.length > 0
      ? Math.max(...keys.map((k) => parseInt(k.replace("Task", ""))))
      : 0;
  const taskID = lastIndex + 1;
  const taskKey = "Task" + taskID;
  return { taskID, taskKey };
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
    showToast();
    clearForm();
    renderNewTask(taskKey, task);
  }
}

function resetTaskData() {
  document.getElementById("taskForm").reset();

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
}

function resetSubtasksAndCategory() {
  document.getElementById("subtaskInput").value = "";
  renderSubtasks();

  selectedCategory = "";
  document.getElementById("categoryLabel").textContent = "Select category";
}

function resetAssignedContactsAndPriority() {
  document.getElementById("assignedPreviewContainer").innerHTML = "";
  renderSelectedContactsBelowInput();

  document
    .querySelectorAll(".priorityButton")
    .forEach((b) => b.classList.remove("active"));
  setDefaultPriority();
}

function clearForm() {
  resetTaskData();
  resetSubtasksAndCategory();
  resetAssignedContactsAndPriority();
}

function showToast() {
  const toast = document.getElementById("toast");
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 2000);
}
