import React, { useState } from "react";
import TodoItem from "./TodoItem";
import TodoForm from "./TodoForm";

const TodoList = ({ todos, toggleTodo, deleteTodo, editTodo }) => {
    const [editingTodo, setEditingTodo] = useState(null);

    const startEditing = (todo) => {
        setEditingTodo(todo);
    };

    return (
        <div className="flex flex-col gap-3">
            {todos.map((todo) => (
                <TodoItem
                    key={todo.id}
                    todo={todo}
                    toggleTodo={toggleTodo}
                    deleteTodo={deleteTodo}
                    startEditing={startEditing}
                />
            ))}
            {editingTodo && (
                <TodoForm
                    editingTodo={editingTodo}
                    editTodo={editTodo}
                    addTodo={() => {}}
                />
            )}
        </div>
    );
};

export default TodoList;
