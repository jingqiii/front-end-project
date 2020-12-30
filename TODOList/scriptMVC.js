// add a new task
// delete a task
// delete all tasks
// toggle one task

// 1. Show how many active tasks left at the left of footer
// 2. Three tabs in center of footer to toggle between All, Active, Completed and show filtered tasks
// 3. Left header button to toggle all tasks. If any task is not completed, set all tasks to completed. If all tasks are completed, set all to active
// 4. Type in the input, press enter key to add the task -> add event listener to 'keyup' and check if it is 'enter' key
// 5. Hover on task, shows pencil icon. Clicking pencil icon allows user to edit the task. Once editing is done, a checkmark icon allows user to save the editing
// 6. During editing, press enter key to save the task -> add event listener to 'keyup' and check if it is 'enter' key
// 7. Close and reopen the application, it should keep all the previous tasks. // localStorage -> save to localStorage on each operation -> load from storage on initial load

// pencil html code: '&#9998;';
// checkmark html code: '&#10003;';

// hover and tab border color: pink

// model layer ——————————————————————————————————————————————————————————————————————————————————————————————————————
const tabs = {
    ALL: "ALL",
    ACTIVE: "ACTIVE",
    COMPLETED: "COMPLETED"
}

const model = {
    // todo {checked: boolean, value: string, id: string}
    todoList: [],
    // activeTab: tabs.ALL,
    editingTask: null
};

function createId() {
    return new Date().toISOString();
}

function getTodoList() {
    return model.todoList;
}

// controllers ————————————————————————————————————————————————————————————————————————————————————————————————————————

function activeItems() {
    const activeList = model.todoList.length > 0 ? model.todoList.filter(
        function (todo) { return !todo.checked }
    ) : [];
    return activeList;
}

function completedItems() {
    const completedList = model.todoList.length > 0 ? model.todoList.filter(
        function (todo) { return todo.checked }
    ) : [];
    return completedList;
}

function addNewTask() {
    const value = getAddInputValue();
    const checked = false;
    const newId = createId();
    const newTodo = {
        checked: checked,
        value: value,
        id: newId
    };
    if (value !== "") {
        model.todoList.push(newTodo);
        updateView();
    }
}

function deleteAllTasks() {
    model.todoList = [];
    updateView();
}

function deleteTaskById(id) {
    const filteredList = model.todoList.filter(function (todo) {
        return todo.id !== id;
    });
    model.todoList = filteredList;
    updateView();
}

function toggleTaskById(id) {
    const newList = model.todoList.map(function (todo) {
        if (todo.id === id) {
            todo.checked = !todo.checked;
            return todo;
        } else {
            return todo;
        }
    });
    model.todoList = newList;
    updateView();
}

function editItems(id, checked, value) {

}

function toggleAllTasks() {
    const newList = model.todoList.map(function (todo) {
        if (todo.checked === true) {
            return todo;
        } else {
            todo.checked = !todo.checked;
            return todo;
        }
    });
    model.todoList = newList;
    updateView();
}

function untoggleAllTasks() {
    const newList = model.todoList.map(function (todo) {
        if (todo.checked === true) {
            todo.checked = !todo.checked;
            return todo;
        } else {
            return todo;
        }
    });
    model.todoList = newList;
    updateView();
}

// views ———————————————————————————————————————————————————————————————————————————————————————————————————————————————

function getListContainer() {
    return document.querySelector(".list-container");
}

function createTaskNode(value, checked, id) {
    const li = document.createElement("li");
    const input = document.createElement("input");
    const span = document.createElement("span");
    const editInput = document.createElement("input");
    const divDel = document.createElement("div");
    const divEdi = document.createElement("div");
    const confirmButton = document.createElement("div");

    li.id = id;
    input.setAttribute("type", "checkbox");
    input.checked = checked; // DOM API to set checked status
    span.innerHTML = value;
    if (checked) {
        span.classList.add("checked");
    }
    span.classList.add("todoText");

    editInput.setAttribute("type", "input");
    editInput.classList.add("text-edit-input");

    divDel.innerHTML = "&#10005;";
    divDel.classList.add("delete-icon");

    divEdi.innerHTML = "&#9998;";
    divEdi.classList.add("pencil-icon");

    confirmButton.innerHTML = "&#10003;";
    confirmButton.classList.add("confirm-icon");


    li.appendChild(input);
    li.appendChild(span);
    li.appendChild(editInput);
    li.appendChild(divEdi);
    li.appendChild(divDel);
    li.appendChild(confirmButton);

    return li;
}

function displayActiveItems() {
    const listContainer = getListContainer();
    listContainer.innerHTML = "";
    const activeList = activeItems();
    activeList.forEach(function (todo) {
        const liNode = createTaskNode(todo.value, todo.checked, todo.id);
        listContainer.appendChild(liNode);
    });
}

