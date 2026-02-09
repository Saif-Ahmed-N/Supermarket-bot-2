# How to Run Supermarket-bot-2

Follow these steps to start both the backend and frontend servers.

### 1. Open Terminal 1 (Backend)
Navigate to the project root and run:
```powershell
# Activate the virtual environment
.\.venv\Scripts\activate

# Start the FastAPI backend
python -m uvicorn backend.main:app --reload --port 8000
```

### 2. Open Terminal 2 (Frontend)
Navigate to the project root and run:
```powershell
# Start the Vite frontend
npm run dev
```

### 3. Access the Application
- **Backend API**: [http://localhost:8000](http://localhost:8000)
- **Frontend App**: [http://localhost:5173](http://localhost:5173) (usually)

> [!NOTE]
> Ensure you have your `.env` file configured with the correct `DATABASE_URL` before starting the backend.
