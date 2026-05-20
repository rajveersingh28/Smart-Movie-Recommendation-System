from flask import Blueprint, jsonify
from db import get_db_connection

recommendations_bp = Blueprint('recommendations', __name__)

@recommendations_bp.route('/<int:user_id>', methods=['GET'])
def get_recommendations(user_id):
    """Generates dynamic movie recommendations based on user genre preferences and highly rated categories."""
    connection = get_db_connection()
    if not connection:
        return jsonify({"status": "error", "message": "Database connection failed."}), 500

    cursor = connection.cursor(dictionary=True)
    try:
        # Step A: Collect all genre IDs that this specific user has marked as preferred or rated highly (>= 4 stars)
        preference_query = """
            SELECT DISTINCT genre_id FROM user_preferences WHERE user_id = %s
            UNION
            SELECT DISTINCT mg.genre_id 
            FROM ratings r
            JOIN movie_genres mg ON r.movie_id = mg.movie_id
            WHERE r.user_id = %s AND r.rating >= 4
        """
        cursor.execute(preference_query, (user_id, user_id))
        preferred_genres = [row['genre_id'] for row in cursor.fetchall()]

        # Fallback handling: If the user is brand new and has no preferences/ratings, recommend top overall IMDb rated films
        if not preferred_genres:
            fallback_query = """
                SELECT m.*, l.language_name FROM movies m
                JOIN languages l ON m.language_id = l.language_id
                WHERE m.movie_id NOT IN (SELECT movie_id FROM ratings WHERE user_id = %s)
                ORDER BY m.imdb_rating DESC LIMIT 4
            """
            cursor.execute(fallback_query, (user_id,))
            recommended_movies = cursor.fetchall()
        else:
            # Step B: Select unique movies matching their interest categories that they haven't rated yet
            format_strings = ','.join(['%s'] * len(preferred_genres))
            recommendation_query = f"""
                SELECT DISTINCT m.movie_id, m.title, m.release_year, m.imdb_rating, m.description, m.poster_url, l.language_name
                FROM movies m
                JOIN languages l ON m.language_id = l.language_id
                JOIN movie_genres mg ON m.movie_id = mg.movie_id
                WHERE mg.genre_id IN ({format_strings})
                  AND m.movie_id NOT IN (SELECT movie_id FROM ratings WHERE user_id = %s)
                ORDER BY m.imdb_rating DESC
                LIMIT 5
            """
            # Appending user_id to fill the final check condition query string parameter
            query_params = preferred_genres + [user_id]
            cursor.execute(recommendation_query, query_params)
            recommended_movies = cursor.fetchall()

        cursor.close()
        connection.close()
        return jsonify({"status": "success", "data": recommended_movies}), 200

    except Exception as e:
        cursor.close()
        connection.close()
        return jsonify({"status": "error", "message": f"Database error: {str(e)}"}), 500