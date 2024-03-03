import React, { useEffect, useState } from 'react';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import LoginPage from './pages/login/login';
import Header from './component/header/Header';
import { Outlet } from "react-router-dom";
import Home from './component/home/Home';
import RegisterPage from './pages/register/register';
import { callFetchAccount } from './services/api';
import {useDispatch, useSelector} from "react-redux";
import { doGetAccountAction } from './redux/account/accountSlice';
import Loading from './component/loading/loading';
import NotFound from './component/notFound/notFound';
import Book from './pages/book/book';
import Contact from './pages/contact/contact';
import User from './pages/user/user';
import ProtectedRoute from './component/protectedRoute/protectedRoute';
import AdminPage from './pages/admin/admin';
import LayoutAdmin from './component/adminLayout/adminLayout';
import Order from './pages/order/order';
import BookTable from './component/adminLayout/book/BookTable';
import UserTable from './component/adminLayout/user/UserTable';
import History from './pages/history/history';
import OrderTable from './component/adminLayout/order/OrderTable';


const Layout = () => {
  const [search, setSearchTerm] = useState("");

  return(
    <div className='layout-app'>
      <Header search={search} setSearchTerm={setSearchTerm}/>
      <Outlet context={[search, setSearchTerm]}/>
    </div>
  )
}

export default function App() {
  const dispatch = useDispatch();
  const isLoading = useSelector(state => state.account.isLoading);

  const getAccount = async() => {
    if( window.location.pathname === '/login' || 
        window.location.pathname === '/register') return;
    const res = await callFetchAccount();
    if(res.data && res){
      dispatch(doGetAccountAction(res.data));
    }
  }

  useEffect(() => {
    getAccount();
  }, [])

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout/>,
      errorElement: <NotFound/>,
      children: [
        { index: true, element: <Home/> },
        {
          path: "book/:slug",
          element: <Book/>
        },
        {
          path: "contact",
          element: <Contact/>
        },
        {
          path: "order",
          element: <ProtectedRoute><Order/></ProtectedRoute>
        },
        {
          path: "history",
          element: <ProtectedRoute><History/></ProtectedRoute>
        },
      ]
    },
    {
      path: "/login",
      element: <LoginPage/>,
    },
    {
      path: "/register",
      element: <RegisterPage/>,
    },
    {
      path: "/admin",
      element: <LayoutAdmin/>,
      errorElement: <NotFound/>,
      children: [
        { index: true, element: <ProtectedRoute> <AdminPage/> </ProtectedRoute> },
        {
          path:'user',
          element:<ProtectedRoute><UserTable/></ProtectedRoute> 
        },
        {
          path:'book',
          element:<ProtectedRoute><BookTable/></ProtectedRoute>
        },
        {
          path:'order',
          element:<ProtectedRoute><OrderTable/></ProtectedRoute>
        }
      ]
    },
  ]);

  return(
    <>
      {isLoading === false || window.location.pathname === '/login' 
      || window.location.pathname === '/register' || window.location.pathname === '/' ? 
        <RouterProvider router={router} /> 
      :
        <Loading/>
      }
    </>
  )
}
