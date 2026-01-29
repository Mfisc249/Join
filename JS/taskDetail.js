
/** Opens the dialog with animation */
function opendialog(ID) {
    const refdialog = document.getElementById(ID);
    refdialog.showModal();
    refdialog.classList.remove('closed');
    refdialog.classList.add('opend');
}

/** Closes the dialog with animation */
function closedialog(ID) {
    const refdialog = document.getElementById(ID);
    refdialog.classList.add('closed');
    refdialog.classList.remove('opend');
    setTimeout(() => {
        refdialog.close();
    }, 200)
}


function openTaskDetails(taskID) {
    let reftaskDetails = document.getElementById('allTaskDetails');
    reftaskDetails.innerHTML = taskDetailsTamplate(taskID);
    renderSubtasks(taskID);
}

function displayNone(ID1, ID2) {
    document.getElementById(ID1).classList.add('displayNone');
    document.getElementById(ID2).classList.remove('displayNone');
}

function removeDisplayNone(ID1, ID2) {
    document.getElementById(ID1).classList.remove('displayNone');
    document.getElementById(ID2).classList.add('displayNone');
}

function deleteTask(ID){
    document.getElementById(ID).remove();
    checkFieldIsEmpty();
    DataDELETE(`Task${ID}`);
}

async function DataDELETE(path = "") {
    let response = await fetch(BOARDURLBASE + path + '.json', {
        method: "DELETE"
    });

}

function checkbox(IDU, IDCheck) {
    document.getElementById(IDU).classList.toggle('displayNone');
    document.getElementById(IDCheck).classList.toggle('displayNone');
}

function renderSubtasks(taskID) {
    let refSubtasks = TASK[0][`Task${taskID}`].subTasks;
    let subTaskCount = (refSubtasks.match(/,/g)||[]).length +1;
    for (let index = 0; index < subTaskCount; index++) {
        let subTask = refSubtasks.split(',')[index];
        document.getElementById('subTasks').innerHTML += subtaskTamplate(index, subTask);
    }
    
    
}