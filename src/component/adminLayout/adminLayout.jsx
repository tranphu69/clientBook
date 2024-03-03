import React, { useEffect, useState } from 'react';
import {
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    AppstoreOutlined,
    UserOutlined,
    TeamOutlined,
    ExceptionOutlined,
    DollarCircleOutlined,
} from '@ant-design/icons';
import { Layout, Menu, Dropdown, Space, message, Avatar } from 'antd';
import './adminLayout.scss';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { Outlet } from "react-router-dom";
import {useNavigate} from "react-router-dom"
import { callLogout } from '../../services/api';
import { doLogoutAction } from '../../redux/account/accountSlice';
import User from '../../pages/user/user';

const { Content, Sider } = Layout;

const items = [
    {
        label: <Link to='/admin'>Dashboard</Link>,
        key:'/admin',
        icon:<AppstoreOutlined/>
    },
    {
        label:<Link to='/admin/user'>Manager User</Link>,
        icon: <UserOutlined/>,
        key:'/admin/user',
    },
    {
        label: <Link to='/admin/book'>Manage Books</Link>,
        key: '/admin/book',
        icon: <ExceptionOutlined />
    },
    {
        label: <Link to='/admin/order'>Manage Orders</Link>,
        key: '/admin/order',
        icon: <DollarCircleOutlined />
    },
];

const LayoutAdmin = () => {
  const [collapsed, setCollapsed] = useState(false);
  const user = useSelector(state => state.account.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const actionMenu = location.pathname;
  const [openAccountManager, setOpenAccountManager] = useState(false);

  const handleLogout = async () => {
    const res = await callLogout();
    if(res && res.data){
        dispatch(doLogoutAction());
        message.success("Logout success");
        navigate('/');
    }
  }

  let itemsDropdown = [
    {
        label: <label style={{ cursor: 'pointer' }} onClick={() => setOpenAccountManager(true)}>Quản lý tài khoản</label>,
        key: 'account',
    },
    {
        label: <label
            style={{ cursor: 'pointer' }}
            onClick={() => handleLogout()}
        >Đăng xuất</label>,
        key: 'logout',
    },
    {
        label: <label style={{ cursor: 'pointer' }}>Lịch sử mua hàng</label>,
        key: 'history',
    },
];
if(user?.role === 'ADMIN'){
    itemsDropdown.unshift({
        label:<Link to="/">Trang chủ</Link>,
        key:'home'
    })
}

const urlAvatar = `${import.meta.env.VITE_BACKEND_URL}/images/avatar/${user?.avatar}`; 

  return (
    <div>
        <Layout style={{ minHeight: '100vh' }} className="layout-admin">
        <Sider 
            collapsible 
            collapsed={collapsed} 
            onCollapse={(value) => setCollapsed(value)}>
            <div style={{height: 30, textAlign:'center', color:'white', marginTop: 15}}> Admin </div>
            <Menu 
                theme="dark" 
                defaultSelectedKeys={[actionMenu] ?? '/admin'}
                mode="inline" 
                items={items}/>
        </Sider>
        <Layout>
            <div className='admin-header'>
                <span>
                    {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                        className: 'trigger',
                        onClick: () => setCollapsed(!collapsed),
                    })}
                </span>
                <Dropdown menu={{ items: itemsDropdown }} trigger={['click']}>
                            <a onClick={(e) => e.preventDefault()}>
                                <Space>
                                    <Avatar src={urlAvatar}/>
                                    <span style={{color: 'black'}}>{user?.fullName}</span>
                                </Space>
                            </a>
                        </Dropdown>
            </div>
            <Content style={{ margin: '16px' }}>
            <Outlet/>
            </Content>
        </Layout>
        </Layout>
        <User openAccountManager={openAccountManager} setOpenAccountManager={setOpenAccountManager}/>
    </div>
  );
};

export default LayoutAdmin;