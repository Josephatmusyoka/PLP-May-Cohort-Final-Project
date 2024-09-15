from flask import Flask, render_template, request, redirect, session, url_for, jsonify
import sqlite3
from datetime import datetime
import os

app = Flask(__name__)

# Generate a secret key
secret_key = os.urandom(24).hex()

# Set the secret key for the application
app.secret_key = secret_key

# Function to create a database table
def create_table():
    conn = sqlite3.connect('databases/users.db')
    cursor = conn.cursor()
    cursor.execute('''CREATE TABLE IF NOT EXISTS users
                      (UserID INTEGER PRIMARY KEY AUTOINCREMENT,
                       Username TEXT UNIQUE,
                       Password TEXT,
                       FullName TEXT,
                       Email TEXT,
                       Role TEXT,
                       RegistrationDate TEXT)''')
    conn.commit()
    conn.close()
    # Function to create a database table for items
def create_table():
    conn = sqlite3.connect('databases/products.db')
    cursor = conn.cursor()
    cursor.execute('''CREATE TABLE IF NOT EXISTS items
                      (ProductID INTEGER PRIMARY KEY AUTOINCREMENT,
                       ProductName TEXT,
                       Category TEXT,
                       Cost_Price REAL,
                       Wholesale_Price REAL,
                       SupplierID INTEGER,
                       Description TEXT,
                       Stock_Quantity INTEGER,
                       Reorder_Level INTEGER)''')
    conn.commit()
    conn.close()

# Function to fetch sales report from database
def fetch_sales_report():
    connection = sqlite3.connect('databases/sales_report.db')
    cursor = connection.cursor()
    cursor.execute("SELECT * FROM sales")
    sales_data = cursor.fetchall()
    connection.close()
    return sales_data

# Function to fetch items out of stock report from database
def fetch_out_of_stock_report():
    # Connect to the SQLite database
    connection = sqlite3.connect('databases/items_out_of_stock.db')
    cursor = connection.cursor()
    
    # Execute query to fetch out of stock items
    cursor.execute("SELECT * FROM items WHERE stock_quantity = 0")
    out_of_stock_items = cursor.fetchall()
    
    # Close the connection
    connection.close()
    
    return out_of_stock_items

@app.route('/reports')
def get_sales_report():
    sales_data = fetch_sales_report()
    return render_template('reports.html', sales_data=sales_data)

@app.route('/out_of_stock_report')
def get_out_of_stock_report():
    out_of_stock_items = fetch_out_of_stock_report()
    return jsonify(out_of_stock_items)


# Function to insert user data into the database
def insert_user(username, password, full_name, email, role):
    conn = sqlite3.connect('databases/users.db')
    cursor = conn.cursor()
    registration_date = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    
    try:
        cursor.execute("INSERT INTO users (Username, Password, FullName, Email, Role, RegistrationDate) VALUES (?, ?, ?, ?, ?, ?)",
                       (username, password, full_name, email, role, registration_date))
        conn.commit()
    except sqlite3.IntegrityError:
        # Handle the case where the username already exists
        conn.rollback()
        raise ValueError("Username already exists")
    finally:
        conn.close()


# Route for the initial page (register.html)
@app.route('/', methods=['GET', 'POST'])
@app.route('/register', methods=['GET', 'POST'])
def register():
    error = None
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        full_name = request.form['full_name']
        email = request.form['email']
        role = request.form['role']
        
        try:
            insert_user(username, password, full_name, email, role)
            return redirect('/login')  # Redirect to login page after successful registration
        except ValueError as e:
            error = str(e)  # Get the error message
            
    return render_template('register.html', error=error)


# Function to retrieve user data from the database based on username
def get_user(username):
    conn = sqlite3.connect('databases/users.db')
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users WHERE Username=?", (username,))
    user = cursor.fetchone()
    conn.close()
    return user

# Route for the login page
@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        
        user = get_user(username)
        if user and user[2] == password:  # Check if user exists and password matches
            session['username'] = username  # Store username in session
            return redirect('/dashboard')  # Redirect to dashboard page
        else:
            return render_template('login.html', error='Invalid username or password')  # Render login page with error message
    
    return render_template('login.html')


# Route for the dashboard page
@app.route('/dashboard')
def dashboard():
    if 'username' in session:
        return render_template('dashboard.html')
    else:
        return redirect('/login')

# Define route for earnings graph data
@app.route('/dashboard/earningsGraph/')
def get_earnings_graph_data():
    # Placeholder data for the earnings graph
    data = {
        "labels": ["January", "February", "March", "April", "May"],
        "datasets": [{
            "label": "Earnings",
            "data": [1000, 2000, 1500, 2500, 1800],  # Example earnings data
            "backgroundColor": "rgba(255, 99, 132, 0.2)",
            "borderColor": "rgba(255, 99, 132, 1)",
            "borderWidth": 1
        }]
    }
    
    # Return the data as JSON response
    return jsonify(data)

# Route to render the Transactions page
@app.route('/transactions')
def transactions():
    return render_template('transactions.html')

# Function to retrieve all items from the database
def get_all_items():
    conn = sqlite3.connect('databases/products.db')
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM items")
    items = cursor.fetchall()
    conn.close()
    return items

# Route to render the Items page and handle adding new item, displaying list of existing products,
# and update stock and edit item modals
@app.route('/items', methods=['GET', 'POST'])
def items():
    if 'username' in session:
        if request.method == 'POST':
            # Logic for adding new item
            # Retrieve form data and insert into database
            # Redirect or render as needed
            pass
        
        items = get_all_items()  # Fetch all items from the database
        return render_template('items.html', items=items)
    else:
        return redirect('/login')

# Route to render the Reports page
@app.route('/reports')
def reports():
    return render_template('reports.html')

# Route to render the User Management page
@app.route('/user_management')
def user_management():
    return render_template('user_management.html')

# Route for logout
@app.route('/logout')
def logout():
    session.pop('username', None)  # Remove username from session
    return redirect('/login')  # Redirect to login page

if __name__ == '__main__':
    create_table()  # Create the database table if it doesn't exist
    app.run(debug=True)
