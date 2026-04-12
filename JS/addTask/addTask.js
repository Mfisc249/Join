const BASE_URL =
  "https://join-6f9cc-default-rtdb.europe-west1.firebasedatabase.app/";

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
  subTasks: [],
  field: "1",
};

/** Initializes the add-task view and loads required startup data. */
async function init() {
  const boardDialog = document.getElementById("boardAddTask");
  if (boardDialog) {
    boardDialog.classList.remove("edit-task-dialog");
  }
  if (typeof isEditTaskMode !== "undefined") {
    isEditTaskMode = false;
  }
  renderTemplate();
  setupSubtaskEnter();
  setupAssignedDropdownClose();
  setupLiveValidation();
  setupPriorityButtons();
  setDefaultPriority();
  setupDueDateInput();
  await loadContacts();

  document.addEventListener("click", closeCategoryDropdown);
}

/** Renders the add-task template into the main content container. */
function renderTemplate() {
  document.getElementById("mainContent").innerHTML = createTaskTemplate();
}

/** Saves a task by generating a key and delegating persistence to Firebase. */
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

/** Persists the task payload to Firebase including subtask review defaults. */
async function saveTaskToFirebase(task, taskID, taskKey) {
  let checkboxString = task.subTasks.map(() => "U").toString();

  const payload = {
    ...task,
    id: taskID,
    field: { field: "field1" },
    assignedTo: task.assignedTo,
    subTasks: task.subTasks,
    subTasksReview: {
      0: checkboxString,
    },
  };

  await DataPUT(`Tasks/${taskKey}`, payload);

  console.log("Task saved:", taskKey);
  count++;
  return taskKey;
}

/** Generates the next sequential task ID and Firebase key from existing tasks. */
function generateTaskKey(existingTasks) {
  const keys = Object.keys(existingTasks || {});
  const lastIndex =
    keys.length > 0
      ? Math.max(...keys.map((k) => parseInt(k.replace("Task", ""))))
      : 0;
  const taskID = lastIndex + 1;
  const taskKey = "Task" + taskID;
  return { taskID, taskKey };
}

/** Collects form values, validates input, and creates a new task entry. */
async function createTask() {
  const titleInput = document.getElementById("taskName");
  const descInput = document.getElementById("taskDesc");
  const dateInput = document.getElementById("DueDate");

  task.title = titleInput.value;
  task.description = descInput.value;
  task.dueDate = dateInput.value;
  let selectedCategory = "";

  errorMessage();
  if (!task.title || !task.dueDate || !task.category) return null;

  const taskKey = await saveTask(task);

  if (taskKey) {
    showToast();
    clearForm();
    return taskKey;
  }

  return null;
}

/** Creates a task and refreshes the board when creation succeeds. */
async function createTaskAndRefreshBoard() {
  errorMessage(); // 👈 IMMER zuerst

  const task = {
    title: document.getElementById("taskName").value,
    dueDate: document.getElementById("DueDate").value,
    category: selectedCategory,
  };

  if (!task.title || !task.dueDate || !task.category) {
    return; // ❌ stop wenn Fehler
  }

  await createTask();
}

/** Resets the form and reinitializes the in-memory task object. */
function resetTaskData() {
  document.getElementById("taskForm").reset();

  task = {
    title: "",
    description: "",
    dueDate: "",
    priority: "",
    assignedTo: [],
    category: "",
    subTasks: [],
    field: "1",
    createdAt: null,
  };
  resetValidation();
}

/** Clears subtasks UI and resets the selected category display. */
function resetSubTasksAndCategory() {
  document.getElementById("subtaskInput").value = "";
  renderSubTasks();

  selectedCategory = "";
  document.getElementById("categoryLabel").textContent = "Select task category";

  const button = document.querySelector(".TaskCategoryInput");
  if (button) button.classList.remove("input-error");

  const error = document.getElementById("categoryError");
  if (error) error.classList.remove("visible");

  // ✅ NEU:
  const dropdown = document.getElementById("categoryDropdown");
  const arrow = document.getElementById("categoryDropdownArrow");

  if (dropdown) dropdown.classList.add("hidden");
  if (arrow) arrow.classList.remove("rotate");
}

/** Resets assigned contacts preview and restores default priority selection. */
function resetAssignedContactsAndPriority() {
  document.getElementById("assignedPreviewContainer").innerHTML = "";
  renderSelectedContactsBelowInput();

  document
    .querySelectorAll(".priorityButton")
    .forEach((b) => b.classList.remove("active"));
  setDefaultPriority();
}

/** Clears all add-task form sections and returns to default state. */
function clearForm() {
  resetTaskData();
  resetSubTasksAndCategory();
  resetAssignedContactsAndPriority();

  // Pfeile zurücksetzen
  const assignedArrow = document.getElementById("assignedDropdownArrow");
  const categoryArrow = document.getElementById("categoryDropdownArrow"); // oder den richtigen Id-Namen

  if (assignedArrow) assignedArrow.classList.remove("rotate");
  if (categoryArrow) categoryArrow.classList.remove("rotate");
}

/** Shows a temporary success toast after task creation. */
function showToast() {
  const toast = document.getElementById("toast");
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 2000);
}
