import { Card, Col, Divider, Layout, Row, Space, Table, theme } from 'antd';
import React, { useEffect, useState } from 'react';
import { useStateContext } from '../contexts/ContextProvider.js';
import Search from 'antd/es/input/Search.js';
import POCTable from '../components/POC/POCTable.jsx';
import PasswordChange from '../components/Account/PasswordChangeForm.jsx';
import CountryGPSForm from '../components/CountryGPSForm.jsx';
import { getCountries } from '../services/resources.js';
const { Content } = Layout;

const Account = () => {
    const { sidebarCollapsed, userRole, countries, setCountries } = useStateContext();
    const {
        token: { colorBgContainer },
    } = theme.useToken();

    const onSearch = (text) => {
        if (text) {
            console.log(text);
        }
    };

    const countriesColumns = [
        {
            title: 'Country',
            label: 'Country',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Code',
            label: 'Code',
            dataIndex: 'code',
            key: 'code',
        },
        {
            title: 'GPS Range',
            label: 'GPS Range',
            dataIndex: 'gps_compliance_range',
            key: 'gps_compliance_range',
        },
    ];

    

    useEffect(() => {
        
    }, [userRole]);

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
                <Card title="User Account Settings" size="small">
                    <div style={{ marginTop: '40px' }}>
                        <PasswordChange />
                    </div>
                    {/* <Divider /> */}
                </Card>
                {/* A row with two columns */}
                <Card title="GPS Compliance Range" size="small">
                    <Row gutter={[16, 16]}>
                        <Col xs={24} md={12}>
                            {userRole == 'admin' ?
                                <div style={{ marginTop: '40px' }}>
                                    <CountryGPSForm />
                                </div> : null}
                        </Col>
                        <Col xs={24} md={12}>
                            <div style={{ }}>
                                <Table columns={countriesColumns} dataSource={countries} bordered size='small' style={{ overflowX: 'scroll' }} />
                            </div>
                        </Col>
                    </Row>
                </Card>
            </Space>
        </Content>
    </>;
};

export default Account;
