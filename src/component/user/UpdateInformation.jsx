import { Row, Col, Avatar, Form, Input, Button, Upload, message, notification} from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { UploadOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { callUpdateAvatar, callUpdateUserInfo } from '../../services/api';
import { doUpdateUserInfoAction, doUploadAvatarAction } from '../../redux/account/accountSlice';

const UpdateInformation = (props) => {
    const user = useSelector(state => state.account.user);
    const [form] = Form.useForm();
    const [userAvatar, setUserAvatar] = useState(user?.avatar ?? "");
    const [isSubmit, setIsSubmit] = useState(false);
    const dispatch = useDispatch();

    const handleUploadAvatar= async({file, onSuccess, onError}) =>{
        const res = await callUpdateAvatar(file);
        if(res && res.data){
            const newAvatar = res.data.fileUploaded;
            dispatch(doUploadAvatarAction({avatar: newAvatar}));
            setUserAvatar(newAvatar);
            onSuccess('ok');
        }else{
            onError('Đã có lỗi xảy ra');
        }
    };
    
    const propsUpload = {
        maxCount: 1,
        multiple: false,
        showUploadList: false,
        customRequest: handleUploadAvatar,
        onChange(info) {
            if(info.file.status === 'done'){
                message.success('Upload file thanh cong')
            }
            if(info.file.status === 'error'){
                message.error('Upload file that bai')
            }
        }
    }

    const onFinish = async (values) => {
        const {_id, fullName, phone} = values;
        setIsSubmit(true);
        const res = await callUpdateUserInfo(_id, phone, fullName, userAvatar);
        console.log(res);
        if(res && res.data){
            dispatch(doUpdateUserInfoAction({avatar: userAvatar, phone, fullName}));
            message.success("Cập nhật thành công thông tin tài khoản");
            localStorage.removeItem('access_token');
            props.setOpenAccountManager(false);
        }else{
            notification.error({
                message:'Đã có lỗi xảy ra',
                description: res.message
            })
        }
        setIsSubmit(false);
    }

    const urlAvatar = `${import.meta.env.VITE_BACKEND_URL}/images/avatar/${userAvatar}`; 

    return(
        <div style={{width:'100%'}}>
            <Row>
                <Col span={8}>
                    <div style={{display:'flex', justifyContent:'center', flexDirection:'column', alignItems:'center'}}>
                        <div>
                            <Avatar size={150} src={urlAvatar} />  
                        </div>
                        <div style={{marginTop: 20}}>
                            <Upload {...propsUpload}>
                                <Button icon={<UploadOutlined />}>Upload Avatar</Button>
                            </Upload>
                        </div>
                    </div>
                </Col>
                <Col span={16}>
                    <div>
                        <Form onFinish={onFinish} form={form}>

                            <Form.Item label="Id" name="_id" initialValue={user?.id} hidden>
                                <Input value={user?.id}/>
                            </Form.Item>

                            <Form.Item labelCol={{span: 24}} label="Email" name="email" style={{marginBottom: 5}}
                                initialValue={user?.email}>
                                <Input value={user?.email} disabled/>
                            </Form.Item>

                            <Form.Item labelCol={{span: 24}} label="Tên người dùng" name="fullName" style={{marginBottom: 5}}
                                initialValue={user?.fullName} rules={[{required: true, message:'Hãy nhập tên người nhận'}]}>
                                <Input value={user?.fullName}/>
                            </Form.Item>   

                            <Form.Item labelCol={{span: 24}} label="Số điện thoại" name="phone" style={{marginBottom: 5}}
                                initialValue={user?.phone} rules={[{required: true, message:'Hãy nhập số điện thoại'}]}>
                                <Input value={user.phone}/>
                            </Form.Item>

                        </Form>
                        <Button disabled={isSubmit} type='primary' style={{marginTop: 10}} onClick={() => form.submit()}>Update Account</Button>
                    </div>
                </Col>
            </Row>
        </div>
    )
}

export default UpdateInformation;