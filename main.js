document.addEventListener('DOMContentLoaded', function () {
    const logoutButton = document.getElementById('logout-button');
    const todoList = document.getElementById('todo-list');
    const newTodoForm = document.getElementById('new-todo-form');
    const nameInput = document.getElementById('name');

    // Assuming you have stored the user information, including user_id, in localStorage during the login process
    const userId = localStorage.getItem('user_id');

    // Check if the user is authenticated
    if (!userId) {
        // Redirect to login page or handle unauthorized access
        window.location.href = 'login.html'; // Update with your login page
    }

    // Fetch and display tasks for the signed-in user
    fetchTasks();

    // Event listener for new todo form submission
    newTodoForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const content = document.getElementById('content').value;
        const category = document.querySelector('input[name="category"]:checked').value;

        // Create a new task for the signed-in user
        fetch(`https://657c8e02853beeefdb99a1d3.mockapi.io/users/${userId}/tasks`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                content: content,
                category: category,
            }),
        })
            .then(response => response.json())
            .then(newTask => {
                // Save the task to localStorage
                saveTask(newTask);
                // Display the new task
                displayTask(newTask);
                // Clear the form
                newTodoForm.reset();
            })
            .catch(error => {
                console.error('Error adding new task:', error);
                // Handle error
            });
    });

    // Logout button event listener
    logoutButton.addEventListener('click', function () {
        // Clear user information from localStorage and redirect to the login page
        localStorage.removeItem('user_id');
        window.location.href = 'login.html'; // Update with your login page
    });

    // Function to fetch and display tasks for the signed-in user
	function fetchTasks() {
		// Fetch tasks from the server to update the list
		fetch(`https://657c8e02853beeefdb99a1d3.mockapi.io/users/${userId}/tasks`)
			.then(response => response.json())
			.then(tasks => {
				// Update tasks in localStorage
				localStorage.setItem('tasks', JSON.stringify(tasks));

				// Clear the current task list in the UI
				todoList.innerHTML = '';

				// Display tasks in the todoList
				tasks.forEach(task => {
					displayTask(task);
				});
			})
			.catch(error => {
				console.error('Error fetching tasks:', error);
				// Handle error
			});
	}


		// Function to save a task to localStorage
		function saveTask(task) {
			const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
			savedTasks.push(task);
			localStorage.setItem('tasks', JSON.stringify(savedTasks));
		}

		// Function to display tasks in the todoList
function displayTask(task) {
    const taskItem = document.createElement('div');
    taskItem.className = 'task';
    taskItem.innerHTML = `
        <p>${task.content}</p>
        <span class="category ${task.category}">${task.category}</span>
        <button class="delete-button" data-task-id="${task.id}">Delete</button>
        <button class="edit-button" data-task-id="${task.id}">Edit</button>
        <button class="save-button" data-task-id="${task.id}" style="display: none;">Save</button>
    `;
    todoList.appendChild(taskItem);

    // Attach event listener for the delete button
    const deleteButton = taskItem.querySelector('.delete-button');
    deleteButton.addEventListener('click', function () {
        const taskId = this.getAttribute('data-task-id');
        deleteTask(taskId);
    });

    // Attach event listener for the edit button
    const editButton = taskItem.querySelector('.edit-button');
    editButton.addEventListener('click', function () {
        const taskId = this.getAttribute('data-task-id');
        editTask(taskId);
    });

    // Attach event listener for the save button
    const saveButton = taskItem.querySelector('.save-button');
    saveButton.addEventListener('click', function () {
        const taskId = this.getAttribute('data-task-id');
        updateTask(taskId);
    });
}

