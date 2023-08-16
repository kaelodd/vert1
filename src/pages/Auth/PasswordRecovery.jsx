import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
// import 'antd/dist/antd.css';
import '../../index.css';
import { Form, Input, Button, Checkbox, Spin } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { STORAGE_KEYS } from '../../auth.js';
import { Link, useLocation, useParams } from 'react-router-dom';
import FormItemLabel from 'antd/es/form/FormItemLabel';
import Title from 'antd/es/typography/Title';
import Notification from '../../components/Notification';
import { resetPassword } from '../../services/auth';

const PasswordRecovery = ({ path }) => {
    // console.log("Params: ", path);
    const notificationRef = useRef();
    const notifier = notificationRef.current;
    const [loading, setLoading] = useState(false);
    const [userId, setUserId] = useState(null);
    const [token, setToken] = useState(null);

    const onFinish = values => {
        console.log('Received values of form: ', values);
        // validation check
        if (!values?.password) {
            notifier.notify('error', 'Error!', 'Please enter your password!');
            return;
        }
        if (!values?.password_confirm) {
            notifier.notify('error', 'Error!', 'Please confirm your password!');
            return;
        }
        if (values?.password !== values?.password_confirm) {
            notifier.notify('error', 'Error!', 'Passwords do not match!');
            return;
        }
        if (!userId || !token) {
            notifier.notify('error', 'Error!', 'Invalid password reset link!');
            return;
        }

        setLoading(true);
        resetPassword(userId, token, { password: values?.password || null }).then(res => {
            setLoading(false);
            console.log("Response: ", res);
            notifier.notify('success', 'Success!', 'Password reset successful!');
            return;
        }).catch(error => {
            setLoading(false);
            notifier.notify('error', 'Error!', 'Password reset attempt failed!');
            console.log('Error: ', error);
        })
    };

    useEffect(() => {
        console.log("Path: ", path);
        if (path.length < 3) {
            notifier.notify('error', 'Error!', 'Invalid password reset link!');
            return;
        }
        const parsedUserId = path[1] || null;
        const parsedToken = path[2] || null;
        console.log("Token: ", token);
        if (!parsedUserId || !parsedToken) {
            notifier.notify('error', 'Error!', 'Invalid password reset link!');
            return;
        } else {
            setUserId(parsedUserId);
            setToken(parsedToken);
        }

    }, [path]);

    return (<>
        <Notification ref={notificationRef} />
        <Spin spinning={loading} delay={500}>
            <div style={{ textAlign: 'center' }}>
                <img src="/1024.png" alt="Pulse" style={{ width: '50%', marginTop: '20px', padding: 5, marginBottom: '15px' }} />
            </div>
            <Form
                name="normal_login"
                className="login-form"
                style={{
                    // maxWidth: 600,
                    paddingTop: 5,
                }}
                initialValues={{
                    remember: true,
                }}
                onFinish={onFinish}
            >
                <Title level={2} style={{ marginBottom: 0, textAlign: 'center' }}>
                    Reset Password
                </Title>
                <div style={{ marginBottom: 40, textAlign: 'center' }}>
                    Enter your password and confirm to reset your password.
                </div>
                <Form.Item
                    name="password"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your Password!',
                        },
                    ]}
                >
                    <Input
                        title='Password'
                        prefix={<LockOutlined className="site-form-item-icon" />}
                        type='password'
                        placeholder="Password" />
                </Form.Item>
                <Form.Item
                    name="password_confirm"
                    rules={[
                        {
                            required: true,
                            message: 'Please confirm password input!',
                        },
                    ]}
                >
                    <Input
                        title='Confirm Password'
                        prefix={<LockOutlined className="site-form-item-icon" />}
                        type="password"
                        placeholder="Confirm Password"
                    />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" className="login-form-button mb-3">
                        Submit
                    </Button>
                    Or <Link to="/login"><strong>login now!</strong></Link>
                </Form.Item>
            </Form>
        </Spin>
    </>
    );
};

export default PasswordRecovery;