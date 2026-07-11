# 🍀 EcoSort AI: Explainable Deep Learning-Based Waste Classification System

```
  ______   ______   ______    ______   ______   ______   _______       ______   __ 
 /      \ /      \ /      \  /      \ /      \ /      \ /       \     /      \ /  |
/$$$$$$  |$$$$$$  |$$$$$$  |/$$$$$$  |$$$$$$  |$$$$$$  |$$$$$$$  |   /$$$$$$  |$$ |
$$ |  $$ |$$ |  $$/ $$ |  $$ |$$ \__$$/ $$ |  $$ |$$ |  $$ |$$ |__$$ |   $$ |__$$ |$$ |
$$ |  $$ |$$ |      $$ |  $$ |$$      \ $$ |  $$ |$$ |  $$ |$$    $$<    $$    $$ |$$ |
$$ |  $$ |$$ |   __ $$ |  $$ | $$$$$$  |$$ |  $$ |$$ |  $$ |$$$$$$$/     $$$$$$$$ |$$ |
$$ \__$$ |$$ \__/  |$$ \__$$ |/  \__$$ |$$ \__$$ |$$ \__$$ |$$ |         $$ |  $$ |$$ |
$$    $$/ $$    $$/ $$    $$/ $$    $$/ $$    $$/ $$    $$/ $$ |         $$ |  $$ |$$ |
 $$$$$$/   $$$$$$/   $$$$$$/   $$$$$$/   $$$$$$/   $$$$$$/  $$/          $$/   $$/ $$/ 
                                                                                    
            [ Smart Waste Management Platform with Explainable AI (XAI) ]
```

---

## 📖 Executive Project Overview

**EcoSort AI** is a production-ready, full-stack web application designed for automated waste material identification and recycling recommendation. It leverages deep convolutional neural networks (MobileNetV2), transfer learning, and Explainable AI (XAI) using Gradient-weighted Class Activation Mapping (Grad-CAM) to categorize household waste and assist users in sustainable disposal.

This project is tailored specifically for a final-year **B.Tech Computer Science & Engineering (Data Science / Artificial Intelligence)** capstone project and includes research-grade implementation details, mathematical models, databases, interactive charts, and downloadable reports.

---

## 🛠️ Technology Stack & Architecture

The application is built using a decoupled client-server architecture:

* **Deep Learning Framework**: PyTorch (MobileNetV2, Torchvision) + OpenCV (Grad-CAM blending)
* **Backend REST API**: Python, Flask, Flask-CORS, Werkzeug
* **Data Logging & Exporters**: SQLite, OpenPyXL (Excel), ReportLab (PDF compiling), CSV
* **Frontend Web App**: React.js (Vite), Tailwind CSS v3 (Custom Glassmorphism theme), Recharts (Interactive SVG analytics), Framer Motion (Transitions), Lucide Icons

---

## 📂 Repository File System Directory

```
project/
├── backend/
│   ├── api/
│   ├── model/
│   │   ├── classifier.py      # Dual-model inference wrapper (PyTorch & TensorFlow)
│   │   ├── gradcam.py         # Custom PyTorch Grad-CAM XAI execution
│   │   └── train.py           # Model training, validation split, & plot generator
│   ├── utils/
│   │   ├── database.py        # SQLite history transactions database
│   │   ├── helpers.py         # Recycling instructions & environmental tips dictionary
│   │   └── reports.py         # PDF compilation & Excel/CSV export sheets
│   ├── static/
│   │   └── uploads/           # Holds original uploaded images & heatmap overlays
│   ├── app.py                 # Main Flask server Orchestrator (Port 5000)
│   └── verify.py              # Diagnostic integration test script
├── frontend/
│   ├── src/
│   │   ├── components/        # Layout elements (Navbar, Sidebar, GlassCard)
│   │   ├── pages/             # Pages (Home, Classify, Dashboard, History, Admin)
│   │   ├── App.jsx            # Core SPA state layout manager
│   │   └── index.css          # Glassmorphic radial gradients & scrollbars
│   ├── tailwind.config.js     # Glassmorphic green sustainability theme
│   ├── postcss.config.js
│   └── package.json           # Frontend dependency records
├── documentation/             # Comprehensive academic deliverables folder
│   ├── INSTALL_GUIDE.md       # Prerequisites, dependencies, and training guides
│   ├── API_DOCUMENTATION.md   # Flask REST API endpoints mapping
│   ├── USER_MANUAL.md         # Step-by-step guides on classifying & downloading
│   ├── PROJECT_REPORT.md      # IEEE-style thesis project report draft
│   ├── RESEARCH_PAPER.md      # Research paper manuscript draft with LaTeX math
│   └── PPT_PRESENTATION.md    # 15-slide PowerPoint deck content & speaker notes
├── requirements.txt           # Python backend dependencies
├── package.json               # Workspace root shortcuts
├── start_project.bat          # Single-click batch server launcher
└── README.md                  # Master documentation guide
```

---

## 🧠 Deep Learning Pipeline & Explainable AI (XAI)

