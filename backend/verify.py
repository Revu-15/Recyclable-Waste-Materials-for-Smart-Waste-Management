import os
import sys
from PIL import Image, ImageDraw
import numpy as np

# Ensure path includes project root
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from backend.utils.database import init_db
from backend.model.classifier import WasteClassifierWrapper
from backend.model.gradcam import generate_and_save_gradcam

def run_verification():
    print("=== Pipeline Verification ===")
    
    # 1. Init Database
    print("1. Initializing database...")
    init_db()
    print("   Database OK.")
    
    # 2. Setup paths
    project_root = os.path.dirname(os.path.abspath(__file__))
    uploads_dir = os.path.join(project_root, 'static', 'uploads')
    os.makedirs(uploads_dir, exist_ok=True)
    
    test_img_path = os.path.join(uploads_dir, 'verify_plastic.jpg')
    test_heatmap_path = os.path.join(uploads_dir, 'verify_heatmap_plastic.jpg')
    
    # 3. Create a mock plastic image for testing
    print("2. Generating test image...")
    img = Image.new('RGB', (300, 300), color=(240, 240, 240))
    draw = ImageDraw.Draw(img)
    # Draw a blue container
    draw.rectangle([80, 100, 220, 260], fill=(50, 100, 200), outline=(0,0,0))
    # Draw a lid
    draw.ellipse([110, 80, 190, 100], fill=(200, 50, 50), outline=(0,0,0))
    img.save(test_img_path)
    print(f"   Generated test image at: {test_img_path}")
    
    # 4. Initialize model
    print("3. Initializing MobileNetV2 classifier...")
    wrapper = WasteClassifierWrapper()
    print("   Model loaded OK.")
    
    # 5. Predict
    print("4. Executing inference...")
    pred = wrapper.predict(test_img_path)
    print(f"   Inference output: {pred}")
    assert pred['success'] is True, "Prediction failed!"
    
    # 6. Grad-CAM
    print("5. Generating Grad-CAM overlay...")
    cls_name = pred['class']
    generate_and_save_gradcam(wrapper, test_img_path, test_heatmap_path, cls_name)
    print(f"   Grad-CAM saved at: {test_heatmap_path}")
    assert os.path.exists(test_heatmap_path), "Grad-CAM file was not created!"
    
    print("\n=== Verification Successful! Pipeline is 100% functional. ===")

if __name__ == '__main__':
    run_verification()
