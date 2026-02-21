/** Builds the HTML markup for a task card on the board. */
function taskTamplate(taskID) {
    return `<div id="${taskID}" class ="task taskContainer" draggable="true" ondragstart="draggedTask('${taskID}')" onclick = "openTaskDetails('${taskID}'), opendialog('allTaskDetails')">
                <h2 id ="boardTaskCatagory${taskID}" class="boardTaskCatagory paddingBottom15">${TASK[0][`Task${taskID}`].category}</h2>
                <h2 class="marginleft10px paddingBottom5">${TASK[0][`Task${taskID}`].title}<h2>
                <h2 class="marginleft10px boardTaskContent paddingBottom15">${TASK[0][`Task${taskID}`].content}<h2>
                <div class="subtaskProgressbarC marginleft10px">
                    <div class="subtaskProgressbar" id="subtaskProgressbar${taskID}"></div>
                </div>
                <div class = "displayFLEX paddingBottom5 paddingTop15">
                    <div id = "taskContactsContainer${taskID}" class="taskContactsContainer paddingBottom5">
                
                    </div>
                    <div id = "taskPriorityContainer${taskID}">
                    </div>
                </div>
            </div>`
}

/** Builds the HTML markup for the drag-and-drop highlight placeholder. */
function highlightTaskTamplate(ID) {
    return `<div id="highlightTask${ID}" class = "highlightTask">
            </div>`
}

/** Builds the HTML markup for the four task board columns. */
function taskBoardTamplate() {
    return ` <td id="field1" ondrop="moveTo('field1')" ondragover="dragoverHandler(event)"></td>
                    <td id="field2" ondrop="moveTo('field2')" ondragover="dragoverHandler(event)"></td>
                    <td id="field3" ondrop="moveTo('field3')" ondragover="dragoverHandler(event)"></td>
                    <td id="field4" ondrop="moveTo('field4')" ondragover="dragoverHandler(event)"></td>`
}

/** Builds the HTML markup for the detailed view of a task. */
function taskDetailsTamplate(taskID) {
    return `
    <div class = "maxWith525 minWith350" onclick="event.stopPropagation()">
        <header>
            <section>
                <div id ="taskDetailsCatagory" class="taskCatagory">${TASK[0][`Task${taskID}`].category}</div>
                <div class= "closeDialogX" onclick = "closedialog('allTaskDetails'); storeSubtask()">X</div>
            </section>
            <h1>${TASK[0][`Task${taskID}`].title}</h1>
        </header>
        <main>
            <section>
                <p>${TASK[0][`Task${taskID}`].content}</p>
                <table>
                    <tr>
                        <td><h2>Due date:</h2></td>
                        <td>${TASK[0][`Task${taskID}`].dueDate}</td>
                    </tr>
                    <tr>
                        <td><h2>Priority:</h2></td>
                        <td class = "displayFLEX">
                            ${TASK[0][`Task${taskID}`].priority}
                            <div id = "taskDetailsPriorityContainer${taskID}">
                            </div>
                        </td>
                    </tr>
                </table>
                <h2 class = "taskDetailsAT">Assigned To:</h2>
                    <div id = "taskDetailsAT"></div>
                <h2 class = "taskDetailsST">Subtasks</h2>
                    <div id = "subTasks" class = "subTasks"></div>
             </div>
            </section>
        </main>
        <footer>
             <div class="taskDetailsIcons">
                <span onmouseover="displayNone('trash','trashMousover')" onmouseout = "removeDisplayNone('trash','trashMousover')" onclick = "closedialog('allTaskDetails'); deleteTask(${taskID})" class="taskDetailsIcons"><img id ="trash" src="./assets/icons/trash_darkblue.svg" alt="trash"><img class ="displayNone" id="trashMousover" src="./assets/icons/trash_lightblue.svg" alt="trashMousover"> Delete</span>
                <span onmouseover="displayNone('edit','editMousover')"  onmouseout = "removeDisplayNone('edit','editMousover')" class="taskDetailsIcons edit"><img id ="edit" onmouseover="" src="./assets/icons/pencil_darkblue.svg" alt="edit"><img class ="displayNone" id="editMousover" src="./assets/icons/pencil_lightblue.svg" alt="editMousover"> Edit</span>
             </div>
        </footer>
    </div>`

}

/** Builds the HTML markup for a single subtask with its checkbox icons. */
function subtaskTamplate(subtaskID, subTask) {
    return `<span><img class ="displayNone" onclick="toggleSubtaskCheckboxVisibility('stCheckboxU${subtaskID}','stCheckboxC${subtaskID}'); toggleSubtaskStatus('stCheckboxC${subtaskID}','${subtaskID}')"  id ="stCheckboxU${subtaskID}" src="./assets/img/checkboxUnchecked.svg" alt="Checkbox"><img class ="displayNone" onclick="toggleSubtaskCheckboxVisibility('stCheckboxU${subtaskID}','stCheckboxC${subtaskID}'); toggleSubtaskStatus('stCheckboxC${subtaskID}','${subtaskID}')" id="stCheckboxC${subtaskID}" src="./assets/img/checkboxChecked.svg" alt="Checkbox checked"> ${subTask}</span>`
}

/** Builds the HTML markup for an assigned contact in the task details. */
function taskDetailContactsTamplate(initials, name, color) {
    return `<div class = "taskDetailsATContainer">
            <span style="background-color: ${color};" class="badge">${initials}</span>
            <span>${name}</span>
            </div>`
}

function taskContactsTamplate(initials, color) {
    return `<span style="background-color: ${color};" class="badge taskContactsbadge">${initials}</span>`
}
