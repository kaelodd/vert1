import React, { useRef, useState } from 'react';
import ReactDOM from 'react-dom';
// import 'antd/dist/antd.css';
import '../../index.css';
import { Form, Input, Button, Checkbox, Spin } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { STORAGE_KEYS } from '../../auth.js';
import Title from 'antd/es/typography/Title';
import { Link } from 'react-router-dom';
import Notification from '../../components/Notification';
import { forgotPassword } from '../../services/auth';

const PasswordReset = () => {
    const notificationRef = useRef();
    const notifier = notificationRef.current;
    const [loading, setLoading] = useState(false);

    const onFinish = values => {
        console.log('Received values of form: ', values);
        // validation check
        if (!values?.email) {
            notifier.notify('error', 'Error!', 'Please enter your email!');
            return;
        }

        setLoading(true);
        forgotPassword({ email: values?.email || null }).then(res => {
            setLoading(false);
            notifier.notify('success', 'Success!', 'Password reset link sent to your email!');
            setTimeout(() => {
                window.location.href = '/login';
            }, 1000);
        }).catch(error => {
            setLoading(false);
            notifier.notify('error', 'Error!', 'Password reset failed!');
            console.log('Error: ', error);
            return;
        })
    };

    return (<>
        <Notification ref={notificationRef} />
        <Spin spinning={loading} delay={500}>
            <div className='login-logo' style={{ textAlign: 'center' }}>
                <img src="/1024.png" alt="Pulse" style={{ width: '50%', marginTop: '20px', padding: 5, marginBottom: '15px' }} />
            </div>
            <Form
                name="normal_login"
                className="login-form"
                style={{
                    // maxWidth: 600,
                    paddingTop: 10,
                }}
                initialValues={{
                    remember: true,
                }}
                onFinish={onFinish}
            >
                <Title level={2} style={{ marginBottom: 0, textAlign: 'center' }}>
                    Reset Password
                </Title>
                <div level={5} style={{ marginBottom: 20, textAlign: 'center' }}>
                    Enter your email to reset your password
                </div>
                <Form.Item
                    name="email"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your Email!',
                        },
                    ]}
                >
                    <Input prefix={<MailOutlined className="site-form-item-icon" />} placeholder="Email" />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" className="login-form-button mb-2">
                        Submit
                    </Button>
                    Or <Link to={'/login'}><strong>login now!</strong></Link>
                </Form.Item>
            </Form>
        </Spin>
    </>
    );
};

export default PasswordReset;