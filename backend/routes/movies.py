from flask import Blueprint, jsonify
from db import get_db_connection

movies_bp = Blueprint('movies', __name__)

@movies_bp.route('/', methods=['GET'])
def get_all_movies():
    """Fetches all movies with their corresponding language details and aggregated genres."""
    connection = get_db_connection()
    if not connection:
        return jsonify({"status": "error", "message": "Database connection failed."}), 500

    cursor = connection.cursor(dictionary=True)
    try:
        # FIXED: Added LEFT JOINs and GROUP_CONCAT to pull genres along with the movie data
        query = """
            SELECT m.movie_id, m.title, m.release_year, m.duration, 
                   m.imdb_rating, m.description, m.poster_url, l.language_name,
                   GROUP_CONCAT(g.genre_name SEPARATOR ', ') as genres
            FROM movies m
            JOIN languages l ON m.language_id = l.language_id
            LEFT JOIN movie_genres mg ON m.movie_id = mg.movie_id
            LEFT JOIN genres g ON mg.genre_id = g.genre_id
            GROUP BY m.movie_id
            ORDER BY m.imdb_rating DESC
        """
        cursor.execute(query)
        movies = cursor.fetchall()
        
        cursor.close()
        connection.close()
        return jsonify({"status": "success", "data": movies}), 200

    except Exception as e:
        cursor.close()
        connection.close()
        return jsonify({"status": "error", "message": f"Database error: {str(e)}"}), 500


@movies_bp.route('/<int:movie_id>', methods=['GET'])
def get_movie_details(movie_id):
    """Fetches detailed structural information for a single movie, including its genres."""
    connection = get_db_connection()
    if not connection:
        return jsonify({"status": "error", "message": "Database connection failed."}), 500

    cursor = connection.cursor(dictionary=True)
    try:
        # Step A: Get basic movie and language information
        movie_query = """
            SELECT m.*, l.language_name 
            FROM movies m
            JOIN languages l ON m.language_id = l.language_id
            WHERE m.movie_id = %s
        """
        cursor.execute(movie_query, (movie_id,))
        movie = cursor.fetchone()

        if not movie:
            cursor.close()
            connection.close()
            return jsonify({"status": "error", "message": "Movie not found."}), 404

        # Step B: Get all associated genres via our movie_genres junction table
        genre_query = """
            SELECT g.genre_name 
            FROM genres g
            JOIN movie_genres mg ON g.genre_id = mg.genre_id
            WHERE mg.movie_id = %s
        """
        cursor.execute(genre_query, (movie_id,))
        genres = [row['genre_name'] for row in cursor.fetchall()]
        
        # Attach genres array to movie object
        movie['genres'] = genres

        cursor.close()
        connection.close()
        return jsonify({"status": "success", "data": movie}), 200

    except Exception as e:
        cursor.close()
        connection.close()
        return jsonify({"status": "error", "message": f"Database error: {str(e)}"}), 500