# CosmoCart - AI-Powered Supermarket Ecosystem

A full-stack supermarket solution featuring an AI-powered customer bot and a comprehensive administrative dashboard.

## 📁 Project Structure

*   **`cosmocartt_Bot/`**: The main customer-facing application.
    *   **`/backend`**: FastAPI server handling LLM logic, product search, and database.
    *   **`/src`**: React/Vite frontend for the chat interface.
*   **`cosmocartt_admin/`**: React/Vite dashboard for inventory and order management.
*   **`cleaned_products_dataset.csv`**: The master product database.

---

## 🚀 Getting Started

### 1. Backend Setup (Recommended Step-by-Step)
Handles the AI logic and product database.

**Automated Setup (Fastest):**
*   **Windows:** Run `.\setup_backend.ps1` in the project root.
*   **Linux/Mac:** Run `./setup_backend.sh` in the project root.

**Manual Setup:**
1.  Navigate to the backend folder:
    ```bash
    cd cosmocartt_Bot/backend
    ```
2.  Create and activate a virtual environment:
    ```bash
    python -m venv .venv
    # Windows: .venv\Scripts\activate
    # Mac/Linux: source .venv/bin/activate
    ```
3.  Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```
4.  Run the server:
    ```bash
    uvicorn main:app --reload
    ```
    *Server will run at: `http://localhost:8000`*

### 2. Bot Frontend Setup (`cosmocartt_Bot`)
The AI Chat interface for customers.

1.  Navigate to the bot folder:
    ```bash
    cd cosmocartt_Bot
    ```
2.  Install packages:
    ```bash
    npm install
    ```
3.  Start development server
    ```bash
    npm run dev
    ```
    *Bot will run at: `http://localhost:5173`*

### 3. Admin Panel Setup (`cosmocartt_admin`)
Dashboard for store management.

1.  Navigate to the admin folder:
    ```bash
    cd cosmocartt_admin
    ```
2.  Install packages:
    ```bash
    npm install
    ```
3.  Start development server:
    ```bash
    npm run dev
    ```
    *Admin panel will run at: `http://localhost:5173` (or next available port)*

---

## 🛠 Features
- **AI-Powered Search:** Chat naturally to find products.
- **Dynamic Category Navigation:** Real product images for subcategories.
- **Smart Product Grid:** Compact 4-column layout with "Show More" functionality.
- **Product Details:** Click any product to see full descriptions and larger images.
- **Integrated Cart:** Persistent shopping cart with weight selection.
- **Admin Dashboard:** Real-time inventory and customer order tracking.

---

## 📦 Tech Stack
- **Frontend:** React, Tailwind CSS, Lucide Icons, Vite.
- **Backend:** FastAPI, PostgreSQL/SQLite, SQLAlchemy.
- **AI:** LangChain, Groq API.
