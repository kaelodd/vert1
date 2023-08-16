import { Card, Col, Layout, Menu, Row, Space, theme } from 'antd';
import React, { useState } from 'react';
import { useStateContext } from '../../contexts/ContextProvider';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import Login from '../../pages/Auth/Login';
import PasswordReset from '../../pages/Auth/PasswordReset';
import PasswordRecovery from '../../pages/Auth/PasswordRecovery';
const { Header, Content } = Layout;
const Auth = () => {
    const [collapsed, setCollapsed] = useState(false);
    const { sidebarCollapsed, setSidebarCollapsed } = useStateContext();
    const toggle = () => {
        setCollapsed(!collapsed);
        setSidebarCollapsed(!sidebarCollapsed);
    };
    const { token: { colorBgContainer } } = theme.useToken();
    const location = useLocation();
    const pathname = location.pathname;
    const path = pathname.split('/');
    console.log('Path: ', path, path[1], path[2]);
    const view = path[1] == 'login' ? <Login /> : ((path[1] == 'password-reset') ? <PasswordReset /> : ((path[1] != 'login' && path[1] != 'password-reset' && !isNaN(parseInt(path[1])) && path[1]?.toString()?.length && path[2]?.toString()?.length)  ? <PasswordRecovery path={path} /> : <Login />));
    return (
        <div>
            <Layout>
            <Content
            style={{
                margin: '24px, 26px',
                // padding: 24,
                // minHeight: 280,
                // background: colorBgContainer,
                // overflow: 'initial',
            }}
        >
            <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
                <Row gutter={3} justify={'center'}>
                    <Col span={12} xs={20} sm={12} md={9} lg={8} xl={6} xxl={6} style={{ height: '100vh' }}>
                        <Card bordered style={{ marginTop: '50%' }}>
                                    {/* <Login /> */}
                                    { view }
                        </Card>
                    </Col>
                        </Row>
                    </Space>
                    </Content>
            </Layout>
        </div>
    );
};
export default Auth;