// Function to edit a task
function editTask(taskId) {
    // Fetch the task data for editing
    fetch(`https://657c8e02853beeefdb99a1d3.mockapi.io/users/${userId}/tasks/${taskId}`)
        .then(response => response.json())
        .then(task => {
            // Populate the input fields with the task data
            document.getElementById('content').value = task.content;
            const categoryRadio = document.querySelector(`input[name="category"][value="${task.category}"]`);
            if (categoryRadio) {
                categoryRadio.checked = true;
            }

            // Show the "Save" button
            const saveButton = document.querySelector(`.save-button[data-task-id="${taskId}"]`);
            saveButton.style.display = 'inline-block';

            // Add an event listener for the save button to update the task
            saveButton.addEventListener('click', function () {
                const content = document.getElementById('content').value;
                const category = document.querySelector('input[name="category"]:checked').value;

                // Make AJAX request to update the task
                fetch(`https://657c8e02853beeefdb99a1d3.mockapi.io/users/${userId}/tasks/${taskId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        content: content,
                        category: category,
                    }),
                })
                    .then(response => response.json())
                    .then(updatedTask => {
                        // Update the content of the existing task element in the UI
                        const taskElement = document.querySelector(`.task[data-task-id="${taskId}"]`);
                        taskElement.querySelector('p').textContent = updatedTask.content;
                        taskElement.querySelector('.category').className = `category ${updatedTask.category}`;
                        taskElement.querySelector('.category').textContent = updatedTask.category;

                        // Hide the "Save" button after the update
                        saveButton.style.display = 'none';

                        // Clear the form
                        clearForm();
                    })
                    .catch(error => {
                        console.error('Error updating task:', error);
                        // Handle error
                    });
            });
        })
        .catch(error => {
            console.error('Error fetching task for editing:', error);
            // Handle error
        });
}

// Function to update a task
function updateTask(taskId) {
    const content = document.getElementById('content').value;
    const category = document.querySelector('input[name="category"]:checked').value;

    // Make AJAX request to update the task
    fetch(`https://657c8e02853beeefdb99a1d3.mockapi.io/users/${userId}/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            content: content,
            category: category,
        }),
    })
        .then(response => response.json())
        .then(updatedTask => {
            // Update the task in the UI
            const taskElement = document.querySelector(`[data-task-id="${taskId}"]`);
            taskElement.querySelector('p').textContent = updatedTask.content;
            taskElement.querySelector('.category').className = `category ${updatedTask.category}`;
            taskElement.querySelector('.category').textContent = updatedTask.category;

            // Optionally, hide the "Save" button after the update
            const saveButton = document.querySelector(`.save-button[data-task-id="${taskId}"]`);
            saveButton.style.display = 'none';

            // Clear the form
            clearForm();
        })
        .catch(error => {
            console.error('Error updating task:', error);
            // Handle error
        });
}

// Function to clear the form
function clearForm() {
    document.getElementById('content').value = '';
    const categoryRadios = document.querySelectorAll('input[name="category"]');
    categoryRadios.forEach(radio => (radio.checked = false));
}


	// Function to delete a task
	function deleteTask(taskId) {
		// Get the task element to remove it from the UI
		const taskElement = document.querySelector(`[data-task-id="${taskId}"]`);

		// Make AJAX request to delete the task
		fetch(`https://657c8e02853beeefdb99a1d3.mockapi.io/users/${userId}/tasks/${taskId}`, {
			method: 'DELETE',
		})
			.then(response => {
				if (response.ok) {
					// Remove the task element from the UI
					taskElement.remove();
					// Remove the task from localStorage
					removeTaskFromLocalStorage(taskId);
					
					// Fetch tasks to update the UI
					fetchTasks();
				} else {
					console.error('Error deleting task:', response.statusText);
					// Handle error
				}
			})
			.catch(error => {
				console.error('Delete task error:', error);
				// Handle error
			});
	}

	// Function to remove a task from localStorage
	function removeTaskFromLocalStorage(taskId) {
		const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
		const updatedTasks = savedTasks.filter(task => task.id !== taskId);
		localStorage.setItem('tasks', JSON.stringify(updatedTasks));
	}
});
