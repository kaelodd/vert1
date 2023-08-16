import { Card, Divider, Layout, Space, theme } from 'antd';
import React, { useEffect, useState } from 'react';
import { useStateContext } from '../contexts/ContextProvider.js';
import Search from 'antd/es/input/Search.js';
import POCTable from '../components/POC/POCTable.jsx';
import PasswordChange from '../components/Account/PasswordChangeForm.jsx';
import RegistrationForm from '../components/Account/RegistrationForm.jsx';
const { Content } = Layout;

const Register = () => {
    const { sidebarCollapsed } = useStateContext();
    const {
        token: { colorBgContainer },
    } = theme.useToken();

    const onSearch = (text) => {
        if (text) {
            console.log(text);
        }
    };

    useEffect(() => {

    }, []);

    return <>

        <Content
            style={{
                margin: '24px 16px',
                // padding: 24,
                minHeight: 280,
                overflow: 'initial',
            }}
        >
            <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
                <Card title="User Registration" size="small">
                    <div style={{ marginTop: '40px' }}>
                        <RegistrationForm />
                    </div>
                    {/* <Divider /> */}
                </Card>
            </Space>
        </Content>
    </>;
};

export default Register;
