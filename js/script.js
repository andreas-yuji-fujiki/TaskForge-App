/* ELEMENTS SELECTION */
// Saluting div elements
const salutingDiv = document.getElementById('saluting')
const displayUserName = document.getElementById('user-name')
const userNameInput = document.getElementById('user-name-input')
const changeNameButton = document.getElementById('change-name-btn')
const changeNameButtonIcon = document.getElementById('change-name-icon')
// Add task form elements
const addTaskForm = document.getElementById('form-add-task')
const taskNameInput = document.getElementById('task-name-input')
const addTaskButton = document.getElementById('add-task-button')
const taskDescriptionInput = document.getElementById('task-description-input')
const taskTemplate = document.getElementById('task-template')
// Task list elements
const taskListsContainer = document.getElementById('task-lists-container')
    // specific task lists elements
    const todoTasksSection = document.getElementById('todo-tasks-section')
    const concluedTasksSection = document.getElementById('conclued-tasks-section')
    const deletedTasksSection = document.getElementById('deleted-tasks-section')
const todoTasksList = document.getElementById('tasks-list')
const concluedTasksList = document.getElementById('conclued-tasks-list')
const deletedTasksList = document.getElementById('deleted-tasks-list')
// User Level && EXP elements
const progressContainer = document.getElementById('progress-container')
const userCurrentExp = document.getElementById('current-exp')
    // user level values
    let userExpValue = 0
    let userLevelValue = 0
const userCurrentLevel = document.getElementById('user-level')
const progressBar = document.getElementById('progress-bar')
// Toolbar element
const toolbarContainer = document.getElementById('toolbar')
// Search tasks form - elements
const searchForm = document.getElementById('search-form')
const searchInput = document.getElementById('search-input')
const clearSearchInputButton = document.getElementById('clear-search-button')
// Filter Tasks Select - elements
const filterTasksSelect = document.getElementById('filter-tasks-select')
const filterTasksSelectOption = document.querySelectorAll('.task-filter-select')
// Edit task - formulary elements
const editTaskForm = document.getElementById('edit-task-form')
const editTaskNameInput = document.getElementById('edit-task-name-input')
const editTaskDescriptionInput = document.getElementById('edit-task-description-input')
const cancelEditButton = document.getElementById('cancel-edit-button')





/* FUNCTIONS */
// Change user name function && event handler
function changeUserNameFunction(){
    const userNameValue = userNameInput.value
    // check if user is editing his username
    const isUserEditing = changeNameButtonIcon.classList.contains('bi-pencil')
    
    if(isUserEditing){
        // update username, show user name input && update button's icon
        displayUserName.innerText = `Hello, `
        userNameInput.classList.remove('hide')
        changeNameButtonIcon.classList.remove('bi-pencil')
        changeNameButtonIcon.classList.add('bi-check-lg')
        userNameInput.value = ''
        userNameInput.focus()
    }else{
        // check if user name input is empty
        const nameInputIsEmpty = !userNameValue
        if(nameInputIsEmpty){
            userNameInput.focus()
            return
        }else{
            // hide user name input && update button's icon
            userNameInput.classList.add('hide')
            changeNameButtonIcon.classList.remove('bi-check-lg')
            changeNameButtonIcon.classList.add('bi-pencil')

            // update user name display
            displayUserName.innerText = `Hello, ${userNameValue}`
        }
    }
}
changeNameButton.addEventListener('click', changeUserNameFunction)


// Add a task function && event handler
function addTaskFunction(event){
    event.preventDefault()
    // check if task don't have a name
    const isTaskNameEmpty = !taskNameInput.value

    if(isTaskNameEmpty){
        taskNameInput.focus()
        return
    }else{
        // creating a new task template && selecting the task item element
        const newTaskTemplate = taskTemplate.cloneNode(true)
        const newTaskItem = newTaskTemplate.content.querySelector('.task-item')

        // selecting task info div & task info div's elements
        const newTaskInfoDiv = newTaskItem.querySelector('.task-info')
        const newTaskTitle = newTaskInfoDiv.querySelector('.task-title')
        const newTaskDescription = newTaskInfoDiv.querySelector('.task-description')

        // defining title && description for the new task
        newTaskTitle.innerText = taskNameInput.value
        newTaskDescription.innerText = taskDescriptionInput.value

        // appending the new task item to todo list
        todoTasksList.appendChild(newTaskItem)
        taskNameInput.value = ''
        taskDescriptionInput.value = ''
        taskNameInput.focus()

        // adding event listeners on task buttons
        setEventListenerToTaskButtons()
    }
}
addTaskForm.addEventListener('submit', addTaskFunction)


