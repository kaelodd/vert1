import { Card, Divider, Layout, Space, theme } from 'antd';
import React, { useEffect, useState } from 'react';
import { useStateContext } from '../contexts/ContextProvider.js';
import SectorForm from '../components/Sectors/SectorForm.jsx';
const { Content } = Layout;

const AddSector = () => {
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
                <Card title="Sector Inclusion" size="small">
                    <div style={{ marginTop: '40px' }}>
                        <SectorForm />
                    </div>
                    {/* <Divider /> */}
                </Card>
            </Space>
        </Content>
    </>;
};

export default AddSector;
