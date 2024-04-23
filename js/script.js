/* ELEMENTS SELECTION */
// user name elements
const saluting = document.getElementById('saluting')
const displayUserName = document.getElementById('user-name')
const userNameInput = document.getElementById('user-name-input')
const changeNameIcon = document.getElementById('change-name-icon')
const changeNameButton = document.getElementById('change-name-btn')

// add tasks form elements
const addTaskForm = document.getElementById('form-add-task')
const taskNameInput = document.getElementById('task-name-input')
const taskDescriptionInput = document.getElementById('task-description-input')
const addTaskButton = document.getElementById('add-task-button')

// user level & progress bar elements
const displayUserLevel = document.getElementById('user-level')
const progressBar = document.getElementById('progress-bar')
let userLevel = 0

// search form elements
const searchForm = document.getElementById('search-form')
const searchInput = document.getElementById('search-input')
const clearSearchButton = document.getElementById('clear-search-button')

// filter tasks elements
const filterTasksSelect = document.getElementById('filter-tasks-select')
const filterTasksOptions = document.getElementsByClassName('task-filter-option')

// edit task elements
const taskListsContainer = document.getElementById('tasks-list-container')
const editTaskForm = document.getElementById('edit-task-form')
const editTaskNameInput = document.getElementById('edit-task-name-input')
const editTaskDescriptionInput = document.getElementById('edit-task-description-input')
const confirmEditButton = document.getElementById('confirm-edit-button')
const cancelEditButton = document.getElementById('cancel-edit-button')

// task lists elements
const todoTasksList = document.getElementById('tasks-list')
const concluedTasksList = document.getElementById('conclued-tasks-list')
const deletedTasksList = document.getElementById('deleted-tasks-list')

// task item element
const taskItem = document.querySelectorAll('.task-item')
const taskTemplate = document.getElementById('task-template')




// update user name
function updateUserName(){
    const isEditing = changeNameIcon.classList.contains('bi-check-lg')
    if(isEditing){
        if(userNameInput.value){
            displayUserName.innerText = `Hello, ${userNameInput.value}!`
            userNameInput.classList.add('hide')
            changeNameIcon.classList.remove('bi-check-lg')
            changeNameIcon.classList.add('bi-pencil')
        }
    }else{
        changeNameIcon.classList.remove('bi-pencil')
        changeNameIcon.classList.add('bi-check-lg')
        displayUserName.innerText = 'Hello, '
        userNameInput.value = ''
        userNameInput.classList.remove('hide')
        userNameInput.focus()
    }
}
changeNameButton.addEventListener('click', updateUserName)



// add a task
function addTask(event){
    event.preventDefault()

    // create a new task item
    const newTaskItem = taskTemplate.content.cloneNode(true)
    const newTaskTitle = newTaskItem.querySelector('.task-title')
    const newTaskDescription = newTaskItem.querySelector('.task-description')

    const taskButtonsDiv = newTaskItem.querySelector('.task-buttons')
    const newEditTaskButton = taskButtonsDiv.querySelector('.task-edit-button')
    const newDeleteTaskButton = taskButtonsDiv.querySelector('.task-delete-button')

    const createdTaskItem = newTaskItem.querySelector('li')

    if(taskNameInput.value){
        // give task name and description, then append it to todo list
        newTaskTitle.innerText = taskNameInput.value
        newTaskDescription.innerText = taskDescriptionInput.value
        todoTasksList.appendChild(newTaskItem);

        /* ! ! ! TASK BUTTONS EVENT LISTENERS ARE HERE ! ! ! */
        createdTaskItem.addEventListener('click', concludeTask);
        newEditTaskButton.addEventListener('click', toggleEditForm)
        newDeleteTaskButton.addEventListener('click', deleteTask)
    }else{
        return   
    }

    taskNameInput.value = ''
    taskDescriptionInput.value = ''
    taskNameInput.focus()
}
addTaskForm.addEventListener('submit', addTask)

