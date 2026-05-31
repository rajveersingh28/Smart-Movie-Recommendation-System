# Smart Movie Recommendation System 🎬

A 3-tier web application built to demonstrate a fully normalized relational database architecture. The system provides personalized content discovery based on implicit user preferences, highest-rated historical records, and explicit transactional logs.

---

## 🏛️ Project Architecture

The application is structured into three distinct decoupled layers:
1. **Frontend (Presentation Layer):** A dynamic, state-managed Single Page Application (SPA) built using **React.js** featuring a modern, responsive user dashboard with an optimized dark-mode poster matrix.
2. **Backend (Application Layer):** A modular **Python Flask RESTful API** configured with Cross-Origin Resource Sharing (CORS) that handles application routing, state logic, session contexts, and structured data execution.
3. **Database (Data Storage Layer):** A fully normalized **MySQL (3NF)** relational database engine managing entity states across optimized tables with referential integrity constraints.

---

## 📊 Database Design & 3NF Schema Compliance

The storage layout utilizes strict relational mapping to eradicate insert, update, and deletion anomalies while completely eliminating text redundancies. 

### Visual Entity-Relationship (ER) Diagram
<img width="660" height="870" alt="er_diagram" src="https://github.com/user-attachments/assets/cb087362-f63b-4ddf-8974-37c5c5cbf539" />

### Schema Breakdown
* **Lookup Entities:** `genres` and `languages` are isolated to suppress textual duplication across rows.
* **Core Entities:** `users` and `movies` house unique core system operational records.
* **Junction Tables (Many-to-Many):** `movie_genres` and `watchlist` use composite foreign keys to securely link entities and bridge multi-valued attributes.
* **Transactional Logs:** `ratings` and `watchlist` keep track of user-specific interactions in real-time.

---

## ⚡ Advanced DBMS Automation Assets

To maximize performance and decouple business logic from the application routes, core operations are handled natively within the relational storage engine.

### 1. Database Triggers (Automated Metric Recalculation)
An active `after_rating_insert` procedural block listens to the `ratings` table. Every time a new score is logged, the database automatically triggers a sync loop to run transactional `AVG()` recalculations on the target asset, updating the core table without manual application-layer calls:

```sql
DELIMITER $$

CREATE TRIGGER after_rating_insert
AFTER INSERT ON ratings
FOR EACH ROW
BEGIN
    UPDATE movies 
    SET imdb_rating = (
        SELECT AVG(rating) 
        FROM ratings 
        WHERE movie_id = NEW.movie_id
    )
    WHERE movie_id = NEW.movie_id;
END$$

DELIMITER ;
