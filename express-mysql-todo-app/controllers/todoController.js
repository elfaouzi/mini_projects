const Todo = require('../models/Todo');

// Get all todos
exports.getAllTodos = async (req, res) => {
    try {
        const todos = await Todo.getAll();
        res.json({
            success: true,
            data: todos
        });
    } catch (error) {
        console.error('Error fetching todos:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching todos'
        });
    }
};

// Get single todo
exports.getTodoById = async (req, res) => {
    try {
        const { id } = req.params;
        const todo = await Todo.getById(id);
        
        if (!todo) {
            return res.status(404).json({
                success: false,
                message: 'Todo not found'
            });
        }

        res.json({
            success: true,
            data: todo
        });
    } catch (error) {
        console.error('Error fetching todo:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching todo'
        });
    }
};

// Create new todo
exports.createTodo = async (req, res) => {
    try {
        const { title, description } = req.body;

        if (!title) {
            return res.status(400).json({
                success: false,
                message: 'Title is required'
            });
        }

        const todo = new Todo(title, description);
        await todo.save();

        res.status(201).json({
            success: true,
            data: todo,
            message: 'Todo created successfully'
        });
    } catch (error) {
        console.error('Error creating todo:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating todo'
        });
    }
};

// Update todo
exports.updateTodo = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const updated = await Todo.update(id, updateData);

        if (!updated) {
            return res.status(404).json({
                success: false,
                message: 'Todo not found'
            });
        }

        const updatedTodo = await Todo.getById(id);
        res.json({
            success: true,
            data: updatedTodo,
            message: 'Todo updated successfully'
        });
    } catch (error) {
        console.error('Error updating todo:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating todo'
        });
    }
};

// Delete todo
exports.deleteTodo = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Todo.delete(id);

        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: 'Todo not found'
            });
        }

        res.json({
            success: true,
            message: 'Todo deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting todo:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting todo'
        });
    }
};

// Toggle todo completion
exports.toggleTodo = async (req, res) => {
    try {
        const { id } = req.params;
        const toggled = await Todo.toggleComplete(id);

        if (!toggled) {
            return res.status(404).json({
                success: false,
                message: 'Todo not found'
            });
        }

        const updatedTodo = await Todo.getById(id);
        res.json({
            success: true,
            data: updatedTodo,
            message: 'Todo status updated successfully'
        });
    } catch (error) {
        console.error('Error toggling todo:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating todo status'
        });
    }
};