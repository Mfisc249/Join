/** Renders the current subtask list into the subtask container. */
function renderSubTasks() {
  var list = document.getElementById("subtaskList");
  list.innerHTML = "";

  var i;
  for (i = 0; i < task.subTasks.length; i++) {
    list.innerHTML += subTaskTemplate(task.subTasks[i], i);
  }
}

/** Adds the entered subtask, resets edit mode, and refreshes the list. */
function confirmSubtask() {
  const input = document.getElementById("subtaskInput");
  const value = input.value.trim();
  if (!value) return;

  task.subTasks.push(value);
  if (typeof handleSubtaskAddedInEditMode === "function") {
    handleSubtaskAddedInEditMode();
  }

  editingSubtaskIndex = null;
  renderSubTasks();
  input.value = "";
  input.focus();
}

/** Clears the subtask input and restores focus to the input field. */
function cancelSubtask() {
  const input = document.getElementById("subtaskInput");
  input.value = "";
  input.focus();
}

/** Removes a subtask by index and updates the rendered list. */
function deleteSubtask(index) {
  if (typeof handleSubtaskDeletedInEditMode === "function") {
    handleSubtaskDeletedInEditMode(index);
  }

  task.subTasks.splice(index, 1);
  renderSubTasks();
}

/** Enables edit mode for the subtask at the given index. */
function startEditSubtask(index) {
  editingSubtaskIndex = index;
  renderSubTasks();
}

/** Saves an edited subtask value or cancels edit if input is empty. */
function saveEditedSubtask(index) {
  const inputs = document.querySelectorAll(".subTaskEditInput");
  const input = inputs[0];
  const value = input.value.trim();

  if (!value) {
    editingSubtaskIndex = null;
    renderSubTasks();
    return;
  }

  task.subTasks[index] = value;
  editingSubtaskIndex = null;
  renderSubTasks();
}

/** Handles keyboard shortcuts for subtask edit commit and cancel actions. */
function handleEditKey(event, index, value) {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault(); // verhindert neue Zeile
    saveEditedSubtask(index);
  }

  if (event.key === "Escape") {
    editingSubtaskIndex = null;
    renderSubTasks();
  }
}

/** Handles Enter key submission for creating a new subtask. */
function handleSubtaskKeydown(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    confirmSubtask();
  }
}

/** Registers Enter key behavior for the subtask input field. */
function setupSubtaskEnter() {
  const input = document.getElementById("subtaskInput");
  if (!input) return;

  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      confirmSubtask();
    }
  });
}
