import {Row, Col, Button, Divider, Form, Input, Radio, message, notification} from 'antd';
import { MdDelete } from "react-icons/md";
import './order.scss';
import { useSelector,useDispatch } from 'react-redux';
import { useState } from 'react';
import { callCreateOrder } from '../../services/api';
import { doPlaceOrderAction } from '../../redux/order/orderSlice';

const { TextArea } = Input;

const Payment = (props) => {
    const {total} = props;
    const carts = useSelector(state => state.order.carts);
    const [form] = Form.useForm();
    const user = useSelector(state => state.account.user);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();

    const onFinish = async(values) => {
        setLoading(true);
        const detailOrder = carts.map(item => {
            return{
                bookName: item.detail.mainText,
                quantity: +item.quantity,
                _id: item._id
            }
        })
        const data = {
            name: values.name,
            phone: values.phone,
            address: values.address,
            totalPrice: total,
            detail: detailOrder
        }
        const res = await callCreateOrder(data);
        if(res && res.data){
            message.success('Đặt hàng thành công');
            props.setCurrentStep(2);
            dispatch(doPlaceOrderAction());
        }else{
            notification.error({
                message:'Đã có lỗi xảy ra',
                description: res.message
            })
        }
        setLoading(false);
    };

    return(
        <div className='pageOrder' style={{background: '#efefef'}}>
            <Row>
                <Col span={18}>
                    {
                        carts.map((book, index) => {
                            return(
                                <div className='leftPageOrder' key={`book-${index}`}>
                                    <div style={{height: 80, width: 80}}>
                                        <img src={`${import.meta.env.VITE_BACKEND_URL}/images/book/${book.detail.thumbnail}`}/>
                                    </div>
                                    <div className='title'>{book.detail.mainText}</div>
                                    <div style={{color: '#1677ff', fontSize: 20}}>
                                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(book.detail.price)}
                                    </div>
                                    <input value={book.quantity} disabled/>
                                    <div style={{color: '#1677ff', fontSize: 20}}>
                                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(book.quantity*book.detail.price || 0)}
                                    </div>
                                    <Button type='primary' disabled><MdDelete /></Button>   
                                </div>
                            )
                        })

                    }
                </Col>
                <Col span={6}>
                    <div className='rightPageOrder'>
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
                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(total || 0)}
                                </span>
                            </div>
                            <Divider style={{margin: '10px 0'}}/>
                            <div>
                                <Button disabled={loading} style={{width:'48%', marginRight: 10}} type='primary' onClick={() => form.submit()}>
                                    Đặt hàng &#40;{carts?.length ?? 0}&#41;
                                </Button>
                                <Button style={{width:'47%'}} type='primary' onClick={() => props.setCurrentStep(0)}>Trở lại</Button>
                            </div>
                    </div>
                </Col>
            </Row>
        </div>
    )
}

export default Payment;