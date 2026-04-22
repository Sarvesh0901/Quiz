'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Button,
  Typography,
  Card,
  Row,
  Col,
  Statistic,
  Divider,
  Modal,
  Tag,
  Space,
  Collapse,
  Avatar,
  Progress,
} from 'antd';
import {
  TrophyOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  BookOutlined,
  LogoutOutlined,
  PlayCircleOutlined,
  EyeOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { questions } from '@/data/questions';

const { Title, Text, Paragraph } = Typography;
const { Panel } = Collapse;

interface QuizResult {
  score: number;
  total: number;
  attempted: number;
  correct: number;
  wrong: number;
  date: string;
  answers: Record<number, number>;
}

export default function DashboardPage() {
  const router = useRouter();
  const [userName, setUserName] = useState('Student');
  const [lastResult, setLastResult] = useState<QuizResult | null>(null);
  const [showAnswers, setShowAnswers] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem('loggedInUser');
    if (!user) {
      router.replace('/login');
      return;
    }
    const parsed = JSON.parse(user);
    setUserName(parsed.fullName || 'Student');

    // Load last quiz result
    const savedResult = localStorage.getItem('lastQuizResult');
    if (savedResult) {
      setLastResult(JSON.parse(savedResult));
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('loggedInUser');
    router.push('/login');
  };

  const handleStartQuiz = () => {
    router.push('/quiz');
  };

  const formatAnswers = (answers: Record<number, number>) => {
    return questions.map((q, idx) => {
      const userAnswer = answers[q.id];
      const isCorrect = userAnswer === q.correct;
      const isAttempted = userAnswer !== undefined;
      return (
        <Panel
          key={q.id}
          header={
            <Space style={{ width: '100%', justifyContent: 'space-between' }}>
              <Space>
                <Text strong style={{ fontSize: 16 }}>Q{idx + 1}</Text>
                <Text style={{ fontSize: 14 }}>{q.question}</Text>
              </Space>
              <Tag color={isCorrect ? 'success' : isAttempted ? 'error' : 'default'} style={{ borderRadius: 12, padding: '4px 12px' }}>
                {isCorrect ? '✓ Correct' : isAttempted ? '✗ Wrong' : 'Not Attempted'}
              </Tag>
            </Space>
          }
          style={{ marginBottom: 12, borderRadius: 8, border: `1px solid ${isCorrect ? '#10b981' : isAttempted ? '#ef4444' : '#d1d5db'}` }}
        >
          <div style={{ padding: '12px 0' }}>
            <div style={{ marginBottom: 16, padding: 12, background: isCorrect ? '#f0fdf4' : isAttempted ? '#fef2f2' : '#f9fafb', borderRadius: 8 }}>
              <Paragraph style={{ margin: 0 }}>
                <Text strong>Your Answer:</Text>{' '}
                <Text strong type={isCorrect ? 'success' : 'danger'} style={{ fontSize: 15 }}>
                  {isAttempted ? q.options[userAnswer] : 'Skipped'}
                </Text>
              </Paragraph>
            </div>
            
            {!isCorrect && (
              <div style={{ marginBottom: 16, padding: 12, background: '#f0fdf4', borderRadius: 8 }}>
                <Paragraph style={{ margin: 0 }}>
                  <Text strong>✓ Correct Answer:</Text>{' '}
                  <Text strong type="success" style={{ fontSize: 15 }}>{q.options[q.correct]}</Text>
                </Paragraph>
              </div>
            )}

            <Divider style={{ margin: '16px 0' }} />
            
            <Text strong style={{ display: 'block', marginBottom: 12 }}>All Options:</Text>
            {q.options.map((opt, optIdx) => {
              const isCorrectOption = optIdx === q.correct;
              const isUserOption = optIdx === userAnswer;
              return (
                <div 
                  key={optIdx} 
                  style={{ 
                    padding: '10px 12px', 
                    marginBottom: 8, 
                    borderRadius: 8,
                    background: isCorrectOption ? '#f0fdf4' : isUserOption ? '#fef2f2' : '#fff',
                    border: `2px solid ${isCorrectOption ? '#10b981' : isUserOption ? '#ef4444' : '#e5e7eb'}`,
                  }}
                >
                  <Space>
                    <Text strong style={{ color: isCorrectOption ? '#10b981' : isUserOption ? '#ef4444' : '#6b7280' }}>
                      {String.fromCharCode(65 + optIdx)}.
                    </Text>
                    <Text style={{ color: isCorrectOption || isUserOption ? '#1a1a2e' : '#374151' }}>
                      {opt}
                    </Text>
                    {isCorrectOption && <CheckCircleOutlined style={{ color: '#10b981' }} />}
                    {isUserOption && !isCorrectOption && <CloseCircleOutlined style={{ color: '#ef4444' }} />}
                  </Space>
                </div>
              );
            })}
          </div>
        </Panel>
      );
    });
  };

  return (
    <div style={styles.wrapper}>
      {/* Navbar */}
      <div style={styles.navbar}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={styles.navLogo}>
            <BookOutlined style={{ color: '#4f46e5', fontSize: 18 }} />
          </div>
          <Text strong style={{ fontSize: 18, color: '#1a1a2e' }}>
            QuizPortal
          </Text>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Avatar icon={<UserOutlined />} style={{ background: '#4f46e5' }} />
          <Text strong>{userName}</Text>
          <Button
            icon={<LogoutOutlined />}
            size="small"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div style={styles.content}>
        <Row justify="center" style={{ marginTop: 20 }}>
          <Col xs={24} sm={24} md={22} lg={20} xl={18}>
            {/* Welcome Section */}
            <Card style={styles.welcomeCard} bordered={false}>
              <Row align="middle" justify="space-between">
                <Col xs={24} sm={24} md={16}>
                  <Title level={2} style={{ margin: 0, color: '#fff' }}>
                    👋 Welcome back, {userName}!
                  </Title>
                  <Text style={{ fontSize: 16, color: 'rgba(255,255,255,0.9)', display: 'block', marginTop: 8 }}>
                    Track your quiz performance and improve your skills
                  </Text>
                </Col>
                <Col xs={24} sm={24} md={8} style={{ textAlign: 'right' }}>
                  <Button
                    type="primary"
                    size="large"
                    icon={<PlayCircleOutlined />}
                    onClick={handleStartQuiz}
                    style={styles.startQuizBtn}
                  >
                    Start New Quiz
                  </Button>
                </Col>
              </Row>
            </Card>

            {/* Stats Cards */}
            {lastResult ? (
              <>
                <div style={{ marginTop: 32 }}>
                  <Title level={3} style={{ marginBottom: 20 }}>
                    <TrophyOutlined style={{ color: '#f59e0b', marginRight: 8 }} />
                    Last Quiz Performance
                  </Title>
                  <Row gutter={[20, 20]}>
                    <Col xs={12} sm={6}>
                      <Card style={styles.statCard} hoverable>
                        <Statistic
                          title={
                            <Text style={{ fontSize: 13, color: '#6b7280' }}>
                              Total Attempted
                            </Text>
                          }
                          value={lastResult.attempted}
                          suffix={`/ ${lastResult.total}`}
                          valueStyle={{ color: '#3b82f6', fontWeight: 700 }}
                        />
                        <div style={{ marginTop: 8 }}>
                          <Tag color="blue" style={{ borderRadius: 12 }}>
                            Questions
                          </Tag>
                        </div>
                      </Card>
                    </Col>
                    <Col xs={12} sm={6}>
                      <Card style={styles.statCard} hoverable>
                        <Statistic
                          title={
                            <Text style={{ fontSize: 13, color: '#6b7280' }}>
                              Correct Answers
                            </Text>
                          }
                          value={lastResult.correct}
                          valueStyle={{ color: '#10b981', fontWeight: 700 }}
                        />
                        <div style={{ marginTop: 8 }}>
                          <Tag color="green" style={{ borderRadius: 12 }}>
                            ✓ Right
                          </Tag>
                        </div>
                      </Card>
                    </Col>
                    <Col xs={12} sm={6}>
                      <Card style={styles.statCard} hoverable>
                        <Statistic
                          title={
                            <Text style={{ fontSize: 13, color: '#6b7280' }}>
                              Wrong Answers
                            </Text>
                          }
                          value={lastResult.wrong}
                          valueStyle={{ color: '#ef4444', fontWeight: 700 }}
                        />
                        <div style={{ marginTop: 8 }}>
                          <Tag color="red" style={{ borderRadius: 12 }}>
                            ✗ Wrong
                          </Tag>
                        </div>
                      </Card>
                    </Col>
                    <Col xs={12} sm={6}>
                      <Card style={styles.statCard} hoverable>
                        <Statistic
                          title={
                            <Text style={{ fontSize: 13, color: '#6b7280' }}>
                              Score
                            </Text>
                          }
                          value={Math.round((lastResult.score / lastResult.total) * 100)}
                          suffix="%"
                          valueStyle={{ color: '#f59e0b', fontWeight: 700 }}
                        />
                        <div style={{ marginTop: 8 }}>
                          <Tag color="orange" style={{ borderRadius: 12 }}>
                            Performance
                          </Tag>
                        </div>
                      </Card>
                    </Col>
                  </Row>
                </div>

                {/* Progress Bar */}
                <Card style={styles.progressCard} bordered={false}>
                  <Row gutter={[24, 16]} align="middle">
                    <Col xs={24} sm={16}>
                      <div style={{ marginBottom: 8 }}>
                        <Text strong style={{ fontSize: 16 }}>
                          Overall Progress
                        </Text>
                        <Text type="secondary" style={{ display: 'block', marginTop: 4 }}>
                          You scored {lastResult.correct} out of {lastResult.total} questions
                        </Text>
                      </div>
                      <Progress
                        percent={Math.round((lastResult.score / lastResult.total) * 100)}
                        strokeColor={{
                          '0%': '#ef4444',
                          '50%': '#f59e0b',
                          '100%': '#10b981',
                        }}
                        trailColor="#f3f4f6"
                        strokeWidth={20}
                        showInfo={false}
                      />
                    </Col>
                    <Col xs={24} sm={8} style={{ textAlign: 'center' }}>
                      <div style={{ padding: '16px' }}>
                        <Text type="secondary" style={{ fontSize: 12, display: 'block' }}>
                          Last attempt
                        </Text>
                        <Text strong style={{ fontSize: 13, display: 'block', marginTop: 4 }}>
                          {new Date(lastResult.date).toLocaleDateString()}
                        </Text>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          {new Date(lastResult.date).toLocaleTimeString()}
                        </Text>
                      </div>
                    </Col>
                  </Row>
                </Card>

                {/* Action Buttons */}
                <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
                  <Col xs={24} sm={12}>
                    <Button
                      type="primary"
                      size="large"
                      icon={<PlayCircleOutlined />}
                      onClick={handleStartQuiz}
                      style={styles.actionBtn}
                      block
                    >
                      Take Quiz Again
                    </Button>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Button
                      size="large"
                      icon={<EyeOutlined />}
                      onClick={() => setShowAnswers(true)}
                      style={styles.viewAnswersBtn}
                      block
                    >
                      Review All Answers
                    </Button>
                  </Col>
                </Row>
              </>
            ) : (
              <Card style={styles.noResultCard} bordered={false}>
                <Row justify="center" align="middle" style={{ minHeight: 400 }}>
                  <Col xs={24} sm={20} md={16}>
                    <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                      <div style={{ fontSize: 80, marginBottom: 24 }}>📝</div>
                      <Title level={3} style={{ color: '#374151', marginBottom: 12 }}>
                        Ready to Test Your Knowledge?
                      </Title>
                      <Text type="secondary" style={{ fontSize: 16, display: 'block', marginBottom: 32 }}>
                        Start your first quiz and track your performance here
                      </Text>
                      <Button
                        type="primary"
                        size="large"
                        icon={<PlayCircleOutlined />}
                        onClick={handleStartQuiz}
                        style={{ ...styles.startQuizBtn, background: 'linear-gradient(135deg, #667eea, #764ba2)', color: '#fff' }}
                      >
                        Start Your First Quiz
                      </Button>
                    </div>
                  </Col>
                </Row>
              </Card>
            )}
          </Col>
        </Row>
      </div>

      {/* Show All Answers Modal */}
      <Modal
        open={showAnswers}
        onCancel={() => setShowAnswers(false)}
        footer={null}
        width={900}
        centered
        title={null}
      >
        <div style={{ padding: '8px 0' }}>
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <Title level={3} style={{ margin: '0 0 8px' }}>
              <EyeOutlined style={{ color: '#4f46e5', marginRight: 8 }} />
              Quiz Review - All Questions & Answers
            </Title>
            <Text type="secondary">
              Review your performance and learn from mistakes
            </Text>
          </div>

          <div style={{ marginBottom: 16, padding: '12px 16px', background: '#f8fafc', borderRadius: 8 }}>
            <Row gutter={16}>
              <Col span={8}>
                <Text strong style={{ color: '#10b981' }}>
                  <CheckCircleOutlined /> Correct: {lastResult?.correct}
                </Text>
              </Col>
              <Col span={8}>
                <Text strong style={{ color: '#ef4444' }}>
                  <CloseCircleOutlined /> Wrong: {lastResult?.wrong}
                </Text>
              </Col>
              <Col span={8}>
                <Text strong style={{ color: '#3b82f6' }}>
                  <BookOutlined /> Attempted: {lastResult?.attempted}
                </Text>
              </Col>
            </Row>
          </div>

          <Collapse accordion defaultActiveKey={[]}>
            {lastResult && formatAnswers(lastResult.answers)}
          </Collapse>

          <div style={{ textAlign: 'center', marginTop: 24 }}>
            <Button
              type="primary"
              size="large"
              onClick={() => setShowAnswers(false)}
              style={{ borderRadius: 8 }}
            >
              Close Review
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
    display: 'flex',
    flexDirection: 'column',
  },
  navbar: {
    background: '#fff',
    padding: '0 32px',
    height: 64,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  navLogo: {
    width: 40,
    height: 40,
    borderRadius: 10,
    background: 'linear-gradient(135deg, #ede9fe, #ddd6fe)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    padding: '20px 24px',
    maxWidth: '100%',
  },
  welcomeCard: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    borderRadius: 20,
    padding: '32px',
    boxShadow: '0 8px 24px rgba(102, 126, 234, 0.3)',
  },
  startQuizBtn: {
    height: 48,
    borderRadius: 12,
    background: '#fff',
    border: 'none',
    fontSize: 16,
    fontWeight: 600,
    color: '#667eea',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
  },
  statCard: {
    borderRadius: 16,
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
    border: '1px solid #e5e7eb',
    background: '#fff',
    transition: 'all 0.3s ease',
  },
  progressCard: {
    background: '#fff',
    borderRadius: 16,
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
    marginTop: 24,
    padding: '24px',
  },
  noResultCard: {
    background: '#fff',
    borderRadius: 20,
    boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
    marginTop: 24,
  },
  actionBtn: {
    height: 52,
    borderRadius: 12,
    background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
    border: 'none',
    fontSize: 16,
    fontWeight: 600,
    boxShadow: '0 4px 16px rgba(79, 70, 229, 0.4)',
  },
  viewAnswersBtn: {
    height: 52,
    borderRadius: 12,
    fontSize: 16,
    fontWeight: 600,
    border: '2px solid #4f46e5',
    color: '#4f46e5',
    background: '#fff',
  },
};
