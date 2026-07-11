# Installation and Environment Configuration Guide

This guide details the step-by-step setup requirements to run the EcoSort AI Waste Management system locally.

---

## System Requirements

- **Operating System**: Windows 10/11 (suitable for Windows Terminal and cmd execution).
- **Python**: Python 3.10 to Python 3.14.
- **Node.js**: Node.js v18 or newer (LTS recommended).
- **RAM**: 8 GB minimum (16 GB recommended for model retraining).
- **GPU**: Optional (CUDA 11+ supported for accelerated PyTorch training, falls back to CPU automatically).

---

## Setup Steps

### 1. Clone the Project
Verify your folder structure is placed in the desired workspace:
```bash
cd c:\Users\polam\Desktop\Recyle
```

### 2. Configure Python Backend Environment
It is highly recommended to configure a Python virtual environment to isolate the project's dependencies:
```powershell
# Create Virtual Environment
python -m venv venv

# Activate Virtual Environment (PowerShell)
.\venv\Scripts\Activate.ps1

# Upgrade Package Installer
python -m pip install --upgrade pip
```

Install backend dependencies from `requirements.txt`:
```powershell
python -m pip install -r requirements.txt
```

### 3. Verify Python Core Backend
Run the backend validation script to test PyTorch MobileNetV2 loading, SQLite database creation, and Grad-CAM generation:
```powershell
$env:PYTHONPATH="."
python backend/verify.py
```
*Expected Output*: You should see `=== Verification Successful! Pipeline is 100% functional. ===` in the console, indicating that dependencies are successfully set up.

### 4. Setup React Frontend
Navigate to the `frontend/` directory and install the npm packages:
```powershell
cd frontend
# Install dependencies (axios, framer-motion, lucide-react, recharts, tailwindcss, etc.)
npm install
```

### 5. Running the Application
Return to the root workspace directory and launch both servers simultaneously:
```powershell
cd ..
.\start_project.bat
```
This batch script triggers two independent command prompt windows:
1. **Flask Backend API**: Starts serving on `http://localhost:5000`.
2. **React Frontend Server**: Opens on `http://localhost:5173` (or the next available port).

Open your browser to the local URL displayed in the frontend console to view the Glassmorphic interface.

---

## Model Retraining Setup
If you wish to retrain the neural network on the actual TrashNet/Garbage datasets:
1. Create a `dataset/` directory in the project root.
2. Structure your custom images as subdirectories named after the classes:
   ```
   dataset/
   ├── train/
   │   ├── Plastic/
   │   ├── Paper/
   │   └── ... (all 10 classes)
   ├── val/
   │   └── ...
   └── test/
       └── ...
   ```
3. Run the training script:
   ```bash
   python backend/model/train.py --epochs 10 --batch_size 16 --lr 0.001
   ```
   This will train the MobileNetV2 classification head, save the weights to `backend/saved_models/waste_model.pth`, and export precision curves and confusion matrices to the `backend/reports/plots/` folder.
