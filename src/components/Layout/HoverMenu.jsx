import { DownOutlined, UserOutlined, SettingOutlined, LogoutOutlined } from '@ant-design/icons';
import { Dropdown, Space } from 'antd';
import { getUser, logout } from '../../auth';
import { useEffect, useState } from 'react';
import { useStateContext } from '../../contexts/ContextProvider';

const signOut = () => {
  logout();
  window.location.reload();
};
const items = [
  {
    label: <a href="#">Profile</a>,
    key: '0',
    icon: <UserOutlined />,
  },
  {
    label: <a href="#">Settings</a>,
    key: '1',
    icon: <SettingOutlined />,
  },
  {
    type: 'divider',
  },
  {
    label: <label onClick={() => signOut()}>Logout</label>,
    key: '3',
    icon: <LogoutOutlined onClick={() => signOut()} />,
    danger: true,
    disabled: false,
  },
];
const handleMenuClick = (e) => {
  console.log('click', e);
};
const menuProps = {
  items,
  onClick: handleMenuClick,
};

const HoverMenu = () => {
  const { sidebarCollapsed, setSidebarCollapsed } = useStateContext();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = getUser;
    if (userData && userData.email) {
      setUser(userData);
    }
  }, [sidebarCollapsed, setSidebarCollapsed]);

  return (<Dropdown.Button
    menu={menuProps}
    trigger={['click']}
    icon={<UserOutlined />}
    style={{
      display: sidebarCollapsed ? 'flex' : 'none',
      marginTop: '15px',
    }}
  >
    <Space>
      {user ? user.firstName : ''}
    </Space>
  </Dropdown.Button>);

}
export default HoverMenu;