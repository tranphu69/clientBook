import React, { useEffect, useState } from 'react';
import { Table, Row, Col, Button, Popconfirm, message } from 'antd';
import {
  ReloadOutlined, PlusOutlined, LogoutOutlined
} from '@ant-design/icons';
import * as XLSX from "xlsx";
import { MdDelete } from "react-icons/md";
import { CiEdit } from "react-icons/ci";
import { callDeleteBook, callFetchListBook } from '../../../services/api';
import moment from 'moment';
import InputSearch from './InputSearch';
import BookViewDetail from './BookViewDetail';
import BookModalCreate from './BookModalCreate';
import BookModalUpdate from './BookModalUpdate';

const BookTable = () => {
    const [listBook, setListBook] = useState([]);
    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(2);
    const [total, setTotal] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [filter, setFilter] = useState("");
    const [sortQuery, setSortQuery] = useState("");
    const [openViewDetail, setOpenViewDetail] = useState(false);
    const [dataViewDetail, setDataViewDetail] = useState()
    const [openModalCreate, setOpenModalCreate] = useState(false);
    const [openModalUpdate, setOpenModalUpdate] = useState(false);
    const [dataModalUpdate, setDataModalUpdate] = useState([]);

    useEffect(() => {
        fetchBook();
      }, [current, pageSize, filter, sortQuery]);

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

    const handleDelete = async(id) => {
      const res = await callDeleteBook(id);
      if(res && res.data){
        message.success("delete book success");
        fetchBook();
      }
      else{
        message.error("had error");
      }
    }

    const columns = [
        {
          title: 'Id',
          dataIndex: '_id',
          render:(text, record, index)=>{
            return(
                <a href='#' style={{color:'black'}} onClick={() => {
                  setDataViewDetail(record);
                  setOpenViewDetail(true);
                }}>{record._id}</a>
            )
          }
        },
        {
          title: 'BookName',
          dataIndex: 'mainText',
          sorter: true
        },
        {
          title: 'Category',
          dataIndex: 'category',
          sorter: true
        },
        {
          title: 'Author',
          dataIndex: 'author',
          sorter: true
        },
        {
            title: 'Price',
            dataIndex: 'price',
            render: (record) => {
                const price = formatCurrency(record);
                return(
                    <div>{price}</div>
                )
            },
            sorter: true
        },
        {
            title: 'Updated At',
            dataIndex: 'updatedAt',
            render: (record) => {
                return(
                    <p>{moment(record.updatedAt).format("DD-MM-YYYY HH:mm:ss")}</p>
                )
            },
            sorter: true
          },
        {
          title:'Action',
          render: (text, record, index) => {
            return(
              <div style={{display:'flex', gap:'15px'}}>
    
                <Popconfirm
                  placement='leftTop'
                  title="Delete user"
                  description="Are you sure to delete this task?"
                  onConfirm={() =>handleDelete(record._id)}
                  okText="Delete"
                  cancelText="Cancel"
                >
                  <Button type='primary' danger><MdDelete /></Button>
                </Popconfirm>
    
                <Button type='primary' onClick={() => {
                  setOpenModalUpdate(true);
                  setDataModalUpdate(record);
                }}><CiEdit /></Button>
    
              </div>
            )
          }
        }
      ];

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

      const handleExportData = () => {
        if(listBook.length > 0){
          const worksheet = XLSX.utils.json_to_sheet(listBook);
          const workbook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
          XLSX.writeFile(workbook, "ExportBook.xlsx");
        }
      }

      const renderHeader = () => {
        return(
          <> 
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', height:'30px'}}>
              <h3> Table List Book</h3>
              <span style={{display:'flex', gap:'10px'}}>
                <Button icon={<LogoutOutlined />} type='primary' onClick={() => handleExportData()}>
                  export
                </Button>
                <Button icon={<PlusOutlined />} type='primary'onClick={() => setOpenModalCreate(true)}>
                  add new
                </Button>
                <Button type='ghost' onClick={() => {
                  setFilter('');
                  setSortQuery('');
                }}> 
                  <ReloadOutlined />
                </Button>
              </span>
            </div>
          </>
        )
      }

    return(
        <>
            <Row gutter={[20, 20]}>
                <Col span={24}>
                    <InputSearch setFilter={setFilter}/>
                </Col>
                <Col span={24}>
                    <Table
                        className='def'
                        title={renderHeader}
                        columns={columns}
                        loading={isLoading}
                        dataSource={listBook}
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
                </Col>
            </Row>
            <BookViewDetail openViewDetail={openViewDetail}
            setOpenViewDetail={setOpenViewDetail} dataViewDetail={dataViewDetail}
            setDataViewDetail={setDataViewDetail}/>
            <BookModalCreate openModalCreate={openModalCreate}
            setOpenModalCreate={setOpenModalCreate} fetchBook={fetchBook}/>
            <BookModalUpdate openModalUpdate={openModalUpdate} setOpenModalUpdate={setOpenModalUpdate}
            dataModalUpdate={dataModalUpdate} setDataModalUpdate={setDataModalUpdate}
            fetchBook={fetchBook}/>
        </>
    )
}

export default BookTable;