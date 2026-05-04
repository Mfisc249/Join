/** Returns the full Add Task form template with optional prefilled values. */
/** Returns the full Add Task form template with optional prefilled values. */
function createTaskTemplate(taskName, taskDescription, taskDueDate) {
  return `
  <div id="addTaskHeaderContent" class="displayFLEX headerContent">
    <h1 class="mainTitle">Add Task</h1>
    <div id="boardTaskcloseDialogX" class="closeDialogX displayNone" onclick="closedialog('boardAddTask')">
      X
    </div>
  </div>

  <div class="contentWrapperAddTask">

    <!-- LEFT -->
    <div class="leftContent">
      <form id="taskForm" class="taskForm">

        <!-- TITLE -->
        <label class="addTaskLabel" for="taskName">
          <div class="headlineTextArea">
            <h2 class="h2AddTask">Title</h2>
            <p class="star">*</p>
          </div>

          <div class="taskNameContainer">
            <textarea
              class="taskName"
              id="taskName"
              name="taskName"
              required
              placeholder="Enter a title"
            >${taskName ?? ""}</textarea>

            <p class="requiredField">This field is required</p>
          </div>
        </label>

        <!-- DESCRIPTION -->
        <label class="addTaskLabelDescription" for="taskDesc">
          <h2 class="h2AddTask">Description</h2>

          <div class="taskDescriptionContainer">
            <textarea
              class="taskDescription"
              id="taskDesc"
              name="taskDesc"
              placeholder="Enter a Description"
            >${taskDescription ?? ""}</textarea>

            <img class="descriptionImg" src="./assets/icons/Capa 2.svg" alt="Description icon" />
          </div>
        </label>

        <!-- DUE DATE -->
        <label class="addTaskLabelDate" for="DueDate">
          <div class="headlineTextArea">
            <h2 class="h2AddTask">Due Date</h2>
            <p class="star">*</p>
          </div>

          <div class="addTaskDateContainer">
            <input
              class="taskDateInput"
              type="date"
              id="DueDate"
              max="9999-12-31"
              required
            />
            <p class="requiredField requiredDate">This field is required</p>
          </div>
        </label>

      </form>
    </div>

    <div class="divider"></div>

    <!-- RIGHT -->
    <div class="rightContent">

      <!-- PRIORITY -->
      <h2 class="h2AddTask priorityHeadline">Priority</h2>
      <div class="priority">

        <div class="priorityButton urgent">
          <span>Urgent</span>
          <img class="priorityIcon" src="assets/img/Prio alta.svg" alt="High priority" />
        </div>

        <div class="priorityButton medium">
          <span>Medium</span>
          <img class="priorityIcon" src="assets/img/Prio media.svg" alt="Medium priority" />
        </div>

        <div class="priorityButton low">
          <span>Low</span>
          <img class="priorityIcon" src="assets/img/Prio baja.svg" alt="Low priority" />
        </div>

      </div>

      <!-- ASSIGNED TO -->
      <div class="OptionsContainer">
        <h2 class="ChoiceHeadline">Assigned to</h2>

        <button type="button" class="assignedToInput" onclick="toggleAssignedDropdown(event)">
          <p id="clearContact" class="choiceContact">Select contacts to assign</p>

          <img
            class="dropDownArrow"
            id="assignedDropdownArrow"
            src="./assets/img/arrow_drop_down.svg"
            alt="Toggle assigned contacts dropdown"
            onclick="handleArrowClick(event)"
          >
        </button>

        <div id="assignedPreviewContainer" class="assignedPreviewContainer"></div>
        <div id="assignedDropdown" class="assignedDropdown hidden"></div>
      </div>

      <!-- CATEGORY -->
      <div class="OptionsContainer">
        <div class="headlineTextArea">
          <h2 class="ChoiceHeadline">Category</h2>
          <p class="star">*</p>
        </div>

        <div class="categorySelectWrapper">
          <button type="button" class="ChoiceOption TaskCategoryInput" onclick="toggleCategoryDropdown(event)">
            <span id="categoryLabel">Select task category</span>

            <img
              class="dropDownArrow"
              id="categoryDropdownArrow"
              src="./assets/img/arrow_drop_down.svg"
              alt="Toggle category dropdown"
            >
          </button>

          <div id="categoryDropdown" class="assignedDropdown hidden assignedDropdownEditTask">
            <div class="categoryOption" onclick="selectCategory('Technical Task')">Technical Task</div>
            <div class="categoryOption" onclick="selectCategory('User Story')">User Story</div>
          </div>
        </div>

        <p id="categoryError" class="requiredField">This field is required</p>
      </div>

      <!-- SUBTASKS -->
      <div class="OptionsContainer">
        <h2 class="ChoiceHeadline">Subtasks</h2>

        <div class="subtaskInputContainer">
          <div class="bottomInputContainer">
            <textarea class="inputField bottomInput" id="subtaskInput" placeholder="Add new subtask"></textarea>
          </div>

          <div class="subTaskIconsContainer">
            <img onclick="cancelSubtask()" class="subtaskIcon check"
              id="cancelSubtask"
              src="./assets/img/Subtasks icons11-3.svg"
              alt="Cancel subtask"
            />

            <div class="spacer"></div>

            <img onclick="confirmSubtask()" class="subtaskIcon close"
              id="confirmSubtask"
              src="assets/img/check.png"
              alt="Confirm subtask"
            />
          </div>
        </div>

        <div id="toast" class="toast">
          <span class="toastText">Task added to board</span>
          <img class="toastIcon" src="./assets/icons/Vector.svg" alt="Success icon">
        </div>

        <ul class="subTaskList" id="subtaskList"></ul>
      </div>

    </div>
  </div>

  <div class="buttonRequiredField">
    <div class="headlineTextArea requiredBottomLeft">
      <p class="star subTaskStar">*</p>
      <p class="requiredField SubTaskField">this field is required</p>
    </div>

    <div class="taskButton">
      <button onclick="clearForm()" class="clearButton">
        Clear
        <img class="cross" src="./assets/img/Subtasks icons11-3.svg" alt="Clear form">
      </button>

      <button onclick="createTaskAndRefreshBoard()" class="createButton">
        Create Task
        <img class="createButtonIcon" src="assets/img/check-2.svg" alt="Create task">
      </button>
    </div>
  </div>
  `;
}

