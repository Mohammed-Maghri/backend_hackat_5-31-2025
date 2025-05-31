-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    login TEXT NOT NULL UNIQUE,
    images TEXT, -- JSON array of image URLs 
    club_staff BOOLEAN DEFAULT 0, -- Indicates if the user is a club staff member
    role BOOLEAN DEFAULT 0 , -- 0 means a number user , 1 is staff
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Events table
CREATE TABLE IF NOT EXISTS events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    location TEXT,
    date TEXT, -- ISO 8601 string
    image_url TEXT,
    latitude REAL NOT NULL,
    longitude REAL NOT NULL,
    status TEXT DEFAULT 'pending', -- 'upcoming' | 'completed' | 'cancelled' | 'pending'
    category_id INTEGER DEFAULT NULL,
    pictures TEXT DEFAULT "", -- should implement pictures logic
    creator_id INTEGER NOT NULL,
    slots INTEGER NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_events_creator
        FOREIGN KEY (creator_id)
        REFERENCES users(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_events_category
        FOREIGN KEY (category_id)
        REFERENCES categories(id)
        ON DELETE SET NULL
);

-- Registrations table (many-to-many)
CREATE TABLE IF NOT EXISTS registrations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    event_id INTEGER NOT NULL,
    registered_at TEXT DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, event_id),
    -- Foreign Keys with Constraint Names
    CONSTRAINT fk_registrations_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_registrations_event
        FOREIGN KEY (event_id)
        REFERENCES events(id)
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS feedback (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    event_id INTEGER NOT NULL,
    rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    -- Foreign keys
    CONSTRAINT fk_feedback_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_feedback_event FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);
