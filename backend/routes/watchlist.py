from flask import Blueprint, request, jsonify
from db import get_db_connection

watchlist_bp = Blueprint('watchlist', __name__)

@watchlist_bp.route('/<int:user_id>', methods=['GET'])
def get_watchlist(user_id):
    """Fetches all movies currently sitting on a specific user's watchlist."""
    connection = get_db_connection()
    if not connection:
        return jsonify({"status": "error", "message": "Database connection failed."}), 500

    cursor = connection.cursor(dictionary=True)
    try:
        # A relational JOIN to fetch complete movie records attached to a user's watchlist
        query = """
            SELECT w.watchlist_id, w.added_date, m.movie_id, m.title, m.release_year, m.imdb_rating, m.poster_url
            FROM watchlist w
            JOIN movies m ON w.movie_id = m.movie_id
            WHERE w.user_id = %s
            ORDER BY w.added_date DESC
        """
        cursor.execute(query, (user_id,))
        watchlist_items = cursor.fetchall()
        
        cursor.close()
        connection.close()
        return jsonify({"status": "success", "data": watchlist_items}), 200
    except Exception as e:
        cursor.close()
        connection.close()
        return jsonify({"status": "error", "message": f"Database error: {str(e)}"}), 500


@watchlist_bp.route('/add', methods=['POST'])
def add_to_watchlist():
    """Inserts a new relationship record mapping a user to a specific movie."""
    data = request.get_json()
    user_id = data.get('user_id')
    movie_id = data.get('movie_id')

    if not user_id or not movie_id:
        return jsonify({"status": "error", "message": "Missing user_id or movie_id."}), 400

    connection = get_db_connection()
    if not connection:
        return jsonify({"status": "error", "message": "Database connection failed."}), 500

    cursor = connection.cursor(dictionary=True)
    try:
        # Prevent adding duplicates to the watchlist
        cursor.execute("SELECT watchlist_id FROM watchlist WHERE user_id = %s AND movie_id = %s", (user_id, movie_id))
        if cursor.fetchone():
            cursor.close()
            connection.close()
            return jsonify({"status": "error", "message": "Movie is already in your watchlist."}), 400

        query = "INSERT INTO watchlist (user_id, movie_id) VALUES (%s, %s)"
        cursor.execute(query, (user_id, movie_id))
        connection.commit()
        
        cursor.close()
        connection.close()
        return jsonify({"status": "success", "message": "Movie added to watchlist successfully!"}), 201
    except Exception as e:
        cursor.close()
        connection.close()
        return jsonify({"status": "error", "message": f"Database error: {str(e)}"}), 500


@watchlist_bp.route('/remove', methods=['DELETE'])
def remove_from_watchlist():
    """Deletes a relationship entry from the watchlist table."""
    data = request.get_json()
    user_id = data.get('user_id')
    movie_id = data.get('movie_id')

    connection = get_db_connection()
    if not connection:
        return jsonify({"status": "error", "message": "Database connection failed."}), 500

    cursor = connection.cursor(dictionary=True)
    try:
        query = "DELETE FROM watchlist WHERE user_id = %s AND movie_id = %s"
        cursor.execute(query, (user_id, movie_id))
        connection.commit()
        
        cursor.close()
        connection.close()
        return jsonify({"status": "success", "message": "Movie removed from watchlist."}), 200
    except Exception as e:
        cursor.close()
        connection.close()
        return jsonify({"status": "error", "message": f"Database error: {str(e)}"}), 500