from flask import Blueprint, request, jsonify
from db import get_db_connection

# Creating a blueprint for routing authentication paths cleanly
auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    
    # Extracting incoming user registration data
    username = data.get('username')
    email = data.get('email')
    password = data.get('password') # In a production app we would hash this, keeping it simple for DBMS verification
    full_name = data.get('full_name')
    age = data.get('age')
    gender = data.get('gender')

    if not username or not email or not password:
        return jsonify({"status": "error", "message": "Missing required fields (username, email, password)."}), 400

    connection = get_db_connection()
    if not connection:
        return jsonify({"status": "error", "message": "Database connection failed."}), 500

    cursor = connection.cursor(dictionary=True)
    try:
        # Check if username or email already exists to prevent duplicates
        cursor.execute("SELECT user_id FROM users WHERE username = %s OR email = %s", (username, email))
        if cursor.fetchone():
            cursor.close()
            connection.close()
            return jsonify({"status": "error", "message": "Username or Email already registered."}), 400

        # Insert fresh user record into the DB
        query = """
            INSERT INTO users (username, email, password, full_name, age, gender) 
            VALUES (%s, %s, %s, %s, %s, %s)
        """
        cursor.execute(query, (username, email, password, full_name, age, gender))
        connection.commit()
        
        cursor.close()
        connection.close()
        return jsonify({"status": "success", "message": "User registered successfully!"}), 201

    except Exception as e:
        cursor.close()
        connection.close()
        return jsonify({"status": "error", "message": f"Database error: {str(e)}"}), 500


@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({"status": "error", "message": "Please provide both username and password."}), 400

    connection = get_db_connection()
    if not connection:
        return jsonify({"status": "error", "message": "Database connection failed."}), 500

    cursor = connection.cursor(dictionary=True)
    try:
        # Verify user credentials
        cursor.execute("SELECT user_id, username, full_name FROM users WHERE username = %s AND password = %s", (username, password))
        user = cursor.fetchone()
        
        cursor.close()
        connection.close()

        if user:
            return jsonify({
                "status": "success",
                "message": f"Welcome back, {user['full_name']}!",
                "user": {
                    "user_id": user['user_id'],
                    "username": user['username'],
                    "full_name": user['full_name']
                }
            }), 200
        else:
            return jsonify({"status": "error", "message": "Invalid username or password."}), 401

    except Exception as e:
        cursor.close()
        connection.close()
        return jsonify({"status": "error", "message": f"Database error: {str(e)}"}), 500