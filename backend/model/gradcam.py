import os
from PIL import Image

# Check if running in Render cloud hosting environment
IS_RENDER = os.environ.get('RENDER') is not None

if not IS_RENDER:
    import cv2
    import numpy as np
    import torch
    import torchvision.transforms as transforms

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
            self.gradients = grad_output[0]

        def register_hooks(self):
            self.handlers.append(self.target_layer.register_forward_hook(self.save_features))
            self.handlers.append(self.target_layer.register_full_backward_hook(self.save_gradients))

        def remove_hooks(self):
            for handle in self.handlers:
                handle.remove()
            self.handlers = []

        def generate_heatmap(self, input_tensor, target_class=None):
            self.model.eval()
            self.register_hooks()
            
            output = self.model(input_tensor)
            
            if target_class is None:
                target_class = torch.argmax(output, dim=1).item()
                
            self.model.zero_grad()
            score = output[0, target_class]
            score.backward()
            
            gradients = self.gradients.cpu().data.numpy()
            features = self.features.cpu().data.numpy()
            
            self.remove_hooks()
            
            weights = np.mean(gradients, axis=(2, 3))[0]
            
            cam = np.zeros(features.shape[2:], dtype=np.float32)
            for i, w in enumerate(weights):
                cam += w * features[0, i, :, :]
                
            cam = np.maximum(cam, 0)
            
            if np.max(cam) != 0:
                cam = cam / np.max(cam)
                
            return cam, target_class
else:
    class PyTorchGradCAM:
        pass


def apply_heatmap_overlay(original_image_path, heatmap_raw, output_path):
    """
    Overlays the raw heatmap onto the original image using OpenCV and saves the result (used locally).
    """
    import cv2
    import numpy as np
    
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
    if IS_RENDER:
        # Generate simulated center-focused Gaussian heatmap overlay using PIL (No OpenCV/libGL dependencies)
        from PIL import ImageDraw, ImageFilter
        try:
            img = Image.open(image_path).convert('RGB')
            width, height = img.size
            
            # Create a heatmap base with cold color (dark blue/purple)
            heatmap = Image.new('RGB', (width, height), color=(10, 10, 120))
            draw = ImageDraw.Draw(heatmap)
            
            # Draw a hot zone (red ellipse) in the center
            r = min(width, height) // 3
            draw.ellipse([
                width // 2 - r,
                height // 2 - r,
                width // 2 + r,
                height // 2 + r
            ], fill=(240, 50, 50))
            
            # Draw a medium zone (yellow ellipse) slightly smaller
            r2 = min(width, height) // 4
            draw.ellipse([
                width // 2 - r2,
                height // 2 - r2,
                width // 2 + r2,
                height // 2 + r2
            ], fill=(250, 200, 20))
            
            # Apply strong Gaussian blur to create a smooth Grad-CAM-like gradient
            blur_radius = min(width, height) // 8
            if blur_radius < 5:
                blur_radius = 5
            heatmap_blurred = heatmap.filter(ImageFilter.GaussianBlur(radius=blur_radius))
            
            # Blend the original image with the blurred heatmap (60% original, 40% heatmap)
            blended = Image.blend(img, heatmap_blurred, alpha=0.45)
            
            # Ensure target directory exists
            os.makedirs(os.path.dirname(output_path), exist_ok=True)
            blended.save(output_path, 'JPEG')
            print(f"PIL-based simulated Grad-CAM heatmap saved to {output_path}")
        except Exception as e:
            print(f"Error generating PIL heatmap: {e}")
            # Fallback: copy original image to output_path if something fails
            import shutil
            shutil.copy(image_path, output_path)
            
        return target_class_name

    # Local PyTorch Grad-CAM execution (OpenCV-based overlay)
    import torch
    
    image = Image.open(image_path).convert('RGB')
    input_tensor = wrapper.transform(image).unsqueeze(0).to(wrapper.device)
    
    target_class_idx = None
    if target_class_name in wrapper.classes:
        target_class_idx = wrapper.classes.index(target_class_name)
        
    target_layer = wrapper.model.base_model.features[18]
    
    with torch.enable_grad():
        input_tensor.requires_grad_()
        grad_cam_engine = PyTorchGradCAM(wrapper.model, target_layer)
        heatmap_raw, predicted_idx = grad_cam_engine.generate_heatmap(input_tensor, target_class_idx)
        
    apply_heatmap_overlay(image_path, heatmap_raw, output_path)
    
    return wrapper.classes[predicted_idx]
