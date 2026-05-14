export const defaultCategories = [
  { id: 'cat1', name: 'Science', icon: '🔬' },
  { id: 'cat2', name: 'Mathematics', icon: '📐' },
  { id: 'cat3', name: 'History', icon: '📜' },
  { id: 'cat4', name: 'Geography', icon: '🌍' },
  { id: 'cat5', name: 'Technology', icon: '💻' },
  { id: 'cat6', name: 'Sports', icon: '⚽' },
  { id: 'cat7', name: 'Entertainment', icon: '🎬' },
  { id: 'cat8', name: 'General Knowledge', icon: '🧠' },
];

export const defaultQuestions = [
  {
    id: 'q1', text: 'What is the chemical symbol for water?', options: ['H2O', 'CO2', 'NaCl', 'O2'],
    correctAnswer: 0, category: 'Science', difficulty: 'easy'
  },
  {
    id: 'q2', text: 'What planet is known as the Red Planet?', options: ['Venus', 'Mars', 'Jupiter', 'Saturn'],
    correctAnswer: 1, category: 'Science', difficulty: 'easy'
  },
  {
    id: 'q3', text: 'What is 7 × 8?', options: ['48', '56', '64', '72'],
    correctAnswer: 1, category: 'Mathematics', difficulty: 'easy'
  },
  {
    id: 'q4', text: 'In what year did World War II end?', options: ['1943', '1944', '1945', '1946'],
    correctAnswer: 2, category: 'History', difficulty: 'medium'
  },
  {
    id: 'q5', text: 'What is the capital of France?', options: ['London', 'Berlin', 'Madrid', 'Paris'],
    correctAnswer: 3, category: 'Geography', difficulty: 'easy'
  },
  {
    id: 'q6', text: 'Who invented the World Wide Web?', options: ['Bill Gates', 'Steve Jobs', 'Tim Berners-Lee', 'Alan Turing'],
    correctAnswer: 2, category: 'Technology', difficulty: 'medium'
  },
  {
    id: 'q7', text: 'Which country has won the most FIFA World Cups?', options: ['Germany', 'Argentina', 'Italy', 'Brazil'],
    correctAnswer: 3, category: 'Sports', difficulty: 'medium'
  },
  {
    id: 'q8', text: 'What is the largest ocean on Earth?', options: ['Atlantic', 'Indian', 'Arctic', 'Pacific'],
    correctAnswer: 3, category: 'Geography', difficulty: 'easy'
  },
  {
    id: 'q9', text: 'What does CPU stand for?', options: ['Central Process Unit', 'Computer Personal Unit', 'Central Processing Unit', 'Core Process Unit'],
    correctAnswer: 2, category: 'Technology', difficulty: 'easy'
  },
  {
    id: 'q10', text: 'What is the speed of light approximately?', options: ['300,000 km/s', '150,000 km/s', '500,000 km/s', '100,000 km/s'],
    correctAnswer: 0, category: 'Science', difficulty: 'hard'
  },
  {
    id: 'q11', text: 'Which element has the atomic number 1?', options: ['Helium', 'Hydrogen', 'Lithium', 'Beryllium'],
    correctAnswer: 1, category: 'Science', difficulty: 'easy'
  },
  {
    id: 'q12', text: 'What is the square root of 144?', options: ['10', '11', '12', '13'],
    correctAnswer: 2, category: 'Mathematics', difficulty: 'easy'
  },
  {
    id: 'q13', text: 'Who painted the Mona Lisa?', options: ['Michelangelo', 'Raphael', 'Da Vinci', 'Van Gogh'],
    correctAnswer: 2, category: 'Entertainment', difficulty: 'medium'
  },
  {
    id: 'q14', text: 'What is the largest mammal?', options: ['Elephant', 'Blue Whale', 'Giraffe', 'Hippopotamus'],
    correctAnswer: 1, category: 'Science', difficulty: 'easy'
  },
  {
    id: 'q15', text: 'Which year did the Titanic sink?', options: ['1910', '1911', '1912', '1913'],
    correctAnswer: 2, category: 'History', difficulty: 'medium'
  },
  {
    id: 'q16', text: 'What is the smallest prime number?', options: ['0', '1', '2', '3'],
    correctAnswer: 2, category: 'Mathematics', difficulty: 'easy'
  },
  {
    id: 'q17', text: 'Which programming language is primarily used for React?', options: ['Python', 'Java', 'JavaScript', 'C++'],
    correctAnswer: 2, category: 'Technology', difficulty: 'easy'
  },
  {
    id: 'q18', text: 'What is the chemical symbol for gold?', options: ['Ag', 'Au', 'Fe', 'Cu'],
    correctAnswer: 1, category: 'Science', difficulty: 'medium'
  },
  {
    id: 'q19', text: 'Which country is the largest by area?', options: ['China', 'USA', 'Canada', 'Russia'],
    correctAnswer: 3, category: 'Geography', difficulty: 'medium'
  },
  {
    id: 'q20', text: 'Who wrote "Romeo and Juliet"?', options: ['Shakespeare', 'Dickens', 'Austen', 'Hemingway'],
    correctAnswer: 0, category: 'Entertainment', difficulty: 'easy'
  },
  {
    id: 'q21', text: 'What is the powerhouse of the cell?', options: ['Nucleus', 'Ribosome', 'Mitochondria', 'Golgi body'],
    correctAnswer: 2, category: 'Science', difficulty: 'medium'
  },
  {
    id: 'q22', text: 'What is the value of Pi (to 2 decimal places)?', options: ['3.14', '3.16', '3.12', '3.18'],
    correctAnswer: 0, category: 'Mathematics', difficulty: 'easy'
  },
  {
    id: 'q23', text: 'Which gas do plants absorb from the atmosphere?', options: ['Oxygen', 'Nitrogen', 'Carbon Dioxide', 'Hydrogen'],
    correctAnswer: 2, category: 'Science', difficulty: 'easy'
  },
  {
    id: 'q24', text: 'What is the longest river in the world?', options: ['Amazon', 'Nile', 'Mississippi', 'Yangtze'],
    correctAnswer: 1, category: 'Geography', difficulty: 'medium'
  },
  {
    id: 'q25', text: 'In which year was the first iPhone released?', options: ['2005', '2006', '2007', '2008'],
    correctAnswer: 2, category: 'Technology', difficulty: 'medium'
  },
];

export const defaultQuiz = {
  id: 'quiz1',
  title: 'General Knowledge Quiz',
  description: 'Test your knowledge across various topics!',
  category: 'General Knowledge',
  difficulty: 'medium',
  timePerQuestion: 60,
  thumbnail: '🧠',
  maxPlayers: 4,
  questions: ['q1', 'q2', 'q3', 'q5', 'q8', 'q11', 'q12', 'q14', 'q16', 'q20'],
  createdAt: new Date().toISOString(),
  createdBy: 'admin',
  playCount: 0,
};

export const defaultAdmin = {
  id: 'admin1',
  username: 'Admin',
  email: 'admin@quiz.com',
  password: 'admin123',
  role: 'admin',
  createdAt: new Date().toISOString(),
};
