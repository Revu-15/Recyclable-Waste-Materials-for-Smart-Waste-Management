# EcoSort AI - Smart Waste Management System

An intelligent, full-stack waste classification system utilizing deep neural networks to automate recyclable waste identification, generate explainable visual heatmaps (Grad-CAM XAI), and provide real-time analytical reports. 

Designed specifically as a final-year **B.Tech Computer Science (Data Science)** major capstone project.

---

## 🚀 Key Features

*   **Transfer Learning Core**: Fine-tuned **MobileNetV2** architecture trained for 10-class waste categorization (Plastic, Paper, Cardboard, Glass, Metal, Organic, Clothes, Battery, Electronic Waste, and Trash).
*   **Explainable AI (Grad-CAM)**: Custom PyTorch gradient hook mechanism that isolates the final convolutional layer (`base_model.features[18]`) to generate visual heatmap overlays, showing exactly which regions the AI focused on.
*   **Real-time Analytics Board**: Fully interactive dashboard compiling scan metrics, accuracy graphs, daily volume trends, and category distribution charts.
*   **Automated Reporting & Exports**:
    *   **PDF Report Generation**: Downloadable diagnostic sheets for single scans complete with Grad-CAM overlays, details, and recycling instructions.
    *   **Excel/CSV Exports**: One-click extraction of the SQLite classification database log.
*   **Production-Ready Hybrid Engine**: 
    *   *Cloud Mode (Render)*: Bypasses loading heavy PyTorch libraries to fit inside free-tier memory constraints (512MB RAM), utilizing high-speed PIL simulated heatmaps.
    *   *Local Mode (PC)*: Executes the full PyTorch tensor operations and backpropagation calculations.

---

## 📂 Project Structure

```text
Recyle/
├── backend/
│   ├── model/
│   │   ├── classifier.py      # MobileNetV2 wrapper & Hybrid Engine
│   │   └── gradcam.py         # Custom Grad-CAM hook engines (OpenCV/PIL)
│   ├── saved_models/
│   │   └── waste_model.pth    # Fine-tuned PyTorch model weights
│   ├── static/
│   │   └── uploads/           # Ephemeral storage for user scans & heatmaps
│   ├── utils/
│   │   ├── database.py        # SQLite database schemas and initializations
│   │   ├── helpers.py         # Category lookup and environmental details
│   │   └── reports.py         # PDF/Excel report generator pipelines
│   └── app.py                 # Flask server and routing endpoints
├── frontend/
│   ├── src/
│   │   ├── components/        # Reusable UI elements (Navbar, Sidebar)
│   │   ├── pages/             # Dashboard, Classify, History, Admin screens
│   │   ├── App.jsx            # Main router and layout
│   │   └── index.css          # Styling & color systems
│   ├── vite.config.js         # Frontend compiler configurations
│   └── package.json           # Node dependency list
├── test_images/               # Demonstration waste images (Cardboard, Organic, Glass)
├── Procfile                   # Gunicorn command for Render hosting
├── requirements.txt           # Python dependency list
└── README.md                  # Project documentation
```

---

## 💻 Local Installation & Setup

Follow these commands to run both the backend and frontend concurrently on your local machine:

### 1️⃣ Start the Backend (Flask)
Open a terminal window and run:
```powershell
# Go to the root directory
cd C:\Users\polam\Desktop\Recyle

# Create a Python virtual environment (if not already created)
python -m venv venv

# Start the Flask app directly from the virtual environment (bypasses execution policies)
venv\Scripts\python -m backend.app
```
*The server will boot and start listening on `http://127.0.0.1:5000`*

### 2️⃣ Start the Frontend (React + Vite)
Open a **new separate terminal window** and run:
```powershell
# Navigate to the frontend directory
cd C:\Users\polam\Desktop\Recyle\frontend

# Install dependencies (only required on first launch)
npm install

# Start the dev server (bypasses PowerShell script execution restrictions)
npm.cmd run dev
```
*The React app will launch and open on `http://localhost:5173`*

---

## 🌐 Production Cloud Deployment

### 🟢 Backend (Render Deployment)
1. Link your GitHub repository to **Render** and create a **Web Service**.
2. Set the following settings:
    *   **Root Directory**: *Keep completely blank/empty*
    *   **Start Command**: `gunicorn --timeout 120 wsgi:app`
3. Add the following **Environment Variable** in Render settings:
    *   **Key**: `PYTHONPATH` | **Value**: `.`
4. Click **Deploy**.

### 🔵 Frontend (Vercel Deployment)
1. Link your GitHub repository to **Vercel** and select **Add New Project**.
2. Configure settings:
    *   **Root Directory**: Select the `frontend` folder.
    *   *(Vercel will auto-configure the preset to **Vite**)*.
3. Expand **Environment Variables** and add:
    *   **Key**: `VITE_API_URL`
    *   **Value**: `https://<YOUR-RENDER-BACKEND-URL>.onrender.com/api`
4. Click **Deploy**.

---

## 🛠️ Technology Stack

*   **Frontend**: React (Vite), TailwindCSS, Lucide Icons, Axios.
*   **Backend**: Flask (Python), Gunicorn, SQLite3.
*   **Deep Learning (XAI)**: PyTorch, Torchvision, NumPy, OpenCV, Pillow.
