/**
 * Component 6: ULTIMATE Port/Protocol Trainer Enhancement
 * Features:
 * - Spaced repetition algorithm (Leitner system)
 * - Memory palace with visual mnemonics
 * - Flashcard mode with progressive difficulty
 * - Timed exam simulation mode
 * - Performance tracking and analytics
 * - Gamification (achievements, streaks, levels)
 * - localStorage persistence
 */

import React, { useState, useEffect, useMemo } from 'react';

// ===========================
// TYPE DEFINITIONS
// ===========================

interface PortCard {
  id: string;
  port: number;
  protocol: string;
  service: string;
  description: string;
  tcpUdp: string;
  security: string;
  mnemonic: string;
  category: 'well-known' | 'registered' | 'dynamic';
  examCritical: boolean;
}

interface CardProgress {
  cardId: string;
  box: number; // Leitner box 0-4 (0=new, 4=mastered)
  lastReviewed: number;
  nextReview: number;
  correctCount: number;
  incorrectCount: number;
  accuracy: number;
}

interface QuizQuestion {
  id: string;
  type: 'port-to-protocol' | 'protocol-to-port' | 'security' | 'tcp-udp' | 'use-case';
  question: string;
  correctAnswer: string;
  options: string[];
  explanation: string;
  portNumber?: number;
}

interface QuizResult {
  questionId: string;
  correct: boolean;
  timeSpent: number;
  selectedAnswer: string;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: number;
}

interface TrainingStats {
  totalCards: number;
  masteredCards: number;
  studyStreak: number;
  lastStudyDate: string;
  totalReviews: number;
  accuracy: number;
  level: number;
  xp: number;
  achievements: Achievement[];
  quizScores: number[];
}

type TrainingMode = 'flashcards' | 'quiz' | 'memory-palace' | 'analytics';

// ===========================
// EXAM-CRITICAL PORTS DATA
// ===========================

