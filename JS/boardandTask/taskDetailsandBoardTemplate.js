

/** Builds the HTML markup for a task card on the board. */
function taskTamplate(taskID) {
    let task = getTaskById(taskID);
    let subTasks = safeArray(task.subTasks);

    return `<div id="${taskID}" class ="task taskContainer" draggable="true" ondragstart="draggedTask('${taskID}')" onclick = "openTaskDetails('${taskID}'), opendialog('allTaskDetails')">
                <section class = "displayFLEX">
                <h2 id ="boardTaskCatagory${taskID}" class="boardTaskCatagory paddingBottom15"  onclick = "openTaskDetails('${taskID}'), opendialog('allTaskDetails')">${normalizeCategory(task.category)}</h2>
                <img id = "mobileArrowsMoveTask${taskID}" onmouseover="addMobileMoveTask('mobileArrowsMoveTask${taskID}',${taskID})" class = "mobileArrows" src="./assets/img/mobileArrows.svg" alt="Arrows">
                </section>
                <section>
                <h2 class="marginleft10px paddingBottom5">${safeText(task.title, 'Untitled task')}<h2>
                <h2 class="marginleft10px boardTaskContent paddingBottom15">${safeText(shortenDescription(task.description), '')}<h2>
                <div id ="allsubtaskProgressbar${taskID}" class ="displayFLEX allsubtaskProgressbar">
                    <div class="subtaskProgressbarC marginleft10px">
                        <div class="subtaskProgressbar" id="subtaskProgressbar${taskID}"></div>
                    </div>
                    <span class ="displayFLEX allSubtaskCheckedCount"> <p id = "subtaskCheckedCount${taskID}"></p>/<p>${subTasks.length}</p>  Subtasks</span>
                </div>
                <div class = "displayFLEX paddingBottom5 paddingTop15">
                    <div id = "taskContactsContainer${taskID}" class="taskContactsContainer paddingBottom5">
                
                    </div>
                    <div id = "taskPriorityContainer${taskID}">
                    </div>
                </div>
                </section>
            </div>
            `
}

/** Builds the HTML markup for the drag-and-drop highlight placeholder. */
function highlightTaskTamplate(ID) {
    return `<div id="highlightTask${ID}" class = "highlightTask">
            </div>`
}

/** Builds the HTML markup for the four task board columns. */
function taskBoardTamplate() {
    return `        <tr class="tableCategories">
                        <td>To do <button onclick="opendialog('boardAddTask');init()">+</button></td>
                        <td>In progress <button onclick="opendialog('boardAddTask');init()">+</button></td>
                        <td>Await feedback <button onclick="opendialog('boardAddTask');init()">+</button></td>
                        <td>Done</td>
                    </tr>
                    <tr id="fields">
                        <td id="field1" ondrop="moveTo('field1')" ondragover="dragoverHandler(event)"></td>
                        <td id="field2" ondrop="moveTo('field2')" ondragover="dragoverHandler(event)"></td>
                        <td id="field3" ondrop="moveTo('field3')" ondragover="dragoverHandler(event)"></td>
                        <td id="field4" ondrop="moveTo('field4')" ondragover="dragoverHandler(event)"></td>
                    </tr>`
}

/** Builds the HTML markup for the stacked mobile board layout. */
function taskBoardTamplateMobile() {
    return `            <tr>
                            <td class="tableCategories">To do <button onclick="opendialog('boardAddTask');init()">+</button></th>
                        </tr>
                        <tr>
                            <td id="field1" ondrop="moveTo('field1')" ondragover="dragoverHandler(event)"></td>
                        </tr>
                        <tr>
                            <td class="tableCategories">In progress <button onclick="opendialog('boardAddTask');init()">+</button></th>
                        </tr>
                        <tr>
                            <td id="field2" ondrop="moveTo('field2')" ondragover="dragoverHandler(event)"></td>
                        </tr>
                        <tr>
                            <td class="tableCategories">Await feedback <button onclick="opendialog('boardAddTask');init()">+</button></th>
                        </tr>
                        <tr>
                            <td id="field3" ondrop="moveTo('field3')" ondragover="dragoverHandler(event)"></td>
                        </tr>
                        <tr>
                            <td class="tableCategories">Done</th>
                        </tr>
                        <tr>
                            <td id="field4" ondrop="moveTo('field4')" ondragover="dragoverHandler(event)"></td>
                        </tr>`
}

