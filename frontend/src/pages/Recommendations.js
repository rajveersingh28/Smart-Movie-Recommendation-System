import React, { useState, useEffect } from 'react';
import { recommendationAPI } from '../services/api';
import MovieCard from '../components/MovieCard';

function Recommendations({ userId }) {
    const [recs, setRecs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!userId) return;

        recommendationAPI.get(userId)
            .then(response => {
                if (response.data.status === "success") {
                    setRecs(response.data.data);
                }
                setLoading(false);
            })
            .catch(err => {
                setError("Could not compute recommendations.");
                setLoading(false);
            });
    }, [userId]);

    if (!userId) {
        return <div style={{ padding: '3rem', textAlign: 'center' }}><h2>Please log in to unlock personalized AI recommendation engines.</h2></div>;
    }

    if (loading) return <div style={{ padding: '2rem', textAlign: 'center', color: '#aaa' }}><h3>Running smart filtering against your profile...</h3></div>;

    return (
        <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
            <h2 style={{ marginBottom: '0.5rem', color: '#00ffff' }}>🎯 Smart Recommendations For You</h2>
            <p style={{ color: '#aaa', marginBottom: '1.5rem', borderBottom: '2px solid #333', paddingBottom: '10px' }}>
                Generated dynamically by analyzing your favorite movie genres and your highest-rated relational records.
            </p>
            {recs.length === 0 ? (
                <p style={{ color: '#aaa', textAlign: 'center', marginTop: '2rem' }}>No new recommendations available for your profile traits right now.</p>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '25px' }}>
                    {recs.map(movie => (
                        <MovieCard key={movie.movie_id} movie={movie} />
                    ))}
                </div>
            )}
        </div>
    );
}

export default Recommendations;