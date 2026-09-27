import React from "react";

const TodoItem = ({ todo, toggleTodo, deleteTodo, startEditing }) => {
    return (
        <div className="flex justify-between items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md mb-3">
            <div className="flex items-center gap-2">
                <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggleTodo(todo.id)}
                    className="cursor-pointer"
                />
                <span
                    className={`${
                        todo.completed ? "line-through text-gray-500" : ""
                    } dark:text-white`}
                >
                    {todo.text}
                </span>
            </div>
            <div className="flex gap-2">
                <button
                    onClick={() => startEditing(todo)}
                    className="p-2 text-sm text-blue-500 hover:text-blue-600 transition-all"
                >
                    Edit
                </button>
                <button
                    onClick={() => deleteTodo(todo.id)}
                    className="p-2 text-sm text-red-500 hover:text-red-600 transition-all"
                >
                    Delete
                </button>
            </div>
        </div>
    );
};

export default TodoItem;
