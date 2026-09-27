// Todo App Frontend JavaScript
class TodoApp {
    constructor() {
        this.todos = [];
        this.currentFilter = 'all';
        this.editingTodoId = null;
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadTodos();
    }

    bindEvents() {
        // Form submission
        document.getElementById('todoForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.createTodo();
        });

        // Filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.setFilter(e.target.dataset.filter);
            });
        });

        // Modal events
        document.querySelector('.close').addEventListener('click', () => {
            this.closeModal();
        });

        document.getElementById('cancelEdit').addEventListener('click', () => {
            this.closeModal();
        });

        document.getElementById('editForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.updateTodo();
        });

        // Close modal when clicking outside
        document.getElementById('editModal').addEventListener('click', (e) => {
            if (e.target.id === 'editModal') {
                this.closeModal();
            }
        });
    }

    async loadTodos() {
        try {
            this.showLoading(true);
            const response = await fetch('/api/todos');
            const data = await response.json();
            
            if (data.success) {
                this.todos = data.data;
                this.renderTodos();
                this.updateStats();
            } else {
                this.showToast('Error loading todos', 'error');
            }
        } catch (error) {
            console.error('Error loading todos:', error);
            this.showToast('Failed to load todos', 'error');
        } finally {
            this.showLoading(false);
        }
    }

    async createTodo() {
        const form = document.getElementById('todoForm');
        const formData = new FormData(form);
        
        const todoData = {
            title: formData.get('title').trim(),
            description: formData.get('description').trim()
        };

        if (!todoData.title) {
            this.showToast('Please enter a title', 'warning');
            return;
        }

        try {
            const response = await fetch('/api/todos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(todoData)
            });

            const data = await response.json();

            if (data.success) {
                this.showToast('Task created successfully!', 'success');
                form.reset();
                this.loadTodos();
            } else {
                this.showToast(data.message || 'Error creating task', 'error');
            }
        } catch (error) {
            console.error('Error creating todo:', error);
            this.showToast('Failed to create task', 'error');
        }
    }

    async updateTodo() {
        if (!this.editingTodoId) return;

        const form = document.getElementById('editForm');
        const formData = new FormData(form);
        
        const todoData = {
            title: formData.get('title').trim(),
            description: formData.get('description').trim()
        };

        if (!todoData.title) {
            this.showToast('Please enter a title', 'warning');
            return;
        }

        try {
            const response = await fetch(`/api/todos/${this.editingTodoId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(todoData)
            });

            const data = await response.json();

            if (data.success) {
                this.showToast('Task updated successfully!', 'success');
                this.closeModal();
                this.loadTodos();
            } else {
                this.showToast(data.message || 'Error updating task', 'error');
            }
        } catch (error) {
            console.error('Error updating todo:', error);
            this.showToast('Failed to update task', 'error');
        }
    }

    async deleteTodo(id) {
        if (!confirm('Are you sure you want to delete this task?')) {
            return;
        }

        try {
            const response = await fetch(`/api/todos/${id}`, {
                method: 'DELETE'
            });

            const data = await response.json();

            if (data.success) {
                this.showToast('Task deleted successfully!', 'success');
                this.loadTodos();
            } else {
                this.showToast(data.message || 'Error deleting task', 'error');
            }
        } catch (error) {
            console.error('Error deleting todo:', error);
            this.showToast('Failed to delete task', 'error');
        }
    }

    async toggleTodo(id) {
        try {
            const response = await fetch(`/api/todos/${id}/toggle`, {
                method: 'PATCH'
            });

            const data = await response.json();

            if (data.success) {
                this.showToast('Task status updated!', 'success');
                this.loadTodos();
            } else {
                this.showToast(data.message || 'Error updating task status', 'error');
            }
        } catch (error) {
            console.error('Error toggling todo:', error);
            this.showToast('Failed to update task status', 'error');
        }
    }

    openEditModal(todo) {
        this.editingTodoId = todo.id;
        document.getElementById('editTitle').value = todo.title;
        document.getElementById('editDescription').value = todo.description || '';
        document.getElementById('editModal').style.display = 'block';
    }

    closeModal() {
        document.getElementById('editModal').style.display = 'none';
        this.editingTodoId = null;
    }

    setFilter(filter) {
        this.currentFilter = filter;
        
        // Update active filter button
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-filter="${filter}"]`).classList.add('active');
        
        this.renderTodos();
    }

    renderTodos() {
        const container = document.getElementById('todosContainer');
        const emptyState = document.getElementById('emptyState');
        
        // Filter todos based on current filter
        let filteredTodos = this.todos;
        switch (this.currentFilter) {
            case 'pending':
                filteredTodos = this.todos.filter(todo => !todo.completed);
                break;
            case 'completed':
                filteredTodos = this.todos.filter(todo => todo.completed);
                break;
            default:
                filteredTodos = this.todos;
        }

        if (filteredTodos.length === 0) {
            container.innerHTML = '';
            emptyState.style.display = 'block';
            return;
        }

        emptyState.style.display = 'none';
        
        container.innerHTML = filteredTodos.map(todo => `
            <div class="todo-item ${todo.completed ? 'completed' : ''}" data-id="${todo.id}">
                <div class="todo-header">
                    <div class="todo-content">
                        <h3>${this.escapeHtml(todo.title)}</h3>
                        ${todo.description ? `<p>${this.escapeHtml(todo.description)}</p>` : ''}
                    </div>
                    <div class="todo-actions">
                        <button class="btn ${todo.completed ? 'btn-warning' : 'btn-success'}" 
                                onclick="app.toggleTodo(${todo.id})" 
                                title="${todo.completed ? 'Mark as pending' : 'Mark as completed'}">
                            <i class="fas ${todo.completed ? 'fa-undo' : 'fa-check'}"></i>
                        </button>
                        <button class="btn btn-primary" onclick="app.openEditModal(${JSON.stringify(todo).replace(/"/g, '&quot;')})" title="Edit task">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-danger" onclick="app.deleteTodo(${todo.id})" title="Delete task">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                <div class="todo-meta">
                    <span class="status-badge ${todo.completed ? 'completed' : 'pending'}">
                        ${todo.completed ? 'Completed' : 'Pending'}
                    </span>
                    <span style="float: right;">
                        Created: ${this.formatDate(todo.created_at)}
                    </span>
                </div>
            </div>
        `).join('');
    }

    updateStats() {
        const total = this.todos.length;
        const completed = this.todos.filter(todo => todo.completed).length;
        const pending = total - completed;

        document.getElementById('totalTasks').textContent = total;
        document.getElementById('completedTasks').textContent = completed;
        document.getElementById('pendingTasks').textContent = pending;
    }

    showLoading(show) {
        const loading = document.getElementById('loadingIndicator');
        const container = document.getElementById('todosContainer');
        
        if (show) {
            loading.style.display = 'block';
            container.style.display = 'none';
        } else {
            loading.style.display = 'none';
            container.style.display = 'block';
        }
    }

    showToast(message, type = 'success') {
        const toastContainer = document.getElementById('toastContainer');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <strong>${type === 'error' ? 'Error!' : type === 'warning' ? 'Warning!' : 'Success!'}</strong>
            ${message}
        `;

        toastContainer.appendChild(toast);

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 5000);

        // Make toast clickable to dismiss
        toast.addEventListener('click', () => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        });
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new TodoApp();
});

// Handle keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // ESC to close modal
    if (e.key === 'Escape') {
        const modal = document.getElementById('editModal');
        if (modal.style.display === 'block') {
            window.app.closeModal();
        }
    }
    
    // Ctrl/Cmd + Enter to submit forms
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        const activeForm = document.querySelector('form:focus-within');
        if (activeForm) {
            activeForm.dispatchEvent(new Event('submit'));
        }
    }
});