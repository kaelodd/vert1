import { Card, Divider, Layout, Space, theme } from 'antd';
import React, { useEffect, useState } from 'react';
import { useStateContext } from '../contexts/ContextProvider.js';
import Search from 'antd/es/input/Search.js';
import POCTable from '../components/POC/POCTable.jsx';
import AssetsTable from '../components/POC/AssetsTable.jsx';
import Breadcrumb from '../components/Layout/Breadcrum.jsx';
const { Content } = Layout;

const POCs = () => {
    const { sidebarCollapsed } = useStateContext();
    const [searchText, setSearchText] = useState();
    const {
        token: { colorBgContainer },
    } = theme.useToken();

    const onSearch = (text) => {
        if (text) {
            // console.log(text);

            setSearchText(text);
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
            <Breadcrumb />
            <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
                <Card size="small">
                    <div style={{}}>
                    <Space direction="vertical">
                        <Search
                        placeholder="input search text"
                        onSearch={onSearch}
                        style={{
                            width: '100%',
                            marginBottom: 20
                        }}
                        />
                        </Space>
                    </div>
                    <AssetsTable search={searchText} />
                </Card>
            </Space>
        </Content>
    </>;
};

export default POCs;
