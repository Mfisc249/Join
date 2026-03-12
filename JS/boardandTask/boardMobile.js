
async function widthChangeCallback(myMediaQuery) {
    if (myMediaQuery.matches) {
        document.getElementById('taskTableContent').innerHTML = taskBoardTamplateMobile();
        startLoadingScreenMobile();
        TASK = [];
        TASKKEYS = [];
        count = 0;
        await render();
    } else {
        document.getElementById('taskTableContent').innerHTML = taskBoardTamplate();
        startLoadingScreen();
        TASK = [];
        TASKKEYS = [];
        count = 0;
        await render();
    }
}
myMediaQuery.addEventListener('change', widthChangeCallback);

function addMobileMoveTask(mobileArrowsMoveTaskID, taskID) {
    let refMobileArrowsMoveTaskID = document.getElementById(mobileArrowsMoveTaskID);
    let mobileArrowsMoveTaskPosition = refMobileArrowsMoveTaskID.getBoundingClientRect();
    let refDiv = document.createElement("div");
    refDiv.id = "taskMobileMove";
    checkFieldTaskMobile(taskID, refDiv, mobileArrowsMoveTaskPosition);
    document.getElementById('app-canvas').appendChild(refDiv);
}

function checkFieldTaskMobile(taskID, refDiv, mobileArrowsMoveTaskPosition) {
    switch (TASK[0][`Task${taskID}`].field.field) {
        case 'field1':
            refDiv.innerHTML = `<div class="taskMobileMenu taskMobileMove" role="menu" aria-label="taskMobileMove menu" style="top: ${mobileArrowsMoveTaskPosition.top}px; left: ${mobileArrowsMoveTaskPosition.left}px;" onmouseleave="removeMobileMoveTask()" >
                     <span>Move to</span>
                     <table>
                        <tr>
                            <td onclick = "removeMobileMoveTask(); taskMoveDownMobile(${taskID})" role="menuitem" class="taskMobileSubmenuItem"><img src="./assets/img/arrow_downward_TaskMobile.svg" alt="Arrow Down"></td> 
                            <td onclick = "removeMobileMoveTask(); taskMoveDownMobile(${taskID})" role="menuitem" class="taskMobileSubmenuItem">Review</td>
                        </tr>
                    </div>`;
            break;

        case 'field4':
            refDiv.innerHTML = `<div class="taskMobileMenu taskMobileMove" role="menu" aria-label="taskMobileMove menu" style="top: ${mobileArrowsMoveTaskPosition.top}px; left: ${mobileArrowsMoveTaskPosition.left}px;" onmouseleave="removeMobileMoveTask()" >
                     <span>Move to</span>
                     <table>
                        <tr>
                            <td onclick = "removeMobileMoveTask(); taskMoveUpMobile(${taskID})" role="menuitem" class="taskMobileSubmenuItem"><img src="./assets/img/arrow_upward_TaskMobile.svg" alt="Arrow UP"></td>
                            <td onclick = "removeMobileMoveTask(); taskMoveUpMobile(${taskID})" role="menuitem" class="taskMobileSubmenuItem">To-do</td>
                        </tr>
                    </div>`;
            break;

        default:
            refDiv.innerHTML = `<div class="taskMobileMenu taskMobileMove" role="menu" aria-label="taskMobileMove menu" style="top: ${mobileArrowsMoveTaskPosition.top}px; left: ${mobileArrowsMoveTaskPosition.left}px;" onmouseleave="removeMobileMoveTask()" >
                     <span>Move to</span>
                     <table>
                        <tr>
                            <td onclick = "removeMobileMoveTask(); taskMoveUpMobile(${taskID})" role="menuitem" class="taskMobileSubmenuItem"><img src="./assets/img/arrow_upward_TaskMobile.svg" alt="Arrow UP"></td>
                            <td onclick = "removeMobileMoveTask(); taskMoveUpMobile(${taskID})" role="menuitem" class="taskMobileSubmenuItem">To-do</td>
                        </tr>
                        <tr>
                            <td onclick = "removeMobileMoveTask(); taskMoveDownMobile(${taskID})" role="menuitem" class="taskMobileSubmenuItem"><img src="./assets/img/arrow_downward_TaskMobile.svg" alt="Arrow Down"></td>
                            <td onclick = "removeMobileMoveTask(); taskMoveDownMobile(${taskID})" role="menuitem" class="taskMobileSubmenuItem">Review</td>
                     </table>
                    </div>`;
            break;
    }
}

function removeMobileMoveTask() {
    document.getElementById("taskMobileMove").remove();
}

function taskMoveUpMobile(taskID) {
    let refField = TASK[0][`Task${taskID}`].field.field.slice(-1) * 1;
    if (refField > 1) {
        moveToMobile(`field${refField - 1}`, taskID);
    }
}

function taskMoveDownMobile(taskID) {
    let refField = TASK[0][`Task${taskID}`].field.field.slice(-1) * 1;
    if (refField < 4) {
        moveToMobile(`field${refField + 1}`, taskID);
    }
}

async function moveToMobile(field, taskID) {
    TASK[0][`Task${taskID}`].field.field = `${field}`;
    renderMovedTask(field, taskID);
    await DataPUT(`Tasks/Task${taskID}/field`, {
        'field': `${field}`,
    });
}
