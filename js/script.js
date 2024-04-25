/* ELEMENTS SELECTION */
// dimiss data warning button
const dataWarningDiv = document.getElementById('data-warning')
const dimissWarningButton = document.getElementById('dimiss-warning')
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
const categoryInfoDivs = document.querySelectorAll('.category-info')
    // specific task lists elements
    const searchInfoDiv = document.getElementById('search-info')
    const displaySearchInfoParagraph = document.getElementById('display-search-info')
    const todoTasksSection = document.getElementById('todo-tasks-section')
    const concluedTasksSection = document.getElementById('conclued-tasks-section')
    const deletedTasksSection = document.getElementById('deleted-tasks-section')
const todoTasksList = document.getElementById('tasks-list')
const concluedTasksList = document.getElementById('conclued-tasks-list')
const deletedTasksList = document.getElementById('deleted-tasks-list')
const clearDeletedTasksButton = document.getElementById('clear-deleted-tasks-list-button')
// User Level && EXP elements
const progressContainer = document.getElementById('progress-container')
const userCurrentExp = document.getElementById('current-exp')
const userCurrentLevel = document.getElementById('user-level')
    // user level values
    let userExpValue = 0
    let userLevelValue = 0
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
// dimiss data warning function
dimissWarningButton.addEventListener('click', () => {
    dataWarningDiv.classList.add('hide')
})
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
            saveData()
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
    saveData()
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

    // set event handler to "edit name" button
    changeNameButton.addEventListener('click', changeUserNameFunction)
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


// ["SEARCH" RELATED FUNCTION] Search tasks function && event handler
function searchTasksFunction(event){
    // select useful elements
    const inputValue = event.currentTarget.value.toLowerCase()
    const tasksList = document.getElementsByTagName('li')

    // counter of visible tasks
    let visibleTasksCount = 0

    // if there is an input value: we will run trough all list items
    // then if an list item includes on name or description the input value
    // we will show it, otherwise, hide it
    if(inputValue){
        // set the selection value to "all" to avoid confusing while search
        filterTasksSelect.value = 'all-tasks'
        filterTasksFunction()

        // show "search" info div && hide all other category info divs
        searchInfoDiv.classList.remove('hide')

        categoryInfoDivs.forEach(div => {
            div.classList.add('hide')
        })

        // then check input values
        for(let i = 0; i < tasksList.length; i++){
            const taskItem = tasksList[i]
            const taskName =  tasksList[i].querySelector('.task-title').innerText.toLowerCase()
            const taskDescription = tasksList[i].querySelector('.task-description').innerText.toLowerCase()
            const searchValueMatchesWithTask = taskName.includes(inputValue) || taskDescription.includes(inputValue)

            if(searchValueMatchesWithTask){
                taskItem.classList.remove('hide')
                visibleTasksCount++
            }else{
                taskItem.classList.add('hide')
            }
            // set a message if there is no search results
            if(visibleTasksCount === 0){
                displaySearchInfoParagraph.innerText = 'No matching results!'
            }else{
                displaySearchInfoParagraph.innerText = ''
            }
        }
    }else{
        // hide "search" info div && show back all category info divs
        searchInfoDiv.classList.add('hide')

        categoryInfoDivs.forEach(div => {
            div.classList.remove('hide')
        })

        // if there's no input value... then we will show back all tasks
        for(let i = 0; i < tasksList.length; i++){
            tasksList[i].classList.remove('hide')
        }
    }
}
searchInput.addEventListener('input', searchTasksFunction)


// ["SEARCH" RELATED FUNCTION] Clear search input function && event handler
clearSearchInputButton.addEventListener('click', event => {
    event.preventDefault()

    // set value as a empty string
    searchInput.value = ''
    searchInput.focus()

    // calling search function to update search results
    searchTasksFunction()
})


