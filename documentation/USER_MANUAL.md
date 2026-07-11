# User Manual: EcoSort AI Waste Management Platform

This user manual outlines the key interface screens and guidelines for using the EcoSort AI platform.

---

## 🖥️ Navigation Panel Structures

EcoSort AI features a sidebar navigation layout grouping five specialized dashboards:
1. **Overview**: Project abstract, research methodology context, dataset classifications list, and developer team cards.
2. **AI Classification**: Upload interface (Drag-and-Drop or Webcam live feeds), processing indicator list, prediction scores, and Grad-CAM explainers.
3. **Analytics Board**: High-level counters, timeline scanning activity charts, waste category distribution graphs, and tabular logs of recent uploads.
4. **Classification Log**: Database explorer page with query fields, row deletion triggers, individual PDF download shortcuts, and CSV/Excel exports.
5. **Admin Center**: Management console to inspect dataset splits distribution and trigger background retraining scripts with real-time log consoles.

---

## ⚙️ How to Classify Waste

### Step 1: Provide Image
Navigate to **AI Classification** tab. You have two choices:
- **Local Upload**: Click on the dashed drag-and-drop container to open the file explorer and pick a waste image (PNG, JPG), or drag-and-drop a file directly.
- **Webcam Snapshot**: Click **Camera Stream** button to activate your computer's webcam. Align the waste material in front of the lens and click **Capture Photo**.

### Step 2: Trigger Analysis
Click the green **Analyze Waste** button. The server will execute the preprocessing, deep learning inference, and Grad-CAM backward pass.

### Step 3: Interpret Predictions and XAI
- **Classification & Confidence**: Located on the top green card. For instance, `Plastic` at `98.45%` confidence.
- **Grad-CAM Activations Grid**: Rendered on the right image.
  - *How to read the heatmap*: Areas colored in **Red** indicate the specific pixel regions the CNN relied on to predict that class (e.g. bottle caps, aluminum rims). Areas colored in **Blue/Green** had low contribution values.
- **Disposal Guides & Impact**: Bottom panels provide clear instructions on how to handle the item (e.g., rinse clean, discard lid) and show the positive impact of doing so.
- **Download PDF**: Generates and downloads a formal 1-page report detailing this scan, suitable for academic or community portfolios.

---

## 📊 Exporting History & Logs

To export your logs:
1. Go to the **Classification Log** tab.
2. Filter the records using the top search bar (type classes like "Organic" or specific filenames).
3. Click **CSV Export** or **Excel Export** at the top right to download aggregated spreadsheets.
4. Click the red trash icon on any row to delete that record from the database and clean up the associated uploaded files from disk.

---

## 🛠️ Model Management (Admin)

If you have updated the local `dataset/` directory with new images:
1. Go to the **Admin Center** tab.
2. Review the **Dataset Allocations** panel to see the scanned distribution of train, validation, and test splits.
3. Click the **Retrain Model** button.
4. Watch the progress bar fill as the model performs epoch training runs, printing updates and validation metrics to the **Real-Time Output Terminal**.
5. Once completed, the model shifts status to `completed` and saves the updated weights to the disk.
