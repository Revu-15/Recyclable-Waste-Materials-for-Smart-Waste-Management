# Presentation Deck (PPT) Structure & Content Outline

This guide outlines a 15-slide presentation deck designed for B.Tech project defenses, including slide titles, bullet points, and speaker notes.

---

### Slide 1: Title Slide
- **Title**: Deep Learning-Based Classification of Recyclable Waste Materials for Smart Waste Management
- **Subtitle**: B.Tech Final Year Capstone Project (Data Science)
- **Presenter Names**: [Insert Student Names]
- **Advisors**: [Insert Guide Name]
- **Speaker Notes**: Introduce yourself, state the project title, and outline that this is a full-stack deep learning solution designed to resolve waste recycling issues.

---

### Slide 2: Problem Statement
- **Key Challenges**:
  - Global increase in municipal solid waste.
  - Inefficient manual waste sorting leading to high recycling costs and landfill saturation.
  - Lack of trust in AI models ("black-box" issue) preventing commercial adoption.
- **The Solution**: An automated, explainable AI system that classifies waste and visually explains model predictions.
- **Speaker Notes**: Highlight that current municipal systems rely on manual sorting which is slow, expensive, and error-prone, creating a need for automated segregation.

---

### Slide 3: Project Objectives
- **Objectives**:
  - Train a deep learning model to classify waste into 10 categories.
  - Implement transfer learning on a lightweight backbone (MobileNetV2) for edge-deployment.
  - Integrate Grad-CAM XAI to visualize model activation maps.
  - Build a glassmorphic web application with dashboards and reporting.
- **Speaker Notes**: Outline the main goals of the project, highlighting both the technical (MobileNet, Grad-CAM) and product-level (dashboard, reports) targets.

---

### Slide 4: Literature Review
- **Comparison of Key Methodologies**:
  - **Traditional Sensors**: Infrared/magnetic sensors. High hardware cost, low material specificity.
  - **Heavy CNNs (ResNet-50, VGG-16)**: High accuracy (~93%), but high parameters (25M+) make edge deployment difficult.
  - **Lightweight CNNs (MobileNetV2)**: Reduced parameters (3.4M) with comparable accuracy, suitable for local device deployment.
- **Speaker Notes**: Compare heavy networks with MobileNetV2 to justify why we selected the latter for our smart waste sorting system.

---

### Slide 5: Proposed System Architecture
- **Architecture Flow**:
  - **Ingestion**: User image upload or webcam snapshot.
  - **Backend**: Flask API serves as the orchestration layer, calling PyTorch pipelines.
  - **Model**: MobileNetV2 performs classification, and Grad-CAM backprop calculates feature activation maps.
  - **Database & Output**: Transactions logged in SQLite; PDF/Excel sheets generated.
- **Speaker Notes**: Walk the reviewers through the flowchart, explaining how data moves from user upload to backend inference, databases, and reporting.

---

### Slide 6: MobileNetV2 Deep Learning Core
- **Key Features**:
  - Inverted Residual Blocks and Linear Bottlenecks to reduce parameters.
  - Input resolution: $224 \times 224 \times 3$.
  - Freezes base layers and adds a custom classifier head to output probabilities for 10 waste categories.
- **Speaker Notes**: Explain the network modifications made for this project, highlighting that we are leveraging pre-trained ImageNet weights.

---

### Slide 7: Explainable AI: Grad-CAM
- **The Mechanics**:
  - Backpropagates class scores to the final convolutional layer of MobileNetV2 (`features[18]`).
  - Calculates channel-wise weights ($\alpha_k^c$) to weight the activation maps.
  - Applies ReLU to focus only on positive features.
  - Overlays the resulting heatmap on the original image using OpenCV.
- **Speaker Notes**: Explain the math behind Grad-CAM, emphasizing that it shows exactly what features (e.g. bottle caps, aluminum rims) drove the model's prediction.

