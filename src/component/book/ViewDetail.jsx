import { Row, Col, Rate, Divider, Button, message} from 'antd';
import './book.scss';
import ImageGallery from 'react-image-gallery';
import { useRef, useState } from 'react';
import ModalGallery from './ModalGallery';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { BsCartPlus } from 'react-icons/bs';
import BookLoader from './BookLoader';
import { useDispatch, useSelector} from 'react-redux';
import { doAddBookAction, doAuthentication } from '../../redux/order/orderSlice';
import { useNavigate } from 'react-router-dom';
import ModalPurchase from './ModalPurchase';

const ViewDetail = (props) => {
    const {dataBook, isLoading} = props;
    const [isOpenModalGallery, setIsOpenModalGallery] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [numbers, setNumbers] = useState(1);
    const refGallery = useRef(null);
    const dispatch = useDispatch();
    const isAuthenticated = useSelector(state => state.account.isAuthenticated);
    const navigate = useNavigate();
    const [openModalPurchase, setOpenModalPurchase] = useState(false);

    const images = [];

    const handleOnClickImage = () => {
        setIsOpenModalGallery(true);
        setCurrentIndex(refGallery?.current?.getCurrentIndex() ?? 0);
    }

    const handleChangeButton = (type) => {
        if(type === 'Minus'){
            if(numbers <= 1) return;
            setNumbers(numbers - 1);
        }
        if(type === 'Plus'){
            if(numbers >= +dataBook.quantity){
                setNumbers(+dataBook.quantity);
            }else{
                setNumbers(numbers + 1);
            }
        }
    }

    const handleChangeInput = (value) => {
        if(!isNaN(value)){
            if(+value < 0){
                setNumbers(1);
            }else if(+value > +dataBook.quantity){
                setNumbers(+dataBook.quantity)
            }else{
                setNumbers(+value);
            }
        }
    }

    const handleAddToCar = (quantity, book) => {
        dispatch(doAddBookAction({quantity, detail: book, _id: book._id}));
    }

    const checkAccount = () => {
        if(isAuthenticated === true){
            dispatch(doAuthentication(true))
        }else{
            dispatch(doAuthentication(false))
            message.error("Yêu cầu đăng nhập tài khoản");
            navigate("/login");
        }
    }

    return(
        <div className='viewDetail' style={{maxWidth: 1440, padding:'10px 40px'}}>
            <div>
                {isLoading === true ? 
                    <BookLoader/> 
                    :    
                    <Row>    
                        <Col span={14} style={{paddingRight: 20}}>
                            <div style={{maxHeight: 400}}>
                                <ImageGallery
                                    ref={refGallery}
                                    items={dataBook?.items ?? images}
                                    showPlayButton={false}
                                    showFullscreenButton={false}
                                    renderLeftNav={() => <></>}
                                    renderRightNav={() => <></>}
                                    slideOnThumbnailOver={true}
                                    onClick = {() => handleOnClickImage()}/>
                            </div>
                        </Col>
                        <Col span={10}>
                            <div style={{marginTop: 35, marginLeft: 35}}>
                                <div className='author'>Tác giả: <a href='#'>{dataBook.author}</a> </div>
                                <div className='title'>{dataBook.mainText}</div>
                                <div className='rating'>
                                    <Rate value={4} disabled style={{ color: '#ffce3d', fontSize: 12 }} />
                                    <span className='sold'>
                                        <Divider type="vertical" /> Đã bán {dataBook.sold}
                                    </span>
                                </div>
                                <div className='price'>
                                    <span className='currency'>
                                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(dataBook.price)}
                                    </span>
                                </div>
                                <div className='delivery'>
                                    <div>
                                        <span className='left'>Vận chuyển:</span>
                                        <span className='right'>Miễn phí vận chuyển</span>
                                    </div>
                                </div>
                                <div className='quantity' style={{display: 'flex'}}>
                                    <span className='left'>Số lượng: </span>
                                    <span className='right'>
                                        <button onClick={() => handleChangeButton('Minus')}><MinusOutlined /></button>
                                        <input onChange={(e) => handleChangeInput(e.target.value)} value={numbers}/>
                                        <button onClick={() => handleChangeButton('Plus')}><PlusOutlined /></button>
                                    </span>
                                    <span style={{ marginLeft: 20, fontWeight: '450'}}>Sản phẩm có sẵn {dataBook.quantity}</span>
                                </div>
                                <div className='buy' style={{display: 'flex', gap:'10px'}}>
                                    <Button className='cart' type="primary" onClick={() => handleAddToCar(numbers, dataBook)}>
                                        <BsCartPlus className='icon-cart' />
                                        <span onClick={() => checkAccount()}>Thêm vào giỏ hàng</span>
                                    </Button>
                                    <Button className='now' type="primary" onClick={() => checkAccount()}>
                                        <span onClick={() => {
                                            setOpenModalPurchase(true);
                                        }}>Mua ngay</span>
                                    </Button>
                                </div>
                            </div>
                        </Col>
                    </Row>
                }
            </div>
            <ModalGallery
                isOpen={isOpenModalGallery}
                setIsOpen={setIsOpenModalGallery}
                currentIndex={currentIndex}
                items={dataBook?.items ?? images}
            />
            <ModalPurchase openModalPurchase={openModalPurchase} 
            setOpenModalPurchase={setOpenModalPurchase} dataBook={dataBook} 
            numbers={numbers}/>
        </div>
    )
}

export default ViewDetail;