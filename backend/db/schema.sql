-- Database is created/enabled by init.js based on DB_NAME env

CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(36) PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  fullName VARCHAR(255) DEFAULT NULL,
  role ENUM('admin', 'user') DEFAULT 'user',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS categories (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  icon VARCHAR(10) DEFAULT '📁'
);

CREATE TABLE IF NOT EXISTS quizzes (
  id VARCHAR(36) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100) DEFAULT 'General',
  difficulty ENUM('easy', 'medium', 'hard') DEFAULT 'medium',
  timePerQuestion INT DEFAULT 60,
  thumbnail VARCHAR(10) DEFAULT '📝',
  maxPlayers INT DEFAULT 4,
  playCount INT DEFAULT 0,
  createdBy VARCHAR(36),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (createdBy) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS questions (
  id VARCHAR(36) PRIMARY KEY,
  quizId VARCHAR(36),
  text TEXT NOT NULL,
  options JSON NOT NULL,
  correctAnswer INT NOT NULL,
  type ENUM('multiple', 'truefalse', 'fill') DEFAULT 'multiple',
  category VARCHAR(100) DEFAULT 'General',
  difficulty ENUM('easy', 'medium', 'hard') DEFAULT 'medium',
  FOREIGN KEY (quizId) REFERENCES quizzes(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS attempts (
  id VARCHAR(36) PRIMARY KEY,
  userId VARCHAR(36) NOT NULL,
  quizId VARCHAR(36) NOT NULL,
  quizTitle VARCHAR(255),
  score INT DEFAULT 0,
  totalQuestions INT DEFAULT 0,
  correct INT DEFAULT 0,
  incorrect INT DEFAULT 0,
  unanswered INT DEFAULT 0,
  accuracy DECIMAL(5,2) DEFAULT 0,
  timeTaken INT DEFAULT 0,
  answers JSON,
  mode VARCHAR(20) DEFAULT 'solo',
  completedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (quizId) REFERENCES quizzes(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS rooms (
  id VARCHAR(36) PRIMARY KEY,
  code VARCHAR(6) NOT NULL UNIQUE,
  quizId VARCHAR(36),
  hostId VARCHAR(36),
  maxPlayers INT DEFAULT 4,
  players JSON,
  status ENUM('waiting', 'playing', 'finished') DEFAULT 'waiting',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (quizId) REFERENCES quizzes(id) ON DELETE SET NULL,
  FOREIGN KEY (hostId) REFERENCES users(id) ON DELETE SET NULL
);
