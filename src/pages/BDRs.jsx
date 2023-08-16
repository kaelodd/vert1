import { Button, Card, Divider, Layout, Space, theme } from 'antd';
import React, { useEffect, useState } from 'react';
import { UserAddOutlined, PlusSquareOutlined } from '@ant-design/icons';
import { useStateContext } from '../contexts/ContextProvider.js';
import Statistics from '../components/Statistics.jsx';
import BDRTable from '../components/BDR/BDRTable.jsx';
import Search from 'antd/es/input/Search.js';
import { Link, useNavigate } from 'react-router-dom';
import BreadCrumb from '../components/Layout/Breadcrum.jsx';
const { Content } = Layout;

const breadCrumbLinks = [
    {
        title: <Link to={'/'}>Home</Link>,
    },
    // {
    //     title: <a href="">Application Center</a>,
    // },
    {
        title: 'Users',
    },
]

const BDRs = () => {
    const { sidebarCollapsed } = useStateContext();
    const navigate = useNavigate();
    const { token: { colorBgContainer }, } = theme.useToken();
    const [searchText, setSearchText] = useState('');

    const onSearch = (text) => {
        if (text) {
            setSearchText(text);
        }
    };

    const addNewUser = () => {
        navigate('/add-user');
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
                        <Search
                        placeholder="input search text"
                        onSearch={onSearch}
                        style={{
                            width: '100%',
                            marginBottom: 20
                                }}
                            />
                            <Button onClick={() => { addNewUser() }} style={{ marginLeft: 5, marginBottom: 20, paddingRight: 20}} type="primary" icon={<PlusSquareOutlined />}>
                                Add
                            </Button>
                        </Space>
                    </div>
                    <BDRTable search={searchText} />
                </Card>
            </Space>
        </Content>
    </>;
};

export default BDRs;
