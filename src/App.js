import { Layout } from 'antd';
import React, { useEffect, useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import Auth from './components/Layout/Auth';
import { useStateContext } from './contexts/ContextProvider';
import { accessToken, getUser } from './auth.js'
import Main from './components/Layout/Main';

// const [api, contextHolder] = notification.useNotification();
const { Header, Content } = Layout;
const App = () => {
    const [token, setToken] = useState(null);
    const {setUser, user, userRole, setUserRole, sidebarCollapsed} = useStateContext();
    // const { token: { colorBgContainer }} = theme.useToken();
    useEffect(() => {
        setToken(accessToken);
        if (!user && getUser) {
            setUser(getUser);
            // console.log('user: ', getUser);
            setUserRole(getUser?.role || null);
        }
    }, []);

    return (
        <div>
            {!token ? (<BrowserRouter><Auth /></BrowserRouter>) :
                (<BrowserRouter>
                    {/* {contextHolder} */}
                    <Main />
                </BrowserRouter>)
            }
        </div>
    );
};
export default App;
