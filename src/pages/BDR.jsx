import { Button, Card, Divider, Layout, Space, theme } from 'antd';
import React, { useEffect, useState } from 'react';
import { UserAddOutlined, PlusSquareOutlined } from '@ant-design/icons';
import { useStateContext } from '../contexts/ContextProvider.js';
import Search from 'antd/es/input/Search.js';
import { Link, useNavigate, useParams } from 'react-router-dom';
import BreadCrumb from '../components/Layout/Breadcrum.jsx';
import BdrView from '../components/BDR/BdrView.jsx';
const { Content } = Layout;


const BDR = () => {
    const { id } = useParams();
    const breadCrumbLinks = [
        {
            title: <Link to={'/'}>Home</Link>,
        },
        {
            title: <Link to={'/bdrs'}>Users</Link>,
        },
        {
            title: id || '',
        },
    ]
    const { sidebarCollapsed } = useStateContext();
    const navigate = useNavigate();
    const { token: { colorBgContainer }, } = theme.useToken();
    const [searchText, setSearchText] = useState('');

    const onSearch = (text) => {
        if (text) {
            setSearchText(text);
        }
    };

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
                    {id ? <BdrView id={id} /> : ''}
                </Card>
            </Space>
        </Content>
    </>;
};

export default BDR;
