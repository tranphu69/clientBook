import {Row, Col, Button, Divider, message, Empty} from 'antd';
import { MdDelete } from "react-icons/md";
import './order.scss';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { useDispatch} from 'react-redux';
import { doDeleteBookAction, doUpdateBookAction } from '../../redux/order/orderSlice';
import { useNavigate } from 'react-router-dom';

const ViewOrder = (props) => {
    const {total, setTotal} = props;
    const carts = useSelector(state => state.order.carts);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        totalPrice();
    },[carts])

    const totalPrice = () => {
        let p = 0;
        carts?.map(book => {
            p += book.quantity*book.detail.price;
        })
        setTotal(p);
    }

    const handleNumberBook = (quantity, book) => {
        if(!isNaN(quantity)){
            if(quantity> book.detail.quantity){
                let q = +book.detail.quantity;
                let p = book.detail.mainText;
                message.error(`Bạn đã nhập quá ${q} sản phẩm hiện có của sách ${p}`);
                dispatch(doUpdateBookAction({quantity, detai: book, _id: book._id}))
            }else if(quantity < 0){
                let p = book.detail.mainText;
                message.error(`Đề nghị nhập số lượng của sách ${p} lớn hơn 0`);
                dispatch(doUpdateBookAction({quantity, detai: book, _id: book._id}))
            }
            else{
                dispatch(doUpdateBookAction({quantity, detai: book, _id: book._id}));
            }
        }
    }

    const handleNext = () => {
        if(carts?.length > 0){
            props.setCurrentStep(1);
        }else{
            message.error('Bạn chưa có sản phẩm nào')
            navigate('/')
        }  
    }

    return(
        <div className='pageOrder' style={{background: '#efefef'}}>
            <Row>
                <Col span={18}>
                    {carts.length === 0 ?
                        <Empty style={{background:'white', margin:'20px 40px', minHeight: 250, paddingTop: 20}} description={'Không có sản phẩm trong giỏ hàng'} />
                        :
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
                                    <input value={book.quantity} onChange={(e) => handleNumberBook(e.target.value, book)} type='number'/>
                                    <div style={{color: '#1677ff', fontSize: 20}}>
                                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(book.quantity*book.detail.price || 0)}
                                    </div>
                                    <Button type='primary' onClick={() => dispatch(doDeleteBookAction({_id: book._id}))}><MdDelete /></Button>   
                                </div>
                            )
                        })

                    }
                </Col>
                <Col span={6}>
                    <div className='rightPageOrder'>
                        <div>Tạm tính</div>
                        <Divider style={{margin: '20px 0'}}/>
                        <div className='totalPrice'>
                            <span>Tổng tiền</span>
                            <span style={{fontSize: 20, color: '#1677ff'}}>
                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(total || 0)}
                            </span>
                        </div>
                        <Divider style={{margin: '20px 0'}}/>
                        <div>
                            <Button style={{width:'100%'}} type='primary' onClick={() => handleNext()}>Mua hàng &#40;{carts?.length ?? 0}&#41;</Button>
                        </div>
                    </div>
                </Col>
            </Row>
        </div>
    )
}

export default ViewOrder;