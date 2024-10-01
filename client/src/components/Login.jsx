/* eslint-disable react/prop-types */
import { useAuth } from '../context/UserContext';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, Input } from 'antd';
import { useState } from 'react';

const Login = () => {
  const { login, register } = useAuth();
  const [form] = Form.useForm();
  const [isLogin, setIsLogin] = useState(true);

  const handleSubmit = async (values) => {
    const { username, password } = values;

    if (isLogin) {
      await login(username, password);
    } else {
      await register(username, password);
    }

    form.resetFields();
  };

  return (
    <div className="flex items-center justify-center h-3/4 py-10">
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-8">
        <h1 className="font-serif text-2xl text-center py-4">{isLogin ? 'Login' : 'Register'}</h1>
        <Form
          form={form}
          name="login"
          initialValues={{
            remember: true,
          }}
          onFinish={handleSubmit}
          layout="vertical"
        >
          <Form.Item
            name="username"
            rules={[
              {
                required: true,
                message: 'Please input your Username!',
              },
            ]}
          >
            <Input prefix={<UserOutlined />} placeholder="Username" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: 'Please input your Password!',
              },
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Password" />
          </Form.Item>
          <Form.Item>
            <Checkbox>Remember me</Checkbox>
          </Form.Item>

          <Form.Item>
            <Button block type="primary" htmlType="submit">
              {isLogin ? 'Log in' : 'Register'}
            </Button>
            <span>
              or{' '}
              <span
                onClick={() => setIsLogin(!isLogin)} 
                className="text-blue-500 hover:underline cursor-pointer"
              >
                {isLogin ? 'Register' : 'Login'}
              </span>
            </span>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Login;