const EXAM_CRITICAL_PORTS: PortCard[] = [
  {
    id: 'ftp-20',
    port: 20,
    protocol: 'FTP',
    service: 'FTP Data',
    description: 'File Transfer Protocol - Data transfer channel',
    tcpUdp: 'TCP',
    security: 'Insecure',
    mnemonic: '20/20 vision to see files transfer',
    category: 'well-known',
    examCritical: true,
  },
  {
    id: 'ftp-21',
    port: 21,
    protocol: 'FTP',
    service: 'FTP Control',
    description: 'File Transfer Protocol - Command/control channel',
    tcpUdp: 'TCP',
    security: 'Insecure',
    mnemonic: '21 jump street - FTP commands',
    category: 'well-known',
    examCritical: true,
  },
  {
    id: 'ssh-22',
    port: 22,
    protocol: 'SSH/SFTP',
    service: 'Secure Shell',
    description: 'Encrypted remote access and file transfer',
    tcpUdp: 'TCP',
    security: 'Secure',
    mnemonic: '22 pairs of secure locks',
    category: 'well-known',
    examCritical: true,
  },
  {
    id: 'telnet-23',
    port: 23,
    protocol: 'Telnet',
    service: 'Remote Terminal',
    description: 'Unencrypted remote command-line access',
    tcpUdp: 'TCP',
    security: 'Insecure',
    mnemonic: 'Michael Jordan #23 - obsolete like Telnet',
    category: 'well-known',
    examCritical: true,
  },
  {
    id: 'smtp-25',
    port: 25,
    protocol: 'SMTP',
    service: 'Email Transfer',
    description: 'Simple Mail Transfer Protocol - server to server',
    tcpUdp: 'TCP',
    security: 'Insecure',
    mnemonic: '25 letters in the mail',
    category: 'well-known',
    examCritical: true,
  },
  {
    id: 'dns-53',
    port: 53,
    protocol: 'DNS',
    service: 'Domain Name System',
    description: 'Name resolution - UDP for queries, TCP for transfers',
    tcpUdp: 'TCP/UDP',
    security: 'Optional',
    mnemonic: '53 DNS = Domain Name System (3 letters each)',
    category: 'well-known',
    examCritical: true,
  },
  {
    id: 'dhcp-67',
    port: 67,
    protocol: 'DHCP',
    service: 'DHCP Server',
    description: 'Dynamic Host Configuration - server listening port',
    tcpUdp: 'UDP',
    security: 'Insecure',
    mnemonic: '67 Chevy - DHCP server',
    category: 'well-known',
    examCritical: true,
  },
  {
    id: 'dhcp-68',
    port: 68,
    protocol: 'DHCP',
    service: 'DHCP Client',
    description: 'Dynamic Host Configuration - client listening port',
    tcpUdp: 'UDP',
    security: 'Insecure',
    mnemonic: '68 Mustang - DHCP client',
    category: 'well-known',
    examCritical: true,
  },
  {
    id: 'tftp-69',
    port: 69,
    protocol: 'TFTP',
    service: 'Trivial FTP',
    description: 'Simple file transfer without authentication',
    tcpUdp: 'UDP',
    security: 'Insecure',
    mnemonic: '69 - trivial and backwards',
    category: 'well-known',
    examCritical: true,
  },
  {
    id: 'http-80',
    port: 80,
    protocol: 'HTTP',
    service: 'Web Traffic',
    description: 'Hypertext Transfer Protocol - unencrypted web',
    tcpUdp: 'TCP',
    security: 'Insecure',
    mnemonic: '80 miles per hour on the information highway',
    category: 'well-known',
    examCritical: true,
  },
  {
    id: 'pop3-110',
    port: 110,
    protocol: 'POP3',
    service: 'Email Retrieval',
    description: 'Post Office Protocol - download email',
    tcpUdp: 'TCP',
    security: 'Insecure',
    mnemonic: '110% getting all your mail',
    category: 'well-known',
    examCritical: true,
  },
  {
    id: 'ntp-123',
    port: 123,
    protocol: 'NTP',
    service: 'Time Sync',
    description: 'Network Time Protocol - clock synchronization',
    tcpUdp: 'UDP',
    security: 'Optional',
    mnemonic: '1-2-3 time synchronization',
    category: 'well-known',
    examCritical: true,
  },
  {
    id: 'imap-143',
    port: 143,
    protocol: 'IMAP',
    service: 'Email Access',
    description: 'Internet Message Access Protocol - manage email on server',
    tcpUdp: 'TCP',
    security: 'Insecure',
    mnemonic: '143 = I (1) LOVE (4 letters) YOU (3 letters) - IMAP',
    category: 'well-known',
    examCritical: true,
  },
  {
    id: 'snmp-161',
    port: 161,
    protocol: 'SNMP',
    service: 'Network Monitoring',
    description: 'Simple Network Management - agent port for queries',
    tcpUdp: 'UDP',
    security: 'Optional',
    mnemonic: '161 - monitoring 1-6-1 devices',
    category: 'well-known',
    examCritical: true,
  },
  {
    id: 'snmp-162',
    port: 162,
    protocol: 'SNMP',
    service: 'SNMP Traps',
    description: 'Simple Network Management - trap notifications',
    tcpUdp: 'UDP',
    security: 'Optional',
    mnemonic: '162 - one more than 161 for traps',
    category: 'well-known',
    examCritical: true,
  },
  {
    id: 'ldap-389',
    port: 389,
    protocol: 'LDAP',
    service: 'Directory Services',
    description: 'Lightweight Directory Access Protocol - unencrypted',
    tcpUdp: 'TCP',
    security: 'Insecure',
    mnemonic: '389 cubic inches - LDAP engine',
    category: 'well-known',
    examCritical: true,
  },
  {
    id: 'https-443',
    port: 443,
    protocol: 'HTTPS',
    service: 'Secure Web',
    description: 'HTTP over TLS/SSL - encrypted web traffic',
    tcpUdp: 'TCP',
    security: 'Secure',
    mnemonic: '443 - 4 for S (secure), double security',
    category: 'well-known',
    examCritical: true,
  },
  {
    id: 'smb-445',
    port: 445,
    protocol: 'SMB',
    service: 'File Sharing',
    description: 'Server Message Block - Windows file/printer sharing',
    tcpUdp: 'TCP',
    security: 'Optional',
    mnemonic: '445 - SMB stands for sharing',
    category: 'well-known',
    examCritical: true,
  },
  {
    id: 'smtps-465',
    port: 465,
    protocol: 'SMTPS',
    service: 'Secure SMTP',
    description: 'SMTP over SSL - encrypted email submission',
    tcpUdp: 'TCP',
    security: 'Secure',
    mnemonic: '465 - secure mail delivery',
    category: 'well-known',
    examCritical: false,
  },
  {
    id: 'syslog-514',
    port: 514,
    protocol: 'Syslog',
    service: 'System Logging',
    description: 'System log message transport',
    tcpUdp: 'UDP',
    security: 'Insecure',
    mnemonic: '514 - system logging errors',
    category: 'well-known',
    examCritical: true,
  },
  {
    id: 'smtp-587',
    port: 587,
    protocol: 'SMTP',
    service: 'Email Submission',
    description: 'SMTP with authentication and STARTTLS',
    tcpUdp: 'TCP',
    security: 'Secure',
    mnemonic: '587 - authenticated email submission',
    category: 'well-known',
    examCritical: true,
  },
  {
    id: 'ldaps-636',
    port: 636,
    protocol: 'LDAPS',
    service: 'Secure Directory',
    description: 'LDAP over TLS/SSL - encrypted directory access',
    tcpUdp: 'TCP',
    security: 'Secure',
    mnemonic: '636 - secure LDAP directory',
    category: 'well-known',
    examCritical: true,
  },
  {
    id: 'imaps-993',
    port: 993,
    protocol: 'IMAPS',
    service: 'Secure IMAP',
    description: 'IMAP over TLS/SSL - encrypted email access',
    tcpUdp: 'TCP',
    security: 'Secure',
    mnemonic: '993 - secure IMAP',
    category: 'well-known',
    examCritical: true,
  },
  {
    id: 'pop3s-995',
    port: 995,
    protocol: 'POP3S',
    service: 'Secure POP3',
    description: 'POP3 over TLS/SSL - encrypted email download',
    tcpUdp: 'TCP',
    security: 'Secure',
    mnemonic: '995 - secure POP3',
    category: 'well-known',
    examCritical: true,
  },
  {
    id: 'sql-1433',
    port: 1433,
    protocol: 'SQL Server',
    service: 'Database',
    description: 'Microsoft SQL Server database connections',
    tcpUdp: 'TCP',
    security: 'Optional',
    mnemonic: '1433 - SQL database queries',
    category: 'registered',
    examCritical: true,
  },
  {
    id: 'rdp-3389',
    port: 3389,
    protocol: 'RDP',
    service: 'Remote Desktop',
    description: 'Remote Desktop Protocol - Windows remote access',
    tcpUdp: 'TCP',
    security: 'Optional',
    mnemonic: '3389 - remote desktop connection',
    category: 'registered',
    examCritical: true,
  },
  {
    id: 'sip-5060',
    port: 5060,
    protocol: 'SIP',
    service: 'VoIP Signaling',
    description: 'Session Initiation Protocol - unencrypted VoIP',
    tcpUdp: 'TCP/UDP',
    security: 'Insecure',
    mnemonic: '5060 - VoIP calls 50/60 Hz',
    category: 'registered',
    examCritical: true,
  },
  {
    id: 'sip-5061',
    port: 5061,
    protocol: 'SIP',
    service: 'Secure VoIP',
    description: 'SIP over TLS - encrypted VoIP signaling',
    tcpUdp: 'TCP/UDP',
    security: 'Secure',
    mnemonic: '5061 - one more for secure VoIP',
    category: 'registered',
    examCritical: true,
  },
  {
    id: 'http-alt-8080',
    port: 8080,
    protocol: 'HTTP-Alt',
    service: 'Alternative Web',
    description: 'Alternative HTTP port for web servers/proxies',
    tcpUdp: 'TCP',
    security: 'Insecure',
    mnemonic: '8080 - double 80 for alternative HTTP',
    category: 'registered',
    examCritical: false,
  },
];

