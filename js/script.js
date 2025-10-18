/// Database Simulation (+ simple persistence)
let tasksDb = [];
const STORAGE_KEY = 'tasksDb';

// Load from localStorage if exists
try {
  const saved = localStorage.getItem(STORAGE_KEY);
  tasksDb = saved ? JSON.parse(saved) : [];
} catch {
  tasksDb = [];
}

function saveDb() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasksDb));
  } catch {}
}

function addTask() {
  const taskInput = document.getElementById('todo-input');
  const taskDate  = document.getElementById('todo-date');

  if (validateInput(taskInput.value, taskDate.value)) {
    const newTask = {
      id: Date.now(),
      task: taskInput.value.trim(),
      date: taskDate.value.trim()
    };

    /// Add to database
    tasksDb.push(newTask);
    saveDb();

    // Clear inputs
    taskInput.value = '';
    taskDate.value  = '';

    renderTasks();
  }
}

function renderTasks(list = tasksDb) {
  const taskList = document.getElementById('task-list');
  const emptyState = document.getElementById('empty-state');

  // Reset list
  taskList.innerHTML = '';

  if (!list || list.length === 0) {
    // Show empty state
    const li = document.createElement('li');
    li.className = 'text-gray-500 italic';
    li.textContent = 'No task found';
    taskList.appendChild(li);
    return;
  }

  // Render items
  list.forEach((taskObj) => {
    const li = document.createElement('li');
    li.className = 'flex items-center gap-2';

    const text = document.createElement('span');
    text.textContent = `${taskObj.task} - ${taskObj.date}`;

    // (Optional) single delete button for each item
    const delBtn = document.createElement('button');
    delBtn.textContent = '×';
    delBtn.title = 'Delete task';
    delBtn.className = 'ml-2 px-2 py-0.5 bg-red-500 text-white rounded';
    delBtn.onclick = () => {
      tasksDb = tasksDb.filter(t => t.id !== taskObj.id);
      saveDb();
      renderTasks();
    };

    li.appendChild(text);
    li.appendChild(delBtn);
    taskList.appendChild(li);
  });
}

function deleteAll() {
  if (tasksDb.length === 0) return;
  const ok = confirm('Delete all tasks?');
  if (!ok) return;
  tasksDb = [];
  saveDb();
  renderTasks();
}

function filterTasks() {
  // Simple filter prompt: by date (YYYY-MM-DD) or keyword in task
  const criteria = prompt('Filter by date (YYYY-MM-DD) or keyword in task. Leave empty to show all:','');
  if (criteria === null) return; // user cancelled
  const q = criteria.trim();
  if (q === '') {
    renderTasks(); // show all
    return;
  }
  const filtered = tasksDb.filter(t => 
    t.date === q || t.task.toLowerCase().includes(q.toLowerCase())
  );
  renderTasks(filtered);
}

function validateInput(task, date) {
  if (task.trim() === '' || date.trim() === '') {
    alert('Please enter both task and due date.');
    return false;
  }
  return true;
}

// Wire up buttons (in case inline handlers are removed later)
document.getElementById('filter-button')?.addEventListener('click', filterTasks);
document.getElementById('delete-all-button')?.addEventListener('click', deleteAll);

// Initial render
renderTasks();