// Set event listeners to task buttons function
function setEventListenerToTaskButtons(){
    // event listerner for all tasks to mark it as conclued
    const taskItems = document.querySelectorAll('.task-item')
    taskItems.forEach(taskItem => {
        taskItem.addEventListener('click', concludeTaskFunction)
    })

    // event listener to toggle edit form, for all "edit task" buttons
    // also event listener to update edit form input values
    const editTaskButtons = document.querySelectorAll('.task-edit-button')
    editTaskButtons.forEach(editButton => {
        editButton.addEventListener('click', toggleEditFormFunction)
        editButton.addEventListener('click', updateEditFormInputsFunction)
    })

    // event listener for all "delete task" buttons
    const deleteTaskButtons = document.querySelectorAll('.task-delete-button')
    deleteTaskButtons.forEach(deleteButton => {
        deleteButton.addEventListener('click', deleteTaskFunction)
    })
}
setEventListenerToTaskButtons()


// Update user level function
function updateUserLevelFunction(){
    if(progressBar.value >= 100){
        userLevelValue += 1
        progressBar.value = 0
        userCurrentLevel.innerText = userLevelValue
    }else if(userLevelValue >= 1 && progressBar.value == 0){
        userLevelValue -= 1
        progressBar.value = 90
        userCurrentLevel.innerText = userLevelValue
    }
}


// Search tasks function && event handler
searchInput.addEventListener('input', event => {
    // select useful elements
    const inputValue = event.currentTarget.value.toLowerCase()
    const tasksList = document.getElementsByTagName('li')

    // if there is an input value: we will run trough all list items
    // then if an list item includes on name or description the input value
    // we will show it, otherwise, hide it
    if(inputValue){
        for(let i = 0; i < tasksList.length; i++){
            const taskItem = tasksList[i]
            const taskName =  tasksList[i].querySelector('.task-title').innerText.toLowerCase()
            const taskDescription = tasksList[i].querySelector('.task-description').innerText.toLowerCase()
            const searchValueMatchesWithTask = taskName.includes(inputValue) || taskDescription.includes(inputValue)

            if(searchValueMatchesWithTask){
                taskItem.classList.remove('hide')
            }else{
                taskItem.classList.add('hide')
            }
        }
    }else{
        // if there's no input value... then we will show back all tasks
        for(let i = 0; i < tasksList.length; i++){
            tasksList[i].classList.remove('hide')
        }
    }
})


// Filter tasks function && event handler
filterTasksSelect.addEventListener('change', () => {
    console.log(filterTasksSelect.value)
    switch(filterTasksSelect.value){
        case 'all-tasks':
            todoTasksSection.classList.remove('hide')
            concluedTasksSection.classList.remove('hide')
            deletedTasksSection.classList.remove('hide')
        break
        case 'to-do-tasks':
            todoTasksSection.classList.remove('hide')
            concluedTasksSection.classList.add('hide')
            deletedTasksSection.classList.add('hide')
        break
        case 'conclued-tasks':
            todoTasksSection.classList.add('hide')
            concluedTasksSection.classList.remove('hide')
            deletedTasksSection.classList.add('hide')
        break
        case 'deleted-tasks':
            todoTasksSection.classList.add('hide')
            concluedTasksSection.classList.add('hide')
            deletedTasksSection.classList.remove('hide')
        break
    }
})


