from flask import Flask, jsonify
from flask_cors import CORS
from db import get_db_connection

# Importing all modular router blueprints
from routes.auth import auth_bp
from routes.movies import movies_bp
from routes.watchlist import watchlist_bp
from routes.recommendations import recommendations_bp

app = Flask(__name__)
CORS(app) # Broad connection access for upcoming React development

# Registering paths cleanly to build a scalable API design
app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(movies_bp, url_prefix='/api/movies')
app.register_blueprint(watchlist_bp, url_prefix='/api/watchlist')
app.register_blueprint(recommendations_bp, url_prefix='/api/recommendations')

@app.route('/', methods=['GET'])
def home():
    """Health-check route to verify backend status and database connectivity."""
    connection = get_db_connection()
    if connection and connection.is_connected():
        cursor = connection.cursor(dictionary=True)
        try:
            cursor.execute("SELECT COUNT(*) as movie_count FROM movies;")
            result = cursor.fetchone()
            cursor.close()
            connection.close()
            return jsonify({
                "status": "success",
                "message": "Smart Movie Recommendation Backend is running cleanly!",
                "database_connected": True,
                "total_movies_in_db": result['movie_count']
            }), 200
        except Exception as e:
            cursor.close()
            connection.close()
            return jsonify({"status": "error", "message": f"Query failed: {str(e)}"}), 500
    else:
        return jsonify({
            "status": "error", 
            "message": "Backend running, but unable to connect to the database."
        }), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)