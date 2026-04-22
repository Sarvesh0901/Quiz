'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Form,
  Input,
  Button,
  Typography,
  Card,
  Row,
  Col,
  Checkbox,
  message,
  Divider,
} from 'antd';
import {
  MailOutlined,
  LockOutlined,
  BookOutlined,
  SafetyCertificateOutlined,
} from '@ant-design/icons';

const { Title, Text } = Typography;

interface LoginFormValues {
  email: string;
  password: string;
  remember: boolean;
}

export default function LoginPage() {
  const router = useRouter();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = (values: LoginFormValues) => {
    setLoading(true);
    setTimeout(() => {
      // Simple demo auth - any email/password works after registration
      const user = localStorage.getItem('registeredUser');
      if (user) {
        const parsed = JSON.parse(user);
        if (parsed.email === values.email) {
          localStorage.setItem('loggedInUser', JSON.stringify(parsed));
          message.success(`Welcome back, ${parsed.fullName}!`);
          setLoading(false);
          router.push('/dashboard');
          return;
        }
      }
      // Allow demo login
      localStorage.setItem('loggedInUser', JSON.stringify({ fullName: 'Demo User', email: values.email }));
      message.success('Login successful!');
      setLoading(false);
      router.push('/dashboard');
    }, 1000);
  };

  return (
    <div style={styles.wrapper}>
      {/* Decorative circles */}
      <div style={{ ...styles.circle, ...styles.circle1 }} />
      <div style={{ ...styles.circle, ...styles.circle2 }} />
      <div style={{ ...styles.circle, ...styles.circle3 }} />

      <Row justify="center" align="middle" style={{ minHeight: '100vh', padding: '24px' }}>
        <Col xs={24} sm={20} md={14} lg={10} xl={8}>
          {/* Top badge */}
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <div style={styles.badge}>
              <SafetyCertificateOutlined style={{ marginRight: 8 }} />
              Secure Login Portal
            </div>
          </div>

          <Card style={styles.card} bordered={false}>
            {/* Header */}
            <div style={styles.header}>
              <div style={styles.iconWrap}>
                <BookOutlined style={{ fontSize: 30, color: '#fff' }} />
              </div>
              <Title level={2} style={styles.title}>
                Welcome Back
              </Title>
              <Text style={styles.subtitle}>Sign in to continue your quiz journey</Text>
            </div>

            <Divider style={{ margin: '28px 0' }} />

            <Form form={form} layout="vertical" onFinish={onFinish} requiredMark={false} size="large">
              <Form.Item
                name="email"
                label={<span style={styles.label}>Email Address</span>}
                rules={[
                  { required: true, message: 'Please enter your email' },
                  { type: 'email', message: 'Enter a valid email' },
                ]}
              >
                <Input
                  prefix={<MailOutlined style={{ color: '#4f46e5' }} />}
                  placeholder="your@email.com"
                  style={styles.input}
                />
              </Form.Item>

              <Form.Item
                name="password"
                label={<span style={styles.label}>Password</span>}
                rules={[{ required: true, message: 'Please enter your password' }]}
              >
                <Input.Password
                  prefix={<LockOutlined style={{ color: '#4f46e5' }} />}
                  placeholder="Enter your password"
                  style={styles.input}
                />
              </Form.Item>

              <Form.Item>
                <Row justify="space-between" align="middle">
                  <Form.Item name="remember" valuePropName="checked" noStyle>
                    <Checkbox>Remember me</Checkbox>
                  </Form.Item>
                  <Button type="link" style={{ padding: 0, color: '#4f46e5' }}>
                    Forgot password?
                  </Button>
                </Row>
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  block
                  style={styles.submitBtn}
                >
                  Sign In to Quiz
                </Button>
              </Form.Item>

              <div style={{ textAlign: 'center' }}>
                <Text type="secondary">Don&apos;t have an account? </Text>
                <Button
                  type="link"
                  onClick={() => router.push('/register')}
                  style={{ padding: 0, color: '#4f46e5', fontWeight: 600 }}
                >
                  Register Now
                </Button>
              </div>
            </Form>
          </Card>

          {/* Info cards */}
          <Row gutter={12} style={{ marginTop: 20 }}>
            {[
              { icon: '📝', label: '10 Questions' },
              { icon: '⏱️', label: '30 Minutes' },
              { icon: '🏆', label: 'Instant Results' },
            ].map((item) => (
              <Col span={8} key={item.label}>
                <div style={styles.infoCard}>
                  <span style={{ fontSize: 20 }}>{item.icon}</span>
                  <Text style={{ color: '#fff', fontSize: 12, marginTop: 4, display: 'block' }}>
                    {item.label}
                  </Text>
                </div>
              </Col>
            ))}
          </Row>
        </Col>
      </Row>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
    position: 'relative',
    overflow: 'hidden',
  },
  circle: {
    position: 'absolute',
    borderRadius: '50%',
    background: 'rgba(79, 70, 229, 0.15)',
    pointerEvents: 'none',
  },
  circle1: { width: 400, height: 400, top: '-100px', right: '-100px' },
  circle2: { width: 250, height: 250, bottom: '10%', left: '-80px' },
  circle3: { width: 150, height: 150, top: '40%', right: '5%' },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    background: 'rgba(79, 70, 229, 0.3)',
    color: '#a5b4fc',
    padding: '6px 18px',
    borderRadius: 20,
    fontSize: 13,
    border: '1px solid rgba(165, 180, 252, 0.3)',
  },
  card: {
    borderRadius: 20,
    boxShadow: '0 30px 80px rgba(0,0,0,0.5)',
    background: '#fff',
    padding: '12px',
  },
  header: { textAlign: 'center', paddingTop: 8 },
  iconWrap: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 64,
    height: 64,
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
    marginBottom: 16,
    boxShadow: '0 8px 25px rgba(79, 70, 229, 0.4)',
  },
  title: { margin: 0, color: '#1a1a2e', fontWeight: 700 },
  subtitle: { color: '#666', fontSize: 15 },
  label: { fontWeight: 600, color: '#374151' },
  input: { borderRadius: 8, height: 46 },
  submitBtn: {
    height: 50,
    borderRadius: 10,
    background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
    border: 'none',
    fontSize: 16,
    fontWeight: 600,
    boxShadow: '0 4px 20px rgba(79, 70, 229, 0.5)',
  },
  infoCard: {
    background: 'rgba(255,255,255,0.08)',
    borderRadius: 12,
    padding: '12px 8px',
    textAlign: 'center',
    border: '1px solid rgba(255,255,255,0.12)',
    backdropFilter: 'blur(10px)',
  },
};
