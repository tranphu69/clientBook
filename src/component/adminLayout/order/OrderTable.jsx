import { Table} from 'antd';
import { useEffect, useState } from 'react';
import { callListOrder } from '../../../services/api';
import moment from 'moment';
import OrderViewDetail from './OrderViewDetail';

const OrderTable = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [listOrder, setListOrder] = useState([])
    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(2);
    const [total, setTotal] = useState(0);
    const [sortQuery, setSortQuery] = useState("");
    const [openViewDetail, setOpenViewDetail] = useState(false);
    const [dataViewDetail, setDataViewDetail] = useState([]);

    useEffect(() => {
        fetchOrder();
    }, [current, pageSize, sortQuery]);

    const fetchOrder = async() => {
        let query = `current=${current}&pageSize=${pageSize}`
        setIsLoading(true)
        if(sortQuery){
            query += `${sortQuery}`
        }
        const res = await callListOrder(query);
        if(res && res.data){
            setListOrder(res.data.result);
            setTotal(res.data.meta.total);
        }
        setIsLoading(false);
    }

    const columns=[
        {
            title: 'Id',
            dataIndex: '_id',
            render:(text, record, index)=>{
              return(
                    <a href='#' style={{color:'black'}} onClick={() => {
                        setOpenViewDetail(true);
                        setDataViewDetail(record);
                    }}>{record._id}</a>
              )
            }
        },
        {
            title:'Price',
            dataIndex:'totalPrice',
            render:(record) => {
                return(
                    <p style={{color: '#1677ff'}}>
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(record || 0)}
                    </p>
                )
            },
            sorter: true
        },
        {
            title:'Name',
            dataIndex:'name',
            sorter: true
        },
        {
            title:'Address',
            dataIndex:'address',
            sorter: true
        },
        {
            title:'Phone',
            dataIndex:'phone',
            sorter: true
        },
        {
            title:'Updated At',
            dataIndex:'updatedAt',
            render:(record) => {
                return(
                    <p>{moment(record.updatedAt).format("DD-MM-YYYY HH:mm:ss")}</p>
                )
            },
            sorter: true
        }
    ]

    const onChange = (pagination, filter, sorter, extra) => {
        if(pagination && pagination.current !== current){
          setCurrent(pagination.current);
        }
        if(pagination && pagination.pageSize !== pageSize){
          setPageSize(pagination.pageSize);
          setCurrent(1);
        }
        if(sorter && sorter.field){
            const q = sorter.order === 'ascend' ? `&sort=${sorter.field}` : `&sort=-${sorter.field}`;
            setSortQuery(q);
        }
    }

    return(
        <div>
            <h3>Table list order</h3>
            <Table className='def'
                columns={columns}
                loading={isLoading}
                dataSource={listOrder}
                onChange={onChange}
                rowKey="_id"
                pagination = {
                    {
                        showTotal: (total, range) => {return (<div> {range[0]} - {range[1]} trên {total} row</div>)},
                        current: current, 
                        pageSize: pageSize, 
                        showSizeChanger: true, 
                        pageSizeOptions: ['1', '2', '5', '10'],
                        total: total
                    }
                }
            />
            <OrderViewDetail dataViewDetail={dataViewDetail} openViewDetail={openViewDetail} setOpenViewDetail={setOpenViewDetail}/>
        </div>
    )
}

export default OrderTable;