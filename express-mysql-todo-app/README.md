# Professional Todo App

A modern, feature-rich todo application built with Express.js and MySQL, featuring a clean and responsive design.

## Features

- ✅ **Full CRUD Operations** - Create, read, update, and delete todos
- 🔄 **Toggle Completion** - Mark tasks as completed or pending
- 🔍 **Smart Filtering** - Filter todos by all, pending, or completed status
- 📊 **Real-time Statistics** - Track your productivity with live stats
- 📱 **Responsive Design** - Works perfectly on desktop, tablet, and mobile
- 🎨 **Modern UI/UX** - Clean, professional interface with smooth animations
- 💾 **Persistent Storage** - All data stored securely in MySQL database
- ⚡ **Professional Architecture** - Clean, modular code structure

## Project Structure

```
mini-todo-app/
├── config/
│   └── database.js          # Database configuration and connection
├── controllers/
│   └── todoController.js    # Business logic for todo operations
├── models/
│   └── Todo.js             # Todo data model and database operations
├── routes/
│   └── todoRoutes.js       # API route definitions
├── public/
│   ├── css/
│   │   └── style.css       # Modern CSS styling
│   ├── js/
│   │   └── app.js          # Frontend JavaScript functionality
│   └── index.html          # Main HTML page
├── server.js               # Main server file
├── package.json            # Project dependencies and scripts
└── README.md              # Project documentation
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/todos` | Get all todos |
| GET | `/api/todos/:id` | Get a specific todo |
| POST | `/api/todos` | Create a new todo |
| PUT | `/api/todos/:id` | Update a todo |
| DELETE | `/api/todos/:id` | Delete a todo |
| PATCH | `/api/todos/:id/toggle` | Toggle todo completion status |

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MySQL server
- npm or yarn package manager

### Database Setup
1. Create a MySQL database named `todo_db`:
```sql
CREATE DATABASE todo_db;
```

2. Update database credentials in `config/database.js` if needed:
```javascript
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'todo_db'
};
```

### Installation Steps

1. **Clone or download the project**
2. **Install dependencies:**
```bash
npm install
```

3. **Install nodemon for development (optional):**
```bash
npm install -g nodemon
# or
npm install --save-dev nodemon
```

4. **Start the server:**
```bash
# Production mode
npm start

# Development mode (with auto-restart)
npm run dev
```

5. **Access the application:**
Open your browser and navigate to `http://localhost:3000`

## Database Schema

The application automatically creates the required table on first run:

```sql
CREATE TABLE todos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## Usage

### Adding a New Todo
1. Enter a title in the "Task Title" field
2. Optionally add a description
3. Click "Add Task" or press Ctrl+Enter

### Managing Todos
- **Complete/Uncomplete**: Click the green checkmark or yellow undo button
- **Edit**: Click the blue edit button to modify the todo
- **Delete**: Click the red trash button to remove the todo

### Filtering
Use the filter buttons to view:
- **All**: Show all todos
- **Pending**: Show only incomplete todos
- **Completed**: Show only completed todos

### Keyboard Shortcuts
- **Ctrl/Cmd + Enter**: Submit the current form
- **Escape**: Close any open modal

## Technology Stack

### Backend
- **Express.js** - Web application framework
- **MySQL2** - MySQL client for Node.js
- **Body-parser** - Request body parsing middleware

### Frontend
- **Vanilla JavaScript** - Modern ES6+ features
- **CSS3** - Responsive design with flexbox and grid
- **Font Awesome** - Icons and visual elements

### Architecture Patterns
- **MVC Pattern** - Separation of concerns
- **RESTful API** - Standard HTTP methods and status codes
- **Modular Design** - Clean, maintainable code structure
- **Error Handling** - Comprehensive error management
- **Input Validation** - Client and server-side validation

## Features in Detail

### Professional Code Organization
- **Controllers**: Handle business logic
- **Models**: Manage data operations
- **Routes**: Define API endpoints
- **Configuration**: Centralized settings
- **Static Files**: Organized frontend assets

### User Experience
- **Loading States**: Visual feedback during operations
- **Toast Notifications**: Success/error messages
- **Responsive Design**: Mobile-first approach
- **Smooth Animations**: Enhanced user interactions
- **Accessibility**: Keyboard navigation support

### Data Management
- **Connection Pooling**: Optimized database performance
- **Error Recovery**: Graceful error handling
- **Data Validation**: Input sanitization and validation
- **SQL Injection Protection**: Parameterized queries

## Development

### Adding New Features
1. Create route in `routes/todoRoutes.js`
2. Add controller method in `controllers/todoController.js`
3. Update model if needed in `models/Todo.js`
4. Add frontend functionality in `public/js/app.js`

### Customization
- **Styling**: Modify `public/css/style.css`
- **Database**: Update `config/database.js`
- **API**: Extend controllers and routes
- **Frontend**: Enhance `public/js/app.js`

## Production Deployment

For production deployment:

1. **Environment Variables**: Set up proper environment configuration
2. **Database**: Use production MySQL instance
3. **Security**: Add authentication and authorization
4. **Performance**: Implement caching and optimization
5. **Monitoring**: Add logging and error tracking

## License

ISC License - Feel free to use this project for learning and development purposes.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

**Built with ❤️ using Express.js and MySQL**