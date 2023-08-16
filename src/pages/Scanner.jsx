import { Card, Divider, Layout, Space, theme } from 'antd';
import React, { useEffect, useState } from 'react';
import { useStateContext } from '../contexts/ContextProvider.js';
import RegistrationForm from '../components/Account/RegistrationForm.jsx';
import ScannerComponent from '../components/POC/ScannerComponent.jsx';
const { Content } = Layout;

const Scanner = () => {
    useEffect(() => {

    }, []);

    return <>

        <Content style={{
            margin: '24px 16px',
            // padding: 24,
            // minHeight: 280,
            overflow: 'initial',
        }}>
            <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
                <Card title="Asset Reporter" size="small">
                    <div style={{ marginTop: '0px' }}>
                        <ScannerComponent />
                    </div>
                    {/* <Divider /> */}
                </Card>
            </Space>
        </Content>
    </>;
};

export default Scanner;
