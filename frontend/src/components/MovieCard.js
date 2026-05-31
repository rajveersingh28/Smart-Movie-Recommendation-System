import React, { useState } from 'react';

function MovieCard({ movie, onAddToWatchlist }) {
    const [isHovered, setIsHovered] = useState(false);

    // Map titles to exact filename matches
    const imageMap = {
        '777 Charlie': '777_charlie.jpg',
        'Interstellar': 'interstellar.jpg',
        '3 Idiots': '3_idiots.jpg',
        'Shershaah': 'shershaah.jpg',
        'Dangal': 'dangal.jpg',
        'Kantara': 'kantara.jpg',
        'KGF Chapter 1': 'kgf_chapter_1.jpg',
        'Train to Busan': 'train_to_busan.jpg',
        'Train To Busan': 'train_to_busan.jpg'
    };

    const genreTags = {
        '777 Charlie': 'DRAMA', 'Interstellar': 'SCI-FI', '3 Idiots': 'COMEDY', 'Shershaah': 'BIOGRAPHY',
        'Dangal': 'SPORTS', 'Kantara': 'MYSTERY', 'KGF Chapter 1': 'ACTION', 'Train to Busan': 'THRILLER'
    };

    const currentGenre = genreTags[movie.title] || 'CINEMA';
    const movieLanguage = movie.language_name || movie.language || movie.lang || 'EN';

    // Safely attempt a local dynamic load, fall back to a dark panel if file is missing
    let posterPath = null;
    try {
        const fileName = imageMap[movie.title];
        if (fileName) {
            posterPath = require(`../assets/${fileName}`);
        }
    } catch (err) {
        console.warn(`Local asset missing for movie: ${movie.title}`);
    }

    return (
        <div 
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
                backgroundColor: '#111111',
                borderRadius: '12px',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                height: '420px',
                boxShadow: isHovered ? '0 12px 30px rgba(0,0,0,0.8), 0 0 15px rgba(0,255,255,0.1)' : '0 6px 20px rgba(0,0,0,0.6)',
                transform: isHovered ? 'translateY(-5px)' : 'translateY(0)',
                transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
                border: isHovered ? '1px solid #33333f' : '1px solid #222222',
                boxSizing: 'border-box'
            }}
        >
            {/* Poster Frame Window */}
            <div style={{ width: '100%', height: '260px', overflow: 'hidden', backgroundColor: '#1a1a22', position: 'relative' }}>
                {posterPath ? (
                    <img 
                        src={posterPath} 
                        alt={movie.title} 
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            display: 'block',
                            transform: isHovered ? 'scale(1.05)' : 'scale(1)',
                            transition: 'transform 0.4s ease'
                        }}
                    />
                ) : (
                    // Elegant dark fallback banner space if image isn't downloaded yet
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(to bottom, #1f1f2e, #0d0d13)', padding: '20px', boxSizing: 'border-box', textAlign: 'center' }}>
                        <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#4ca6ff', opacity: 0.8 }}>{movie.title.toUpperCase()}</span>
                    </div>
                )}

                {/* Genre Tag Badge Component overlayed directly over image graphics */}
                <span style={{
                    position: 'absolute',
                    top: '12px',
                    left: '12px',
                    background: 'rgba(0,0,0,0.75)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    padding: '3px 8px',
                    borderRadius: '4px',
                    fontSize: '0.65rem',
                    fontWeight: '700',
                    color: '#00ffff',
                    letterSpacing: '0.5px'
                }}>
                    {currentGenre}
                </span>
            </div>
            
            {/* Content Details Area */}
            <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flexGrow: 1, gap: '8px' }}>
                <h4 style={{ 
                    margin: 0, 
                    fontSize: '1.1rem', 
                    color: '#ffffff', 
                    fontWeight: '600',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                }}>
                    {movie.title}
                </h4>
                
                <div style={{ display: 'flex', gap: '10px', fontSize: '0.8rem', color: '#888890', alignItems: 'center' }}>
                    <span>📅 {movie.release_year}</span>
                    <span>•</span>
                    <span style={{ color: '#ffcc00', fontWeight: '600' }}>⭐ {movie.imdb_rating}/10</span>
                    <span>•</span>
                    <span style={{ background: '#222', padding: '1px 5px', borderRadius: '3px', fontSize: '0.7rem' }}>{movieLanguage.toUpperCase()}</span>
                </div>

                {/* Add to Watchlist Dynamic Button Selection */}
                <button 
                    onClick={() => onAddToWatchlist && onAddToWatchlist(movie.movie_id)}
                    style={{
                        marginTop: 'auto',
                        padding: '10px 0',
                        backgroundColor: isHovered ? '#00ffff' : '#22222a',
                        color: isHovered ? '#000000' : '#ffffff',
                        border: 'none',
                        borderRadius: '6px',
                        fontWeight: '700',
                        fontSize: '0.85rem',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                    }}
                >
                    + Add to Watchlist
                </button>
            </div>
        </div>
    );
}

export default MovieCard;