// ===========================
// ACHIEVEMENTS DEFINITIONS
// ===========================

const ACHIEVEMENTS: Achievement[] = [
  { id: 'first-card', name: 'First Steps', description: 'Review your first flashcard', icon: '🎯', unlocked: false },
  { id: 'ten-cards', name: 'Getting Started', description: 'Review 10 cards', icon: '📚', unlocked: false },
  { id: 'master-ten', name: 'Expert Level', description: 'Master 10 cards (box 4)', icon: '🏆', unlocked: false },
  { id: 'perfect-quiz', name: 'Perfect Score', description: 'Score 100% on a quiz', icon: '💯', unlocked: false },
  { id: 'week-streak', name: 'Dedicated Learner', description: 'Study for 7 days in a row', icon: '🔥', unlocked: false },
  { id: 'all-secure', name: 'Security Expert', description: 'Master all secure protocol ports', icon: '🔒', unlocked: false },
  { id: 'speed-demon', name: 'Speed Demon', description: 'Complete quiz in under 2 minutes', icon: '⚡', unlocked: false },
  { id: 'master-all', name: 'Port Master', description: 'Master all exam-critical ports', icon: '👑', unlocked: false },
];

// ===========================
// UTILITY FUNCTIONS
// ===========================

const calculateNextReview = (box: number): number => {
  const intervals = [0, 1, 3, 7, 14]; // days
  const days = intervals[Math.min(box, 4)];
  return Date.now() + days * 24 * 60 * 60 * 1000;
};

const getDueCards = (progress: Map<string, CardProgress>): PortCard[] => {
  const now = Date.now();
  return EXAM_CRITICAL_PORTS.filter((card) => {
    const cardProgress = progress.get(card.id);
    if (!cardProgress) return true; // New cards
    return cardProgress.nextReview <= now;
  }).sort((a, b) => {
    const progressA = progress.get(a.id);
    const progressB = progress.get(b.id);
    const boxA = progressA?.box || 0;
    const boxB = progressB?.box || 0;
    return boxA - boxB; // Lower boxes first
  });
};

const generateQuizQuestions = (count: number = 10): QuizQuestion[] => {
  const questions: QuizQuestion[] = [];
  const shuffled = [...EXAM_CRITICAL_PORTS].sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, count);

  selected.forEach((card, index) => {
    const questionType: QuizQuestion['type'] =
      index % 4 === 0 ? 'port-to-protocol' :
      index % 4 === 1 ? 'protocol-to-port' :
      index % 4 === 2 ? 'tcp-udp' :
      'security';

    let question: QuizQuestion;

    switch (questionType) {
      case 'port-to-protocol': {
        const wrongProtocols = shuffled
          .filter(c => c.protocol !== card.protocol)
          .slice(0, 3)
          .map(c => c.protocol);
        question = {
          id: `q-${card.id}-${index}`,
          type: questionType,
          question: `What protocol uses port ${card.port}?`,
          correctAnswer: card.protocol,
          options: [card.protocol, ...wrongProtocols].sort(() => Math.random() - 0.5),
          explanation: `Port ${card.port} is used by ${card.protocol} (${card.service}). ${card.description}`,
          portNumber: card.port,
        };
        break;
      }

      case 'protocol-to-port': {
        const wrongPorts = shuffled
          .filter(c => c.port !== card.port)
          .slice(0, 3)
          .map(c => c.port.toString());
        question = {
          id: `q-${card.id}-${index}`,
          type: questionType,
          question: `What is the default port for ${card.protocol}?`,
          correctAnswer: card.port.toString(),
          options: [card.port.toString(), ...wrongPorts].sort(() => Math.random() - 0.5),
          explanation: `${card.protocol} uses port ${card.port}. Mnemonic: ${card.mnemonic}`,
          portNumber: card.port,
        };
        break;

      case 'tcp-udp':
        question = {
          id: `q-${card.id}-${index}`,
          type: questionType,
          question: `Does port ${card.port} (${card.protocol}) use TCP or UDP?`,
          correctAnswer: card.tcpUdp,
          options: card.tcpUdp === 'TCP/UDP' ? ['TCP/UDP', 'TCP only', 'UDP only', 'Neither'] : ['TCP', 'UDP', 'TCP/UDP', 'Both equally'],
          explanation: `${card.protocol} on port ${card.port} uses ${card.tcpUdp}.`,
          portNumber: card.port,
        };
        break;

      case 'security':
        question = {
          id: `q-${card.id}-${index}`,
          type: questionType,
          question: `Is ${card.protocol} (port ${card.port}) considered secure by default?`,
          correctAnswer: card.security === 'Secure' ? 'Yes' : card.security === 'Insecure' ? 'No' : 'Optional/Depends',
          options: ['Yes', 'No', 'Optional/Depends', 'Not applicable'].sort(() => Math.random() - 0.5),
          explanation: `${card.protocol} is ${card.security}. ${card.description}`,
          portNumber: card.port,
        };
        break;

      default:
        throw new Error('Invalid question type');
    }

    questions.push(question);
  });

  return questions;
};

const calculateLevel = (xp: number): number => {
  return Math.floor(Math.sqrt(xp / 100)) + 1;
};

const calculateXPForReview = (correct: boolean, box: number): number => {
  const baseXP = 10;
  const multiplier = correct ? (box + 1) : 0.5;
  return Math.floor(baseXP * multiplier);
};

// ===========================
// MAIN COMPONENT
// ===========================

