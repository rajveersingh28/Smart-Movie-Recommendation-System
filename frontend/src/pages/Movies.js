import React, { useState, useEffect } from 'react';
import { movieAPI } from '../services/api';
import MovieCard from '../components/MovieCard';

function Movies({ currentUserId }) {
    const [movies, setMovies] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        movieAPI.getAll()
            .then(response => {
                if (response.data.status === "success") {
                    setMovies(response.data.data);
                } else {
                    setError("Failed to parse database records.");
                }
                setLoading(false);
            })
            .catch(err => {
                setError("Unable to connect to Flask backend.");
                setLoading(false);
            });
    }, []);

    // Placeholder interaction function for watchlist submissions
    const handleAddToWatchlist = (movieId) => {
        console.log(`Adding Movie ID ${movieId} to user account: ${currentUserId}`);
        alert(`Success: Movie added to your watchlist tracking space!`);
    };

    // Advanced multi-column filtering calculation including our new aggregated genres field
    const filteredMovies = movies.filter(movie => {
        const search = searchQuery.toLowerCase();
        
        const titleMatch = movie.title ? movie.title.toLowerCase().includes(search) : false;
        const languageMatch = movie.language_name ? movie.language_name.toLowerCase().includes(search) : false;
        
        // Checks the comma-separated genres string sent by our updated backend query
        const genreString = movie.genres || '';
        const genreMatch = genreString.toLowerCase().includes(search);
        
        return titleMatch || languageMatch || genreMatch;
    });

    if (loading) return <div style={{ padding: '2rem', textAlign: 'center', color: '#aaa' }}><h3>Loading movies from database...</h3></div>;
    if (error) return <div style={{ padding: '2rem', textAlign: 'center', color: '#ff4444' }}><h3>⚠️ Error: {error}</h3></div>;

    return (
        <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '15px', borderBottom: '2px solid #333', paddingBottom: '15px' }}>
                <h2 style={{ margin: 0 }}>🎬 Browse Database Movies</h2>
                
                {/* Real-time Filter Input Box */}
                <input 
                    type="text"
                    placeholder="🔍 Search by title, language, or genre..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                        padding: '10px 15px',
                        width: '300px',
                        borderRadius: '20px',
                        border: '1px solid #444',
                        background: '#222',
                        color: '#fff',
                        outline: 'none'
                    }}
                />
            </div>

            {filteredMovies.length === 0 ? (
                <p style={{ color: '#aaa', textAlign: 'center', marginTop: '2rem' }}>No movies found matching "{searchQuery}"</p>
            ) : (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                    gap: '25px'
                }}>
                    {filteredMovies.map(movie => (
                        <MovieCard 
                            key={movie.movie_id} 
                            movie={movie} 
                            onAddToWatchlist={handleAddToWatchlist} 
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default Movies;