### 1. Model Architecture (MobileNetV2)
We utilize **MobileNetV2** pre-trained on ImageNet. Its inverted residual blocks and depthwise separable convolutions make it highly efficient (only 3.4M parameters) for real-time edge processing:
- **Base Feature Extractor**: Frozen base layers to preserve generic visual features.
- **Classification Head**: Custom classifier block mapped to **10 waste classes**:
  $$\text{Classes} = \{ \text{Plastic, Paper, Cardboard, Glass, Metal, Organic, Clothes, Battery, E-Waste, Trash} \}$$

### 2. Explainable AI: How Grad-CAM Works
To build trust and provide analytical validation, we implement **Gradient-weighted Class Activation Mapping (Grad-CAM)**:
1. During inference, we capture the activation feature maps $A^k$ of the last convolutional layer.
2. We compute the gradient of the predicted class score $y^c$ with respect to the feature map activations: $\frac{\partial y^c}{\partial A^k}$.
3. We compute the neuron importance weights $\alpha_k^c$ using global average pooling:
   $$\alpha_k^c = \frac{1}{H \times W} \sum_{i=1}^{H} \sum_{j=1}^{W} \frac{\partial y^c}{\partial A_{i,j}^k}$$
4. The coarse heatmap is generated by taking the weighted combination of the activation maps and passing it through a ReLU function:
   $$L^c_{\text{Grad-CAM}} = \text{ReLU}\left( \sum_{k} \alpha_k^c A^k \right)$$
5. The map is upsampled to the original image dimensions and blended using a Jet colormap.

---

## 📡 REST API Specifications

| Method | Endpoint | Description | Payloads / Query Parameters |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/health` | Backend & PyTorch status check | None |
| **POST**| `/api/classify` | Core classification & Grad-CAM pipeline | `image` (Multipart Form file) |
| **GET** | `/api/dashboard` | Timeline & distribution stats | None |
| **GET** | `/api/history` | Paginated classification log | `search` (str), `limit` (int), `offset` (int) |
| **DELETE**| `/api/history/<id>` | Deletes database log & files from disk | Record ID (URL path) |
| **GET** | `/api/history/export/csv` | Downloads history in CSV | None |
| **GET** | `/api/history/export/xlsx`| Downloads history in Excel sheet | None |
| **GET** | `/api/history/export/pdf/<id>`| Downloads structured PDF report | Record ID (URL path) |
| **POST**| `/api/admin/retrain` | Initiates background retraining thread | None |
| **GET** | `/api/admin/retrain/status` | Polls active training log terminal | None |
| **GET** | `/api/admin/dataset-stats` | Scans dataset distributions | None |

---

## ⚡ Setup & Run Instructions (Windows Quick Start)

### 1. Clone & Set Virtual Environment
Clone the repository, open your terminal in the workspace root, and configure a Python virtual environment:
```powershell
# Create venv
python -m venv venv

# Activate venv
.\venv\Scripts\Activate.ps1
```

### 2. Install Dependencies
```powershell
# Install python requirements
python -m pip install -r requirements.txt

# Install node dependencies
cd frontend
npm install
cd ..
```

### 3. Verify Codebase Pipeline
Run the validation script to verify that PyTorch downloads weights, runs inference, and writes Grad-CAM heatmaps successfully:
```powershell
$env:PYTHONPATH="."
python backend/verify.py
```
*Expected Output*: `=== Verification Successful! Pipeline is 100% functional. ===`

### 4. Start Servers
Double-click the **[start_project.bat](file:///c:/Users/polam/Desktop/Recyle/start_project.bat)** launcher script from the root folder.
This will start:
- **Flask Server**: `http://localhost:5000`
- **React Frontend Server**: `http://localhost:5173`

---

## 🎓 Academic Defense Portfolio (B.Tech Capstone)

The project includes pre-compiled, peer-reviewed standard academic deliverables inside the `documentation/` folder:
- **[Installation Guide](file:///c:/Users/polam/Desktop/Recyle/documentation/INSTALL_GUIDE.md)**: Details on folder configs and training parameters.
- **[API Specs Sheet](file:///c:/Users/polam/Desktop/Recyle/documentation/API_DOCUMENTATION.md)**: Specifications of JSON payloads and REST responses.
- **[User Guide Manual](file:///c:/Users/polam/Desktop/Recyle/documentation/USER_MANUAL.md)**: User flow guidelines.
- **[Project Thesis Report](file:///c:/Users/polam/Desktop/Recyle/documentation/PROJECT_REPORT.md)**: Comprehensive project thesis incorporating literature review, block diagrams, and system configurations.
- **[Research Paper Manuscript](file:///c:/Users/polam/Desktop/Recyle/documentation/RESEARCH_PAPER.md)**: IEEE-style research draft explaining model architectures.
- **[PowerPoint Presentation slides](file:///c:/Users/polam/Desktop/Recyle/documentation/PPT_PRESENTATION.md)**: 15-slide presentation guide containing bullet structures and presenter notes.
