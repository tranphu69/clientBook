import { Table } from 'antd';
import { useEffect, useState } from 'react';
import { callHistoryOrder } from '../../services/api';
import moment from 'moment';

const History = (props) => {
    const [dataHistory, setDataHistory] = useState([])

    const columns = [
        {
            title:'STT',
            dataIndex:'_id',
            render:(text, record, index) =>{
                return(
                    <div> {index + 1} </div>
                )
            },
            width:'10px'
        },
        {
            title: 'Thời gian',
            dataIndex: 'updatedAt',
            render: (text, record, index) => {
                return(
                    <p>{moment(record.updatedAt).format("DD-MM-YYYY HH:mm:ss")}</p>
                )
            },
            width:'160px'
        },
        {
            title:'Tổng tiền',
            dataIndex:'totalPrice',
            render: (record) => {
                return(
                    <div>
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(record || 0)}
                    </div>
                )
            },
            width:'150px'
        },
        {
            title:'Trạng thái',
            render: (text, record, index) => {
                return(
                    <div>Thành công</div>
                )
            },
            width:'120px'
        },
        {
            title:'Chi tiết',
            render:(record) => {
                console.log(record);
                return(
                    <div>
                        <div style={{display:'flex', gap: 10}}>
                            <div> Chi tiết đơn hàng: </div>
                            <div style={{display:'flex',gap: 20 ,marginLeft: 30}}>
                                <div>Name: {record.name}</div>
                                <div>Phone: {record.phone}</div>
                            </div>
                        </div>
                        {
                            record.detail.map((item, index) => {
                                return(
                                    <div key={`order-${index}`} style={{display:'flex', gap: 20, marginLeft: 30}}>
                                        <div>Sản phẩm {index + 1}:</div>
                                        <div>Tên sách: {item.bookName}</div>
                                        <div>Số lượng: {item.quantity}</div>
                                    </div>
                                )
                            })
                        }
                    </div>
                )
            }
        }
    ]

    useEffect(() => {
        listOrder();
    }, [])

    const listOrder = async() => {
        const res = await callHistoryOrder();
        setDataHistory(res.data);
    }

    return(
        <div>
            <div style={{margin: 30, fontSize: 20}}>Lịch sử đặt hàng</div>
            <Table columns={columns} dataSource={dataHistory} pagination={false}/>
        </div>
    )
}

export default History;