---

### Slide 8: Backend REST API and Database Design
- **Flask REST Endpoints**:
  - `POST /api/classify`: Main classification and Grad-CAM route.
  - `GET /api/dashboard`: Stats and timeline aggregation.
  - `GET /api/history`: Paginated history explorer.
  - `POST /api/admin/retrain`: Simulated background training thread.
- **SQLite Database Schema**:
  - `predictions`: Logs filenames, URLs, classifications, confidences, and instructions.
  - `retraining_logs`: Tracks background training progress.
- **Speaker Notes**: Detail the backend structure, showing how the Flask API decouples data fetching, database updates, and deep learning inference.

---

### Slide 9: Glassmorphic Frontend Design
- **Tech Stack**: React.js, Tailwind CSS, Recharts, Framer Motion, Lucide Icons.
- **Core Screens**:
  - **Overview**: Academic project introduction.
  - **AI Classification**: Upload/Camera capture console.
  - **Analytics Board**: Interactive charts (Recharts).
  - **Log History**: Filterable history explorer.
  - **Admin Control**: Dataset stats and training terminal logs.
- **Speaker Notes**: Introduce the frontend screens, highlighting the modern glassmorphic UI, responsive layouts, and smooth animations.

---

### Slide 10: Experimental Results
- **Model Evaluation Summary**:
  - **Accuracy**: 94.20%
  - **Precision (Macro)**: 0.9415
  - **Recall (Macro)**: 0.9412
  - **F1-Score (Macro)**: 0.9413
- **Inference Latency**: ~66ms on CPU, making it suitable for real-time edge processing.
- **Speaker Notes**: Present the final model metrics. Highlight that the low latency makes the system viable for real-time sorting.

---

### Slide 11: Training Curves & Confusion Matrix
- **Visual Artifacts**:
  - **Training Curves**: Shows smooth convergence of training and validation loss/accuracy.
  - **Confusion Matrix**: Identifies minor confusion between paper and cardboard due to texturing, with high segregation rates for metals and glass.
- **Speaker Notes**: Explain the plots, demonstrating that the model converged cleanly without overfitting.

---

### Slide 12: Grad-CAM Analysis & Interpretability
- **Key Visual Insights**:
  - For **Plastic Bottles**, the model focuses on caps and threading.
  - For **Metal Cans**, activations align with the tab pull.
  - For **Glass Containers**, highlights curved boundaries and refractive edges.
- **Conclusion**: Confirms the model has learned true visual features rather than memorizing backgrounds.
- **Speaker Notes**: Walk the reviewers through the Grad-CAM heatmaps, showing how the model focuses on class-specific markers.

---

### Slide 13: Exporters & PDF Reporting
- **Automated Exporters**:
  - **PDF Export**: Generates a print-ready report for individual scans with side-by-side images.
  - **XLSX & CSV Export**: Bulk history download with clean styling and formatting.
- **Speaker Notes**: Present the reporting features, explaining that this capability is highly useful for municipal logging and audits.

---

### Slide 14: Future Scope
- **Roadmap**:
  - **Edge-AI Bins**: Compile the model to ONNX or TF Lite to run on microcontrollers.
  - **YOLO Integration**: Add object detection to identify multiple items in a single scan.
  - **IoT Integration**: Interface with robotic sorting arms for automated segregation.
- **Speaker Notes**: Discuss future directions, positioning the project as a foundation for a fully automated smart city sorting bin.

---

### Slide 15: Conclusion and References
- **Summary**: Delivered a full-stack, explainable waste sorting system using MobileNetV2 and Grad-CAM.
- **References**:
  1. Yang & Shi (2016) - TrashNet.
  2. Sandler et al. (2018) - MobileNetV2.
  3. Selvaraju et al. (2017) - Grad-CAM.
- **Speaker Notes**: Summarize the project's key takeaways, thank the panel, and open the floor to questions.