// Conclude task function
function concludeTaskFunction(event){
    // selecting current task item 
    const currentTask = event.currentTarget

    // check if task is already marked as conclued && if task is marked as deleted
    const isTaskDeleted = currentTask.classList.contains('deleted')
    const isTaskConclued = currentTask.classList.contains('marked')

    if(isTaskDeleted){
        return
    }else{
        if(isTaskConclued){
            currentTask.classList.remove('marked')
            todoTasksList.appendChild(currentTask)

            // update exp && level info
            progressBar.value -= 10
            userExpValue -= 10
            userCurrentExp.innerText = userExpValue
        }else{
            currentTask.classList.add('marked')
            concluedTasksList.appendChild(currentTask)

            // update exp && level info
            progressBar.value += 10
            userExpValue += 10
            userCurrentExp.innerText = userExpValue
        }
    }
    updateUserLevelFunction()
}


// ["EDIT TASK" RELATED FUNCTION] Toggle edit form
function toggleEditFormFunction(event){
    event.stopPropagation()

    // show edit form
    editTaskForm.classList.toggle('hide')

    // hide these elements
    taskListsContainer.classList.toggle('hide')
    toolbarContainer.classList.toggle('hide')
    progressBar.classList.toggle('hide')
    progressContainer.classList.toggle('hide')
    addTaskForm.classList.toggle('hide')
}
editTaskForm.addEventListener('submit', toggleEditFormFunction)


// ["EDIT TASK" RELATED FUNCTION] Update edit form inputs
function updateEditFormInputsFunction(event){
    // get current task being edited info
    const currentTask = event.currentTarget.closest('li')
    let currentTitle = currentTask.querySelector('.task-title').innerText
    let currentDescription = currentTask.querySelector('.task-description').innerText

    // set edit inputs value as current task info & adding an ID to current task
    editTaskNameInput.value = currentTitle
    editTaskDescriptionInput.value = currentDescription

    // sets an id to identify the last edited task
    currentTask.id = 'being-edited-task'
}


// ["EDIT TASK" RELATED FUNCTION] Cancel task edit
cancelEditButton.addEventListener('click', () => {
    // pick the last "being edited task" info
    const currentTask = document.getElementById('being-edited-task')
    const currentTaskTitle = currentTask.querySelector('.task-title')
    const currentTaskDescription = currentTask.querySelector('.task-description')

    // set the inner texts as it was before, avoiding changes
    editTaskNameInput.value = currentTaskTitle.innerText
    editTaskDescriptionInput.value = currentTaskDescription.innerText
})


// ["EDIT TASK" RELATED FUNCTION] Update task info
function updateTaskInfo(event){
    event.preventDefault()

    // pick the last "being edited task" info
    const currentTask = document.getElementById('being-edited-task')
    const currentTaskTitle = currentTask.querySelector('.task-title')
    const currentTaskDescription = currentTask.querySelector('.task-description')

    // set the info as "edit task form" input values
    currentTaskTitle.innerText = editTaskNameInput.value
    currentTaskDescription.innerText = editTaskDescriptionInput.value

    // removes "being-edited-task" id from task
    currentTask.id = ''
}
editTaskForm.addEventListener('submit', updateTaskInfo)


// Delete task function
function deleteTaskFunction(event){
    event.stopPropagation()
    // selecting current elements
    const clickedButton = event.currentTarget
    const clickedButtonIcon = clickedButton.querySelector('i')
    const currentTask = clickedButton.closest('li')

    // check if task is already deleted && if task is marked as conclued
    const taskIsDeleted = currentTask.classList.contains('deleted')
    const taskIsConclued = currentTask.classList.contains('marked')

    if(taskIsDeleted){
        // remove task from "deleted" list and append it to last list it was
        currentTask.classList.remove('deleted')
        if(taskIsConclued){
            concluedTasksList.appendChild(currentTask)
        }else{
            todoTasksList.appendChild(currentTask)
        }

        // update delete button icon
        clickedButtonIcon.classList.remove('bi-arrow-clockwise')
        clickedButtonIcon.classList.add('bi-x-square')
    }else{
        // remove task from current list && add it to "Deleted" list
        currentTask.classList.add('deleted')
        deletedTasksList.appendChild(currentTask)

        // update delete button icon
        clickedButtonIcon.classList.add('bi-arrow-clockwise')
        clickedButtonIcon.classList.remove('bi-x-square')
    }
}
