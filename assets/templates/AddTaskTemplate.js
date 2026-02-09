function createTaskTemplate(taskName, taskDescription) {
  return `
         <h1>Add task</h1>
      <div class="contentWrapper">
        <!-- LINKS -->
        <div class="leftContent">
          <form id="taskForm">
            <label class="addTaskLabel" for="taskName">
              <div class="headlineTextArea">
                <h2>Title</h2>
                <p class="star">*</p>
              </div>
              <div class="taskNameContainer">
                <textarea
                  class="taskName"
                  type="text"
                  id="taskName"
                  name="taskName"
                  placeholder="Enter a title"
                  required
                ></textarea>
                <p class="requiredField">this field is required</p>
              </div>
            </label>
            <label class="addTaskLabelDescription" for="taskDesc">
              <h2>Description</h2>
              <div class="taskDescriptionContainer">
                <textarea
                  class="taskDescription"
                  id="taskDesc"
                  name="taskDesc"
                  placeholder="Enter a Description"
                  required
                ></textarea>
                <p class="requiredField">this field is required</p>
              </div>
            </label>
            <label class="addTaskLabelDate" for="DueDate">
              <div class="headlineTextArea">
                <h2>Due Date</h2>
                <p class="star">*</p>
              </div>
              <div class="addTaskDateContainer">
                <input
                  class="taskDateInput"
                  type="date"
                  id="DueDate"
                  name="DueDate"
                  placeholder="dd/mm/yyyy"
                  required
                />
                <img class="eventImg" src="./assets/img/event.svg" alt="" />
                <p class="requiredField">this field is required</p>
              </div>
            </label>
          </form>
        </div>
        <div class="divider"></div>
        <div class="rightContent">
          <h2>Priority</h2>
        <div class="priority">
  <div class="priorityButton urgent">
    <span>Urgent</span>
    <img class="priorityIcon" src="assets/img/Prio alta.svg" />
  </div>
 <div class="priorityButton medium">
    <span>Medium</span>
    <img class="priorityIcon" src="assets/img/Prio media.svg" />
  </div>
  <div class="priorityButton low">
    <span>Low</span>
    <img class="priorityIcon" src="assets/img/Prio baja.svg" />
  </div>
  </div>
  <div class="OptionsContainer">
 <h2 class=ChoiceHeadline>Assigned to</h2>
  <div class="assignedToInput" onclick="toggleAssignedDropdown()">
   <p class=choiceContact>Select contacts to assign</p>
    <img class="dropDownArrow" src="./assets/img/arrow_drop_down.svg" alt="">
  </div>
  <div id="assignedDropdown" class="assignedDropdown hidden">
  <img class="checkBox assignedOption" src="./assets/img/Rectangle 5.svg" alt="">
       </div>
       </div>
           <div class="OptionsContainer">
           <div class="headlineTextArea">
           <h2 class="ChoiceHeadline">Category</h2>
           <p class="star">*</p>
           </div>
        <div class="categorySelectWrapper">
  <select class="ChoiceOption" id="category" required>
    <option value=""selected hidden>Select task category</option>
    <option value="technicalTask">Technical Task</option>
    <option value="UserStory">User Story</option>
  </select>
  <img class="dropDownArrow taskArrow" id="taskArrow" src="./assets/img/arrow_drop_down.svg" alt="">
</div>
        </div>
        <div class="OptionsContainer">
  <h2 class="ChoiceHeadline">Subtasks</h2>

  <div class="subtaskInputContainer">
  <div class="bottomInputContainer">
    <input
      class="ChoiceOption inputField bottomInput"
      id="subtaskInput"
      placeholder="Add new subtask"
    />
    </div>
    <div class="subTaskIconsContainer">
    <img onclick="cancelSubtask()" class="subtaskIcon check" id="cancelSubtask" src="./assets/img/Subtasks icons11-3.svg" alt="" />
    <div class="spacer"></div>
   <img onclick="confirmSubtask()" class="subtaskIcon close" id="confirmSubtask" src="assets/img/check.svg" />
    </div>
  </div>
  <div id="toast" class="toast">Task added to board</div>
  <ul class="subTaskList" id="subtaskList"></ul>
</div>
        </div>
      </div>
    </div>
      <div class="buttonRequiredField">
      <div class="headlineTextArea requiredBottomLeft">
      <p class="star">*</p>
      <p class="requiredField SubTaskField">this field is rehhqired</p>
      </div>
      <div class="taskButton">
       <div>
     <button onclick="clearForm()"  class="clearButton">
     Clear 
<img class="cross" src="./assets/img/Subtasks icons11-3.svg" alt="" />

    </button>
      </div>
        <button  onclick="createTask()" class="createButton">Create Task
          <img class="createButtonIcon" src="assets/img/check-2.svg" />
        </button>
      </div>
      </div>`;
}

function subtaskTemplate(text, index) {
  const isEditing = editingSubtaskIndex === index;

  if (isEditing) {
    return `
      <li class="subTaskItem editing">
  <div class="subTaskEditContainer">
    <input
      class="subTaskEditInput"
      value="${text}"
      onkeydown="handleEditKey(event, ${index}, this.value)"
      autofocus
    />

    <div class="subTaskEditIcons">
     <img class="subtaskEditNote" onclick="deleteSubtask(${index})" src="./assets/img/Subtasks icons11.svg" alt="" />
      <div class="spacer Edit"></div>
    <img class="subtaskEditNote" onclick="saveEditedSubtask(${index}, this)" src="./assets/img/check.svg" alt="" />
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

function assignedToTemplate() {
  let html = `<option value="" selected hidden>Select contacts to assign</option>`;

  for (let i = 0; i < contacts.length; i++) {
    html += assignedToOptionTemplate(contacts[i]);
  }

  return html;
}

function assignedToOptionTemplate(contact) {
  return `
    <option value="${contact.name}">
      ${contact.name}
    </option>
  `;
}