// Filter tasks function && event handler
function filterTasksFunction(){
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
}
filterTasksSelect.addEventListener('change', filterTasksFunction)


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
    tasksLimitFunction()
    saveData()
}


// ["EDIT TASK" RELATED FUNCTION] Toggle edit form && event handler
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
    saveData()
}
editTaskForm.addEventListener('submit', updateTaskInfo)


// ["DELETE TASK" RELATED FUNCTION] Delete task function
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
        saveData()
    }else{
        // remove task from current list && add it to "Deleted" list
        currentTask.classList.add('deleted')
        deletedTasksList.appendChild(currentTask)

        // update delete button icon
        clickedButtonIcon.classList.add('bi-arrow-clockwise')
        clickedButtonIcon.classList.remove('bi-x-square')
    }
    tasksLimitFunction()
    saveData()
}


// ["DELETE TASK" RELATED FUNCTION] Clear deleted tasks list && event handler
function clearDeletedTasksListFunction(){
    deletedTasksList.innerHTML = ''
    tasksLimitFunction()
    saveData()
}
clearDeletedTasksButton.addEventListener('click', clearDeletedTasksListFunction)


// Tasks limit function
function tasksLimitFunction(){
    // defining conditions
    const concluedTasksLisIstOverTheLimit = concluedTasksList.children.length > 15
    const deletedTasksListIsOverTheLimit = deletedTasksList.children.length > 10

    // if any of these conditions above return true, then we will remove the last child from the list
    if(concluedTasksLisIstOverTheLimit){
        const lastConcluedItem = concluedTasksList.lastChild
        concluedTasksList.removeChild(lastConcluedItem)
    }else if(deletedTasksListIsOverTheLimit){
        const lastDeletedItem = deletedTasksList.lastChild
        deletedTasksList.removeChild(lastDeletedItem)
    }
}


/* Local storage functions */
function saveData(){
    // save user name data
    localStorage.setItem('saluting-div-content', salutingDiv.innerHTML)
    localStorage.setItem('display-user-name-content', displayUserName.innerText)
    localStorage.setItem('change-name-button-content', changeNameButton.innerHTML)
    localStorage.setItem('change-name-button-icon-content', changeNameButtonIcon.innerHTML)
    
    // save user exp && level info
    localStorage.setItem('user-exp-value', userExpValue)
    localStorage.setItem('user-level-value', userLevelValue)

    // save progress bar value
    localStorage.setItem('progress-bar-value', progressBar.value)

    // save task lists
    localStorage.setItem('to-do-tasks-list-content', todoTasksList.innerHTML)
    localStorage.setItem('conclued-tasks-list-content', concluedTasksList.innerHTML)
    localStorage.setItem('deleted-tasks-list-content', deletedTasksList.innerHTML)
}

function loadData() {
    // load user name data
    if(localStorage.getItem('display-user-name-content') == null){
        return
    }else{
        displayUserName.innerText = localStorage.getItem('display-user-name-content')
        userNameInput.classList.add('hide')
        changeNameButtonIcon.classList.remove('bi-check-lg')
        changeNameButtonIcon.classList.add('bi-pencil')
    }

    // load user exp && level info
    const savedExp = localStorage.getItem('user-exp-value')
    const savedLevel = localStorage.getItem('user-level-value')

    if(savedExp == null || savedLevel == null){
        userCurrentExp.innerText = '0'
        userCurrentLevel.innerText = '0'
    }else{
        userCurrentExp.innerText = savedExp
        userCurrentLevel.innerText = savedLevel
    }

    // load progress bar value
    progressBar.value = localStorage.getItem('progress-bar-value')

    // load task lists
    todoTasksList.innerHTML = localStorage.getItem('to-do-tasks-list-content')
    concluedTasksList.innerHTML = localStorage.getItem('conclued-tasks-list-content')
    deletedTasksList.innerHTML = localStorage.getItem('deleted-tasks-list-content')

    setEventListenerToTaskButtons()
}
loadData()
