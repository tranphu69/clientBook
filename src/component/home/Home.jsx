import './home.scss';
import { FilterTwoTone} from '@ant-design/icons';
import { Row, Col, Form, Checkbox, Divider, InputNumber, Button, Rate, Tabs, Pagination, Spin} from 'antd';
import { useEffect, useState } from 'react';
import { callFetchListBook, callListCategory } from '../../services/api';
import { useNavigate, useOutletContext } from 'react-router-dom';

const items = [
    {
      key: '&sort=-sold',
      label: 'Phổ biến',
      Children: <></>
    },
    {
        key: '&sort=-updatedAt',
        label: 'Hàng mới',
        Children: <></>
    },
    {
        key: '&sort=price',
        label: 'Giá thấp đến cao',
        Children: <></>
    },
    {
        key: '&sort=-price',
        label: 'Giá cao đến thấp',
        Children: <></>
    },
  ];

const Home = () => {
    const [form] = Form.useForm();
    const [listCategory, setListCategory] = useState([]);
    const [listBook, setListBook] = useState([]);
    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [total, setTotal] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [filter, setFilter] = useState("");
    const [sortQuery, setSortQuery] = useState("&sort=-sold");
    const navigate = useNavigate();
    const [search, setSearchTerm] = useOutletContext();

    useEffect(() => {
        getListCategory();
    }, [])

    const getListCategory = async() => {
        const res = await callListCategory();
        if(res && res.data){
            const d = res.data.map(item => {
                return {label: item, value: item}
            })
            setListCategory(d);
        }
    }

    useEffect(() => {
        fetchBook();
    }, [current, pageSize, filter, sortQuery, search]);

    useEffect(() => {
        setCurrent(1);
    },[sortQuery]);

    const fetchBook = async() => {
        let query = `current=${current}&pageSize=${pageSize}`;
        setIsLoading(true);
        if(sortQuery){
            query += `${sortQuery}`
        }
        if(filter){
            query += `${filter}`
            setCurrent(1);
        }
        if(search){
            query += `&mainText=/${search}/i`
        }
        console.log(query);
        const res = await callFetchListBook(query);
        if( res && res.data){
            setListBook(res.data.result);
            setTotal(res.data.meta.total);
        }
        setIsLoading(false)
    }

    const formatCurrency = (price) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    }

    const handleOnChangePage = (pagination) => {
        console.log(pagination);
        if(pagination && pagination.current !== current){
            setCurrent(pagination.current);
        }
        if(pagination && pagination.pageSize !== pageSize){
            setPageSize(pagination.pageSize);
            setCurrent(1);
        }
    }


    const onFinish = (values) => {
        if(values?.range?.from >= 0 && values?.range?.to >= 0){
            let f = `&price>=${values?.range?.from}&price<=${values?.range?.to}`;
            if(values?.category?.length){
                const cate = values?.category?.join(',');
                f += `&category=${cate}`
            }
            console.log(f);
            setFilter(f);
        }
    }

    const handleChangeFilter = (changedValues, values) => {
        if(changedValues.category){
            const cate =  values.category;
            if( cate && cate.length > 0){
                const f = cate.join(',');
                setFilter(`&category=${f}`);
            }else{
                setFilter('');
            }
        }
    }

    const nonAccentVietnamese = (str) => {
        str = str.replace(/A|Á|À|Ã|Ạ|Â|Ấ|Ầ|Ẫ|Ậ|Ă|Ắ|Ằ|Ẵ|Ặ/g, "A");
        str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
        str = str.replace(/E|É|È|Ẽ|Ẹ|Ê|Ế|Ề|Ễ|Ệ/, "E");
        str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
        str = str.replace(/I|Í|Ì|Ĩ|Ị/g, "I");
        str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
        str = str.replace(/O|Ó|Ò|Õ|Ọ|Ô|Ố|Ồ|Ỗ|Ộ|Ơ|Ớ|Ờ|Ỡ|Ợ/g, "O");
        str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
        str = str.replace(/U|Ú|Ù|Ũ|Ụ|Ư|Ứ|Ừ|Ữ|Ự/g, "U");
        str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
        str = str.replace(/Y|Ý|Ỳ|Ỹ|Ỵ/g, "Y");
        str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
        str = str.replace(/Đ/g, "D");
        str = str.replace(/đ/g, "d");
        // Some system encode vietnamese combining accent as individual utf-8 characters
        str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // Huyền sắc hỏi ngã nặng
        str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // Â, Ê, Ă, Ơ, Ư
        return str;
    }

    const convertSlug = (str) => {
        str = nonAccentVietnamese(str);
        str = str.replace(/^\s+|\s+$/g, ''); // trim
        str = str.toLowerCase();

        // remove accents, swap ñ for n, etc
        const from = "ÁÄÂÀÃÅČÇĆĎÉĚËÈÊẼĔȆĞÍÌÎÏİŇÑÓÖÒÔÕØŘŔŠŞŤÚŮÜÙÛÝŸŽáäâàãåčçćďéěëèêẽĕȇğíìîïıňñóöòôõøðřŕšşťúůüùûýÿžþÞĐđßÆa·/_,:;";
        const to = "AAAAAACCCDEEEEEEEEGIIIIINNOOOOOORRSSTUUUUUYYZaaaaaacccdeeeeeeeegiiiiinnooooooorrsstuuuuuyyzbBDdBAa------";
        for (let i = 0, l = from.length; i < l; i++) {
            str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
        }

        str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
            .replace(/\s+/g, '-') // collapse whitespace and replace by -
            .replace(/-+/g, '-'); // collapse dashes

        return str;
    }

    const handleRedirectBook = (book) => {
        const slug = convertSlug(book.mainText);
        navigate(`/book/${slug}?id=${book._id}`)
    }


    return(
        <div className='homepage-container' style={{maxWidth: 1440, margin:'0 auto'}}>
            <Row>
                <Col md={4} sm={0} xs={0} style={{marginTop: 15}}>
                    <div style={{display:'flex', alignItems:'center'}}>
                        <span onClick={() => {
                            form.resetFields();
                            setFilter('');
                            setSearchTerm('');
                        }} style={{fontWeight: '500', fontSize: '15px', cursor:'pointer'}}><FilterTwoTone/> Bộ lọc tìm kiếm </span>
                    </div>
                    <Divider/>
                    <Form
                        onFinish={onFinish}
                        form={form}
                        onValuesChange={(changedValues, values) => handleChangeFilter(changedValues, values)}>
                        <Form.Item
                            name="category"
                            label="Danh mục sản phẩm"
                            labelCol={{span: 24}}>
                            <Checkbox.Group>
                                <Row>
                                    {listCategory?.map((item, index) => {
                                        return(
                                            <Col span={12} key={`index-${index}`} style={{padding: '7px 2px'}}>
                                                <Checkbox value={item.value}>
                                                    {item.label}
                                                </Checkbox>
                                            </Col>
                                        )
                                    })}
                                </Row>
                            </Checkbox.Group>
                        </Form.Item>
                        <Divider />
                        <Form.Item
                            label= "Khoảng giá"
                            labelCol={{ span: 24 }}>
                            <div style={{display:'flex', justifyContent:'space-between'}}>
                                <Form.Item name={["range", 'from']}>
                                    <InputNumber
                                        name='from'
                                        min={0}
                                        placeholder="đ TỪ"
                                        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    />
                                </Form.Item>
                                <span>-</span>
                                <Form.Item name={["range", 'to']}>
                                    <InputNumber
                                        name='to'
                                        min={0}
                                        placeholder="đ ĐẾnS"
                                        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    />
                                </Form.Item>
                            </div>
                            <div>
                                <Button type='primary' style={{width:'100%'}} onClick={() => form.submit()}> Áp dụng </Button>
                            </div>
                        </Form.Item>
                    </Form>
                </Col>
                <Col md={20} xs={24}>
                    <Spin spinning={isLoading} tip="Loading...">
                        <Row style={{marginLeft:10}}>
                            <Tabs defaultActiveKey='&sort=-sold' items={items} onChange={(value) => setSortQuery(value)} style={{overflowX: "auto"}}/>
                        </Row>
                        <Row className='customize-row' style={{marginLeft:10}}>
                            {listBook?.map((item, index)=> {
                                return(
                                    <div className='column' key={`book-${index}`} onClick={() => handleRedirectBook(item)}>
                                            <div className='wrapper'>
                                                <div className='thumbnail'>
                                                    <img src={`http://localhost:8080/images/book/${item.thumbnail}`} alt="thumbnail book"/>
                                                </div>
                                                <div className='text'>
                                                    {item.mainText}
                                                </div>
                                                <div className='price'>
                                                    {formatCurrency(item.price)}
                                                </div>
                                                <div className='rating'>
                                                    <Rate value={Math.floor(Math.random() * 5) + 1} disabled style={{ color: '#ffce3d', fontSize: 10 }} />
                                                    <span>Đã bán {item.sold}</span>
                                                </div>
                                            </div>
                                    </div>
                                )
                            })}
                        </Row>
                        <Row style={{display:'flex', justifyContent:'center', marginTop: 20}}>
                            <Pagination
                                current={current}
                                total={total}
                                pageSize={pageSize}
                                responsive
                                onChange={(p, s) => handleOnChangePage({current: p, pageSize: s})}
                            />
                        </Row>
                    </Spin>
                </Col>
            </Row>
        </div>
    )
}

export default Home;