function displayCompletedItems() {
    const listContainer = getListContainer();
    listContainer.innerHTML = "";
    const completedList = completedItems();
    console.log(completedList);
    completedList.forEach(function (todo) {
        const liNode = createTaskNode(todo.value, todo.checked, todo.id);
        listContainer.appendChild(liNode);
    });
}

function toggleTaskByTabs(tab) {
    switch (tab) {
        case tabs.ALL:
            updateView();
            break;
        case tabs.ACTIVE:
            displayActiveItems();
            break;
        case tabs.COMPLETED:
            displayCompletedItems();
    }
}

function updateLeftItemsCount() {
    const todoCount = document.querySelector(".todo-count");
    const active = activeItems();
    if (active.length > 1) {
        todoCount.innerHTML = active.length + " items left";
    } else {
        todoCount.innerHTML = active.length + " item left";
    }
}

function updateList() {
    const listContainer = getListContainer();
    listContainer.innerHTML = "";
    const todoList = getTodoList();
    todoList.forEach(function (todo) {
        const liNode = createTaskNode(todo.value, todo.checked, todo.id);
        listContainer.appendChild(liNode);
    });
}

function updateView() {
    updateList();
    updateLeftItemsCount();
    localStorage.setItem("TodoList", JSON.stringify(model.todoList));
}

function getOriginalModel() {
    const originalModel = localStorage.getItem("TodoList");
    model.todoList = JSON.parse(originalModel);
    updateView();
}


function getAddInputValue() {
    const input = document.querySelector(".text-input");
    const inputValue = input.value;
    input.value = "";
    return inputValue;
}

function handleContainerClick(e) {
    const target = e.target;
    if (target.classList.contains("delete-icon")) {
        // target is the delete icon div
        const li = target.parentNode;
        const taskId = li.id;
        deleteTaskById(taskId);
        return;
    }

    if (target.classList.contains("pencil-icon")) {
        const li = target.parentNode;
        const taskId = li.id;
        const inputValue = li.children[1].innerHTML;
        const i = document.querySelector(".text-edit-input");
        i.value = inputValue;
        li.classList.add("editMode");
        return;
    }

    if (target.classList.contains("confirm-icon")) {
        const li = target.parentNode;
        const inputValue = li.children[2].value;
        const i = document.querySelector(".todoText");
        i.textContent = inputValue;
        li.classList.remove("editMode");
        return;
    }

    if (target.tagName === "INPUT" && target.getAttribute("type") === "checkbox") {
        const li = target.parentNode;
        const taskId = li.id;
        toggleTaskById(taskId);
        return;
    }
}

function handleTabClick(e) {
    const target = e.target;
    if (target.tagName === "BUTTON" && target.getAttribute("id") === "allButton") {
        toggleTaskByTabs(tabs.ALL);
    }
    if (target.tagName === "BUTTON" && target.getAttribute("id") === "activeButton") {
        toggleTaskByTabs(tabs.ACTIVE);
    }
    if (target.tagName === "BUTTON" && target.getAttribute("id") === "completedButton") {
        toggleTaskByTabs(tabs.COMPLETED);
    }
}

function handleKeyEnter(e) {
    const addButton = document.querySelector("#addButton");
    if (e.keyCode === 13) {
        addButton.click();
    }
}

function toggleAllItems() {

}

function untoggleAllItems() {

}

function handleToggleAllClick(e) {
    const target = e.target.checked;
    console.log(target);
    if (target) {
        toggleAllTasks();
    } else {
        untoggleAllTasks();
    }
}

function loadEvents() {
    getOriginalModel();
    const addButton = document.querySelector("#addButton");
    const clearAllButton = document.querySelector("#clearButton");
    const listContainer = getListContainer();
    const input = document.querySelector(".text-input");
    const allButton = document.querySelector("#allButton");
    const activeButton = document.querySelector("#activeButton");
    const completedButton = document.querySelector("#completedButton");
    const toggleAllButton = document.querySelector("#toggle");
    const editButton = document.querySelector(".pencil-icon");
    const confirmButton = document.querySelector(".confirm-icon");

    addButton.addEventListener("click", addNewTask);
    clearAllButton.addEventListener("click", deleteAllTasks);
    listContainer.addEventListener("click", handleContainerClick);
    input.addEventListener('keyup', handleKeyEnter);
    allButton.addEventListener('click', handleTabClick);
    activeButton.addEventListener('click', handleTabClick);
    completedButton.addEventListener('click', handleTabClick);
    toggleAllButton.addEventListener('click', handleToggleAllClick);
    editButton.addEventListener('click', handleContainerClick);
    confirmButton.addEventListener('click', handleContainerClick);
}

loadEvents();
// updateLeftItemsCount();