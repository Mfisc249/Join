let refTaskID;
let refSubTaskCheckbox = [];
let allContactDetails = [];

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


async function openTaskDetails(taskID) {
    let reftaskDetails = document.getElementById('allTaskDetails');
    reftaskDetails.innerHTML = taskDetailsTamplate(taskID);
    await getTaskDetailsContacts(taskID);
    await renderSubtasks(taskID);
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

/** 
* Contacts
*/
async function getTaskDetailsContacts(taskID) {
   document.getElementById('subTasks').innerHTML = `<img src="./assets/img/loading-3-bars.svg" alt="loadingscreen">`;
   let reftaskDetailsContainer = document.getElementById('taskDetailsAT');
   reftaskDetailsContainer.innerHTML = `<img src="./assets/img/loading-3-bars.svg" alt="loadingscreen">`;
   let refAssignedTo = await DataGET(`Tasks/Task${taskID}/assignedTo`);
   let assignedToCount = (refAssignedTo.match(/,/g)||[]).length +1;
   allContactDetails =[];
   for (let index = 0; index < assignedToCount; index++) {
        let contact = refAssignedTo.split(',')[index];
        allContactDetails.push(await DataGET(`Contacts/${contact}`));
    }
    reftaskDetailsContainer.innerHTML = "";
    renderTaskDetailsContacts(reftaskDetailsContainer)
}

function renderTaskDetailsContacts(reftaskDetailsContainer) {
    allContactDetails.forEach(element => {
        reftaskDetailsContainer.innerHTML += taskDetailContactsTamplate(element.initials, element.name, element.color);
    });
    
}

/**
 * Subtasks
 */
function checkbox(IDU, IDC) {
    document.getElementById(IDU).classList.toggle('displayNone');
    document.getElementById(IDC).classList.toggle('displayNone');
}

async function renderSubtasks(taskID) {
    let subTaskCheckbox = await DataGET(`Tasks/Task${taskID}/subTasksReview`);
    refSubTaskCheckbox = [];
    let refSubtasks = await DataGET(`Tasks/Task${taskID}/subTasks`);
    let subTaskCount = (refSubtasks.match(/,/g)||[]).length +1;
    document.getElementById('subTasks').innerHTML = "";
    for (let index = 0; index < subTaskCount; index++) {
        let subTID = index;
        let subTask = refSubtasks.split(',')[index];
        refSubTaskCheckbox.push(subTaskCheckbox[0].split(',')[index]);
        document.getElementById('subTasks').innerHTML += subtaskTamplate(index, subTask, subTID);
        subTaskCheckCheckbox(subTID);
    }
    refTaskID = taskID;
    
}

function subTaskCheckCheckbox(subTID) {
   let refCheckboxC = document.getElementById(`stCheckboxC${subTID}`);
   let refCheckboxU = document.getElementById(`stCheckboxU${subTID}`);
    if (refSubTaskCheckbox[subTID] === 'U') {
        refCheckboxC.classList.add("displayNone");
        refCheckboxU.classList.remove("displayNone");
    }else{
        refCheckboxC.classList.remove("displayNone");
        refCheckboxU.classList.add("displayNone");
    }
}

function subtaskCU(IDC, subTID) {
    let refClass = document.getElementById(IDC).classList.item(0);
    if (refClass != 'displayNone' ) {
        refSubTaskCheckbox[subTID] = 'C';
        console.log(refSubTaskCheckbox);
    }else{
        refSubTaskCheckbox[subTID] = 'U';
        console.log(refSubTaskCheckbox);
    }
}

function storeSubtask() {
    let checkboxString = refSubTaskCheckbox.toString();
        DataPUT(`Tasks/Task${refTaskID}/subTasksReview`,{
          0 : `${checkboxString}`
        }
        );
   
}