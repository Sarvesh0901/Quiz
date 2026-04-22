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
  Select,
  DatePicker,
  message,
  Divider,
} from 'antd';
import {
  UserOutlined,
  MailOutlined,
  LockOutlined,
  PhoneOutlined,
  TeamOutlined,
  BookOutlined,
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;

interface RegisterFormValues {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  gender: string;
  dob: string;
  course: string;
}

export default function RegisterPage() {
  const router = useRouter();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = (values: RegisterFormValues) => {
    setLoading(true);
    setTimeout(() => {
      localStorage.setItem('registeredUser', JSON.stringify({ ...values, password: undefined }));
      message.success('Registration successful! Please login.');
      setLoading(false);
      router.push('/login');
    }, 1000);
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.bgDecor} />
      <Row justify="center" align="middle" style={{ minHeight: '100vh', padding: '24px' }}>
        <Col xs={24} sm={20} md={16} lg={12} xl={10}>
          <Card style={styles.card} bordered={false}>
            {/* Header */}
            <div style={styles.header}>
              <div style={styles.iconWrap}>
                <BookOutlined style={{ fontSize: 28, color: '#fff' }} />
              </div>
              <Title level={2} style={styles.title}>
                Create Account
              </Title>
              <Text style={styles.subtitle}>Join our quiz platform today</Text>
            </div>

            <Divider style={{ margin: '24px 0' }} />

            <Form
              form={form}
              layout="vertical"
              onFinish={onFinish}
              requiredMark={false}
              size="large"
            >
              <Row gutter={16}>
                <Col span={24}>
                  <Form.Item
                    name="fullName"
                    label={<span style={styles.label}>Full Name</span>}
                    rules={[{ required: true, message: 'Please enter your full name' }]}
                  >
                    <Input prefix={<UserOutlined style={{ color: '#4f46e5' }} />} placeholder="John Doe" style={styles.input} />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={12}>
                  <Form.Item
                    name="email"
                    label={<span style={styles.label}>Email Address</span>}
                    rules={[
                      { required: true, message: 'Please enter email' },
                      { type: 'email', message: 'Enter a valid email' },
                    ]}
                  >
                    <Input prefix={<MailOutlined style={{ color: '#4f46e5' }} />} placeholder="john@example.com" style={styles.input} />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={12}>
                  <Form.Item
                    name="phone"
                    label={<span style={styles.label}>Phone Number</span>}
                    rules={[{ required: true, message: 'Please enter phone number' }]}
                  >
                    <Input prefix={<PhoneOutlined style={{ color: '#4f46e5' }} />} placeholder="+91 9876543210" style={styles.input} />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={12}>
                  <Form.Item
                    name="gender"
                    label={<span style={styles.label}>Gender</span>}
                    rules={[{ required: true, message: 'Please select gender' }]}
                  >
                    <Select placeholder="Select gender" style={styles.input}>
                      <Option value="male">Male</Option>
                      <Option value="female">Female</Option>
                      <Option value="other">Other</Option>
                      <Option value="prefer_not">Prefer not to say</Option>
                    </Select>
                  </Form.Item>
                </Col>

                <Col xs={24} sm={12}>
                  <Form.Item
                    name="course"
                    label={<span style={styles.label}>Course / Stream</span>}
                    rules={[{ required: true, message: 'Please select course' }]}
                  >
                    <Select placeholder="Select course" suffixIcon={<TeamOutlined />}>
                      <Option value="cs">Computer Science</Option>
                      <Option value="it">Information Technology</Option>
                      <Option value="ece">Electronics & Communication</Option>
                      <Option value="mech">Mechanical Engineering</Option>
                      <Option value="civil">Civil Engineering</Option>
                      <Option value="other">Other</Option>
                    </Select>
                  </Form.Item>
                </Col>

                <Col xs={24} sm={12}>
                  <Form.Item
                    name="password"
                    label={<span style={styles.label}>Password</span>}
                    rules={[
                      { required: true, message: 'Please enter password' },
                      { min: 6, message: 'Minimum 6 characters' },
                    ]}
                  >
                    <Input.Password prefix={<LockOutlined style={{ color: '#4f46e5' }} />} placeholder="Min. 6 characters" style={styles.input} />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={12}>
                  <Form.Item
                    name="confirmPassword"
                    label={<span style={styles.label}>Confirm Password</span>}
                    dependencies={['password']}
                    rules={[
                      { required: true, message: 'Please confirm password' },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || getFieldValue('password') === value) {
                            return Promise.resolve();
                          }
                          return Promise.reject('Passwords do not match!');
                        },
                      }),
                    ]}
                  >
                    <Input.Password prefix={<LockOutlined style={{ color: '#4f46e5' }} />} placeholder="Re-enter password" style={styles.input} />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item style={{ marginTop: 8 }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  block
                  style={styles.submitBtn}
                >
                  Create Account
                </Button>
              </Form.Item>

              <div style={{ textAlign: 'center' }}>
                <Text type="secondary">Already have an account? </Text>
                <Button type="link" onClick={() => router.push('/login')} style={{ padding: 0, color: '#4f46e5', fontWeight: 600 }}>
                  Sign In
                </Button>
              </div>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    position: 'relative',
    overflow: 'hidden',
  },
  bgDecor: {
    position: 'absolute',
    top: '-50%',
    right: '-20%',
    width: '600px',
    height: '600px',
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.05)',
    pointerEvents: 'none',
  },
  card: {
    borderRadius: 20,
    boxShadow: '0 25px 60px rgba(0,0,0,0.25)',
    padding: '8px',
  },
  header: {
    textAlign: 'center',
    paddingTop: 8,
  },
  iconWrap: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
    height: 60,
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #667eea, #764ba2)',
    marginBottom: 16,
  },
  title: {
    margin: 0,
    color: '#1a1a2e',
    fontWeight: 700,
  },
  subtitle: {
    color: '#666',
    fontSize: 15,
  },
  label: {
    fontWeight: 600,
    color: '#374151',
  },
  input: {
    borderRadius: 8,
  },
  submitBtn: {
    height: 48,
    borderRadius: 10,
    background: 'linear-gradient(135deg, #667eea, #764ba2)',
    border: 'none',
    fontSize: 16,
    fontWeight: 600,
    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.5)',
  },
};
