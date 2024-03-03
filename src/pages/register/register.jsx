import { Button, Form, Input, Divider, message, notification } from 'antd';
import { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { callRegister } from '../../services/api';

const RegisterPage = () => {
    const navigate = useNavigate();
    const [isSubmit, setIsSubmit] = useState(false);

    const onFinish = async(values) => {
        const {fullName, email, password, phone} = values;
        setIsSubmit(true);
        const res = await callRegister(fullName, email, password, phone);
        setIsSubmit(false);
        if(res?.data?._id){
            message.success("Register account success");
            navigate("/login")
        }else{
            notification.error({
                message:"had error!",
                description:
                    res.message && res.message.length > 0 ? res.message[0] : res.message,
                duration: 5
            })
        }
    };

    return(
        <div className='register-page' style={{padding:'50px'}}>
            <h1 style={{textAlign:'center', marginBottom:"50px"}}> Register new user</h1>
            <Form
                name="basic"
                labelCol={{ span: 24 }}
                style={{ maxWidth: 600, margin: "0 auto" }}
                onFinish={onFinish}
                autoComplete="off"
            >
                <Divider/>
                <Form.Item
                label="Fullname"
                name="fullName"
                rules={[{ required: true, message: 'Please input your fullname!' }]}
                >
                <Input />
                </Form.Item>

                <Form.Item
                label="Email"
                name="email"
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

                <Form.Item
                label="Phone"
                name="phone"
                rules={[{ required: true, message: 'Please input your phone!' }]}
                >
                <Input />
                </Form.Item>

                <Form.Item>
                <Button type="primary" htmlType="submit" loading={isSubmit}>
                    Submit
                </Button>
                </Form.Item>
                <Divider>Or</Divider>
                <p className='text'> Already have an account? 
                    <span>
                        <Link to="/login"> Log in</Link>
                    </span>
                    <span>?
                        <Link to="/"> Home</Link>
                    </span>
                </p>
            </Form>
        </div>
    )
};

export default RegisterPage;