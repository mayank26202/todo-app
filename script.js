const todoInput = document.getElementById('todoInput');
const addTodoBtn = document.getElementById('addTodoBtn');
const todoList = document.getElementById('todoList');

addTodoBtn.addEventListener('click', addTodo);
todoInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        addTodo();
    }
});

function addTodo() {
    const todoText = todoInput.value.trim();
    if (todoText === '') return;

    const existingTasks = Array.from(document.querySelectorAll('.task-text')).map(span => span.textContent.toLowerCase());
    if (existingTasks.includes(todoText.toLowerCase())) {
        showWarning(`"${todoText}" already exists!`);
        todoInput.value = '';
        return;
    }

    const li = document.createElement('li');
    li.setAttribute('draggable', 'true');
    li.classList.add('fade-in');

    const taskSpan = document.createElement('span');
    taskSpan.textContent = todoText;
    taskSpan.className = 'task-text';

    const btnWrapper = document.createElement('div');
    btnWrapper.className = 'btn-wrapper';

    const checkBtn = document.createElement('button');
    checkBtn.textContent = '✔';
    checkBtn.className = 'check-btn';
    checkBtn.addEventListener('click', () => {
        taskSpan.classList.toggle('completed');
        saveTasksToStorage();
    });

    const editBtn = document.createElement('button');
    editBtn.textContent = 'Edit';
    editBtn.className = 'edit-btn';
    editBtn.addEventListener('click', () => {
        const newText = prompt('Edit your task:', taskSpan.textContent);
        if (newText !== null) {
            const trimmed = newText.trim();
            if (trimmed && !existingTasks.includes(trimmed.toLowerCase())) {
                taskSpan.textContent = trimmed;
                saveTasksToStorage();
            } else {
                showWarning(`Invalid or duplicate task name!`);
            }
        }
    });

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = '❌';
    deleteBtn.className = 'delete-btn';
    deleteBtn.addEventListener('click', () => {
        li.classList.add('fade-out');
        setTimeout(() => {
            li.remove();
            saveTasksToStorage();
        }, 300);
    });

    btnWrapper.appendChild(checkBtn);
    btnWrapper.appendChild(deleteBtn);
    btnWrapper.appendChild(editBtn);

    li.appendChild(taskSpan);
    li.appendChild(btnWrapper);

    todoList.appendChild(li);
    todoInput.value = '';
    saveTasksToStorage();
}

const clearAllBtn = document.getElementById('clearAllBtn');

clearAllBtn.addEventListener('click', () => {
    const confirmClear = confirm('Are you sure you want to delete all tasks?');
    if (confirmClear) {
        todoList.innerHTML = '';
        localStorage.removeItem('todos');
        updateTaskCount(); // update task count if implemented
    }
});

function showWarning(message) {
    let warning = document.getElementById('warningMessage');
    if (!warning) {
        warning = document.createElement('div');
        warning.id = 'warningMessage';
        warning.style.position = 'fixed';
        warning.style.bottom = '20px';
        warning.style.left = '50%';
        warning.style.transform = 'translateX(-50%)';
        warning.style.backgroundColor = '#ffdddd';
        warning.style.color = '#a00';
        warning.style.padding = '10px 20px';
        warning.style.border = '1px solid #a00';
        warning.style.borderRadius = '5px';
        warning.style.boxShadow = '0 2px 6px rgba(0,0,0,0.2)';
        warning.style.fontSize = '14px';
        warning.style.zIndex = 9999;
        document.body.appendChild(warning);
    }

    warning.textContent = message;
    warning.style.display = 'block';
    warning.classList.add('shake');

    setTimeout(() => {
        warning.classList.remove('shake');
        warning.style.display = 'none';
    }, 2500);
}




function saveTasksToStorage() {
    const allTasks = Array.from(todoList.children).map(li => {
        const text = li.querySelector('.task-text').textContent;
        const completed = li.querySelector('.task-text').classList.contains('completed');
        return { text, completed };
    });
    localStorage.setItem('todos', JSON.stringify(allTasks));
}

function loadTasksFromStorage() {
    const stored = localStorage.getItem('todos');
    if (stored) {
        const tasks = JSON.parse(stored);
        tasks.forEach(task => {
            todoInput.value = task.text;
            addTodo();
            const lastLi = todoList.lastChild;
            if (task.completed) {
                lastLi.querySelector('.task-text').classList.add('completed');
            }
        });
    }
}

window.addEventListener('DOMContentLoaded', loadTasksFromStorage);


const filterButtons = document.querySelectorAll('.filter-btn');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        document.querySelector('.filter-btn.active')?.classList.remove('active');
        button.classList.add('active');

        const filter = button.getAttribute('data-filter');
        const tasks = document.querySelectorAll('#todoList li');

        tasks.forEach(task => {
            const isCompleted = task.querySelector('.task-text').classList.contains('completed');
            
            if (filter === 'all') {
                task.style.display = 'flex';
            } else if (filter === 'completed') {
                task.style.display = isCompleted ? 'flex' : 'none';
            } else if (filter === 'pending') {
                task.style.display = !isCompleted ? 'flex' : 'none';
            }
        });
    });
});


const themeToggleBtn = document.getElementById('themeToggleBtn');
const body = document.body;

// Load from localStorage on startup
if (localStorage.getItem('theme') === 'dark') {
    body.classList.add('dark-mode');
    themeToggleBtn.textContent = '☀️ Light Mode';
} else {
    body.classList.add('light-mode');
}

themeToggleBtn.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    body.classList.toggle('light-mode');

    const isDark = body.classList.contains('dark-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    themeToggleBtn.textContent = isDark ? '☀️ Light Mode' : '🌙 Dark Mode';
});