/* ! EVENT HANDLER FOR THESE ARE INSIDE 'addTask' FUNCTION ! */
// mark task as conclued
function concludeTask(event){
    const clickedTask = event.currentTarget
    const taskIsDeleted = clickedTask.classList.contains('deleted')

    if(taskIsDeleted){
        return
    }else{
        const taskIsMarked = clickedTask.classList.toggle('marked')
        if(progressBar.value < 10){
            progressBar.value = 0
        }
        
        // updating progress bar & adding task to conclued tasks list
        if(taskIsMarked){
            progressBar.value += 10
            concluedTasksList.appendChild(clickedTask)
            updateLevel()
        }else{
            todoTasksList.appendChild(clickedTask)
            progressBar.value -= 10
            updateLevel()
        }
    }
}


// update level
function updateLevel(){
    if(progressBar.value >= 100){
        userLevel += 1
        progressBar.value = 0.1
        displayUserLevel.innerText = `Level: ${userLevel}`
    }else if(userLevel >= 1 && progressBar.value == 0){
        userLevel -= 1
        progressBar.value = 90
        displayUserLevel.innerText = `Level: ${userLevel}`
    }
}


// edit a task
function deleteTask(event){
    event.stopPropagation()
    const delBtn = event.currentTarget
    const delBtnIcon = delBtn.children[0]
    const task = event.currentTarget.parentNode.parentNode
    const taskIsDeleted = task.classList.toggle('deleted')
    const taskIsMarked = task.classList.contains('marked')

    /* if task is conclued, when unmarked as deleted will be sended to conclued 
    tasks list instead todo list*/
    if(taskIsMarked && !taskIsDeleted){
        concluedTasksList.appendChild(task)
    }else{
        todoTasksList.appendChild(task)
    }

    // switching icons and sending to deleted tasks lists if task is deleted
    if(taskIsDeleted){
        delBtnIcon.classList.remove('bi-x-square')
        delBtnIcon.classList.add('bi-arrow-clockwise')
        deletedTasksList.appendChild(task)
    }else{
        delBtnIcon.classList.add('bi-x-square')
        delBtnIcon.classList.remove('bi-arrow-clockwise')
    }
}


// toggle edit form

let currentTaskTitle = null 
let currentTaskDescription = null

function toggleEditForm(event){
    event.preventDefault()
    event.stopPropagation()

    const clickedEditButton = event.currentTarget
    const currentTask = clickedEditButton.parentNode.parentNode
    currentTaskTitle = currentTask.querySelector('.task-title')
    currentTaskDescription = currentTask.querySelector('.task-description')

    taskListsContainer.classList.toggle('hide')
    editTaskForm.classList.toggle('hide')

    editTaskNameInput.value = currentTaskTitle.innerText
    editTaskDescriptionInput.value = currentTaskDescription.innerText
}
cancelEditButton.addEventListener('click', toggleEditForm)


// edit & update task
function editTask(event){
    event.preventDefault()

    if(!editTaskNameInput.value.trim()){
        alert('[INFO] Nothing was changed!')
    }else{
        currentTaskTitle.innerText = editTaskNameInput.value
        currentTaskDescription.innerText = editTaskDescriptionInput.value
    }
}
editTaskForm.addEventListener('submit', editTask)
editTaskForm.addEventListener('submit', toggleEditForm)

// search tasks
searchInput.addEventListener('input', event => {
    const inputValue = event.currentTarget.value.toLowerCase()
    const tasksList = document.getElementsByTagName('li')
    if(inputValue){
        for(let i = 0; i < tasksList.length; i++){
            const taskName = tasksList[i].querySelector('.task-title').textContent.toLowerCase()
            const taskDescription = tasksList[i].querySelector('.task-description').textContent.toLowerCase()
            const inputValueMatchesWithTask = taskName.includes(inputValue) || taskDescription.includes(inputValue)

            if(inputValueMatchesWithTask){
                tasksList[i].classList.remove('hide')
            }else{
                tasksList[i].classList.add('hide')
            }
        }
    }else{
        for(let i = 0; i < tasksList.length; i++){
            tasksList[i].classList.remove('hide')
        }
    }
})




/*COISAS PRA SALVAR NO STORAGE:

- displayUserName.innerText
- displayUserLevel.innerText
- todoTasksList.innerHTML
- concluedTasksList.innerHTML
- deletedTasksList.innerHTML
- userLevel
- progressBar.value
*/
