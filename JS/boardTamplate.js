
function taskTamplate(taskID) {
    return `<div id="${taskID}" class ="task" draggable="true" ondragstart="draggedTask('${taskID}')" onclick = "openTaskDetails('${taskID}'), opendialog('allTaskDetails')">
            ${TASK[0][`Task${taskID}`].title}
            </div>`
}

function highlightTaskTamplate(){
    return `<div id="highlightTask" class = "highlightTask">
            </div>`
}

function taskBoardTamplate(){
    return `<td id="field1" ondrop="moveTo('field1')" ondragleave="removeHighlightField('field1')"
                        ondragover="dragoverHandler(event), highlightField('field1')"></td>
                    <td id="field2" ondrop="moveTo('field2')" ondragleave="removeHighlightField('field2')"
                        ondragover="dragoverHandler(event), highlightField('field2')"></td>
                    <td id="field3" ondrop="moveTo('field3')" ondragleave="removeHighlightField('field3')"
                        ondragover="dragoverHandler(event), highlightField('field3')"></td>
                    <td id="field4" ondrop="moveTo('field4')" ondragleave="removeHighlightField('field4')"
                        ondragover="dragoverHandler(event), highlightField('field4')"></td>`
}

function taskDetailsTamplate(taskID) {
    return `
    <div onclick="event.stopPropagation()">
        <header>
            <section>
                <div class="taskCatagory">${TASK[0][`Task${taskID}`].category}</div>
                <div class= "closeDialogX" onclick = "closedialog('allTaskDetails')">X</div>
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
                        <td>${TASK[0][`Task${taskID}`].priority}</td>
                    </tr>
                </table>
                <h2>Assigned To:</h2>
                <h2>Subtasks</h2>
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

function subtaskTamplate(ID, subTask) {
    return `<span><img onclick="checkbox('stCheckboxU${ID}','stCheckboxCheck${ID}')"  id ="stCheckboxU${ID}" src="./assets/img/checkboxUnchecked.svg" alt="Checkbox"><img class ="displayNone" onclick="checkbox('stCheckboxU${ID}','stCheckboxCheck${ID}')" id="stCheckboxCheck${ID}" src="./assets/img/checkboxChecked.svg" alt="Checkbox checked"> ${subTask}</span>`
}