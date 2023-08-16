import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UploadOutlined,
    UserOutlined,
    VideoCameraOutlined,
    CameraOutlined,
    AppstoreOutlined,
    BarChartOutlined,
    CloudOutlined,
    ShopOutlined,
    ShopFilled,
    TeamOutlined,
    LogoutOutlined,
    BarcodeOutlined,
    GatewayOutlined,
    FolderOutlined,
    DashboardOutlined,
    ClusterOutlined,
    SafetyOutlined,
    BookOutlined,
} from '@ant-design/icons';
import { Layout, Menu, theme } from 'antd';
import React, { useEffect, useState } from 'react';
import { useStateContext } from '../../contexts/ContextProvider.js';
import { Link } from 'react-router-dom';
import { logout } from '../../auth.js';
const { Sider } = Layout;
const items = [
    UserOutlined,
    VideoCameraOutlined,
    UploadOutlined,
    BarChartOutlined,
    CloudOutlined,
    AppstoreOutlined,
    TeamOutlined,
    ShopOutlined,
].map((icon, index) => ({
    key: String(index + 1),
    icon: React.createElement(icon),
    label: `nav ${index + 1}`,
}));
const signOut = () => {
    console.log('Logout');
    logout();
    window.location.reload();
}
let menuItems = [
    {
        key: '1',
        icon: <DashboardOutlined />,
        label: <Link to={'/'}>Dashboard</Link>,
        access: 'user'
    },
    // {
    //     key: '2',
    //     icon: <ShopOutlined />,
    //     label: <Link to={'/pocs'}>POCs</Link>,
    // },
    {
        key: '2',
        icon: <ShopOutlined />,
        label: <Link to={'/assets'}>Assets</Link>,
        access: 'admin'
    },
    {
        key: '9',
        icon: <ShopFilled />,
        label: <Link to={'/decommissioned-assets'}>Decommissioned Assets</Link>,
        access: 'admin'
    },
    {
        key: '3',
        icon: <BarcodeOutlined />,
        label: <Link to={'/poc-verify'}>Scanner</Link>,
        title: 'Scan Barcode',
        access: 'user'
    },
    {
        key: '4',
        icon: <ClusterOutlined />,
        label: <Link to={'/sectors'}>Sectors</Link>,
        title: 'Sectors',
        access: 'admin'
    },
    {
        key: '5',
        icon: <TeamOutlined />,
        label: <Link to={'/bdrs'}>Users</Link>,
        title: 'View and Manage Users',
        access: 'admin'
    },
    {
        key: '6',
        icon: <BookOutlined />,
        label: <Link to={'/contracts'}>Contracts</Link>,
        title: 'Contracts',
        access: 'user'
    },
    {
        key: '7',
        icon: <SafetyOutlined />,
        label: <Link to={'/account-settings'}>Account</Link>,
        title: 'Account Settings',
        access: 'user'
    },
    {
        key: '8',
        icon: <LogoutOutlined onClick={() => signOut()} />,
        label: <label onClick={() => signOut()}>Logout</label>,
        title: 'Logout',
        access: 'user'
    }
];

const Sidebar = ({ collapsed }) => {
    const { sidebarCollapsed, userRole } = useStateContext();

    useEffect(() => {
    }, [collapsed, userRole]);

    menuItems = userRole !== 'admin' ? menuItems.filter(item => item.access !== 'admin') : menuItems;
    return (<>
        <Sider style={{
            overflow: 'auto',
            height: '100vh',
            position: 'fixed',
            left: 0,
            top: 0,
            bottom: 0,
            background: 'rgba(255, 255, 255, 0.5)',
            fontWeight: 500,
        }} trigger={null} collapsible collapsed={sidebarCollapsed}>
            <div className="logo">
                {/* Logo image */}
                <img src="/1024.png" alt="Pulse" style={{ width: '100%', marginTop: '20px', padding: 5, marginBottom: '15px' }} />
                </div>
            {/* <div
                style={{
                    height: 2,
                    margin: 16,
                    background: 'rgba(255, 255, 255, 0.2)',
                }}
            /> */}
            <Menu theme="light" mode="inline" defaultSelectedKeys={['1']} items={menuItems} />
        </Sider>
    </>);
};

export default Sidebar;
