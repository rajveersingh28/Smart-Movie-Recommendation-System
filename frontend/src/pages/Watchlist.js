import React, { useState, useEffect } from 'react';
import { watchlistAPI } from '../services/api';
import MovieCard from '../components/MovieCard';

function Watchlist({ userId }) {
    const [watchlist, setWatchlist] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!userId) return;
        
        watchlistAPI.get(userId)
            .then(response => {
                if (response.data.status === "success") {
                    setWatchlist(response.data.data);
                }
                setLoading(false);
            })
            .catch(err => {
                setError("Failed to fetch watchlist data.");
                setLoading(false);
            });
    }, [userId]);

    // New logic: Calls the custom .remove helper method cleanly
    const handleRemove = (movieId) => {
        watchlistAPI.remove(userId, movieId)
            .then(response => {
                if (response.data.status === "success") {
                    // Update frontend UI instantly without reloading the page
                    setWatchlist(prevList => prevList.filter(item => item.movie_id !== movieId));
                }
            })
            .catch(err => {
                console.error("Error removing item from watchlist:", err);
                alert("Failed to remove movie. Try again!");
            });
    };

    if (!userId) {
        return <div style={{ padding: '3rem', textAlign: 'center' }}><h2>Please log in to view your personal watchlist.</h2></div>;
    }

    if (loading) return <div style={{ padding: '2rem', textAlign: 'center', color: '#aaa' }}><h3>Loading your watchlist...</h3></div>;

    return (
        <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
            <h2 style={{ marginBottom: '1.5rem', borderBottom: '2px solid #333', paddingBottom: '10px', color: '#00ffff' }}>📋 Your Personal Watchlist</h2>
            {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
            {watchlist.length === 0 ? (
                <p style={{ color: '#aaa', textAlign: 'center', marginTop: '2rem' }}>Your watchlist is currently empty. Start exploring movies to add them!</p>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '25px' }}>
                    {watchlist.map(item => (
                        <div key={item.movie_id} style={{ display: 'flex', flexDirection: 'column', background: '#111', borderRadius: '8px', overflow: 'hidden', paddingBottom: '10px' }}>
                            {/* Renders your original movie card UI layout component */}
                            <MovieCard movie={item} />
                            
                            {/* Styled Remove Action Button */}
                            <button 
                                onClick={() => handleRemove(item.movie_id)}
                                style={{
                                    margin: '10px 15px 5px 15px',
                                    padding: '8px',
                                    background: '#ff3333',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    fontWeight: 'bold',
                                    transition: 'background 0.2s'
                                }}
                                onMouseOver={(e) => e.target.style.background = '#cc0000'}
                                onMouseOut={(e) => e.target.style.background = '#ff3333'}
                            >
                                ✕ Remove
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Watchlist;