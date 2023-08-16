import React, { useState, useRef, useEffect} from 'react';
import ReactDOM from 'react-dom';
import '../../index.css';
import { Form, Input, Button, Checkbox, Spin } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { STORAGE_KEYS } from '../../auth.js';
import { Link, useLocation } from 'react-router-dom';
import { login, getOauthCallBackResponse } from '../../services/auth';
import Notification from '../../components/Notification';
import { API_BASE_URL } from '../../config/index';

const NormalLoginForm = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);   

    const oauthCode = queryParams.get('code');
	const oauthClientInfo = queryParams.get('client_info');
    const oauthSessionState = queryParams.get('session_state');
    
    console.log(oauthCode, oauthClientInfo, oauthSessionState)

    const notificationRef = useRef();
    const notifier = notificationRef.current;
    const [loading, setLoading] = useState(false);
    console.log('Notifier:', notificationRef);

    useEffect(() => {
		const checkOauthLogin = async () => {
			console.log(oauthCode, oauthClientInfo, oauthSessionState)
			if (oauthCode && oauthClientInfo && oauthSessionState) {
				getOauthCallBackResponse({
					oauthCode, oauthClientInfo, oauthSessionState
				}).then((res) => {
					verifyLoginSuccessful({ token: res.token, user: res.user })
				})
					.catch((error) => {
						setIsLoading(false);
						addToast('User login attempt failed!', {
							autoDismiss: true,
							appearance: 'error',
						});
						return;
					});
			}
		}

		checkOauthLogin();
    }, [oauthCode, oauthClientInfo, oauthSessionState])
    
    const verifyLoginSuccessful = ({token, user}) => {
        window.localStorage.setItem(STORAGE_KEYS.accessToken, token || null);
        window.localStorage.setItem(STORAGE_KEYS.mandate, JSON.stringify(user || {}));
        window.localStorage.setItem(STORAGE_KEYS.timestamp, Date.now());
        // Reload the page for localStorage updates to be reflected
        window.location.href = '/';
        return;
    }

    const onFinish = values => {
        console.log('Received values of form: ', values);
        setLoading(true);
        login({ email: values?.email || null, password: values?.password || null }).then(res => {
            setLoading(false);
            console.log("Response: ", res);
            const data = res?.data || null;
            if (data?.token) verifyLoginSuccessful({token: data.token, user: data.user});
            throw new Error('Login attempt failed!');
        }).catch(error => {
            setLoading(false);
            notifier.notify('error', 'Error!', 'Login attempt failed!');
            console.log('Error: ', error);
        })
    };

    return (<>
        <Notification ref={notificationRef} />
        <Spin size="large" spinning={loading} delay={500}>
            <div className='login-logo' style={{ textAlign: 'center' }}>
                <img src="/1024.png" alt="Pulse" style={{ width: '50%', marginTop: '20px', padding: 5, marginBottom: '15px' }} />
            </div>
            <Form
                name="normal_login"
                className="login-form"
                style={{
                    // maxWidth: 600,
                    paddingTop: 20,
                }}
                initialValues={{
                    remember: true,
                }}
                onFinish={onFinish}
            >
                {/* <Form.Item
                    name="email"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your Email!',
                        },
                    ]}
                >
                    <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
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
                    <Input
                        prefix={<LockOutlined className="site-form-item-icon" />}
                        type="password"
                        placeholder="Password"
                    />
                </Form.Item>
                <Form.Item>
                    <Form.Item name="remember" valuePropName="checked" noStyle>
                        <Checkbox>Remember me</Checkbox>
                    </Form.Item>

                    <Link to='/password-reset' className="login-form-forgot">
                        Forgot password
                    </Link>
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" className="login-form-button">
                        Log in
                    </Button>
                    Or <a href="">register now!</a>
                </Form.Item> */}
                <Form.Item>
                    <a href={`${API_BASE_URL}/auth/oauth`} className="login-form-button microsoft-button">
                        Sign in with your Microsoft account
                    </a>
                </Form.Item>
                
            </Form>
        </Spin>
    </>
    );
};

export default NormalLoginForm;