export const PortProtocolTrainer: React.FC = () => {
  const [mode, setMode] = useState<TrainingMode>('flashcards');
  const [progress, setProgress] = useState<Map<string, CardProgress>>(new Map());
  const [stats, setStats] = useState<TrainingStats>({
    totalCards: EXAM_CRITICAL_PORTS.length,
    masteredCards: 0,
    studyStreak: 0,
    lastStudyDate: '',
    totalReviews: 0,
    accuracy: 0,
    level: 1,
    xp: 0,
    achievements: ACHIEVEMENTS,
    quizScores: [],
  });

  // Flashcard state
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [dueCards, setDueCards] = useState<PortCard[]>([]);

  // Quiz state
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [quizResults, setQuizResults] = useState<QuizResult[]>([]);
  const [quizStartTime, setQuizStartTime] = useState(0);
  const [questionStartTime, setQuestionStartTime] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');

  // Load progress from localStorage
  useEffect(() => {
    const savedProgress = localStorage.getItem('portTrainerProgress');
    const savedStats = localStorage.getItem('portTrainerStats');

    if (savedProgress) {
      const parsed = JSON.parse(savedProgress);
      const progressMap = new Map<string, CardProgress>(Object.entries(parsed));
      setProgress(progressMap);
    }

    if (savedStats) {
      setStats(JSON.parse(savedStats));
    }

    // Initialize due cards
    const initialDueCards = getDueCards(new Map());
    setDueCards(initialDueCards);
  }, []);

  // Save progress to localStorage
  useEffect(() => {
    if (progress.size > 0) {
      const progressObj = Object.fromEntries(progress);
      localStorage.setItem('portTrainerProgress', JSON.stringify(progressObj));
    }
  }, [progress]);

  useEffect(() => {
    localStorage.setItem('portTrainerStats', JSON.stringify(stats));
  }, [stats]);

  // Calculate current card
  const currentCard = useMemo(() => {
    if (mode === 'flashcards' && dueCards.length > 0) {
      return dueCards[currentCardIndex % dueCards.length];
    }
    return null;
  }, [mode, dueCards, currentCardIndex]);

  const currentProgress = useMemo(() => {
    if (currentCard) {
      return progress.get(currentCard.id);
    }
    return undefined;
  }, [currentCard, progress]);

  // Handle card review
  const handleCardReview = (correct: boolean) => {
    if (!currentCard) return;

    const currentProg = progress.get(currentCard.id) || {
      cardId: currentCard.id,
      box: 0,
      lastReviewed: 0,
      nextReview: 0,
      correctCount: 0,
      incorrectCount: 0,
      accuracy: 0,
    };

    const newBox = correct
      ? Math.min(currentProg.box + 1, 4)
      : Math.max(currentProg.box - 1, 0);

    const correctCount = currentProg.correctCount + (correct ? 1 : 0);
    const incorrectCount = currentProg.incorrectCount + (correct ? 0 : 1);
    const totalAttempts = correctCount + incorrectCount;
    const accuracy = (correctCount / totalAttempts) * 100;

    const newProgress: CardProgress = {
      cardId: currentCard.id,
      box: newBox,
      lastReviewed: Date.now(),
      nextReview: calculateNextReview(newBox),
      correctCount,
      incorrectCount,
      accuracy,
    };

    const newProgressMap = new Map(progress);
    newProgressMap.set(currentCard.id, newProgress);
    setProgress(newProgressMap);

    // Update stats
    const xpGained = calculateXPForReview(correct, currentProg.box);
    const newXP = stats.xp + xpGained;
    const newLevel = calculateLevel(newXP);

    const masteredCards = Array.from(newProgressMap.values()).filter(p => p.box === 4).length;

    // Check for achievements
    const newAchievements = [...stats.achievements];
    if (stats.totalReviews === 0) {
      const achievement = newAchievements.find(a => a.id === 'first-card');
      if (achievement && !achievement.unlocked) {
        achievement.unlocked = true;
        achievement.unlockedAt = Date.now();
      }
    }
    if (stats.totalReviews + 1 >= 10) {
      const achievement = newAchievements.find(a => a.id === 'ten-cards');
      if (achievement && !achievement.unlocked) {
        achievement.unlocked = true;
        achievement.unlockedAt = Date.now();
      }
    }
    if (masteredCards >= 10) {
      const achievement = newAchievements.find(a => a.id === 'master-ten');
      if (achievement && !achievement.unlocked) {
        achievement.unlocked = true;
        achievement.unlockedAt = Date.now();
      }
    }

    // Update study streak
    const today = new Date().toDateString();
    const lastStudy = stats.lastStudyDate;
    let newStreak = stats.studyStreak;

    if (lastStudy !== today) {
      const lastDate = new Date(lastStudy);
      const todayDate = new Date(today);
      const diffDays = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        newStreak += 1;
      } else if (diffDays > 1) {
        newStreak = 1;
      }

      if (newStreak >= 7) {
        const achievement = newAchievements.find(a => a.id === 'week-streak');
        if (achievement && !achievement.unlocked) {
          achievement.unlocked = true;
          achievement.unlockedAt = Date.now();
        }
      }
    }

    setStats({
      ...stats,
      masteredCards,
      studyStreak: newStreak,
      lastStudyDate: today,
      totalReviews: stats.totalReviews + 1,
      level: newLevel,
      xp: newXP,
      achievements: newAchievements,
    });

    // Move to next card
    setShowAnswer(false);
    const newDueCards = getDueCards(newProgressMap);
    setDueCards(newDueCards);

    if (newDueCards.length > 0) {
      setCurrentCardIndex((prev) => (prev + 1) % newDueCards.length);
    }
  };

  // Start quiz
  const startQuiz = () => {
    const questions = generateQuizQuestions(10);
    setQuizQuestions(questions);
    setCurrentQuestionIndex(0);
    setQuizResults([]);
    setQuizCompleted(false);
    setSelectedAnswer('');
    setQuizStartTime(Date.now());
    setQuestionStartTime(Date.now());
    setMode('quiz');
  };

  // Handle quiz answer
  const handleQuizAnswer = (answer: string) => {
    if (!quizQuestions[currentQuestionIndex]) return;

    const question = quizQuestions[currentQuestionIndex];
    const correct = answer === question.correctAnswer;
    const timeSpent = Date.now() - questionStartTime;

    const result: QuizResult = {
      questionId: question.id,
      correct,
      timeSpent,
      selectedAnswer: answer,
    };

    const newResults = [...quizResults, result];
    setQuizResults(newResults);

    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer('');
      setQuestionStartTime(Date.now());
    } else {
      // Quiz completed
      const score = (newResults.filter(r => r.correct).length / newResults.length) * 100;
      const totalTime = Date.now() - quizStartTime;

      // Check achievements
      const newAchievements = [...stats.achievements];
      if (score === 100) {
        const achievement = newAchievements.find(a => a.id === 'perfect-quiz');
        if (achievement && !achievement.unlocked) {
          achievement.unlocked = true;
          achievement.unlockedAt = Date.now();
        }
      }
      if (totalTime < 120000) { // Under 2 minutes
        const achievement = newAchievements.find(a => a.id === 'speed-demon');
        if (achievement && !achievement.unlocked) {
          achievement.unlocked = true;
          achievement.unlockedAt = Date.now();
        }
      }

      setStats({
        ...stats,
        quizScores: [...stats.quizScores, score],
        achievements: newAchievements,
      });

      setQuizCompleted(true);
    }
  };

  // ===========================
  // RENDER MODES
  // ===========================

  const renderFlashcards = () => {
    if (!currentCard) {
      return (
        <div className="no-cards">
          <h3>🎉 All caught up!</h3>
          <p>You've reviewed all due cards. Come back later or start a quiz!</p>
          <button onClick={startQuiz} className="quiz-btn">Start Quiz</button>
        </div>
      );
    }

    return (
      <div className="flashcard-mode">
        <div className="flashcard-header">
          <div className="card-counter">
            Card {currentCardIndex + 1} of {dueCards.length} due
          </div>
          {currentProgress && (
            <div className="leitner-box">
              Box {currentProgress.box + 1}/5 | Accuracy: {currentProgress.accuracy.toFixed(0)}%
            </div>
          )}
        </div>

        <div className={`flashcard ${showAnswer ? 'flipped' : ''}`}>
          <div className="flashcard-front">
            <div className="port-number">{currentCard.port}</div>
            <div className="card-category">{currentCard.category}</div>
            {currentCard.examCritical && <div className="exam-badge">EXAM CRITICAL</div>}
          </div>

          {showAnswer && (
            <div className="flashcard-back">
              <h3>{currentCard.protocol}</h3>
              <div className="service-name">{currentCard.service}</div>
              <div className="protocol-details">
                <span className={`security-badge ${currentCard.security.toLowerCase()}`}>
                  {currentCard.security}
                </span>
                <span className="tcp-udp-badge">{currentCard.tcpUdp}</span>
              </div>
              <p className="description">{currentCard.description}</p>
              <div className="mnemonic">
                <strong>💡 Memory Aid:</strong> {currentCard.mnemonic}
              </div>
            </div>
          )}
        </div>

        <div className="flashcard-controls">
          {!showAnswer ? (
            <button onClick={() => setShowAnswer(true)} className="reveal-btn">
              Reveal Answer
            </button>
          ) : (
            <div className="rating-buttons">
              <button onClick={() => handleCardReview(false)} className="rating-btn hard">
                ❌ Incorrect
              </button>
              <button onClick={() => handleCardReview(true)} className="rating-btn easy">
                ✅ Correct
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderQuiz = () => {
    if (quizCompleted) {
      const score = (quizResults.filter(r => r.correct).length / quizResults.length) * 100;
      const totalTime = quizResults.reduce((sum, r) => sum + r.timeSpent, 0);

      return (
        <div className="quiz-results">
          <h2>Quiz Complete!</h2>
          <div className="score-display">
            <div className="score-number">{score.toFixed(0)}%</div>
            <div className="score-details">
              {quizResults.filter(r => r.correct).length} / {quizResults.length} correct
            </div>
            <div className="time-taken">
              Time: {(totalTime / 1000).toFixed(1)}s
            </div>
          </div>

          <div className="quiz-breakdown">
            {quizQuestions.map((q, index) => {
              const result = quizResults[index];
              return (
                <div key={q.id} className={`question-review ${result.correct ? 'correct' : 'incorrect'}`}>
                  <div className="question-number">Q{index + 1}</div>
                  <div className="question-text">{q.question}</div>
                  <div className="answer-comparison">
                    <div>Your answer: <strong>{result.selectedAnswer}</strong></div>
                    {!result.correct && (
                      <div className="correct-answer">Correct: <strong>{q.correctAnswer}</strong></div>
                    )}
                  </div>
                  <div className="explanation">{q.explanation}</div>
                </div>
              );
            })}
          </div>

          <div className="quiz-actions">
            <button onClick={startQuiz} className="retry-btn">Try Again</button>
            <button onClick={() => setMode('flashcards')} className="back-btn">Back to Flashcards</button>
          </div>
        </div>
      );
    }

    const question = quizQuestions[currentQuestionIndex];
    if (!question) return null;

    return (
      <div className="quiz-mode">
        <div className="quiz-header">
          <div className="question-counter">
            Question {currentQuestionIndex + 1} / {quizQuestions.length}
          </div>
          <div className="quiz-progress-bar">
            <div
              className="quiz-progress-fill"
              style={{ width: `${((currentQuestionIndex + 1) / quizQuestions.length) * 100}%` }}
            />
          </div>
        </div>

        <div className="quiz-question">
          <h3>{question.question}</h3>
          <div className="quiz-options">
            {question.options.map((option) => (
              <button
                key={option}
                onClick={() => {
                  setSelectedAnswer(option);
                  setTimeout(() => handleQuizAnswer(option), 300);
                }}
                className={`quiz-option ${selectedAnswer === option ? 'selected' : ''}`}
                disabled={selectedAnswer !== ''}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderMemoryPalace = () => {
    const portGroups = {
      '20-30': EXAM_CRITICAL_PORTS.filter(c => c.port >= 20 && c.port < 30),
      '50-100': EXAM_CRITICAL_PORTS.filter(c => c.port >= 50 && c.port < 100),
      '100-200': EXAM_CRITICAL_PORTS.filter(c => c.port >= 100 && c.port < 200),
      '300-500': EXAM_CRITICAL_PORTS.filter(c => c.port >= 300 && c.port < 500),
      '500+': EXAM_CRITICAL_PORTS.filter(c => c.port >= 500),
    };

    return (
      <div className="memory-palace">
        <h2>🏰 Port Memory Palace</h2>
        <p className="subtitle">Visual mnemonics organized by port ranges</p>

        {Object.entries(portGroups).map(([range, cards]) => (
          <div key={range} className="memory-room">
            <h3>Ports {range}</h3>
            <div className="memory-cards">
              {cards.map((card) => (
                <div key={card.id} className="memory-card">
                  <div className="memory-port">{card.port}</div>
                  <div className="memory-protocol">{card.protocol}</div>
                  <div className="memory-mnemonic">💡 {card.mnemonic}</div>
                  <div className={`memory-security ${card.security.toLowerCase()}`}>
                    {card.security}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderAnalytics = () => {
    const boxDistribution = [0, 1, 2, 3, 4].map(box =>
      Array.from(progress.values()).filter(p => p.box === box).length
    );

    const averageQuizScore = stats.quizScores.length > 0
      ? stats.quizScores.reduce((a, b) => a + b, 0) / stats.quizScores.length
      : 0;

    return (
      <div className="analytics-mode">
        <h2>📊 Performance Analytics</h2>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-label">Level</div>
            <div className="stat-value">{stats.level}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">XP</div>
            <div className="stat-value">{stats.xp}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Study Streak</div>
            <div className="stat-value">{stats.studyStreak} days</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Total Reviews</div>
            <div className="stat-value">{stats.totalReviews}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Mastered Cards</div>
            <div className="stat-value">{stats.masteredCards}/{stats.totalCards}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Avg Quiz Score</div>
            <div className="stat-value">{averageQuizScore.toFixed(0)}%</div>
          </div>
        </div>

        <div className="leitner-distribution">
          <h3>Spaced Repetition Progress</h3>
          <div className="leitner-boxes">
            {boxDistribution.map((count, box) => (
              <div key={box} className="leitner-box-stat">
                <div className="box-label">Box {box + 1}</div>
                <div className="box-count">{count} cards</div>
                <div className="box-bar" style={{ width: `${(count / EXAM_CRITICAL_PORTS.length) * 100}%` }} />
              </div>
            ))}
          </div>
        </div>

        <div className="achievements-section">
          <h3>🏆 Achievements</h3>
          <div className="achievements-grid">
            {stats.achievements.map((achievement) => (
              <div key={achievement.id} className={`achievement ${achievement.unlocked ? 'unlocked' : 'locked'}`}>
                <div className="achievement-icon">{achievement.icon}</div>
                <div className="achievement-name">{achievement.name}</div>
                <div className="achievement-desc">{achievement.description}</div>
                {achievement.unlocked && achievement.unlockedAt && (
                  <div className="unlock-date">
                    {new Date(achievement.unlockedAt).toLocaleDateString()}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // ===========================
  // MAIN RENDER
  // ===========================

  return (
    <div className="port-protocol-trainer-enhanced">
      <header className="trainer-header">
        <h1>⚡ ULTIMATE Port/Protocol Trainer</h1>
        <p>CompTIA Network+ N10-008 Exam Preparation</p>

        <div className="trainer-stats-bar">
          <div className="stat-item">
            <span className="stat-label">Level {stats.level}</span>
            <div className="xp-bar">
              <div
                className="xp-fill"
                style={{
                  width: `${((stats.xp % 100) / 100) * 100}%`,
                }}
              />
            </div>
            <span className="stat-value">{stats.xp % 100}/100 XP</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Streak</span>
            <span className="stat-value">{stats.studyStreak} 🔥</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Mastered</span>
            <span className="stat-value">{stats.masteredCards}/{stats.totalCards}</span>
          </div>
        </div>
      </header>

      <nav className="mode-selector">
        <button
          onClick={() => setMode('flashcards')}
          className={`mode-btn ${mode === 'flashcards' ? 'active' : ''}`}
        >
          📇 Flashcards
        </button>
        <button
          onClick={startQuiz}
          className={`mode-btn ${mode === 'quiz' ? 'active' : ''}`}
        >
          📝 Quiz Mode
        </button>
        <button
          onClick={() => setMode('memory-palace')}
          className={`mode-btn ${mode === 'memory-palace' ? 'active' : ''}`}
        >
          🏰 Memory Palace
        </button>
        <button
          onClick={() => setMode('analytics')}
          className={`mode-btn ${mode === 'analytics' ? 'active' : ''}`}
        >
          📊 Analytics
        </button>
      </nav>

      <main className="trainer-content">
        {mode === 'flashcards' && renderFlashcards()}
        {mode === 'quiz' && renderQuiz()}
        {mode === 'memory-palace' && renderMemoryPalace()}
        {mode === 'analytics' && renderAnalytics()}
      </main>

      <style>{`
        .port-protocol-trainer-enhanced {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
          font-family: 'Segoe UI', system-ui, sans-serif;
        }

        .trainer-header {
          text-align: center;
          margin-bottom: 30px;
          padding: 30px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-radius: 15px;
        }

        .trainer-header h1 {
          margin: 0 0 10px 0;
          font-size: 2.5em;
        }

        .trainer-stats-bar {
          display: flex;
          justify-content: center;
          gap: 30px;
          margin-top: 20px;
          padding: 20px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }

        .stat-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 5px;
        }

        .stat-label {
          font-size: 0.9em;
          opacity: 0.9;
        }

        .stat-value {
          font-size: 1.4em;
          font-weight: bold;
        }

        .xp-bar {
          width: 150px;
          height: 8px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 4px;
          overflow: hidden;
        }

        .xp-fill {
          height: 100%;
          background: linear-gradient(90deg, #4facfe 0%, #00f2fe 100%);
          transition: width 0.5s ease;
        }

        .mode-selector {
          display: flex;
          gap: 10px;
          margin-bottom: 30px;
          padding: 10px;
          background: white;
          border-radius: 10px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .mode-btn {
          flex: 1;
          padding: 15px 20px;
          background: #f8f9fa;
          border: 2px solid transparent;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
        }

        .mode-btn:hover {
          background: #e9ecef;
        }

        .mode-btn.active {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-color: #667eea;
        }

        .trainer-content {
          background: white;
          padding: 40px;
          border-radius: 15px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          min-height: 500px;
        }

        /* Flashcard Mode */
        .flashcard-mode {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .flashcard-header {
          width: 100%;
          display: flex;
          justify-content: space-between;
          margin-bottom: 30px;
          padding: 15px;
          background: #f8f9fa;
          border-radius: 8px;
        }

        .card-counter, .leitner-box {
          font-weight: 600;
          color: #495057;
        }

        .flashcard {
          width: 100%;
          max-width: 600px;
          min-height: 400px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 20px;
          padding: 40px;
          color: white;
          box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4);
          transition: transform 0.3s;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        .flashcard:hover {
          transform: scale(1.02);
        }

        .flashcard-front {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
        }

        .port-number {
          font-size: 6em;
          font-weight: bold;
          text-shadow: 0 4px 8px rgba(0,0,0,0.2);
        }

        .card-category {
          padding: 8px 20px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 20px;
          font-size: 0.9em;
          text-transform: uppercase;
        }

        .exam-badge {
          padding: 8px 20px;
          background: #ffc107;
          color: #000;
          border-radius: 20px;
          font-weight: bold;
          font-size: 0.9em;
        }

        .flashcard-back {
          width: 100%;
          text-align: center;
        }

        .flashcard-back h3 {
          font-size: 3em;
          margin: 0 0 15px 0;
        }

        .service-name {
          font-size: 1.4em;
          margin-bottom: 20px;
          opacity: 0.9;
        }

        .protocol-details {
          display: flex;
          justify-content: center;
          gap: 15px;
          margin-bottom: 25px;
        }

        .security-badge, .tcp-udp-badge {
          padding: 8px 16px;
          border-radius: 20px;
          font-weight: bold;
          font-size: 0.9em;
        }

        .security-badge.secure {
          background: #28a745;
        }

        .security-badge.insecure {
          background: #dc3545;
        }

        .security-badge.optional {
          background: #ffc107;
          color: #000;
        }

        .tcp-udp-badge {
          background: rgba(255, 255, 255, 0.2);
        }

        .description {
          font-size: 1.1em;
          line-height: 1.6;
          margin-bottom: 25px;
        }

        .mnemonic {
          padding: 20px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
          border-left: 4px solid #ffc107;
          text-align: left;
          font-size: 1.05em;
        }

        .flashcard-controls {
          margin-top: 30px;
          width: 100%;
          max-width: 600px;
        }

        .reveal-btn {
          width: 100%;
          padding: 20px;
          background: #667eea;
          color: white;
          border: none;
          border-radius: 10px;
          font-size: 1.2em;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s;
        }

        .reveal-btn:hover {
          background: #764ba2;
          transform: scale(1.02);
        }

        .rating-buttons {
          display: flex;
          gap: 15px;
        }

        .rating-btn {
          flex: 1;
          padding: 20px;
          border: none;
          border-radius: 10px;
          font-size: 1.2em;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s;
        }

        .rating-btn.hard {
          background: #dc3545;
          color: white;
        }

        .rating-btn.hard:hover {
          background: #c82333;
          transform: scale(1.05);
        }

        .rating-btn.easy {
          background: #28a745;
          color: white;
        }

        .rating-btn.easy:hover {
          background: #218838;
          transform: scale(1.05);
        }

        .no-cards {
          text-align: center;
          padding: 60px 20px;
        }

        .no-cards h3 {
          font-size: 2em;
          color: #28a745;
          margin-bottom: 15px;
        }

        .quiz-btn {
          margin-top: 20px;
          padding: 15px 40px;
          background: #667eea;
          color: white;
          border: none;
          border-radius: 10px;
          font-size: 1.1em;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s;
        }

        .quiz-btn:hover {
          background: #764ba2;
          transform: scale(1.05);
        }

        /* Quiz Mode */
        .quiz-mode {
          max-width: 800px;
          margin: 0 auto;
        }

        .quiz-header {
          margin-bottom: 30px;
        }

        .question-counter {
          text-align: center;
          font-size: 1.2em;
          font-weight: bold;
          color: #495057;
          margin-bottom: 15px;
        }

        .quiz-progress-bar {
          height: 10px;
          background: #e9ecef;
          border-radius: 5px;
          overflow: hidden;
        }

        .quiz-progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
          transition: width 0.3s ease;
        }

        .quiz-question h3 {
          font-size: 1.8em;
          color: #2c3e50;
          margin-bottom: 30px;
          text-align: center;
        }

        .quiz-options {
          display: grid;
          gap: 15px;
        }

        .quiz-option {
          padding: 20px;
          background: #f8f9fa;
          border: 2px solid #dee2e6;
          border-radius: 10px;
          font-size: 1.1em;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s;
          text-align: left;
        }

        .quiz-option:hover:not(:disabled) {
          background: #e9ecef;
          border-color: #667eea;
          transform: translateX(10px);
        }

        .quiz-option.selected {
          background: #667eea;
          color: white;
          border-color: #667eea;
        }

        .quiz-option:disabled {
          cursor: not-allowed;
          opacity: 0.6;
        }

        .quiz-results {
          max-width: 900px;
          margin: 0 auto;
        }

        .quiz-results h2 {
          text-align: center;
          font-size: 2.5em;
          color: #2c3e50;
          margin-bottom: 30px;
        }

        .score-display {
          text-align: center;
          padding: 40px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-radius: 15px;
          margin-bottom: 30px;
        }

        .score-number {
          font-size: 4em;
          font-weight: bold;
          margin-bottom: 10px;
        }

        .score-details, .time-taken {
          font-size: 1.3em;
        }

        .quiz-breakdown {
          margin-bottom: 30px;
        }

        .question-review {
          padding: 20px;
          margin-bottom: 15px;
          border-radius: 10px;
          border-left: 4px solid;
        }

        .question-review.correct {
          background: #d4edda;
          border-color: #28a745;
        }

        .question-review.incorrect {
          background: #f8d7da;
          border-color: #dc3545;
        }

        .question-number {
          font-weight: bold;
          margin-bottom: 10px;
        }

        .question-text {
          font-size: 1.1em;
          margin-bottom: 10px;
        }

        .answer-comparison {
          margin: 10px 0;
        }

        .correct-answer {
          color: #28a745;
          font-weight: 600;
        }

        .explanation {
          margin-top: 10px;
          padding: 10px;
          background: rgba(0,0,0,0.05);
          border-radius: 5px;
          font-size: 0.95em;
        }

        .quiz-actions {
          display: flex;
          gap: 15px;
          justify-content: center;
        }

        .retry-btn, .back-btn {
          padding: 15px 40px;
          border: none;
          border-radius: 10px;
          font-size: 1.1em;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s;
        }

        .retry-btn {
          background: #667eea;
          color: white;
        }

        .retry-btn:hover {
          background: #764ba2;
          transform: scale(1.05);
        }

        .back-btn {
          background: #6c757d;
          color: white;
        }

        .back-btn:hover {
          background: #5a6268;
          transform: scale(1.05);
        }

        /* Memory Palace */
        .memory-palace {
          max-width: 1000px;
          margin: 0 auto;
        }

        .memory-palace h2 {
          text-align: center;
          font-size: 2.5em;
          color: #2c3e50;
          margin-bottom: 10px;
        }

        .subtitle {
          text-align: center;
          color: #6c757d;
          margin-bottom: 40px;
        }

        .memory-room {
          margin-bottom: 40px;
          padding: 30px;
          background: #f8f9fa;
          border-radius: 15px;
        }

        .memory-room h3 {
          color: #667eea;
          margin-bottom: 20px;
          font-size: 1.8em;
        }

        .memory-cards {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 20px;
        }

        .memory-card {
          padding: 20px;
          background: white;
          border-radius: 10px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          transition: transform 0.3s;
        }

        .memory-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        }

        .memory-port {
          font-size: 2.5em;
          font-weight: bold;
          color: #667eea;
          margin-bottom: 10px;
        }

        .memory-protocol {
          font-size: 1.3em;
          font-weight: 600;
          color: #2c3e50;
          margin-bottom: 15px;
        }

        .memory-mnemonic {
          padding: 10px;
          background: #fff3cd;
          border-radius: 5px;
          font-size: 0.95em;
          margin-bottom: 10px;
          border-left: 3px solid #ffc107;
        }

        .memory-security {
          display: inline-block;
          padding: 5px 12px;
          border-radius: 12px;
          font-size: 0.85em;
          font-weight: bold;
        }

        .memory-security.secure {
          background: #d4edda;
          color: #155724;
        }

        .memory-security.insecure {
          background: #f8d7da;
          color: #721c24;
        }

        .memory-security.optional {
          background: #fff3cd;
          color: #856404;
        }

        /* Analytics */
        .analytics-mode {
          max-width: 1000px;
          margin: 0 auto;
        }

        .analytics-mode h2 {
          text-align: center;
          font-size: 2.5em;
          color: #2c3e50;
          margin-bottom: 40px;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-bottom: 40px;
        }

        .stat-card {
          padding: 30px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-radius: 15px;
          text-align: center;
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        }

        .stat-card .stat-label {
          font-size: 0.9em;
          opacity: 0.9;
          margin-bottom: 10px;
        }

        .stat-card .stat-value {
          font-size: 2.5em;
          font-weight: bold;
        }

        .leitner-distribution {
          margin-bottom: 40px;
          padding: 30px;
          background: #f8f9fa;
          border-radius: 15px;
        }

        .leitner-distribution h3 {
          color: #2c3e50;
          margin-bottom: 20px;
        }

        .leitner-box-stat {
          margin-bottom: 15px;
        }

        .box-label {
          font-weight: 600;
          margin-bottom: 5px;
        }

        .box-count {
          font-size: 0.9em;
          color: #6c757d;
          margin-bottom: 5px;
        }

        .box-bar {
          height: 20px;
          background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
          border-radius: 10px;
          transition: width 0.5s ease;
        }

        .achievements-section {
          padding: 30px;
          background: #f8f9fa;
          border-radius: 15px;
        }

        .achievements-section h3 {
          color: #2c3e50;
          margin-bottom: 20px;
        }

        .achievements-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 20px;
        }

        .achievement {
          padding: 20px;
          background: white;
          border-radius: 10px;
          text-align: center;
          transition: transform 0.3s;
        }

        .achievement.unlocked {
          box-shadow: 0 4px 12px rgba(255, 193, 7, 0.4);
        }

        .achievement.locked {
          opacity: 0.5;
          filter: grayscale(100%);
        }

        .achievement:hover {
          transform: translateY(-5px);
        }

        .achievement-icon {
          font-size: 3em;
          margin-bottom: 10px;
        }

        .achievement-name {
          font-weight: bold;
          margin-bottom: 5px;
        }

        .achievement-desc {
          font-size: 0.9em;
          color: #6c757d;
          margin-bottom: 10px;
        }

        .unlock-date {
          font-size: 0.8em;
          color: #ffc107;
          font-weight: 600;
        }

        @media (max-width: 768px) {
          .trainer-stats-bar {
            flex-direction: column;
            gap: 15px;
          }

          .mode-selector {
            flex-direction: column;
          }

          .flashcard {
            padding: 20px;
          }

          .port-number {
            font-size: 4em !important;
          }

          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .memory-cards {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default PortProtocolTrainer;