/** Builds the HTML markup for the detailed view of a task. */
function taskDetailsTamplate(taskID) {
    let task = getTaskById(taskID);

    return `
    <div class = "maxWith525 minWith350" onclick="event.stopPropagation()">
        <header>
            <section>
                <div id ="taskDetailsCatagory" class="taskCatagory">${normalizeCategory(task.category)}</div>
                <div class= "closeDialogX" onclick = "closedialog('allTaskDetails'); storeSubtask()">X</div>
            </section>
            <h1>${safeText(task.title, 'Untitled task')}</h1>
        </header>
        <main>
            <section>
                <p>${safeText(task.description, 'No description')}</p>
                <table>
                    <tr>
                        <td><h2>Due date:</h2></td>
                        <td>${normalizeDueDate(task.dueDate)}</td>
                    </tr>
                    <tr>
                        <td><h2>Priority:</h2></td>
                        <td class = "displayFLEX allPriority">
                            ${normalizePriority(task.priority)}
                            <div id = "taskDetailsPriorityContainer${taskID}">
                            </div>
                        </td>
                    </tr>
                </table>
                <h2 id = "taskDetailsATHeadline" class = "taskDetailsAT">Assigned To:</h2>
                    <div id = "taskDetailsAT"></div>
                <h2 id = "subTasksHeadline" class = "taskDetailsST">Subtasks</h2>
                    <div id = "subTasks" class = "subTasks"></div>
             </div>
            </section>
        </main>
        <footer>
             <div class="taskDetailsIcons">
                <span onmouseover="displayNone('trash','trashMousover')" onmouseout = "removeDisplayNone('trash','trashMousover')" onclick = "closedialog('allTaskDetails'); deleteTask(${taskID})" class="taskDetailsIcons"><img id ="trash" src="./assets/icons/trash_darkblue.svg" alt="trash"><img class ="displayNone" id="trashMousover" src="./assets/icons/trash_lightblue.svg" alt="trashMousover"> Delete</span>
                <span onmouseover="displayNone('edit','editMousover')"  onmouseout = "removeDisplayNone('edit','editMousover')" onclick = "opendialog('boardAddTask');editPreparation(${taskID})" class="taskDetailsIcons edit"><img id ="edit" onmouseover="" src="./assets/icons/pencil_darkblue.svg" alt="edit"><img class ="displayNone" id="editMousover" src="./assets/icons/pencil_lightblue.svg" alt="editMousover"> Edit</span>
             </div>
        </footer>
    </div>`

}

/** Builds the HTML markup for a single subtask with its checkbox icons. */
function subtaskTamplate(subtaskID, subTask) {
    return `<span><img class ="displayNone" onclick="toggleSubtaskCheckboxVisibility('stCheckboxU${subtaskID}','stCheckboxC${subtaskID}'); toggleSubtaskStatus('stCheckboxC${subtaskID}','${subtaskID}')"  id ="stCheckboxU${subtaskID}" src="./assets/img/checkboxUnchecked.svg" alt="Checkbox"><img class ="displayNone" onclick="toggleSubtaskCheckboxVisibility('stCheckboxU${subtaskID}','stCheckboxC${subtaskID}'); toggleSubtaskStatus('stCheckboxC${subtaskID}','${subtaskID}')" id="stCheckboxC${subtaskID}" src="./assets/img/checkboxChecked.svg" alt="Checkbox checked"> ${safeText(subTask, '')}</span>`
}

/** Builds the HTML markup for an assigned contact in the task details. */
function taskDetailContactsTamplate(initials, name, color) {
    return `<div class = "taskDetailsATContainer">
            <span style="background-color: ${safeText(color, '#2A3647')};" class="badge">${safeText(initials, '?')}</span>
            <span>${safeText(name, 'Unknown contact')}</span>
            </div>`
}

