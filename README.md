# EcoSort AI: Deep Learning-Based Classification of Recyclable Waste Materials for Smart Waste Management

EcoSort AI is a production-ready, full-stack web application designed for automated waste material identification and recycling recommendation. It leverages deep convolutional neural networks (MobileNetV2), transfer learning, and explainable AI (Grad-CAM) to categorize household waste and assist users in sustainable disposal.

This project is fully structured and documented for B.Tech Computer Science (Data Science) final-year capstone presentations and academic submissions.

---

## 📂 Project Repository Structure

```
project/
├── backend/
│   ├── api/
│   ├── model/
│   │   ├── classifier.py      # Dual PyTorch & TensorFlow strategy
│   │   ├── gradcam.py         # PyTorch Grad-CAM XAI Engine
│   │   └── train.py           # Self-contained training & plot script
│   ├── utils/
│   │   ├── database.py        # SQLite history logs database
│   │   ├── helpers.py         # Recycling instructions & details mapping
│   │   └── reports.py         # PDF, Excel, and CSV export engines
│   ├── static/
│   │   └── uploads/           # Holds uploaded files & overlays
│   ├── app.py                 # Main Flask server
│   └── verify.py              # Test script checking the full pipeline
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/        # Navbar, Sidebar, GlassCard
│   │   ├── pages/             # Home, Classify, Dashboard, History, Admin
│   │   ├── App.jsx            # Core SPA state layout manager
│   │   └── index.css          # Glassmorphic themes & radial backgrounds
│   ├── tailwind.config.js     # Glassmorphic sustainability theme config
│   ├── postcss.config.js
│   └── package.json
├── documentation/             # Comprehensive academic deliverables
│   ├── INSTALL_GUIDE.md       # Installation & launch instructions
│   ├── API_DOCUMENTATION.md   # Flask REST API endpoints specification
│   ├── USER_MANUAL.md         # Walkthrough instructions for users
│   ├── PROJECT_REPORT.md      # IEEE-style thesis report (B.Tech standard)
│   ├── RESEARCH_PAPER.md      # Research paper format layout
│   └── PPT_PRESENTATION.md    # 15-slide PowerPoint deck content
├── requirements.txt           # Python backend dependencies
├── package.json               # Workspace root run commands
├── start_project.bat          # Concurrently starts backend & frontend servers
└── README.md
```

---

## ⚡ Quick Start (Windows)

1. **Prerequisites**: Ensure you have Python 3.10+ and Node.js installed.
2. **Install Dependencies**:
   * **Backend**: Run `pip install -r requirements.txt` to install PyTorch, OpenCV, Flask, openpyxl, reportlab, and other helpers.
   * **Frontend**: Open a terminal inside the `frontend` folder and run `npm install`.
3. **Launch System**: Double-click `start_project.bat` from the root directory. This will start the Flask server (`http://localhost:5000`) and the React development server concurrently.
4. **Access Web Application**: Open the Local URL displayed in the React frontend terminal.

---

## 📖 Project Documentation Index

To access detailed academic deliverables and guide manuals, navigate to:
* **[Installation Guide](file:///c:/Users/polam/Desktop/Recyle/documentation/INSTALL_GUIDE.md)**: Setup guides for environments, dependencies, and model files.
* **[API Documentation](file:///c:/Users/polam/Desktop/Recyle/documentation/API_DOCUMENTATION.md)**: Endpoints structure, schema mappings, and example requests.
* **[User Manual](file:///c:/Users/polam/Desktop/Recyle/documentation/USER_MANUAL.md)**: UI functionality, uploading waste, interpreting Grad-CAM, and downloading reports.
* **[Project Report Thesis](file:///c:/Users/polam/Desktop/Recyle/documentation/PROJECT_REPORT.md)**: Complete major project report containing literature review, system architectures, and validation metrics.
* **[Research Paper Draft](file:///c:/Users/polam/Desktop/Recyle/documentation/RESEARCH_PAPER.md)**: Scientific paper template reporting experimental results.
* **[PPT Presentation Guide](file:///c:/Users/polam/Desktop/Recyle/documentation/PPT_PRESENTATION.md)**: Structured presentation deck outline with content templates for final-year defense.
