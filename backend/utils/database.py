import sqlite3
import os

DB_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'waste_management.db')

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Create prediction history table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS predictions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            image_name TEXT NOT NULL,
            original_image_path TEXT NOT NULL,
            heatmap_image_path TEXT,
            predicted_class TEXT NOT NULL,
            confidence REAL NOT NULL,
            processing_time REAL NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            user_feedback TEXT,
            explain_text TEXT,
            recycling_instructions TEXT,
            environmental_tip TEXT
        )
    ''')
    
    # Create retraining logs table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS retraining_logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            status TEXT NOT NULL, -- 'running', 'completed', 'failed'
            total_epochs INTEGER,
            current_epoch INTEGER,
            logs TEXT, -- JSON or string logs
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            completed_at TIMESTAMP
        )
    ''')
    
    # Insert some dummy records if the table is empty, to make the dashboard look interesting out-of-the-box
    cursor.execute('SELECT COUNT(*) FROM predictions')
    if cursor.fetchone()[0] == 0:
        dummy_data = [
            ('plastic_bottle.jpg', '/static/uploads/plastic_bottle.jpg', '/static/uploads/heatmap_plastic_bottle.jpg', 'Plastic', 98.45, 0.24, '2026-07-11 10:15:30', 'This item is recyclable. Please clean the bottle before placing it in the plastic recycling bin.', 'Recycling one plastic bottle saves energy and reduces landfill waste.'),
            ('newspaper.jpg', '/static/uploads/newspaper.jpg', '/static/uploads/heatmap_newspaper.jpg', 'Paper', 94.20, 0.18, '2026-07-11 11:22:15', 'This item is recyclable. Keep it dry and discard it in the paper recycling bin.', 'Recycling paper saves trees, water, and energy compared to producing new paper.'),
            ('apple_core.jpg', '/static/uploads/apple_core.jpg', None, 'Organic Waste', 99.12, 0.32, '2026-07-11 12:45:00', 'Organic waste is biodegradable. Place it in the compost bin.', 'Composting organic waste reduces methane emissions from landfills.'),
            ('cardboard_box.jpg', '/static/uploads/cardboard_box.jpg', '/static/uploads/heatmap_cardboard_box.jpg', 'Cardboard', 97.60, 0.21, '2026-07-11 14:05:12', 'Recyclable. Flatten the box and place it in the cardboard recycling bin.', 'Recycling 1 ton of cardboard saves 9 cubic yards of landfill space.'),
            ('wine_bottle.jpg', '/static/uploads/wine_bottle.jpg', '/static/uploads/heatmap_wine_bottle.jpg', 'Glass', 96.15, 0.28, '2026-07-11 15:30:22', 'Glass is 100% recyclable. Rinse it and put it in the glass container.', 'Glass can be recycled endlessly without losing quality or purity.')
        ]
        for item in dummy_data:
            cursor.execute('''
                INSERT INTO predictions (image_name, original_image_path, heatmap_image_path, predicted_class, confidence, processing_time, created_at, recycling_instructions, environmental_tip)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', item)
            
    conn.commit()
    conn.close()

if __name__ == '__main__':
    # Test DB init
    init_db()
    print("Database initialized successfully.")
