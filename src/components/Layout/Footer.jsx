import { Layout, Menu, theme } from 'antd';
import React, { useEffect, useState } from 'react';
import { useStateContext } from '../../contexts/ContextProvider.js';
const { Footer } = Layout;

const PageFooter = () => {
    const { sidebarCollapsed } = useStateContext();

    useEffect(() => {

    }, []);

    return <>
        <Footer
            className='noselect'
            style={{
                textAlign: 'center',
            }}
        >
            ©2023 AbInBev
        </Footer>
    </>;
};

export default PageFooter;
