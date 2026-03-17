function editPreparation(taskID = "1") {
    task.title = `${TASK[0][`Task${taskID}`].title}`;
    init();
}