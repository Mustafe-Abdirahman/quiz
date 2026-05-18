INSERT IGNORE INTO users (id, username, email, password, fullName, role, avatar, createdAt) VALUES
('admin1', 'Admin', 'admin@quiz.com', '$2a$10$dummy', 'Administrator', 'admin', NULL, NOW());

INSERT IGNORE INTO categories (id, name, icon) VALUES
('cat1', 'Science', '🔬'),
('cat2', 'Mathematics', '📐'),
('cat3', 'History', '📜'),
('cat4', 'Geography', '🌍'),
('cat5', 'Technology', '💻'),
('cat6', 'Sports', '⚽'),
('cat7', 'Entertainment', '🎬'),
('cat8', 'General Knowledge', '🧠');

INSERT IGNORE INTO quizzes (id, title, description, category, difficulty, timePerQuestion, thumbnail, maxPlayers, playCount, createdBy) VALUES
('quiz1', 'General Knowledge Quiz', 'Test your knowledge across various topics!', 'General Knowledge', 'medium', 60, '🧠', 4, 0, 'admin1');

INSERT IGNORE INTO questions (id, quizId, text, options, correctAnswer, type, category, difficulty) VALUES
('q1', 'quiz1', 'What is the chemical symbol for water?', '["H2O","CO2","NaCl","O2"]', 0, 'multiple', 'Science', 'easy'),
('q2', 'quiz1', 'What planet is known as the Red Planet?', '["Venus","Mars","Jupiter","Saturn"]', 1, 'multiple', 'Science', 'easy'),
('q3', 'quiz1', 'What is 7 × 8?', '["48","56","64","72"]', 1, 'multiple', 'Mathematics', 'easy'),
('q4', 'quiz1', 'In what year did World War II end?', '["1943","1944","1945","1946"]', 2, 'multiple', 'History', 'medium'),
('q5', 'quiz1', 'What is the capital of France?', '["London","Berlin","Madrid","Paris"]', 3, 'multiple', 'Geography', 'easy'),
('q6', 'quiz1', 'Who invented the World Wide Web?', '["Bill Gates","Steve Jobs","Tim Berners-Lee","Alan Turing"]', 2, 'multiple', 'Technology', 'medium'),
('q7', 'quiz1', 'Which country has won the most FIFA World Cups?', '["Germany","Argentina","Italy","Brazil"]', 3, 'multiple', 'Sports', 'medium'),
('q8', 'quiz1', 'What is the largest ocean on Earth?', '["Atlantic","Indian","Arctic","Pacific"]', 3, 'multiple', 'Geography', 'easy'),
('q9', 'quiz1', 'What does CPU stand for?', '["Central Process Unit","Computer Personal Unit","Central Processing Unit","Core Process Unit"]', 2, 'multiple', 'Technology', 'easy'),
('q10', 'quiz1', 'What is the speed of light approximately?', '["300,000 km/s","150,000 km/s","500,000 km/s","100,000 km/s"]', 0, 'multiple', 'Science', 'hard'),
('q11', 'quiz1', 'Which element has the atomic number 1?', '["Helium","Hydrogen","Lithium","Beryllium"]', 1, 'multiple', 'Science', 'easy'),
('q12', 'quiz1', 'What is the square root of 144?', '["10","11","12","13"]', 2, 'multiple', 'Mathematics', 'easy'),
('q13', 'quiz1', 'Who painted the Mona Lisa?', '["Michelangelo","Raphael","Da Vinci","Van Gogh"]', 2, 'multiple', 'Entertainment', 'medium'),
('q14', 'quiz1', 'What is the largest mammal?', '["Elephant","Blue Whale","Giraffe","Hippopotamus"]', 1, 'multiple', 'Science', 'easy'),
('q15', 'quiz1', 'Which year did the Titanic sink?', '["1910","1911","1912","1913"]', 2, 'multiple', 'History', 'medium'),
('q16', 'quiz1', 'What is the smallest prime number?', '["0","1","2","3"]', 2, 'multiple', 'Mathematics', 'easy'),
('q17', 'quiz1', 'Which programming language is primarily used for React?', '["Python","Java","JavaScript","C++"]', 2, 'multiple', 'Technology', 'easy'),
('q18', 'quiz1', 'What is the chemical symbol for gold?', '["Ag","Au","Fe","Cu"]', 1, 'multiple', 'Science', 'medium'),
('q19', 'quiz1', 'Which country is the largest by area?', '["China","USA","Canada","Russia"]', 3, 'multiple', 'Geography', 'medium'),
('q20', 'quiz1', 'Who wrote "Romeo and Juliet"?', '["Shakespeare","Dickens","Austen","Hemingway"]', 0, 'multiple', 'Entertainment', 'easy'),
('q21', 'quiz1', 'What is the powerhouse of the cell?', '["Nucleus","Ribosome","Mitochondria","Golgi body"]', 2, 'multiple', 'Science', 'medium'),
('q22', 'quiz1', 'What is the value of Pi (to 2 decimal places)?', '["3.14","3.16","3.12","3.18"]', 0, 'multiple', 'Mathematics', 'easy'),
('q23', 'quiz1', 'Which gas do plants absorb from the atmosphere?', '["Oxygen","Nitrogen","Carbon Dioxide","Hydrogen"]', 2, 'multiple', 'Science', 'easy'),
('q24', 'quiz1', 'What is the longest river in the world?', '["Amazon","Nile","Mississippi","Yangtze"]', 1, 'multiple', 'Geography', 'medium'),
('q25', 'quiz1', 'In which year was the first iPhone released?', '["2005","2006","2007","2008"]', 2, 'multiple', 'Technology', 'medium');
