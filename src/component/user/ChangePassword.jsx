import { Form, Input, Button, message, notification} from 'antd';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { callChangePassword } from '../../services/api';

const ChangePassword = (props) => {
    const user = useSelector(state => state.account.user);
    const [form] = Form.useForm();
    const [isSubmit, setIsSubmit] = useState(false);

    const onFinish = async(values) => {
        const {email, oldPassword, newPassword} = values;
        setIsSubmit(true);
        const res = await callChangePassword(email, oldPassword, newPassword);
        if(res && res.data){
            message.success("Cập nhật mật khẩu thành công");
            form.setFieldValue("oldPassword", "");
            form.setFieldValue("newPassword", "");
            props.setOpenAccountManager(false);
        }else{
            notification.error({
                message:'Đã có lỗi xảy ra',
                description: res.message
            })
        }
        setIsSubmit(false);
    }

    return(
        <div>
            <Form onFinish={onFinish} form={form}>
                <Form.Item labelCol={{span: 24}} label="Email" name="email" style={{marginBottom: 5}}
                    initialValue={user?.email}>
                    <Input value={user?.email} disabled/>
                </Form.Item>

                <Form.Item labelCol={{span: 24}} label="Mật khẩu hiện tại" name="oldPassword" style={{marginBottom: 5}}
                    rules={[{required: true, message:'Hãy nhập mật khẩu hiện tại'}]}>
                    <Input.Password/>
                </Form.Item>   

                <Form.Item labelCol={{span: 24}} label="Mật khẩu mới" name="newPassword" style={{marginBottom: 5}}
                    rules={[{required: true, message:'Hãy nhập mật khẩu mới'}]}>
                    <Input.Password/>
                </Form.Item>
            </Form>
            <Button disabled={isSubmit} type='primary' style={{marginTop: 10}} onClick={() => form.submit()}>Đổi mật khẩu</Button>
        </div>
    )
}

export default ChangePassword;