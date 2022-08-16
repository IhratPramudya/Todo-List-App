const submitForm = document.getElementById('submit-form');
const valueTask = document.getElementById('tugas');
const valueTime = document.getElementById('tanggal');
const PREVENT = 'REQUIREDAWEKSI';
let todos = [];
const KEY_SESSION_TODO_LIST = 'todo_list_storage';


function generateId(){
    return +new Date()
}

function dataTodo(id, task, timestamp, isComplete){
    return {
        id,
        task,
        timestamp,
        isComplete
    }
}




function addTodo(){
    const valueTaskAdd = valueTask.value;
    const valueTimeStamp = valueTime.value;

    const generatedID = generateId();

    const dataObjekTodo = dataTodo(generatedID,valueTaskAdd,valueTimeStamp, false);

    todos.push(dataObjekTodo);
    document.dispatchEvent(new Event(PREVENT));
}


console.log(todos);
function makeTodo(todosObjek){
    const contentTask = document.createElement('h4');
    contentTask.innerText = todosObjek.task
    const contentDate = document.createElement('p');
    contentDate.innerText = todosObjek.timestamp
    const containerLeft = document.createElement('div');
    containerLeft.append(contentTask,contentDate);
    containerLeft.classList.add('content-left');

    const containerControl = document.createElement('div');
    containerControl.append(containerLeft);
    containerControl.classList.add('control');
    containerControl.setAttribute('id', `todos->${todosObjek.id}`)

    if(todosObjek.isComplete == true){
       
        const undoButton = document.createElement('span');
        undoButton.innerText = 'refresh';
        undoButton.classList.add('material-symbols-outlined');


        const deleteButton = document.createElement('span');
        deleteButton.innerText = 'delete';
        deleteButton.classList.add('material-symbols-outlined');


        const containerright = document.createElement('div');
        containerright.append(deleteButton,undoButton);
        containerright.classList.add('content-right');


        containerControl.appendChild(containerright);

        undoButton.addEventListener('click', function(){
            undoIscomplete(todosObjek.id);
        })

        deleteButton.addEventListener('click', function(){
            deleteIscomplete(todosObjek.id);
            dataStorage(todosObjek);
            
        })
    }else if(todosObjek.isComplete == false){
        const checkButton = document.createElement('span');
        checkButton.classList.add('material-symbols-outlined');
        checkButton.innerText = 'check_circle';
        const containerright = document.createElement('div');
        containerright.append(checkButton);
        containerright.classList.add('content-right');
        containerControl.append(containerright);

        checkButton.addEventListener('click', function(){
            completeCheckIscomplete(todosObjek.id);
        })

    }

    return containerControl;
}

function checkDataStorage(){
    return typeof(Storage) != 'undefined';
}




function dataStorage(todosObjek){
    let dataHistory = null;
    if(checkDataStorage()){
        if(sessionStorage.getItem(KEY_SESSION_TODO_LIST) == null){
            dataHistory = []
        }else{
            dataHistory = JSON.parse(sessionStorage.getItem(KEY_SESSION_TODO_LIST));
        }
        
        dataHistory.unshift(todosObjek);

        if(dataHistory.length > 10){
            dataHistory.pop()
        }

        sessionStorage.setItem(KEY_SESSION_TODO_LIST, JSON.stringify(dataHistory))
    }else{
        console.log('Tidak mendukung web storage');
    }
}

function dataHistory(){
    if(checkDataStorage()){
        return JSON.parse(sessionStorage.getItem(KEY_SESSION_TODO_LIST)) || [];
    }else{
        return [];
    }
}



function renderDataList(){
    const history = dataHistory();
    const listTodoDelete = document.getElementById('add_control_delete');
    listTodoDelete.innerText = '';

    for(let histories of history){
        const elementTitle = document.createElement('h4');
        elementTitle.innerText = histories.task;
        const elementDate = document.createElement('p');
        elementDate.innerText = histories.timestamp;

        const containerLeft = document.createElement('div');
        containerLeft.classList.add('content-left');
        containerLeft.append(elementTitle,elementDate);

        const contentRight = document.createElement('div');
        contentRight.classList.add('content-right');

        const ButtonRestore = document.createElement('span');
        ButtonRestore.classList.add('material-symbols-outlined');
        ButtonRestore.innerText = 'restore_from_trash';

        contentRight.append(ButtonRestore);

        const control = document.createElement('div');
        control.classList.add('control');
        control.append(containerLeft,contentRight);

        const container = document.getElementById('add_control_delete');
        container.append(control);

    }   
}

renderDataList();


function undoIscomplete(todosID){
    const todoLIstTodos = findTodo(todosID);
    if(todoLIstTodos == null){
        return;
    }

    todoLIstTodos.isComplete = false;
    document.dispatchEvent(new Event(PREVENT));
}



function deleteIscomplete(todoID){
    const indexTodos = findIndexTodos(todoID)
    if(indexTodos == -1){
        return
    }

    todos.splice(indexTodos, 1);
    document.dispatchEvent(new Event(PREVENT));
}

function findIndexTodos(todoID){
    for(let index in todos){
        if(todos[index].id == todoID){
            return index;
        }
        return -1;
    }

    document.dispatchEvent(new Event(PREVENT));
}


function completeCheckIscomplete(todoID){
   const todoLIstTodos = findTodo(todoID)
   if(todoLIstTodos == null){
       return;
   }

   todoLIstTodos.isComplete = true;
   
   document.dispatchEvent(new Event(PREVENT));
   
}

function findTodo(todosId){
    for(let itemTodos of todos){
        if(todosId == itemTodos.id){
            return itemTodos;
        }else{
            return null;
        }
    }
}



function addTodoLIST(objectsTodos){
    const addControl = document.getElementById('add_control');
    const add_control_complite = document.getElementById('add_control_complite');

    addControl.innerText = '';
    add_control_complite.innerText = '';

    
    for(let itemTodos of objectsTodos){
        const addTodoListOBJ = makeTodo(itemTodos)
        if(itemTodos.isComplete == true){
            add_control_complite.append(addTodoListOBJ);
        }else if (itemTodos.isComplete == false){
            addControl.append(addTodoListOBJ);
        }   
    }
}



document.addEventListener(PREVENT, function(){
    addTodoLIST(todos);
})


document.addEventListener('DOMContentLoaded', function(){
    submitForm.addEventListener('submit', function(event){
        event.preventDefault();
        addTodo();
    })
})
