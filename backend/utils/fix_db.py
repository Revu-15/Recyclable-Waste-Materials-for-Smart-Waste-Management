import sqlite3
import shutil
import os

project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
db_path = os.path.join(project_root, 'waste_management.db')
uploads_dir = os.path.join(project_root, 'static', 'uploads')

# Update database paths
if os.path.exists(db_path):
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    cursor.execute("UPDATE predictions SET original_image_path = REPLACE(original_image_path, '/uploads/', '/static/uploads/')")
    cursor.execute("UPDATE predictions SET heatmap_image_path = REPLACE(heatmap_image_path, '/uploads/', '/static/uploads/') WHERE heatmap_image_path IS NOT NULL")
    conn.commit()
    conn.close()
    print("Database paths successfully updated.")

# Copy placeholder images
shutil.copy(os.path.join(uploads_dir, 'verify_plastic.jpg'), os.path.join(uploads_dir, 'plastic_bottle.jpg'))
shutil.copy(os.path.join(uploads_dir, 'verify_plastic.jpg'), os.path.join(uploads_dir, 'newspaper.jpg'))
shutil.copy(os.path.join(uploads_dir, 'verify_plastic.jpg'), os.path.join(uploads_dir, 'apple_core.jpg'))
shutil.copy(os.path.join(uploads_dir, 'verify_plastic.jpg'), os.path.join(uploads_dir, 'cardboard_box.jpg'))
shutil.copy(os.path.join(uploads_dir, 'verify_plastic.jpg'), os.path.join(uploads_dir, 'wine_bottle.jpg'))

shutil.copy(os.path.join(uploads_dir, 'verify_heatmap_plastic.jpg'), os.path.join(uploads_dir, 'heatmap_plastic_bottle.jpg'))
shutil.copy(os.path.join(uploads_dir, 'verify_heatmap_plastic.jpg'), os.path.join(uploads_dir, 'heatmap_newspaper.jpg'))
shutil.copy(os.path.join(uploads_dir, 'verify_heatmap_plastic.jpg'), os.path.join(uploads_dir, 'heatmap_cardboard_box.jpg'))
shutil.copy(os.path.join(uploads_dir, 'verify_heatmap_plastic.jpg'), os.path.join(uploads_dir, 'heatmap_wine_bottle.jpg'))
print("Placeholder images successfully copied.")
