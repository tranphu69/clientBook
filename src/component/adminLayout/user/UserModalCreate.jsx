import { Modal, Form, Input, message, notification} from 'antd';
import { useState } from 'react';
import { callCreateUser } from '../../../services/api';

const UserModalCreate = (props) => {
    const {openModalCreate} = props;
    const [isSubmit, setIsSubmit] = useState(false);
    const [form] = Form.useForm();

    const onFinish = async(values) => {
        const {fullName, password, email, phone} = values;
        setIsSubmit(true);
        const res = await callCreateUser(fullName, password, email, phone);
        if(res && res.data){
            message.success("Add new user success");
            form.resetFields();
            props.setOpenModalCreate(false);
            await props.fetchUser();
        }else{
            notification.error({
                message:'had error',
                description: res.message,
            })
        }
        setIsSubmit(false);
    }

    return(
        <>
            <Modal
                title="Add New User"
                open={openModalCreate}
                onOk={() => { form.submit() }}
                onCancel={() => {
                    props.setOpenModalCreate(false);
                    form.resetFields();
                }}
                okText={"Create"}
                cancelText={"Cancel"}
                confirmLoading={isSubmit}
                >
                <Form
                    form={form}
                    name="basic"
                    labelCol={{ span: 24 }}
                    onFinish={onFinish}
                    style={{ maxWidth: 600, margin: "auto" }}
                    autoComplete="off"
                >
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
                </Form>
            </Modal>
        </>
    )
}

export default UserModalCreate;