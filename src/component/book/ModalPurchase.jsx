import { Modal, Form, Input, Radio, Divider } from 'antd';
import { useEffect, useState } from 'react';
import { useSelector,useDispatch } from 'react-redux';
import { callCreateOrder } from '../../services/api';

const { TextArea } = Input;

const ModalPurchase = (props) => {
    const {openModalPurchase, setOpenModalPurchase, dataBook, numbers} = props;
    const [form] = Form.useForm();
    const user = useSelector(state => state.account.user);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();

    const onFinish = async(values) =>{
        setLoading(true);
        const detailOrder = [{
            bookName: dataBook.mainText,
            quantity: numbers,
            _id: dataBook._id
        }]
        const data = {
            name: values.name,
            phone: values.phone,
            address: values.address,
            totalPrice: numbers*dataBook.price,
            detail: detailOrder
        }
        const res = await callCreateOrder(data);
        console.log(res);
        if(res && res.data){
            message.success('Đặt hàng thành công');
        }else{
            notification.error({
                message:'Đã có lỗi xảy ra',
                description: res.message
            })
        }
        setLoading(false);
    }

    return(
        <>
            <Modal title="Thông tin đơn hàng" 
                open={openModalPurchase} onOk={() => {
                    form.submit();
                    setOpenModalPurchase(false);
                }} 
                onCancel={() => {
                    setOpenModalPurchase(false);
                    form.resetFields();
                }}
                okText={"Mua hàng"}
                cancelText={"Hủy"}
                confirmLoading={loading}>
                <Form onFinish={onFinish} form={form}>

                    <Form.Item labelCol={{span: 24}} label="Tên người nhận" name="name" style={{marginBottom: 5}}
                        initialValue={user?.fullName} rules={[{required: true, message:'Hãy nhập tên người nhận'}]}>
                        <Input value={user?.fullName}/>
                    </Form.Item>   

                    <Form.Item labelCol={{span: 24}} label="Số điện thoại" name="phone" style={{marginBottom: 5}}
                        initialValue={user?.phone} rules={[{required: true, message:'Hãy nhập số điện thoại'}]}>
                        <Input value={user.phone}/>
                    </Form.Item> 

                    <Form.Item labelCol={{span: 24}} label="Địa chỉ" name="address" style={{marginBottom: 5}}
                        rules={[{required: true, message:'Hãy nhập địa chỉ'}]}>
                        <TextArea rows={2}/>
                    </Form.Item>

                </Form>
                <div style={{marginTop: 15}}>
                    <div>Hình thức thanh toán</div>
                    <div>
                        <Radio checked>Thanh toán khi nhận hàng</Radio>
                    </div>
                </div>
                <Divider style={{margin: '10px 0'}}/>
                <div className='totalPrice'>
                    <span>Tổng tiền</span>
                    <span style={{fontSize: 20, color: '#1677ff'}}>
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(numbers*dataBook.price || 0)}
                    </span>
                </div>
            </Modal>
        </>
    )
}

export default ModalPurchase;