import React, { useState } from 'react';
import { watchlistAPI } from '../services/api';

function MovieCard({ movie, currentUserId }) {
    const [isAdded, setIsAdded] = useState(false);
    const [message, setMessage] = useState('');
    const defaultPoster = "https://via.placeholder.com/300x450?text=No+Poster+Available";

    const handleAddToWatchlist = () => {
        if (!currentUserId) {
            alert("Please log in to add movies to your watchlist!");
            return;
        }

        watchlistAPI.add(currentUserId, movie.movie_id)
            .then(response => {
                if (response.data.status === "success") {
                    setIsAdded(true);
                    setMessage("Added!");
                }
            })
            .catch(err => {
                console.error(err);
                setMessage("Already in Watchlist");
            });
    };

    return (
        <div style={{
            background: '#222',
            borderRadius: '8px',
            overflow: 'hidden',
            boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
            display: 'flex',
            flexDirection: 'column',
            border: '1px solid #333'
        }}>
            <img 
                src={movie.poster_url || defaultPoster} 
                alt={movie.title} 
                style={{ width: '100%', height: '330px', objectFit: 'cover' }}
            />
            <div style={{ padding: '15px', flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                    <h3 style={{ margin: '0 0 10px 0', fontSize: '1.1rem', color: '#fff' }}>{movie.title}</h3>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#aaa', marginBottom: '10px' }}>
                        <span>📅 {movie.release_year}</span>
                        <span>⭐ {movie.imdb_rating} / 10</span>
                    </div>
                </div>

                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                        <span style={{ background: '#333', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', color: '#00ffff' }}>
                            🌐 {movie.language_name}
                        </span>
                        
                        {currentUserId && (
                          <button 
                              onClick={handleAddToWatchlist}
                              disabled={isAdded}
                              style={{
                                  background: isAdded ? '#444' : '#00ffff',
                                  color: isAdded ? '#aaa' : '#000',
                                  border: 'none',
                                  padding: '6px 12px',
                                  borderRadius: '4px',
                                  fontWeight: 'bold',
                                  cursor: isAdded ? 'default' : 'pointer',
                                  fontSize: '0.8rem'
                              }}
                          >
                              {message || "➕ Watchlist"}
                          </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MovieCard;