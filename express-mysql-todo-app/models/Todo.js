const { pool } = require('../config/database');

class Todo {
    constructor(title, description, completed = false) {
        this.title = title;
        this.description = description;
        this.completed = completed;
    }

    // Get all todos
    static async getAll() {
        try {
            const [rows] = await pool.execute(
                'SELECT * FROM todos ORDER BY created_at DESC'
            );
            return rows;
        } catch (error) {
            throw error;
        }
    }

    // Get todo by ID
    static async getById(id) {
        try {
            const [rows] = await pool.execute(
                'SELECT * FROM todos WHERE id = ?',
                [id]
            );
            return rows[0];
        } catch (error) {
            throw error;
        }
    }

    // Create new todo
    async save() {
        try {
            const [result] = await pool.execute(
                'INSERT INTO todos (title, description, completed) VALUES (?, ?, ?)',
                [this.title, this.description, this.completed]
            );
            this.id = result.insertId;
            return this;
        } catch (error) {
            throw error;
        }
    }

    // Update todo
    static async update(id, updateData) {
        try {
            const fields = [];
            const values = [];

            if (updateData.title !== undefined) {
                fields.push('title = ?');
                values.push(updateData.title);
            }
            if (updateData.description !== undefined) {
                fields.push('description = ?');
                values.push(updateData.description);
            }
            if (updateData.completed !== undefined) {
                fields.push('completed = ?');
                values.push(updateData.completed);
            }

            if (fields.length === 0) {
                throw new Error('No fields to update');
            }

            values.push(id);

            const [result] = await pool.execute(
                `UPDATE todos SET ${fields.join(', ')} WHERE id = ?`,
                values
            );

            return result.affectedRows > 0;
        } catch (error) {
            throw error;
        }
    }

    // Delete todo
    static async delete(id) {
        try {
            const [result] = await pool.execute(
                'DELETE FROM todos WHERE id = ?',
                [id]
            );
            return result.affectedRows > 0;
        } catch (error) {
            throw error;
        }
    }

    // Toggle completion status
    static async toggleComplete(id) {
        try {
            const [result] = await pool.execute(
                'UPDATE todos SET completed = NOT completed WHERE id = ?',
                [id]
            );
            return result.affectedRows > 0;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Todo;