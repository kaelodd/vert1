import { Button, Card, Divider, Layout, Space, theme } from 'antd';
import React, { useEffect, useState } from 'react';
import { UserAddOutlined, PlusSquareOutlined, DownSquareOutlined, SendOutlined } from '@ant-design/icons';
import { useStateContext } from '../contexts/ContextProvider.js';
import Search from 'antd/es/input/Search.js';
import { Link, useNavigate, useParams } from 'react-router-dom';
import BreadCrumb from '../components/Layout/Breadcrum.jsx';
import ContractView from '../components/Contract/ContractView.jsx';
const { Content } = Layout;


const TermsConditions = () => {
    const { id } = useParams();
    const breadCrumbLinks = [
        {
            title: <Link to={'/'}>Home</Link>,
        },
        {
            title: <Link to={'/contracts'}>Contracts</Link>,
        },
        {
            title: id || '',
        },
    ]
    const { sidebarCollapsed } = useStateContext();
    const navigate = useNavigate();

    const addNew = () => {
        navigate('/sector-form');
    }

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
            <BreadCrumb links={breadCrumbLinks} />
            <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
                <Card size="small">
                    <div style={{}}>
                        <Space direction="horizontal">
                            <Button onClick={() => {  }} style={{ marginLeft: 5, marginBottom: 20 }} type="primary" icon={<DownSquareOutlined />}>
                                Download
                            </Button>
                            <Button onClick={() => { }} style={{ marginLeft: 5, marginBottom: 20 }} color="green">
                                Send to POC <SendOutlined />
                            </Button>
                        </Space>
                    </div>

                    {id ? <ContractView contract_id={id} /> : ''}
                </Card>
            </Space>
        </Content>
    </>;
};

export default TermsConditions;