/** Builds the badge markup used for assigned contacts on a board task card. */
function taskContactsTamplate(initials, color) {
    return `<span style="background-color: ${safeText(color, '#2A3647')};" class="badge taskContactsbadge">${safeText(initials, '?')}</span>`
}

/** Builds the mobile move menu for tasks currently in the first column. */
function moveTamplateTaskMobileField1(taskID, mobileArrowsMoveTaskPosition){
    return `<div class="taskMobileMenu taskMobileMove" role="menu" aria-label="taskMobileMove menu" style="top: ${mobileArrowsMoveTaskPosition.top}px; left: ${mobileArrowsMoveTaskPosition.left}px;" onmouseleave="removeMobileMoveTask()" >
                     <span>Move to</span>
                     <table>
                        <tr class = "allTaskMobileSubmenuItem">
                            <td onclick = "removeMobileMoveTask(); taskMoveDownMobile(${taskID})" role="menuitem" class="taskMobileSubmenuItem"><img src="./assets/img/arrow_downward_TaskMobile.svg" alt="Arrow Down"></td> 
                            <td onclick = "removeMobileMoveTask(); taskMoveDownMobile(${taskID})" role="menuitem" class="taskMobileSubmenuItem">Review</td>
                        </tr>
                    </div>`;

}

/** Builds the mobile move menu for tasks currently in the last column. */
function moveTamplateTaskMobileField4(taskID, mobileArrowsMoveTaskPosition) {
    return `<div class="taskMobileMenu taskMobileMove" role="menu" aria-label="taskMobileMove menu" style="top: ${mobileArrowsMoveTaskPosition.top}px; left: ${mobileArrowsMoveTaskPosition.left}px;" onmouseleave="removeMobileMoveTask()" >
                     <span>Move to</span>
                     <table>
                        <tr class = "allTaskMobileSubmenuItem">
                            <td onclick = "removeMobileMoveTask(); taskMoveUpMobile(${taskID})" role="menuitem" class="taskMobileSubmenuItem"><img src="./assets/img/arrow_upward_TaskMobile.svg" alt="Arrow UP"></td>
                            <td onclick = "removeMobileMoveTask(); taskMoveUpMobile(${taskID})" role="menuitem" class="taskMobileSubmenuItem">To-do</td>
                        </tr>
                    </div>`;
}

/** Builds the mobile move menu for tasks currently in the middle columns. */
function moveTamplateTaskMobileField2_3(taskID, mobileArrowsMoveTaskPosition) {
   return `<div class="taskMobileMenu taskMobileMove" role="menu" aria-label="taskMobileMove menu" style="top: ${mobileArrowsMoveTaskPosition.top}px; left: ${mobileArrowsMoveTaskPosition.left}px;" onmouseleave="removeMobileMoveTask()" >
                     <span>Move to</span>
                     <table>
                        <tr class = "allTaskMobileSubmenuItem">
                            <td onclick = "removeMobileMoveTask(); taskMoveUpMobile(${taskID})" role="menuitem" class="taskMobileSubmenuItem"><img src="./assets/img/arrow_upward_TaskMobile.svg" alt="Arrow UP"></td>
                            <td onclick = "removeMobileMoveTask(); taskMoveUpMobile(${taskID})" role="menuitem" class="taskMobileSubmenuItem">To-do</td>
                        </tr>
                        <tr class = "allTaskMobileSubmenuItem">
                            <td onclick = "removeMobileMoveTask(); taskMoveDownMobile(${taskID})" role="menuitem" class="taskMobileSubmenuItem"><img src="./assets/img/arrow_downward_TaskMobile.svg" alt="Arrow Down"></td>
                            <td onclick = "removeMobileMoveTask(); taskMoveDownMobile(${taskID})" role="menuitem" class="taskMobileSubmenuItem">Review</td>
                     </table>
                    </div>`;
    
}
