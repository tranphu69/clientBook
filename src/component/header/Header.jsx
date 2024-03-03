import { useState } from "react";
import {Drawer, Divider, Badge, Dropdown, Space, message, Avatar, Popover, Button} from 'antd';
import { FiShoppingCart } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import './header.scss';
import { callLogout } from "../../services/api";
import { doLogoutAction } from "../../redux/account/accountSlice";
import { FaBookOpenReader } from "react-icons/fa6";
import { GrSearch } from "react-icons/gr";
import User from "../../pages/user/user";

const Header = (props) => {
    const {search, setSearchTerm} = props;
    const [openDrawer, setOpenDrawer] = useState( false );
    const isAuthenticated = useSelector(state =>  state.account.isAuthenticated);
    const user = useSelector(state => state.account.user);
    const carts = useSelector(state => state.order.carts);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [openAccountManager, setOpenAccountManager] = useState(false);

    const content = (
        <div>
          <div>
            {carts?.map((book, index) => {
                return(
                    <div key={`book-${index}`} style={{display: 'flex', gap: 5, alignItems:'center', marginTop: 10}}>
                        <img src={`${import.meta.env.VITE_BACKEND_URL}/images/book/${book.detail.thumbnail}`} style={{maxHeight: 50, maxWidth: 50}}/>
                        <div>{book.detail.mainText}</div>
                        <div style={{color: '#1677ff'}}>
                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(book.detail.price)}
                        </div>
                    </div>
                )
            })}
          </div>
          <div style={{display:'flex', justifyContent:'flex-end'}}>
            <Button type="primary" style={{marginTop: 10}} onClick={() => navigate("/order")}>Xem giỏ hàng</Button>
          </div>
        </div>
      );

    const handleLogout = async() => {
        const res = await callLogout();
        if(res && res.data){
            dispatch(doLogoutAction())
            message.success("logout success");
            navigate("/")
        }
    }

    let items = [
        {
            label: <label style={{ cursor: 'pointer' }} onClick={() => setOpenAccountManager(true)}>Quản lý tài khoản</label>,
            key: 'account',
        },
        {
            label: <label style={{ cursor: 'pointer' }} onClick={() => handleLogout()}>Đăng xuất</label>,
            key: 'logout',
        },
        {
            label: <label style={{ cursor: 'pointer' }} onClick={() => navigate('/history')}>Lịch sử mua hàng</label>,
            key: 'history',
        }
    ];
    if(user?.role === 'ADMIN'){
        items.unshift({
            label:<Link to="/admin">Trang quản trị</Link>,
            key:'admin'
        })
    }

    const urlAvatar = `${import.meta.env.VITE_BACKEND_URL}/images/avatar/${user?.avatar}`; 

    return(
        <div>
            <div className="header-container">
                <header className="page-header">
                    <div className="page-header_top">
                        <div className="page-header_toggle" onClick={() => setOpenDrawer(true)}>
                            ☰
                        </div>
                        <div className="page-header_logo">
                            <span className="logo">
                                <span onClick={() => navigate("/")}>
                                    <FaBookOpenReader className="icon-react"/> BOOK STORT
                                </span>
                                <GrSearch className="icon-search"/>
                            </span>
                            <input value={search} type="text" className="input-search" placeholder="Tên sách bạn muốn tìm là gì?" onChange={(e) => setSearchTerm(e.target.value)}/>
                        </div>
                    </div>
                    <nav className="page-header_bottom">
                        <ul className="navigation">
                            <li className="navigation_item" style={{paddingRight: '25px'}}>
                                <Popover content={content} title="Sản phẩm được thêm vào giỏ hàng" placement="topRight" arrow={true}>
                                    <Badge count={carts?.length ?? 0} size={"small"} showZero>
                                        <FiShoppingCart className='icon-cart' />
                                    </Badge>
                                </Popover>
                            </li>
                            <li className="navigation_item logo" id="mobile">
                                {!isAuthenticated ?
                                    <span onClick={() => navigate('/login')}> Tài Khoản</span>
                                    :
                                    <Dropdown menu={{ items }} trigger={['click']}>
                                        <a onClick={(e) => e.preventDefault()}>
                                            <Space>
                                                <Avatar src={urlAvatar}/>
                                                {user?.fullName}
                                            </Space>
                                        </a>
                                    </Dropdown>
                                }
                            </li>
                        </ul>
                    </nav>
                </header>
            </div>
            <Drawer
                title="Menu chức năng"
                placement="left"
                onClose={() => setOpenDrawer(false)}
                open={openDrawer}
            >
                <p>Quản lý tài khoản</p>
                <Divider/>
                <p>Đăng xuất</p>
                <Divider/>
            </Drawer>
            <User setOpenAccountManager={setOpenAccountManager} openAccountManager={openAccountManager}/>
        </div>
    )
}

export default Header;