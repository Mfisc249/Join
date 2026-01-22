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
                  placeholder="Select a date"
                  required
                />
                <p class="requiredField">this field is required</p>
              </div>
            </label>
          </form>
        </div>
        <div class="divider"></div>
        <div class="rightContent">
          <h2>Priority</h2>
          <div class="priority">
          <p class="importanceLevel urgent">Urgent</p>
          <p class="importanceLevel medium">Medium</p>
          <p class="importanceLevel low">Low</p>
          </div>
          <div class="d">
            <div class="OptionsContainer">
            <h2 class="ChoiceHeadline">Assigned to</h2>
           <select class="ChoiceOption borderColorOptions" name="priority" id="assignedTo">
           <option value="urgent">Select contacts to assign</option>
           </select>
           </div>
           <div class="OptionsContainer">
           <div class="headlineTextArea">
           <h2 class="ChoiceHeadline">Category</h2>
           <p class="star">*</p>
           </div>
           <select class="ChoiceOption" name="priority" id="category">
           <option value="urgent">Select task category</option>
          </div>
        </select>
        </div>
        <div class="OptionsContainer">
  <h2 class="ChoiceHeadline">Subtasks</h2>

  <div class="subtaskInputContainer">
    <input
      class="ChoiceOption inputField"
      id="subtaskInput"
      placeholder="Add new subtask"
    />

    <span class="subtaskIcon check" id="confirmSubtask">✔</span>
    <span class="subtaskIcon close" id="cancelSubtask">✖</span>
  </div>

  <div id="subtaskList"></div>
</div>
        </div>
      </div>
    </div>
      <div class="buttonRequiredField">
      <div class="headlineTextArea requiredBottomLeft">
      <p class="star">*</p>
      <p class="requiredField">this field is rehhqired</p>
      </div>
      <div class="taskButton">
       <div>
     <button onclick="clearForm()"  class="clearButton">
     Clear <span class="cross">&#10006;</span>
    </button>
      </div>
        <button  onclick="createTask()" class="createButton">Create Task
          <span>&#10003;</span>
        </button>
      </div>
      </div>`;
}

function subtaskTemplate(text) {
  return `
    <div class="subtaskItem">
      ${text}
    </div>
  `;
}
