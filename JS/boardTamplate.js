/**
 * Return HTML for a task.
 * @param {number} taskID Task ID.
 * @returns {string}
 */
function taskTamplate(taskID) {
    return `<div id="${taskID}" draggable="true" ondragstart="draggedTask(${taskID})">
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