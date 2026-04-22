'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Button,
  Typography,
  Radio,
  Space,
  Progress,
  Tag,
  Avatar,
  Modal,
  Result,
  Tooltip,
  Badge,
  Divider,
  Row,
  Col,
} from 'antd';
import {
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ArrowRightOutlined,
  ArrowLeftOutlined,
  LogoutOutlined,
  TrophyOutlined,
  UserOutlined,
  BookOutlined,
  BulbOutlined,
} from '@ant-design/icons';
import { questions } from '@/data/questions';

const { Title, Text, Paragraph } = Typography;
const TOTAL_TIME = 30 * 60; // 30 minutes in seconds

export default function QuizPage() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [quizFinished, setQuizFinished] = useState(false);
  const [userName, setUserName] = useState('Student');
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const user = localStorage.getItem('loggedInUser');
    if (!user) {
      router.replace('/login');
      return;
    }
    const parsed = JSON.parse(user);
    setUserName(parsed.fullName || 'Student');
  }, [router]);

  const calculateScore = () => {
    let score = 0;
    questions.forEach((q) => {
      if (answers[q.id] === q.correct) score++;
    });
    return score;
  };

  const saveResult = () => {
    const score = calculateScore();
    const result = {
      score,
      total: questions.length,
      attempted: Object.keys(answers).length,
      correct: score,
      wrong: Object.keys(answers).length - score,
      date: new Date().toISOString(),
      answers,
    };
    localStorage.setItem('lastQuizResult', JSON.stringify(result));
  };

  const finishQuiz = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    saveResult();
    setQuizFinished(true);
  }, []);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          finishQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [finishQuiz]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleAnswer = (questionId: number, optionIndex: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex((i) => i - 1);
  };

  const attemptedCount = Object.keys(answers).length;
  const currentQuestion = questions[currentIndex];
  const timerPercent = (timeLeft / TOTAL_TIME) * 100;
  const isTimeCritical = timeLeft < 300; // last 5 min

  // ---- RESULTS SCREEN ----
  if (quizFinished) {
    const score = calculateScore();
    const percent = Math.round((score / questions.length) * 100);
    let grade = { label: 'Needs Improvement', color: '#ef4444', icon: '😔' };
    if (percent >= 90) grade = { label: 'Excellent!', color: '#10b981', icon: '🏆' };
    else if (percent >= 70) grade = { label: 'Good Job!', color: '#3b82f6', icon: '👍' };
    else if (percent >= 50) grade = { label: 'Average', color: '#f59e0b', icon: '📚' };

    return (
      <div style={resultStyles.wrapper}>
        <div style={resultStyles.card}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>{grade.icon}</div>
          <Title level={2} style={{ color: '#fff', margin: 0 }}>
            Quiz Completed!
          </Title>
          <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 16 }}>
            Here&apos;s how you performed
          </Text>

          <div style={resultStyles.scoreCircle}>
            <div style={{ fontSize: 48, fontWeight: 700, color: grade.color }}>{score}</div>
            <div style={{ color: '#9ca3af', fontSize: 14 }}>out of {questions.length}</div>
          </div>

          <Progress
            percent={percent}
            strokeColor={grade.color}
            trailColor="rgba(255,255,255,0.1)"
            style={{ marginBottom: 16 }}
          />

          <Tag color={grade.color} style={{ fontSize: 16, padding: '6px 20px', borderRadius: 20 }}>
            {grade.label}
          </Tag>

          <Divider style={{ borderColor: 'rgba(255,255,255,0.1)', margin: '24px 0' }} />

          <Row gutter={16} style={{ marginBottom: 24 }}>
            {[
              { label: 'Correct', value: score, color: '#10b981' },
              { label: 'Incorrect', value: questions.length - score, color: '#ef4444' },
              { label: 'Attempted', value: attemptedCount, color: '#3b82f6' },
              { label: 'Skipped', value: questions.length - attemptedCount, color: '#f59e0b' },
            ].map((s) => (
              <Col span={6} key={s.label}>
                <div style={{ ...resultStyles.statBox, borderColor: s.color }}>
                  <div style={{ fontSize: 24, fontWeight: 700, color: s.color }}>{s.value}</div>
                  <div style={{ fontSize: 11, color: '#9ca3af' }}>{s.label}</div>
                </div>
              </Col>
            ))}
          </Row>

          <Space>
            <Button
              type="primary"
              icon={<TrophyOutlined />}
              style={{ background: '#4f46e5', border: 'none', borderRadius: 8 }}
              onClick={() => {
                setQuizFinished(false);
                setAnswers({});
                setCurrentIndex(0);
                setTimeLeft(TOTAL_TIME);
              }}
            >
              Retake Quiz
            </Button>
            <Button
              type="primary"
              icon={<BookOutlined />}
              style={{ background: '#10b981', border: 'none', borderRadius: 8 }}
              onClick={() => {
                router.push('/dashboard');
              }}
            >
              Go to Dashboard
            </Button>
            <Button
              icon={<LogoutOutlined />}
              style={{ borderRadius: 8 }}
              onClick={() => {
                localStorage.removeItem('loggedInUser');
                router.push('/login');
              }}
            >
              Logout
            </Button>
          </Space>
        </div>
      </div>
    );
  }

  // ---- MAIN QUIZ LAYOUT ----
  return (
    <div style={styles.page}>
      {/* TOP NAV */}
      <div style={styles.navbar}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={styles.navLogo}>
            <BookOutlined style={{ color: '#4f46e5', fontSize: 18 }} />
          </div>
          <Text strong style={{ fontSize: 18, color: '#1a1a2e' }}>
            QuizPortal
          </Text>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Avatar icon={<UserOutlined />} style={{ background: '#4f46e5' }} />
          <Text strong>{userName}</Text>
          <Button
            icon={<LogoutOutlined />}
            size="small"
            onClick={() => {
              localStorage.removeItem('loggedInUser');
              router.push('/login');
            }}
          >
            Logout
          </Button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div style={styles.mainContent}>
        {/* ===== LEFT: Question Panel ===== */}
        <div style={styles.leftPanel}>
          {/* Question header */}
          <div style={styles.questionHeader}>
            <div>
              <Tag color="blue" style={{ borderRadius: 20, fontWeight: 600 }}>
                Question {currentIndex + 1} of {questions.length}
              </Tag>
              {answers[currentQuestion.id] !== undefined && (
                <Tag color="green" icon={<CheckCircleOutlined />} style={{ borderRadius: 20, marginLeft: 8 }}>
                  Answered
                </Tag>
              )}
            </div>
            <Text type="secondary" style={{ fontSize: 13 }}>
              <BulbOutlined /> Choose the best answer
            </Text>
          </div>

          <Progress
            percent={((currentIndex + 1) / questions.length) * 100}
            showInfo={false}
            strokeColor={{ '0%': '#4f46e5', '100%': '#7c3aed' }}
            style={{ marginBottom: 28 }}
          />

          {/* Question text */}
          <div style={styles.questionBox}>
            <div style={styles.qNumber}>Q{currentIndex + 1}</div>
            <Paragraph style={{ fontSize: 18, fontWeight: 600, color: '#1a1a2e', lineHeight: 1.6, flex: 1, margin: 0 }}>
              {currentQuestion.question}
            </Paragraph>
          </div>

          {/* Options */}
          <Radio.Group
            value={answers[currentQuestion.id] ?? null}
            onChange={(e) => handleAnswer(currentQuestion.id, e.target.value)}
            style={{ width: '100%' }}
          >
            <Space direction="vertical" style={{ width: '100%' }} size={12}>
              {currentQuestion.options.map((option, idx) => {
                const isSelected = answers[currentQuestion.id] === idx;
                return (
                  <div
                    key={idx}
                    onClick={() => handleAnswer(currentQuestion.id, idx)}
                    style={{
                      ...styles.optionCard,
                      background: isSelected ? 'linear-gradient(135deg, #ede9fe, #ddd6fe)' : '#fff',
                      border: isSelected ? '2px solid #4f46e5' : '2px solid #e5e7eb',
                      boxShadow: isSelected ? '0 4px 15px rgba(79, 70, 229, 0.2)' : '0 1px 3px rgba(0,0,0,0.06)',
                      cursor: 'pointer',
                    }}
                  >
                    <div
                      style={{
                        ...styles.optionBadge,
                        background: isSelected ? '#4f46e5' : '#f3f4f6',
                        color: isSelected ? '#fff' : '#6b7280',
                      }}
                    >
                      {String.fromCharCode(65 + idx)}
                    </div>
                    <Text style={{ fontSize: 15, color: isSelected ? '#3730a3' : '#374151', fontWeight: isSelected ? 600 : 400 }}>
                      {option}
                    </Text>
                    {isSelected && <CheckCircleOutlined style={{ color: '#4f46e5', marginLeft: 'auto', fontSize: 18 }} />}
                  </div>
                );
              })}
            </Space>
          </Radio.Group>

          {/* Navigation buttons */}
          <div style={styles.navBtns}>
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={handlePrev}
              disabled={currentIndex === 0}
              style={{ borderRadius: 8, height: 42 }}
            >
              Previous
            </Button>
            <Button
              style={{ borderRadius: 8, height: 42, borderColor: '#ef4444', color: '#ef4444' }}
              onClick={() => setShowConfirmSubmit(true)}
            >
              Submit Quiz
            </Button>
            {currentIndex < questions.length - 1 ? (
              <Button
                type="primary"
                icon={<ArrowRightOutlined />}
                iconPosition="end"
                onClick={handleNext}
                style={{ background: '#4f46e5', border: 'none', borderRadius: 8, height: 42 }}
              >
                Next
              </Button>
            ) : (
              <Button
                type="primary"
                onClick={() => setShowConfirmSubmit(true)}
                style={{ background: '#10b981', border: 'none', borderRadius: 8, height: 42 }}
              >
                Finish & Submit
              </Button>
            )}
          </div>
        </div>

        {/* ===== RIGHT: Sidebar Panel (CONSTANT) ===== */}
        <div style={styles.rightPanel}>
          {/* Timer */}
          <div style={{ ...styles.timerCard, background: isTimeCritical ? 'linear-gradient(135deg, #fee2e2, #fecaca)' : 'linear-gradient(135deg, #ede9fe, #ddd6fe)' }}>
            <ClockCircleOutlined style={{ fontSize: 28, color: isTimeCritical ? '#ef4444' : '#4f46e5' }} />
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 36, fontWeight: 800, color: isTimeCritical ? '#ef4444' : '#4f46e5', fontFamily: 'monospace', letterSpacing: 2 }}>
                {formatTime(timeLeft)}
              </div>
              <Text type="secondary" style={{ fontSize: 12 }}>
                {isTimeCritical ? '⚠️ Time running out!' : 'Time Remaining'}
              </Text>
            </div>
            <Progress
              percent={timerPercent}
              showInfo={false}
              strokeColor={isTimeCritical ? '#ef4444' : '#4f46e5'}
              trailColor="rgba(255,255,255,0.5)"
              size="small"
            />
          </div>

          {/* Stats */}
          <div style={styles.statsRow}>
            <div style={styles.statChip}>
              <CheckCircleOutlined style={{ color: '#10b981' }} />
              <Text style={{ fontSize: 13 }}><strong>{attemptedCount}</strong> Attempted</Text>
            </div>
            <div style={styles.statChip}>
              <CloseCircleOutlined style={{ color: '#f59e0b' }} />
              <Text style={{ fontSize: 13 }}><strong>{questions.length - attemptedCount}</strong> Remaining</Text>
            </div>
          </div>

          <Divider style={{ margin: '16px 0' }}>
            <Text type="secondary" style={{ fontSize: 12 }}>Question Navigator</Text>
          </Divider>

          {/* Question grid */}
          <div style={styles.questionGrid}>
            {questions.map((q, idx) => {
              const isAnswered = answers[q.id] !== undefined;
              const isCurrent = idx === currentIndex;
              return (
                <Tooltip key={q.id} title={`Q${idx + 1}: ${isAnswered ? 'Answered' : 'Not Answered'}`}>
                  <div
                    onClick={() => setCurrentIndex(idx)}
                    style={{
                      ...styles.gridCell,
                      background: isCurrent
                        ? '#4f46e5'
                        : isAnswered
                        ? '#10b981'
                        : '#fff',
                      color: isCurrent || isAnswered ? '#fff' : '#374151',
                      border: isCurrent ? '2px solid #4f46e5' : isAnswered ? '2px solid #10b981' : '2px solid #e5e7eb',
                      boxShadow: isCurrent ? '0 4px 12px rgba(79,70,229,0.4)' : 'none',
                      transform: isCurrent ? 'scale(1.1)' : 'scale(1)',
                    }}
                  >
                    {idx + 1}
                  </div>
                </Tooltip>
              );
            })}
          </div>

          {/* Legend */}
          <div style={styles.legend}>
            {[
              { color: '#4f46e5', label: 'Current' },
              { color: '#10b981', label: 'Answered' },
              { color: '#fff', label: 'Not Answered', border: '#e5e7eb' },
            ].map((item) => (
              <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div
                  style={{
                    width: 14,
                    height: 14,
                    borderRadius: 4,
                    background: item.color,
                    border: item.border ? `2px solid ${item.border}` : 'none',
                  }}
                />
                <Text style={{ fontSize: 11, color: '#6b7280' }}>{item.label}</Text>
              </div>
            ))}
          </div>

          <Divider style={{ margin: '16px 0' }} />

          {/* Submit button */}
          <Button
            type="primary"
            block
            size="large"
            icon={<TrophyOutlined />}
            onClick={() => setShowConfirmSubmit(true)}
            style={{
              background: 'linear-gradient(135deg, #10b981, #059669)',
              border: 'none',
              borderRadius: 10,
              height: 48,
              fontWeight: 600,
              fontSize: 15,
            }}
          >
            Submit Quiz ({attemptedCount}/{questions.length})
          </Button>
        </div>
      </div>

      {/* Confirm Submit Modal */}
      <Modal
        open={showConfirmSubmit}
        onCancel={() => setShowConfirmSubmit(false)}
        footer={null}
        centered
        width={400}
        title={null}
      >
        <div style={{ textAlign: 'center', padding: '16px 0' }}>
          <TrophyOutlined style={{ fontSize: 48, color: '#f59e0b', marginBottom: 16 }} />
          <Title level={3} style={{ margin: '0 0 8px' }}>Submit Quiz?</Title>
          <Text type="secondary">
            You have answered {attemptedCount} out of {questions.length} questions.
            {attemptedCount < questions.length && (
              <Text type="warning" style={{ display: 'block', marginTop: 8 }}>
                ⚠️ {questions.length - attemptedCount} question(s) are unattempted.
              </Text>
            )}
          </Text>
          <div style={{ marginTop: 24, display: 'flex', gap: 12, justifyContent: 'center' }}>
            <Button onClick={() => setShowConfirmSubmit(false)} style={{ borderRadius: 8 }}>
              Continue Quiz
            </Button>
            <Button
              type="primary"
              onClick={() => {
                setShowConfirmSubmit(false);
                finishQuiz();
              }}
              style={{ background: '#10b981', border: 'none', borderRadius: 8 }}
            >
              Yes, Submit
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: '100vh',
    background: '#f8fafc',
    display: 'flex',
    flexDirection: 'column',
  },
  navbar: {
    background: '#fff',
    padding: '0 24px',
    height: 64,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    boxShadow: '0 1px 12px rgba(0,0,0,0.08)',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  navLogo: {
    width: 36,
    height: 36,
    borderRadius: 8,
    background: '#ede9fe',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainContent: {
    display: 'flex',
    flex: 1,
    gap: 0,
  },
  leftPanel: {
    flex: 1,
    padding: '32px',
    overflowY: 'auto',
    background: '#f8fafc',
  },
  rightPanel: {
    width: 300,
    background: '#fff',
    borderLeft: '1px solid #e5e7eb',
    padding: '24px',
    overflowY: 'auto',
    position: 'sticky',
    top: 64,
    height: 'calc(100vh - 64px)',
    display: 'flex',
    flexDirection: 'column',
    gap: 0,
  },
  questionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  questionBox: {
    background: '#fff',
    borderRadius: 16,
    padding: '24px',
    marginBottom: 24,
    border: '1px solid #e5e7eb',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    display: 'flex',
    gap: 16,
    alignItems: 'flex-start',
  },
  qNumber: {
    background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
    color: '#fff',
    borderRadius: 10,
    padding: '6px 12px',
    fontWeight: 800,
    fontSize: 14,
    flexShrink: 0,
  },
  optionCard: {
    borderRadius: 12,
    padding: '16px 20px',
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    transition: 'all 0.2s ease',
  },
  optionBadge: {
    width: 32,
    height: 32,
    borderRadius: 8,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 700,
    fontSize: 14,
    flexShrink: 0,
    transition: 'all 0.2s ease',
  },
  navBtns: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: 32,
    gap: 12,
  },
  timerCard: {
    borderRadius: 16,
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  statsRow: {
    display: 'flex',
    gap: 8,
    marginBottom: 4,
  },
  statChip: {
    flex: 1,
    background: '#f8fafc',
    border: '1px solid #e5e7eb',
    borderRadius: 8,
    padding: '8px 10px',
    display: 'flex',
    alignItems: 'center',
    gap: 6,
  },
  questionGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(5, 1fr)',
    gap: 8,
    marginBottom: 12,
  },
  gridCell: {
    width: '100%',
    aspectRatio: '1',
    borderRadius: 8,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 700,
    fontSize: 13,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  legend: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
    padding: '8px 0',
  },
};

const resultStyles: Record<string, React.CSSProperties> = {
  wrapper: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    background: 'rgba(255,255,255,0.05)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 24,
    padding: '48px 40px',
    textAlign: 'center',
    maxWidth: 560,
    width: '100%',
  },
  scoreCircle: {
    width: 120,
    height: 120,
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.08)',
    border: '3px solid rgba(255,255,255,0.15)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '24px auto',
  },
  statBox: {
    background: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    padding: '12px 8px',
    border: '1px solid',
  },
};
