import cv2
import numpy as np
import torch
import torchvision.transforms as transforms
from PIL import Image
import os

class PyTorchGradCAM:
    def __init__(self, model, target_layer):
        self.model = model
        self.target_layer = target_layer
        self.features = None
        self.gradients = None
        self.handlers = []

    def save_features(self, module, input, output):
        self.features = output

    def save_gradients(self, module, grad_input, grad_output):
        # grad_output is a tuple containing gradients with respect to outputs
        self.gradients = grad_output[0]

    def register_hooks(self):
        # Use register_forward_hook and register_full_backward_hook
        self.handlers.append(self.target_layer.register_forward_hook(self.save_features))
        self.handlers.append(self.target_layer.register_full_backward_hook(self.save_gradients))

    def remove_hooks(self):
        for handle in self.handlers:
            handle.remove()
        self.handlers = []

    def generate_heatmap(self, input_tensor, target_class=None):
        self.model.eval()
        self.register_hooks()
        
        # Forward pass
        output = self.model(input_tensor)
        
        if target_class is None:
            target_class = torch.argmax(output, dim=1).item()
            
        # Zero gradients
        self.model.zero_grad()
        
        # Target score for backward pass
        score = output[0, target_class]
        
        # Backward pass
        score.backward()
        
        # Generate Grad-CAM heatmap
        gradients = self.gradients.cpu().data.numpy()
        features = self.features.cpu().data.numpy()
        
        self.remove_hooks()
        
        # Shape of gradients/features is (1, channels, height, width)
        # Global average pool gradients along spatial dimensions (height, width)
        weights = np.mean(gradients, axis=(2, 3))[0]
        
        # Weighted sum of feature maps
        cam = np.zeros(features.shape[2:], dtype=np.float32)
        for i, w in enumerate(weights):
            cam += w * features[0, i, :, :]
            
        # Apply ReLU (only positive activation contributes to final class)
        cam = np.maximum(cam, 0)
        
        # Normalize between 0 and 1
        if np.max(cam) != 0:
            cam = cam / np.max(cam)
            
        return cam, target_class

def apply_heatmap_overlay(original_image_path, heatmap_raw, output_path):
    """
    Overlays the raw heatmap onto the original image using OpenCV and saves the result.
    """
    # Load original image
    img = cv2.imread(original_image_path)
    if img is None:
        raise ValueError(f"Failed to read image at {original_image_path}")
        
    height, width, _ = img.shape
    
    # Resize heatmap to match original image dimensions
    heatmap_resized = cv2.resize(heatmap_raw, (width, height))
    
    # Convert to 8-bit image (0-255 scale)
    heatmap_255 = np.uint8(255 * heatmap_resized)
    
    # Apply JET color map (blue for cold, red for hot)
    heatmap_color = cv2.applyColorMap(heatmap_255, cv2.COLORMAP_JET)
    
    # Overlay heatmap onto original image (blend with alpha-transparency)
    # 60% original image + 40% heatmap color
    overlay = cv2.addWeighted(img, 0.6, heatmap_color, 0.4, 0)
    
    # Ensure target directory exists
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    
    # Save output image
    cv2.imwrite(output_path, overlay)
    return output_path

def generate_and_save_gradcam(wrapper, image_path, output_path, target_class_name=None):
    """
    Primary interface for Grad-CAM generation in Flask.
    """
    # Preprocess image
    image = Image.open(image_path).convert('RGB')
    input_tensor = wrapper.transform(image).unsqueeze(0).to(wrapper.device)
    
    # Resolve target class index
    target_class_idx = None
    if target_class_name in wrapper.classes:
        target_class_idx = wrapper.classes.index(target_class_name)
        
    # Standard MobileNetV2 last convolutional block layer: base_model.features[18]
    target_layer = wrapper.model.base_model.features[18]
    
    # Set gradient computation
    # Grad-CAM requires gradients, so we must enable them temporarily
    with torch.enable_grad():
        # Make model inputs require grad
        input_tensor.requires_grad_()
        
        grad_cam_engine = PyTorchGradCAM(wrapper.model, target_layer)
        heatmap_raw, predicted_idx = grad_cam_engine.generate_heatmap(input_tensor, target_class_idx)
        
    # Save the blended overlay image
    apply_heatmap_overlay(image_path, heatmap_raw, output_path)
    
    return wrapper.classes[predicted_idx]
