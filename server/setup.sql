CREATE DATABASE IF NOT EXISTS band_manager;
USE band_manager;

CREATE TABLE IF NOT EXISTS songs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  artist VARCHAR(255),
  song_key VARCHAR(10),
  tempo INT,
  notes TEXT,
  chords TEXT,
  lyrics TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS setlist (
  id INT AUTO_INCREMENT PRIMARY KEY,
  song_id INT,
  position INT,
  FOREIGN KEY (song_id) REFERENCES songs(id) ON DELETE CASCADE
);

INSERT INTO songs (name, artist, song_key, tempo, notes, chords, lyrics) VALUES
('Puvulalo Dagunna', 'A.R. Rahman', 'A', 95, 'Acoustic intro', '| A | D | E | D |\n| A | D | E | A |', 'Puvulalo dagunna prema\nEe hrudayamlo kaluvuna mana'),
('Asha Pasha', 'Sid Sriram', 'Dm', 110, 'Drums strong', '| Dm | Bb | F | C |\n| Dm | Bb | F | C |', 'Asha pasha bandhalu vidichesina vela\nKalala dharicheti prema'),
('Monna Kanipinchavu', 'S.P. Balasubrahmanyam', 'G', 100, '', '', '');
