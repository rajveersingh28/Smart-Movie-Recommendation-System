# Smart Movie Recommendation System 🎬

A 3-tier web application built to demonstrate a fully normalized relational database architecture. The system provides personalized content discovery based on implicit user preferences, highest-rated historical records, and explicit transactional logs.

---

## 🏛️ Project Architecture

The application is structured into three distinct decoupled layers:
1. **Frontend (Presentation Layer):** A dynamic, state-managed Single Page Application (SPA) built using **React.js** featuring a modern, responsive user dashboard.
2. **Backend (Application Layer):** A modular **Python Flask RESTful API** that handles application routing, state logic, session contexts, and structured data execution.
3. **Database (Data Storage Layer):** A fully normalized **MySQL (3NF)** relational database engine managing entity states across optimized tables with referential integrity.

---

## 📊 Database Design (3NF Normalization)

The storage layout utilizes relational mapping to eradicate insert, update, and deletion anomalies while completely eliminating text redundancies:
* **Lookup Entities:** `genres` and `languages` are isolated to suppress textual duplication across rows.
* **Core Entities:** `users` and `movies` house unique core system operational records.
* **Junction Tables (Many-to-Many):** `movie_genres` uses composite primary keys to securely bridge movies with multiple categories.
* **Transactional Logs:** `ratings` and `watchlist` keep track of user-specific interactions in real-time.

---

## ⚡ Core Recommendation Logic

The personalized recommendation module executes matching algorithms directly at the database layer using dynamic SQL queries. The application reads user historical records, isolates preferred categories matching ratings $\ge 4$, and executes relational set checks:

```sql
SELECT m.*, l.language_name 
FROM movies m
JOIN languages l ON m.language_id = l.language_id
JOIN movie_genres mg ON m.movie_id = mg.movie_id
WHERE mg.genre_id IN (
    -- Subquery fetching user preferred genres based on high ratings
    SELECT mg2.genre_id 
    FROM ratings r 
    JOIN movie_genres mg2 ON r.movie_id = mg2.movie_id 
    WHERE r.user_id = %s AND r.rating >= 4
)
AND m.movie_id NOT IN (
    -- Filters out movies already added to the user's watchlist
    SELECT movie_id FROM watchlist WHERE user_id = %s
)
GROUP BY m.movie_id;