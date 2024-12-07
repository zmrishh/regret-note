# Regret Journal Backend

Flask backend for the Regret Journal application.

## Setup

1. Create a virtual environment:
```bash
python -m venv venv
```

2. Activate the virtual environment:
- Windows:
```bash
venv\Scripts\activate
```
- Unix/MacOS:
```bash
source venv/bin/activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

5. Initialize the database:
```bash
flask db init
flask db migrate -m "Initial migration"
flask db upgrade
```

6. Run the development server:
```bash
flask run
```

## API Endpoints

### Entries
- GET /api/entries - Get all entries
- POST /api/entries - Create a new entry
- GET /api/entries/<id> - Get specific entry
- PUT /api/entries/<id> - Update an entry
- DELETE /api/entries/<id> - Delete an entry

### Users
- POST /api/users - Create a new user
- GET /api/users/<id>/entries - Get entries for a specific user

## Development

To start the development server with debug mode:
```bash
python run.py
```

## Production Deployment

For production deployment:
1. Use a production-grade WSGI server (e.g., Gunicorn)
2. Set up proper environment variables
3. Use a production database (e.g., PostgreSQL)
4. Configure proper CORS settings
5. Enable proper security measures
