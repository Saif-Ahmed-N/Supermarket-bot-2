---
description: How to run the backend and frontend servers
---

1. Open a terminal in the root directory.
2. Run the backend server:
```powershell
.\.venv\Scripts\activate
python -m uvicorn backend.main:app --reload --port 8000
```
3. Open a second terminal in the root directory.
4. Run the frontend server:
```powershell
npm run dev
```
