# Library Management System - Python Backend

This is the Python Flask backend for the Library Management System. It provides RESTful API endpoints for user authentication, book management, borrowing, and reservations.

## Features

- **User Management**: Student and faculty registration, authentication, and profile management
- **Book Management**: CRUD operations for books, search, and filtering
- **Borrowing System**: Book borrowing, returns, and due date management
- **Reservation System**: Book reservations with expiry dates
- **Admin Panel**: Administrative functions for librarians
- **Database**: SQLite database with SQLAlchemy ORM

## Prerequisites

- Python 3.7 or higher
- pip (Python package installer)

## Installation

1. **Clone or download the project files**

2. **Install Python dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Run the application**:
   ```bash
   python app.py
   ```

4. **Access the application**:
   - Frontend: Open `index.html` in your web browser
   - Backend API: http://localhost:5000

## API Endpoints

### Authentication
- `POST /api/register` - User registration
- `POST /api/login` - User login
- `POST /api/admin/login` - Admin login
- `GET /api/logout` - User logout

### Books
- `GET /api/books` - Get all books (with pagination and search)
- `GET /api/books/<id>` - Get specific book details
- `POST /api/admin/books` - Add new book (admin only)
- `PUT /api/admin/books/<id>` - Update book (admin only)
- `DELETE /api/admin/books/<id>` - Delete book (admin only)

### User Operations
- `POST /api/borrow` - Borrow a book
- `POST /api/reserve` - Reserve a book
- `GET /api/user/dashboard` - Get user dashboard data

## Database

The application uses SQLite as the database. The database file (`library.db`) will be created automatically when you first run the application.

### Sample Data

The application creates sample data on first run:
- **Admin User**: username: `admin`, password: `admin123`
- **Sample Books**: 6 books across different subjects (Fiction, Technology, Science, Philosophy)

## Configuration

You can modify the following configurations in `app.py`:

- **Secret Key**: Change `app.config['SECRET_KEY']` for production
- **Database**: Modify `app.config['SQLALCHEMY_DATABASE_URI']` to use other databases
- **Port**: Change the port in `app.run(port=5000)`

## Project Structure

```
├── app.py                 # Main Flask application
├── requirements.txt       # Python dependencies
├── library.db            # SQLite database (created on first run)
├── templates/            # HTML templates (if using Flask templates)
├── static/              # Static files (CSS, JS, images)
└── BACKEND_README.md    # This file
```

## Development

### Adding New Features

1. **New Models**: Add new classes in the models section
2. **New Routes**: Add new route functions
3. **Database Migration**: Run `db.create_all()` to update the database schema

### Testing

The application runs in debug mode by default. You can test the API endpoints using tools like:
- Postman
- cURL
- Browser developer tools

## Security Features

- Password hashing using Werkzeug
- Session management
- Input validation
- SQL injection protection (SQLAlchemy)

## Production Deployment

For production deployment:

1. **Change the secret key**:
   ```python
   app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY') or 'your-secure-secret-key'
   ```

2. **Use a production database**:
   ```python
   app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL')
   ```

3. **Disable debug mode**:
   ```python
   app.run(debug=False)
   ```

4. **Use a production WSGI server** like Gunicorn:
   ```bash
   pip install gunicorn
   gunicorn -w 4 -b 0.0.0.0:5000 app:app
   ```

## Troubleshooting

### Common Issues

1. **Port already in use**: Change the port number in `app.py`
2. **Database errors**: Delete `library.db` and restart the application
3. **Import errors**: Ensure all dependencies are installed with `pip install -r requirements.txt`

### Logs

Check the console output for any error messages or database creation confirmations.

## Support

If you encounter any issues:
1. Check the console output for error messages
2. Verify all dependencies are installed
3. Ensure Python version is 3.7 or higher
4. Check if the port 5000 is available

## License

This project is part of the Library Management System and follows the same license terms.
