import React, { useState } from "react";

const TodoForm = ({ addTodo, editTodo, editingTodo }) => {
    const [text, setText] = useState(editingTodo ? editingTodo.text : "");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingTodo) {
            editTodo({ id: editingTodo.id, text });
        } else {
            addTodo(text);
        }
        setText("");
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-3 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md"
        >
            <input
                type="text"
                placeholder="Enter a task..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                required
            />
            <button
                type="submit"
                className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all"
            >
                {editingTodo ? "Update Task" : "Add Task"}
            </button>
        </form>
    );
};

export default TodoForm;
