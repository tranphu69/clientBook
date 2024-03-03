import { Button, Form, Input, Divider, message, notification} from 'antd';
import { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { callLogin } from '../../services/api';
import { useDispatch } from 'react-redux';
import { doLoginAction } from '../../redux/account/accountSlice';

const LoginPage = () => {
    const navigate = useNavigate();
    const [isSubmit, setIsSubmit] = useState(false);
    const dispatch = useDispatch();

    const onFinish = async (values) => {
        const {username, password} = values;
        setIsSubmit(true);
        const res = await callLogin(username, password);
        setIsSubmit(false);
        if(res?.data){
            localStorage.setItem('access_token', res.data.access_token)
            dispatch(doLoginAction(res.data.user));
            message.success("Login account success");
            navigate("/")
        }else{
            notification.error({
                message: res.message,
                duration: 5
            })
        }
    };

    return(
        <div className='login-page' style={{padding:'50px'}}>
            <h1 style={{textAlign:'center', marginBottom:"50px"}}> Login user</h1>
            
            <Form
                name="basic"
                labelCol={{ span: 24 }}
                style={{ maxWidth: 600, margin: "0 auto" }}
                onFinish={onFinish}
                autoComplete="off"
            >
                <Divider/>
                <Form.Item
                label="Email"
                name="username"
                rules={[{ required: true, message: 'Please input your email!' }]}
                >
                <Input />
                </Form.Item>

                <Form.Item
                label="Password"
                name="password"
                rules={[{ required: true, message: 'Please input your password!' }]}
                >
                <Input.Password />
                </Form.Item>

                <Form.Item>
                <Button type="primary" htmlType="submit" loading={isSubmit}>
                    Submit
                </Button>
                </Form.Item>
                <Divider>Or</Divider>
                <p className='text'> Need an account? 
                    <span>
                        <Link to="/register"> Sign up</Link>
                    </span>
                    <span>?
                        <Link to="/"> Home</Link>
                    </span>
                </p>
            </Form>
        </div>
    )
}

export default LoginPage;