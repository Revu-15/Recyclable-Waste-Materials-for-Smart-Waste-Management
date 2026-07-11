import os
import argparse
import time
import json
import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import DataLoader, Dataset
import torchvision.transforms as transforms
import torchvision.models as models
from torchvision.datasets import ImageFolder
from sklearn.metrics import classification_report, confusion_matrix, precision_recall_fscore_support
import matplotlib.pyplot as plt
import numpy as np
from PIL import Image, ImageDraw

CLASSES = [
    'Plastic', 'Paper', 'Cardboard', 'Glass', 'Metal',
    'Organic Waste', 'Clothes', 'Battery', 'Electronic Waste', 'Trash'
]

# Generate synthetic dataset for instant test run
def generate_synthetic_dataset(base_dir, num_samples_per_class=15):
    print(f"Generating synthetic dataset at {base_dir} to allow instant testing...")
    splits = ['train', 'val', 'test']
    
    # Ratios: 60% train, 20% val, 20% test
    split_counts = {
        'train': int(num_samples_per_class * 0.6),
        'val': int(num_samples_per_class * 0.2),
        'test': int(num_samples_per_class * 0.2)
    }
    
    # Ensure counts are at least 3, 1, 1
    for k in split_counts:
        if split_counts[k] < 1:
            split_counts[k] = 1
            
    for split in splits:
        split_dir = os.path.join(base_dir, split)
        for idx, cls in enumerate(CLASSES):
            cls_dir = os.path.join(split_dir, cls)
            os.makedirs(cls_dir, exist_ok=True)
            
            count = split_counts[split]
            for i in range(count):
                # Create a 224x224 RGB image with random colored geometric shapes
                # representing synthetic waste
                img = Image.new('RGB', (224, 224), color=(
                    np.random.randint(180, 255) if 'Organic' in cls else np.random.randint(220, 255),
                    np.random.randint(180, 255) if 'Glass' in cls else np.random.randint(220, 255),
                    np.random.randint(180, 255) if 'Metal' in cls else np.random.randint(220, 255)
                ))
                draw = ImageDraw.Draw(img)
                
                # Draw geometric shapes to simulate material features
                for _ in range(3):
                    shape_type = np.random.choice(['ellipse', 'rectangle', 'polygon'])
                    coords = [np.random.randint(10, 200) for _ in range(4)]
                    x1, y1 = min(coords[0], coords[2]), min(coords[1], coords[3])
                    x2, y2 = max(coords[0], coords[2]), max(coords[1], coords[3])
                    if x2 - x1 < 10: x2 += 15
                    if y2 - y1 < 10: y2 += 15
                    
                    color = (np.random.randint(0, 200), np.random.randint(0, 200), np.random.randint(0, 200))
                    if shape_type == 'ellipse':
                        draw.ellipse([x1, y1, x2, y2], fill=color, outline=0)
                    elif shape_type == 'rectangle':
                        draw.rectangle([x1, y1, x2, y2], fill=color, outline=0)
                    else:
                        draw.polygon([(x1, y1), (x2, y1), ((x1+x2)//2, y2)], fill=color, outline=0)
                        
                # Add some simulated texture or text for the class
                draw.text((10, 10), f"SIM_{cls}_{i}", fill=(0,0,0))
                
                img_path = os.path.join(cls_dir, f"{cls.lower().replace(' ', '_')}_{i}.jpg")
                img.save(img_path)
    print("Synthetic dataset successfully created!")

def train_model(dataset_dir, output_dir, epochs=5, batch_size=8, lr=0.001):
    os.makedirs(output_dir, exist_ok=True)
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    print(f"Training on device: {device}")
    
    # 1. Image preprocessing and augmentation
    train_transforms = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.RandomHorizontalFlip(),
        transforms.RandomRotation(15),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
    ])
    
    val_transforms = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
    ])
    
    # Check if dataset exists, if not build synthetic one
    train_path = os.path.join(dataset_dir, 'train')
    if not os.path.exists(train_path):
        generate_synthetic_dataset(dataset_dir)
        
    # Load dataset splits
    try:
        train_dataset = ImageFolder(os.path.join(dataset_dir, 'train'), transform=train_transforms)
        val_dataset = ImageFolder(os.path.join(dataset_dir, 'val'), transform=val_transforms)
        test_dataset = ImageFolder(os.path.join(dataset_dir, 'test'), transform=val_transforms)
    except Exception as e:
        print(f"Error loading ImageFolder datasets: {e}")
        print("Re-generating clean synthetic dataset...")
        generate_synthetic_dataset(dataset_dir, num_samples_per_class=20)
        train_dataset = ImageFolder(os.path.join(dataset_dir, 'train'), transform=train_transforms)
        val_dataset = ImageFolder(os.path.join(dataset_dir, 'val'), transform=val_transforms)
        test_dataset = ImageFolder(os.path.join(dataset_dir, 'test'), transform=val_transforms)

    train_loader = DataLoader(train_dataset, batch_size=batch_size, shuffle=True)
    val_loader = DataLoader(val_dataset, batch_size=batch_size, shuffle=False)
    test_loader = DataLoader(test_dataset, batch_size=batch_size, shuffle=False)
    
    # 2. Transfer Learning: MobileNetV2
    # Import locally from classifier module to maintain class architecture consistency
    from backend.model.classifier import PyTorchWasteClassifier
    model = PyTorchWasteClassifier(num_classes=len(CLASSES))
    model.to(device)
    
    # Loss function and optimizer
    criterion = nn.CrossEntropyLoss()
    # Only optimize classifier parameters (frozen backbone layers are ignored)
    optimizer = optim.Adam(model.base_model.classifier.parameters(), lr=lr)
    
    # Training Loop
    history = {'train_loss': [], 'train_acc': [], 'val_loss': [], 'val_acc': []}
    
    best_val_acc = 0.0
    for epoch in range(epochs):
        model.train()
        running_loss = 0.0
        correct = 0
        total = 0
        
        for images, labels in train_loader:
            images, labels = images.to(device), labels.to(device)
            optimizer.zero_grad()
            outputs = model(images)
            loss = criterion(outputs, labels)
            loss.backward()
            optimizer.step()
            
            running_loss += loss.item() * images.size(0)
            _, predicted = outputs.max(1)
            total += labels.size(0)
            correct += predicted.eq(labels).sum().item()
            
        epoch_train_loss = running_loss / len(train_dataset)
        epoch_train_acc = (correct / total) * 100
        
        # Validation pass
        model.eval()
        running_val_loss = 0.0
        val_correct = 0
        val_total = 0
        
        with torch.no_grad():
            for images, labels in val_loader:
                images, labels = images.to(device), labels.to(device)
                outputs = model(images)
                loss = criterion(outputs, labels)
                
                running_val_loss += loss.item() * images.size(0)
                _, predicted = outputs.max(1)
                val_total += labels.size(0)
                val_correct += predicted.eq(labels).sum().item()
                
        epoch_val_loss = running_val_loss / len(val_dataset)
        epoch_val_acc = (val_correct / val_total) * 100
        
        history['train_loss'].append(epoch_train_loss)
        history['train_acc'].append(epoch_train_acc)
        history['val_loss'].append(epoch_val_loss)
        history['val_acc'].append(epoch_val_acc)
        
        print(f"Epoch {epoch+1}/{epochs} | Train Loss: {epoch_train_loss:.4f} | Train Acc: {epoch_train_acc:.2f}% | Val Loss: {epoch_val_loss:.4f} | Val Acc: {epoch_val_acc:.2f}%")
        
        # Save best model
        if epoch_val_acc > best_val_acc:
            best_val_acc = epoch_val_acc
            torch.save(model.state_dict(), os.path.join(output_dir, 'waste_model.pth'))
            print(f"--> Saved new best model with Val Acc {epoch_val_acc:.2f}%")
            
    print("Training finished!")
    
    # 3. Model Evaluation
    model.load_state_dict(torch.load(os.path.join(output_dir, 'waste_model.pth')))
    model.eval()
    
    all_preds = []
    all_labels = []
    
    with torch.no_grad():
        for images, labels in test_loader:
            images = images.to(device)
            outputs = model(images)
            _, preds = outputs.max(1)
            all_preds.extend(preds.cpu().numpy())
            all_labels.extend(labels.numpy())
            
    # Calculate performance metrics
    precision, recall, f1, _ = precision_recall_fscore_support(all_labels, all_preds, average='macro', zero_division=0)
    test_correct = sum([1 for p, l in zip(all_preds, all_labels) if p == l])
    test_acc = (test_correct / len(all_labels)) * 100
    
    print("\n--- Test Set Evaluation ---")
    print(f"Accuracy: {test_acc:.2f}%")
    print(f"Precision (Macro): {precision:.4f}")
    print(f"Recall (Macro): {recall:.4f}")
    print(f"F1 Score (Macro): {f1:.4f}")
    
    # Print Classification Report
    target_names = [CLASSES[i] for i in sorted(list(set(all_labels)))]
    report = classification_report(all_labels, all_preds, target_names=target_names, zero_division=0)
    print("\nClassification Report:\n", report)
    
    # Generate and save Confusion Matrix plot
    cm = confusion_matrix(all_labels, all_preds)
    plt.figure(figsize=(10, 8))
    plt.imshow(cm, interpolation='nearest', cmap=plt.cm.Greens)
    plt.title('Confusion Matrix')
    plt.colorbar()
    tick_marks = np.arange(len(target_names))
    plt.xticks(tick_marks, target_names, rotation=45)
    plt.yticks(tick_marks, target_names)
    plt.tight_layout()
    plt.ylabel('True label')
    plt.xlabel('Predicted label')
    
    plots_dir = os.path.join(os.path.dirname(output_dir), 'reports', 'plots')
    os.makedirs(plots_dir, exist_ok=True)
    plt.savefig(os.path.join(plots_dir, 'confusion_matrix.png'))
    plt.close()
    
    # Generate and save training curves
    plt.figure(figsize=(12, 5))
    plt.subplot(1, 2, 1)
    plt.plot(history['train_loss'], label='Train Loss')
    plt.plot(history['val_loss'], label='Val Loss')
    plt.title('Training & Validation Loss')
    plt.xlabel('Epoch')
    plt.ylabel('Loss')
    plt.legend()
    
    plt.subplot(1, 2, 2)
    plt.plot(history['train_acc'], label='Train Acc')
    plt.plot(history['val_acc'], label='Val Acc')
    plt.title('Training & Validation Accuracy')
    plt.xlabel('Epoch')
    plt.ylabel('Accuracy (%)')
    plt.legend()
    
    plt.savefig(os.path.join(plots_dir, 'training_curves.png'))
    plt.close()
    
    # Save training report summary
    report_summary = {
        'accuracy': float(test_acc),
        'precision': float(precision),
        'recall': float(recall),
        'f1_score': float(f1),
        'epochs': epochs,
        'batch_size': batch_size,
        'learning_rate': lr,
        'history': history,
        'confusion_matrix': cm.tolist()
    }
    
    with open(os.path.join(output_dir, 'training_report.json'), 'w') as f:
        json.dump(report_summary, f, indent=4)
        
    print(f"Confusion Matrix and curves saved to {plots_dir}")
    print(f"Training report saved to {output_dir}/training_report.json")
    
    return report_summary

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Train Recyclable Waste Classifier')
    parser.add_argument('--dataset_dir', type=str, default='dataset', help='Dataset root directory')
    parser.add_argument('--output_dir', type=str, default='saved_models', help='Directory to save model weights')
    parser.add_argument('--epochs', type=int, default=3, help='Number of epochs')
    parser.add_argument('--batch_size', type=int, default=8, help='Batch size')
    parser.add_argument('--lr', type=float, default=0.001, help='Learning rate')
    
    args = parser.parse_args()
    
    # Adjust paths relative to project root
    project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    ds_path = os.path.join(project_root, args.dataset_dir)
    out_path = os.path.join(project_root, args.output_dir)
    
    train_model(ds_path, out_path, epochs=args.epochs, batch_size=args.batch_size, lr=args.lr)
