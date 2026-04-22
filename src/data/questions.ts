export interface Question {
  id: number;
  question: string;
  options: string[];
  correct: number;
}

export const questions: Question[] = [
  {
    id: 1,
    question: 'What does HTML stand for?',
    options: [
      'Hyper Text Markup Language',
      'High Tech Modern Language',
      'Hyper Transfer Markup Language',
      'Home Tool Markup Language',
    ],
    correct: 0,
  },
  {
    id: 2,
    question: 'Which company developed JavaScript?',
    options: ['Microsoft', 'Netscape', 'Google', 'Apple'],
    correct: 1,
  },
  {
    id: 3,
    question: 'What does CSS stand for?',
    options: [
      'Computer Style Sheets',
      'Cascading Style Sheets',
      'Creative Style System',
      'Coded Style Sheets',
    ],
    correct: 1,
  },
  {
    id: 4,
    question: 'Which of the following is NOT a JavaScript framework?',
    options: ['React', 'Angular', 'Django', 'Vue'],
    correct: 2,
  },
  {
    id: 5,
    question: 'What is the purpose of the "useState" hook in React?',
    options: [
      'To fetch data from APIs',
      'To manage component state',
      'To handle routing',
      'To apply styles',
    ],
    correct: 1,
  },
  {
    id: 6,
    question: 'Which HTTP method is used to retrieve data from a server?',
    options: ['POST', 'DELETE', 'GET', 'PUT'],
    correct: 2,
  },
  {
    id: 7,
    question: 'What does SQL stand for?',
    options: [
      'Structured Query Language',
      'Simple Question Language',
      'System Query Logic',
      'Standard Query Lookup',
    ],
    correct: 0,
  },
  {
    id: 8,
    question: 'Which of the following is a NoSQL database?',
    options: ['MySQL', 'PostgreSQL', 'MongoDB', 'Oracle'],
    correct: 2,
  },
  {
    id: 9,
    question: 'What is the default port for HTTP?',
    options: ['443', '8080', '3000', '80'],
    correct: 3,
  },
  {
    id: 10,
    question: 'Which keyword is used to declare a constant in JavaScript?',
    options: ['var', 'let', 'const', 'static'],
    correct: 2,
  },
];
