import sqlite3

# Connect to the SQLite database
conn = sqlite3.connect('databases/products.db')
cursor = conn.cursor()

# Create a table for products
cursor.execute('''CREATE TABLE IF NOT EXISTS Products (
                    ProductID INTEGER PRIMARY KEY,
                    ProductName VARCHAR(255),
                    Category VARCHAR(255),
                    CostPrice DECIMAL(10, 2),
                    WholesalePrice DECIMAL(10, 2),
                    SupplierID INTEGER,
                    Description TEXT,
                    StockQuantity INTEGER,
                    ReorderLevel INTEGER
                )''')

# Sample data for products
products_data = [
    (1, 'T-shirt', 'Clothing', 15.99, 25.99, 1, 'Cotton T-shirt', 100, 20),
    (2, 'Jeans', 'Clothing', 29.99, 45.99, 2, 'Blue denim jeans', 80, 30),
    (3, 'Sneakers', 'Footwear', 39.99, 59.99, 3, 'Sporty sneakers', 50, 15),
    (4, 'Dress', 'Clothing', 49.99, 69.99, 1, 'Elegant evening dress', 60, 25),
    (5, 'Watch', 'Accessories', 99.99, 149.99, 4, 'Stylish wristwatch', 30, 10),
    (6, 'Hoodie', 'Clothing', 39.99, 59.99, 2, 'Warm hoodie', 70, 25),
    (7, 'Sunglasses', 'Accessories', 19.99, 29.99, 5, 'UV protection sunglasses', 40, 15),
    (8, 'Running Shoes', 'Footwear', 59.99, 89.99, 3, 'Lightweight running shoes', 50, 20),
    (9, 'Skirt', 'Clothing', 29.99, 49.99, 1, 'Floral printed skirt', 40, 10),
    (10, 'Backpack', 'Accessories', 49.99, 79.99, 6, 'Water-resistant backpack', 60, 30),
    (11, 'Formal Shirt', 'Clothing', 24.99, 39.99, 2, 'Crisp white shirt', 90, 25),
    (12, 'Necklace', 'Accessories', 39.99, 59.99, 7, 'Elegant necklace', 35, 15),
    (13, 'Sandals', 'Footwear', 19.99, 34.99, 3, 'Comfortable sandals', 65, 20),
    (14, 'Blouse', 'Clothing', 34.99, 49.99, 1, 'Stylish blouse', 55, 15),
    (15, 'Handbag', 'Accessories', 69.99, 99.99, 8, 'Designer handbag', 25, 10),
    (16, 'Polo Shirt', 'Clothing', 19.99, 29.99, 2, 'Classic polo shirt', 85, 20),
    (17, 'Bracelet', 'Accessories', 29.99, 49.99, 9, 'Fashionable bracelet', 45, 15),
    (18, 'Flip Flops', 'Footwear', 9.99, 19.99, 3, 'Casual flip flops', 80, 25),
    (19, 'Jacket', 'Clothing', 59.99, 89.99, 2, 'Waterproof jacket', 30, 10),
    (20, 'Wallet', 'Accessories', 24.99, 39.99, 10, 'Leather wallet', 55, 15),
    (21, 'Boots', 'Footwear', 79.99, 119.99, 3, 'Stylish leather boots', 40, 20),
    (22, 'Sweater', 'Clothing', 34.99, 54.99, 2, 'Cozy knitted sweater', 70, 25),
    (23, 'Earrings', 'Accessories', 19.99, 29.99, 11, 'Chic earrings', 60, 30),
    (24, 'Slippers', 'Footwear', 14.99, 24.99, 3, 'Soft house slippers', 75, 15),
    (25, 'Suit', 'Clothing', 149.99, 199.99, 2, 'Tailored suit', 20, 5),
    (26, 'Scarf', 'Accessories', 14.99, 24.99, 12, 'Fashionable scarf', 50, 20),
    (27, 'Sandals', 'Footwear', 29.99, 44.99, 3, 'Trendy summer sandals', 65, 25),
    (28, 'Maxi Dress', 'Clothing', 54.99, 84.99, 1, 'Long floral maxi dress', 40, 15),
    (29, 'Ring', 'Accessories', 39.99, 59.99, 13, 'Statement ring', 30, 10),
    (30, 'Loafers', 'Footwear', 49.99, 74.99, 3, 'Classic leather loafers', 60, 25),
    (31, 'Skater Dress', 'Clothing', 29.99, 49.99, 1, 'Flirty skater dress', 70, 30),
    (32, 'Hair Accessories', 'Accessories', 9.99, 19.99, 14, 'Assorted hair clips', 80, 35),
    (33, 'Sneakers', 'Footwear', 49.99, 79.99, 3, 'Fashion sneakers', 45, 20),
    (34, 'Pants', 'Clothing', 34.99, 54.99, 2, 'Casual trousers', 50, 25),
    (35, 'Scarf', 'Accessories', 19.99, 29.99, 15, 'Warm winter scarf', 60, 30),
    (36, 'Boots', 'Footwear', 69.99, 109.99, 3, 'Stylish ankle boots', 35, 15),
    (37, 'Jumpsuit', 'Clothing', 39.99, 59.99, 2, 'Chic jumpsuit', 25, 10),
    (38, 'Bracelet', 'Accessories', 24.99, 39.99, 16, 'Bohemian bracelet', 45, 20),
    (39, 'Sandals', 'Footwear', 24.99, 39.99, 3, 'Comfortable beach sandals', 70, 30),
    (40, 'Blazer', 'Clothing', 59.99, 89.99, 2, 'Tailored blazer', 40, 15),
    (41, 'Hat', 'Accessories', 14.99, 24.99, 17, 'Stylish fedora hat', 80, 25),
    (42, 'Heels', 'Footwear', 39.99, 64.99, 3, 'Classic high heels', 30, 10),
    (43, 'Shorts', 'Clothing', 19.99, 34.99, 2, 'Denim shorts', 55, 20),
    (44, 'Necklace', 'Accessories', 29.99, 49.99, 18, 'Layered necklace', 50, 25),
    (45, 'Sandals', 'Footwear', 29.99, 49.99, 3, 'Strappy sandals', 40, 15),
    (46, 'Top', 'Clothing', 14.99, 24.99, 2, 'Casual top', 65, 20),
    (47, 'Watch', 'Accessories', 79.99, 129.99, 19, 'Luxury watch', 35, 10),
    (48, 'Sneakers', 'Footwear', 59.99, 89.99, 3, 'Classic white sneakers', 20, 5),
    (49, 'Dress', 'Clothing', 69.99, 99.99, 2, 'Floral summer dress', 60, 30),
    (50, 'Earrings', 'Accessories', 19.99, 29.99, 20, 'Sparkling stud earrings', 45, 15)
]

# Insert sample data into the Products table
cursor.executemany('''INSERT INTO Products (
                        ProductID, ProductName, Category, CostPrice, WholesalePrice,
                        SupplierID, Description, StockQuantity, ReorderLevel
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)''', products_data)

# Commit changes and close the connection
conn.commit()
conn.close()

print("Products table created and sample data inserted successfully.")
