import {
    MenuFoldOutlined,
    MenuUnfoldOutlined
} from '@ant-design/icons';
import { Layout, theme } from 'antd';
import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Footer from './Footer';
import { useStateContext } from '../../contexts/ContextProvider';
import Home from '../../pages';
import { Route, Routes } from 'react-router-dom';
import HoverMenu from './HoverMenu';
import Verification from '../../pages/Verification';
import BDRs from '../../pages/BDRs';
import POCs from '../../pages/POCs';
import Account from '../../pages/Account';
import Register from '../../pages/Register';
import Assets from '../../pages/Assets';
import VerificationSuccess from '../VerificationSuccess';
import Sectors from '../../pages/Sectors';
import AddSector from '../../pages/SectorForm';
import Contracts from '../../pages/Contracts';
import Sector from '../../pages/Sector';
import DecommissionedAssets from '../../pages/DecommissionedAssets';
import ContractForm from '../../pages/ContractForm';
import Contract from '../../pages/Contract';
import TermsConditions from '../../pages/TermsConditions';
import TCForm from '../../pages/TCForm';
import BDR from '../../pages/BDR';
import Scanner from '../../pages/Scanner';
const { Header } = Layout;
const Main = () => {
    const [collapsed, setCollapsed] = useState(false);
    const { sidebarCollapsed, setSidebarCollapsed, userRole } = useStateContext();
    const toggle = () => {
        setCollapsed(!collapsed);
        setSidebarCollapsed(!sidebarCollapsed);
    };
    const { token: { colorBgContainer } } = theme.useToken();
    return (
        <div >
            <Layout>
                <Sidebar style={{
                    minWidth: '50px !important',
                    maxWidth: '50px !important',
                    width: '100% !important',
                }} className='noselect' />
                <Layout className="site-layout" style={{ marginLeft: sidebarCollapsed ? 40 : 192, minHeight: '95vh' }}>
                    <Header className="site-layout-background noselect" style={{
                        padding: [0, 0, 5, 2],
                        background: colorBgContainer,
                        position: 'sticky',
                        top: 0,
                        zIndex: 1,
                        width: '100%',
                    }}>
                        {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                            className: 'trigger noselect',
                            onClick: () => toggle(),
                        })}
                        <div
                            className='noselect' 
                            style={{
                                float: 'right',
                                width: 120,
                                height: 31,
                                margin: '0px 0px 0px',
                            }}>
                            <HoverMenu/>
                        </div>

                    </Header>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/home" element={<Home />} />
                        <Route path="/poc-verify" element={<Scanner />} />
                        {userRole == 'admin' && <Route path="/bdrs" element={<BDRs />} />}
                        {userRole == 'admin' && <Route path="/bdrs/:id" element={<BDR />} />}
                        <Route path="/pocs" element={<POCs />} />
                        {userRole == 'admin' && <Route path="/assets" element={<Assets />} />}
                        <Route path="/decommissioned-assets" element={<DecommissionedAssets />} />
                        {userRole == 'admin' && <Route path="/sectors" element={<Sectors />} />}
                        {userRole == 'admin' && <Route path="/sector-form" element={<AddSector />} />}
                        {userRole == 'admin' && <Route path="/sector/:id" element={<Sector />} />}
                        <Route path="/account-settings" element={<Account />} />
                        {userRole == 'admin' && <Route path="/add-user" element={<Register />} />}
                        <Route path="/contracts" element={<Contracts />} />
                        <Route path="/contracts/terms" element={<TermsConditions />} />
                        <Route path="/contracts/add-tc" element={<TCForm />} />
                        <Route path="/contract/:id" element={<Contract />} />
                        <Route path="/new-contract" element={<ContractForm />} />
                        <Route path="/verification-success" element={<VerificationSuccess />} />
                    </Routes>
                    <Footer className='noselect' />
                </Layout>
            </Layout>
        </div>
    );
};
export default Main;