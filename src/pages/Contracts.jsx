import { Button, Card, Divider, Layout, Result, Space, theme } from 'antd';
import React, { useEffect, useState } from 'react';
import { UserAddOutlined, PlusSquareOutlined, SmileOutlined } from '@ant-design/icons';
import { useStateContext } from '../contexts/ContextProvider.js';
import Search from 'antd/es/input/Search.js';
import { Link, useNavigate } from 'react-router-dom';
import BreadCrumb from '../components/Layout/Breadcrum.jsx';
import SectorTable from '../components/Sectors/SectorTable.jsx';
import TCForm from '../components/Contract/TCForm.jsx';
import ContractsTable from '../components/Contract/ContractsTable.jsx';
import ContractForm from '../components/Contract/ContractForm.jsx';
import Contract from '../components/Contract/Contract.jsx';
const { Content } = Layout;

const breadCrumbLinks = [
    {
        title: <Link to={'/'}>Home</Link>,
    },
    {
        title: 'Contract',
    },
]

const Contracts = () => {
    const { sidebarCollapsed, userRole } = useStateContext();
    const navigate = useNavigate();
    const { token: { colorBgContainer }, } = theme.useToken();
    const [searchText, setSearchText] = useState('');

    const onSearch = (text) => {
        if (text) {
            setSearchText(text);
        }
    };

    const addNew = () => {
        navigate('/new-contract');
    }

    const addNewTerms = () => {
        navigate('/contracts/add-tc');
    }

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
            <BreadCrumb links={breadCrumbLinks} />
            <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
                <Card size="small">

                    {/* <Result
                        icon={<SmileOutlined />}
                        title="Great, we are still getting this ready!"
                        extra={<Button type="primary">Next</Button>}
                    /> */}
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
                            <Button onClick={() => { addNew() }} style={{ marginLeft: 5, marginBottom: 20 }} type="primary" icon={<PlusSquareOutlined />}>
                                Add
                            </Button>
                        </Space>
                    </div>
                    <ContractsTable search={searchText} />

                    {userRole == 'admin' ? <Card title="Terms and Conditions" style={{ marginTop: '20px' }} size="small" extra={<Button onClick={() => { addNewTerms() }} style={{ marginLeft: 5, marginTop: 5, marginBottom: 5 }} type="primary" icon={<PlusSquareOutlined />}>
                                Add
                            </Button>}>
                        <div style={{ marginTop: '10px' }}>
                            <TCForm />
                        </div>
                    </Card> : <Card title="Terms and Conditions" style={{ marginTop: '20px' }} size="small">
                        <div style={{ marginTop: '10px' }}>
                            <TCForm />
                        </div>
                    </Card>}
                </Card>
            </Space>
        </Content>
    </>;
};

export default Contracts;
