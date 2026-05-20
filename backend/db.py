import mysql.connector
from mysql.connector import pooling
import sys

db_config = {
    "database": "movie_recommendation",
    "user": "root",
    "password": "Shivam@123", 
    "host": "localhost",
    "port": 3306                        
}

try:
    # Creating a connection pool without the unsupported pool_reset_mode parameter
    db_pool = pooling.MySQLConnectionPool(
        pool_name="movie_pool",
        pool_size=5,
        **db_config
    )
    print("Database connection pool created successfully.")
except mysql.connector.Error as err:
    print(f"Error creating connection pool: {err}")
    sys.exit(1)

def get_db_connection():
    """Fetches a connection from the connection pool."""
    try:
        connection = db_pool.get_connection()
        return connection
    except mysql.connector.Error as err:
        print(f"Failed to get connection from pool: {err}")
        return None