DROP TABLE IF EXISTS webcams, comments;

CREATE TABLE webcams (
  id INTEGER PRIMARY KEY,
  title VARCHAR(255),
  likes INTEGER DEFAULT 0
);

CREATE TABLE comments(
  id SERIAL PRIMARY KEY,
  video_id INTEGER NOT NULL REFERENCES webcams(id),
  text VARCHAR(1000),
  handle VARCHAR(20)
);
