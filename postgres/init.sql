CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE taskTree (
    user_id UUID,
    task_id UUID PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
    parent_id UUID,
    root_id UUID,
    text VARCHAR(255),
    deadline VARCHAR(255) UNIQUE NOT NULL,
    completed BOOLEAN,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    FOREIGN KEY (parent_id) REFERENCES taskTree(task_id)
);

CREATE TABLE rootTree (
    user_id UUID,
    task_id UUID PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
    
)

CREATE TABLE reservations (
    reservation_id UUID PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
    user_id UUID REFERENCES users(user_id) NOT NULL,
    title VARCHAR(255) NOT NULL,
    is_all_day BOOLEAN NOT NULL,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- usersテーブルに初期のサンプルデータを挿入
INSERT INTO users (user_id, name, email, image_url, created_at, updated_at)
VALUES 
    ('1935980d-81bc-4b59-9dfe-88f48fde9700', 'John Doe', 'john@example.com', 'https://web-jp-assets-v2.mercdn.net/_next/static/media/avatar3.1f4d50ec.png', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('aeb10db8-6ad3-4998-ac4f-f29a1152b7f9', 'Jane Smith', 'jane@example.com', 'https://web-jp-assets-v2.mercdn.net/_next/static/media/avatar8.22bb62c8.png', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- reservationsテーブルに初期のサンプルデータを挿入
INSERT INTO reservations (user_id, title, is_all_day, start_time, end_time, created_at, updated_at)
VALUES
    ('1935980d-81bc-4b59-9dfe-88f48fde9700', 'Meeting', FALSE, '2024-05-07T09:00:00Z', '2024-05-07T10:00:00Z', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('aeb10db8-6ad3-4998-ac4f-f29a1152b7f9', 'Conference', TRUE, '2024-05-08T00:00:00Z', '2024-05-09T00:00:00Z', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);