import { Modal, Form, Input, message, notification} from 'antd';
import { useEffect, useState } from 'react';
import { callUpdateUser } from '../../../services/api';

const UserModalUpdate = (props) => {
    const {openModalUpdate, dataUpdate} = props;
    const [isSubmit, setIsSubmit] = useState(false);
    const [form] = Form.useForm();

    useEffect(() => {
        form.setFieldsValue(dataUpdate);
    }, [dataUpdate])

    const onFinish = async(values) => {
        const {_id, fullName, phone} = values;
        setIsSubmit(true);
        const res = await callUpdateUser(_id, fullName, phone);
        if(res && res.data){
            message.success("update user success");
            props.setOpenModalUpdate(false);
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
                title="Update User"
                open={openModalUpdate}
                onOk={() => { form.submit() }}
                onCancel={() => {
                    props.setOpenModalUpdate(false);
                    props.setDateUpdate(null);
                }}
                okText={"Update"}
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
                    hidden
                    label="Id"
                    name="_id"
                    rules={[{ required: true, message: 'Please input your id!' }]}
                    >
                    <Input />
                    </Form.Item>

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
                    <Input disabled/>
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

export default UserModalUpdate;