/** Returns the markup for a subtask item in display or edit mode. */
function subTaskTemplate(text, index) {
  const isEditing = editingSubtaskIndex === index;

  if (isEditing) {
    return `
      <li class="subTaskItem editing">
  <div class="subTaskEditContainer">
    <textarea
  class="subTaskEditInput"
  onkeydown="handleEditKey(event, ${index}, this.value)"
  autofocus
>${text}</textarea>

    <div class="subTaskEditIcons">
     <img class="subtaskEditNote" onclick="deleteSubtask(${index})" src="./assets/img/Subtasks icons11.svg" alt="" />
      <div class="spacer Edit"></div>
    <img class="subtaskEditNote checkEdit" onclick="saveEditedSubtask(${index}, this)" src="./assets/img/check.png" alt="" />
    </div>
  </div>
  </li>
    `;
  }

  // normal
  return `
    <li class="subTaskItem">

    <div class="subTaskContent">
      <span class="subTaskText">${text}</span>
      
      <div class="subTaskActions">
     <img onclick="startEditSubtask(${index})" src="./assets/img/Subtasks icons11-2.svg" alt="" />
        <div class="spacer Edit"></div>
        <img  onclick="deleteSubtask(${index})" src="./assets/img/Subtasks icons11.svg" alt="" />
      </div>
      </div>
    </li>
  `;
}

/** Builds the assigned-to select options markup from available contacts. */
function assignedToTemplate() {
  let html = `<option value="" selected hidden>Select contacts to assign</option>`;

  for (let i = 0; i < contacts.length; i++) {
    html += assignedToOptionTemplate(contacts[i]);
  }

  return html;
}

/** Returns the option markup for a single contact entry. */
function assignedToOptionTemplate(contact) {
  return `
    <option value="${contact.name}">
      ${contact.name}
    </option>
  `;
}

/** Returns a selectable assigned-contact row with initials and checkbox state. */
function contactInitialsCircleTemplate(contact, key) {
  const isSelected = task.assignedTo.includes(key);
  const selectedClass = isSelected ? "selected" : "";
  const checkboxImg = isSelected
    ? "./assets/img/checkButton.svg"
    : "./assets/img/Rectangle_5.svg";

  return `
  <div class="assignedOption ${selectedClass}" 
       onclick="toggleContact('${key}', this)">
    <div class="contactLeft">
      <span class="contactInitialsCircle" 
            style="background-color: ${contact.color}">
        ${contact.initials}
      </span>
      <span class="contactName">${contact.name}</span>
    </div>
    <img class="checkBox" src="${checkboxImg}" alt="checkbox">
  </div>
`;
}

/** Returns the compact initials circle used in the assigned contacts preview. */
function contactInitialsPreviewTemplate(contact) {
  return `
    <div class="assignedCircle" 
         style="background-color: ${contact.color}">
      ${contact.initials}
    </div>
  `;
}

function hiddenContactsTemplate(count) {
  return `
    <div class="assignedCircle" style="background-color: var(--GlobalBlue)">
      +${count}
    </div>
  `;
}
