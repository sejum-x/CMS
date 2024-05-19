//client
let tasks = [];
let taskId = 0;

const form = document.getElementById("todo-form");
const input = document.getElementById("todo-input");
const todoLane = document.getElementById("todo-lane");
const doingLane = document.getElementById("doing-lane");
const doneLane = document.getElementById("done-lane");

const messageBtn = document.getElementById('message-btn');

const renderTasks = () => {
    todoLane.innerHTML = '';
    doingLane.innerHTML = '';
    doneLane.innerHTML = '';

    const todoLabel = document.createElement('h2');
    todoLabel.textContent = 'TODO';
    const doingLabel = document.createElement('h2');
    doingLabel.textContent = 'DOING';
    const doneLabel = document.createElement('h2');
    doneLabel.textContent = 'DONE';

    todoLane.appendChild(todoLabel);
    doingLane.appendChild(doingLabel);
    doneLane.appendChild(doneLabel);

    tasks.forEach((task) => {
        const taskElement = createTaskElement(task);
        switch (task.stage) {
            case 'todo':
                todoLane.appendChild(taskElement);
                break;
            case 'doing':
                doingLane.appendChild(taskElement);
                break;
            case 'done':
                doneLane.appendChild(taskElement);
                break;
            default:
                console.error(`Unknown task stage: ${task.stage}`);
        }
    });



    console.log(tasks);
};

const createTaskElement = (task) => {
    const taskElement = document.createElement("div");
    taskElement.classList.add("task");
    taskElement.setAttribute("draggable", "true");
    taskElement.dataset.taskId = task.taskId; // Змінено з task.id на task.taskId

    const textElement = document.createElement("p");
    textElement.innerText = task.text;

    taskElement.appendChild(textElement);

    taskElement.addEventListener("dragstart", () => {
        taskElement.classList.add("is-dragging");
    });

    taskElement.addEventListener("dragend", () => {
        taskElement.classList.remove("is-dragging");
    });

// Додайте анімацію до кнопки message-btn
    messageBtn.classList.add('pulse');

    setTimeout(() => {
        // Зняти анімацію після певного часу (наприклад, після 1 секунди)
        messageBtn.classList.remove('pulse');
    }, 1000); // Час в мілісекундах

    return taskElement;
};


form.addEventListener("submit", (e) => {
    e.preventDefault();
    const value = input.value;

    if (!value) return;

    const newTask = {
        id: taskId++,
        text: value,
        importance: 'normal',
        stage: 'todo',
    };

    tasks.push(newTask);
    renderTasks();
    input.value = "";

    fetch('http://localhost:3000/tasks', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTask),
    })
        .then(response => response.json())
        .then(data => console.log('Task added on server:', data))
        .catch(error => console.error('Error adding task on server:', error));
});

const fetchTasks = () => {
    fetch('http://localhost:3000/tasks')
        .then(response => response.json())
        .then(data => {
            tasks = data.tasks;
            renderTasks();
        })
        .catch(error => console.error('Error:', error));
};

fetchTasks();

const droppables = document.querySelectorAll(".swim-lane");

droppables.forEach((zone) => {
    zone.addEventListener("dragover", (e) => {
        e.preventDefault();
    });

    zone.addEventListener("drop", (e) => {
        e.preventDefault();

        const curTask = document.querySelector(".is-dragging");
        if (!curTask) return;

        const taskId = curTask.dataset.taskId;

        let newStage;
        switch (zone.id) {
            case 'todo-lane':
                newStage = 'todo';
                break;
            case 'doing-lane':
                newStage = 'doing';
                break;
            case 'done-lane':
                newStage = 'done';
                break;
            default:
                console.error(`Unknown lane id: ${zone.id}`);
        }

        // Update the task's stage locally
        tasks[taskId].stage = newStage;

        // Remove the task element from its current lane
        curTask.parentNode.removeChild(curTask);

        // Append the task element to the new lane
        zone.appendChild(curTask);

        // Send the updated task data to the server
        fetch(`http://localhost:3000/tasks/${taskId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ stage: newStage }),
        })
            .then(response => response.json())
            .then(data => console.log('Task stage updated on server:', data))
            .catch(error => console.error('Error updating task stage on server:', error));
    });
});

document.getElementById('message-btn').addEventListener('mouseover', function() {
    const taskTODOList = document.getElementById('taskTODO');
    const todoTasks = tasks.filter(task => task.stage === 'todo');
    taskTODOList.innerHTML = '';
    todoTasks.forEach(task => {
        const taskItem = document.createElement('li');
        taskItem.textContent = task.text;
        taskTODOList.appendChild(taskItem);
    });
});





renderTasks();
