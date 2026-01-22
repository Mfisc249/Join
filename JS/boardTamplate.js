
function taskTamplate(taskID) {
    return `<div id="${taskID}" class ="task" draggable="true" ondragstart="draggedTask('${taskID}')" onclick = "openTaskDetails('${taskID}'), opendialog('taskDetails')">
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
    return `<section>
        <div class="taskCatagory" id="${taskID}">XXX</div>
        <h1>${TASK[0][`Task${taskID}`].title}</h1>
        <p>xxxxxx</p>
        <table>
            <tr>
                <td><h2>Due date:</h2></td>
                <td></td>
            </tr>
            <tr>
                <td><h2>Priority:</h2></td>
                <td></td>
            </tr>
        </table>
        <h2>Assigned To:</h2>
        <h2>Subtasks</h2>
    </section>`
     
}