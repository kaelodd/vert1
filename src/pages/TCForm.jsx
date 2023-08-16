import { Card, Divider, Layout, Space, theme } from 'antd';
import React, { useEffect, useState } from 'react';
import { useStateContext } from '../contexts/ContextProvider.js';
import NewTCForm from '../components/Contract/NewTCForm.jsx';
const { Content } = Layout;

const TCForm = () => {
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
                <Card title="Contract Terms and Conditions Form" size="small">
                    <div style={{ marginTop: '40px' }}>
                        <NewTCForm />
                    </div>
                    {/* <Divider /> */}
                </Card>
            </Space>
        </Content>
    </>;
};

export default TCForm;
