# Flask REST API Documentation

This document describes the specifications of the backend endpoints exposed by the Flask application.

- **Base URL**: `http://localhost:5000`
- **Content Type**: `application/json` (except for file uploads and downloads)

---

## 1. System Health Check

### `GET /api/health`
Checks backend API, active deep learning framework, and SQLite database connectivity status.

**Response**:
- Status Code: `200 OK`
- Body:
  ```json
  {
    "backend": "Flask (Python 3.14.6)",
    "database": "SQLite",
    "framework": "PyTorch (MobileNetV2 active)",
    "status": "healthy",
    "timestamp": 1783829201.24
  }
  ```

---

## 2. Waste Classification & Grad-CAM

### `POST /api/classify`
Uploads a waste image, performs PyTorch MobileNetV2 classification, runs backpropagation for Grad-CAM overlay, stores a transaction log in the database, and returns ecological disposal guides.

**Request Payload**:
- Format: `multipart/form-data`
- Parameters:
  - `image` (File, Required): The JPEG/PNG waste image.

**Response**:
- Status Code: `200 OK`
- Body:
  ```json
  {
    "success": true,
    "id": 42,
    "image_url": "/static/uploads/sodacan_1783829410.jpg",
    "heatmap_url": "/static/uploads/heatmap_sodacan_1783829410.jpg",
    "predicted_class": "Metal",
    "confidence": 98.24,
    "confidences": {
      "Plastic": 0.42,
      "Paper": 0.12,
      "Cardboard": 0.08,
      "Glass": 0.35,
      "Metal": 98.24,
      "Organic Waste": 0.10,
      "Clothes": 0.22,
      "Battery": 0.15,
      "Electronic Waste": 0.05,
      "Trash": 0.27
    },
    "processing_time": 0.2412,
    "recycling_instructions": "Rinse aluminum and steel/tin cans. Put the lids inside the cans so they don't cut anyone. Clean aluminum foil is also recyclable.",
    "recommendation": "Wash off food remains and place in the metal recycling bin. Scrap metal should be taken to a local recycling yard.",
    "environmental_tip": "Recycling aluminum saves 95% of the energy needed to make new aluminum from bauxite ore. Aluminum can be recycled repeatedly.",
    "explain_text": "The model detected metallic sheen, specular highlighting, and thin metallic cylinder configurations common to aluminum beverage/food cans."
  }
  ```

---

## 3. Dashboard Statistics

### `GET /api/dashboard`
Returns summarized classification counters, timeline logs, and recent transaction history lists for visualization widgets.

**Response**:
- Status Code: `200 OK`
- Body:
  ```json
  {
    "total_predictions": 125,
    "average_confidence": 92.45,
    "accuracy": 94.20,
    "class_distribution": {
      "Plastic": 42,
      "Paper": 25,
      "Organic Waste": 33,
      "Glass": 15,
      "Cardboard": 10
    },
    "recent_predictions": [
      {
        "id": 125,
        "predicted_class": "Plastic",
        "confidence": 96.42,
        "original_image_path": "/static/uploads/bottle_1783829800.jpg",
        "created_at": "2026-07-11 18:30:00"
      }
    ],
    "timeline": [
      {
        "date": "2026-07-10",
        "count": 14
      },
      {
        "date": "2026-07-11",
        "count": 22
      }
    ]
  }
  ```

---

## 4. History Logs Explorer

### `GET /api/history`
Retrieves paginated, filtered prediction history logs with support for text search.

**Request Query Parameters**:
- `search` (String, Optional): Search matches predicted class or image name.
- `limit` (Integer, Optional): Number of records to return. Default `10`.
- `offset` (Integer, Optional): Database offset. Default `0`.

**Response**:
- Status Code: `200 OK`
- Body:
  ```json
  {
    "predictions": [
      {
        "id": 12,
        "image_name": "apple_1783820202.jpg",
        "original_image_path": "/static/uploads/apple_1783820202.jpg",
        "heatmap_image_path": null,
        "predicted_class": "Organic Waste",
        "confidence": 99.12,
        "processing_time": 0.184,
        "created_at": "2026-07-11 12:45:00",
        "recycling_instructions": "Organic waste is biodegradable. Place it in the compost bin.",
        "environmental_tip": "Composting organic waste reduces methane emissions from landfills.",
        "explain_text": "The model identified organic shapes, biological textures, and organic patterns typical of food items or plants."
      }
    ],
    "total": 12,
    "limit": 10,
    "offset": 0
  }
  ```

### `DELETE /api/history/<id>`
Deletes a prediction record by ID from the database and removes corresponding files from the disk to free space.

**Response**:
- Status Code: `200 OK`
- Body:
  ```json
  {
    "success": true,
    "message": "Record 12 deleted successfully."
  }
  ```

---

## 5. Reports Exporting

### `GET /api/history/export/csv`
Downloads prediction history log in CSV format.
- Content Type: `text/csv`
- Header: `Content-Disposition: attachment; filename=waste_predictions_history.csv`

### `GET /api/history/export/xlsx`
Downloads prediction history log in Excel spreadsheet format.
- Content Type: `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`
- Header: `Content-Disposition: attachment; filename=waste_predictions_history.xlsx`

### `GET /api/history/export/pdf/<id>`
Downloads a detailed, print-ready PDF report for a single prediction ID. Includes original and Grad-CAM images side-by-side.
- Content Type: `application/pdf`
- Header: `Content-Disposition: attachment; filename=waste_classification_report_<id>.pdf`

---

## 6. Admin Panel Model Retraining

### `POST /api/admin/retrain`
Triggers background fine-tuning.
**Response**:
- Status Code: `200 OK`
- Body:
  ```json
  {
    "success": true,
    "message": "Model retraining initiated in the background.",
    "status": "running"
  }
  ```

### `GET /api/admin/retrain/status`
Retrieves logs and progress (current epoch/total epochs) of the model retraining thread.
**Response**:
- Status Code: `200 OK`
- Body:
  ```json
  {
    "status": "running",
    "current_epoch": 2,
    "total_epochs": 5,
    "logs": [
      "Epoch 1/5 | loss: 0.4200 - accuracy: 79.20% - val_loss: 0.4800 - val_accuracy: 78.00%",
      "Epoch 2/5 | loss: 0.3400 - accuracy: 83.40% - val_loss: 0.4100 - val_accuracy: 82.00%"
    ]
  }
  ```

### `GET /api/admin/dataset-stats`
Scans local dataset directories or returns simulated counts to summarize splits distributions.
**Response**:
- Status Code: `200 OK`
- Body:
  ```json
  {
    "total_images": 4510,
    "splits_distribution": {
      "Plastic": { "train": 480, "val": 120, "test": 100 },
      "Paper": { "train": 510, "val": 130, "test": 110 }
    }
  }
  ```
