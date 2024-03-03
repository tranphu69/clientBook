import React, { useEffect, useState } from 'react';
import { Table, Row, Col, Button, Popconfirm, message } from 'antd';
import InputSearch from './InputSearch';
import { callDeleteUser, callFetchListUser } from '../../../services/api';
import {
  ReloadOutlined, PlusOutlined, CloudDownloadOutlined, LogoutOutlined
} from '@ant-design/icons';
import UserViewDetail from './UserViewDetail';
import UserModalCreate from './UserModalCreate';
import UserImport from './data/UserImport';
import * as XLSX from "xlsx";
import { MdDelete } from "react-icons/md";
import { CiEdit } from "react-icons/ci";
import UserModalUpdate from './UserModalUpdate';

const UserTable = () => {
  const [listUser, setListUser] = useState([]);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(2);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState("");
  const [sortQuery, setSortQuery] = useState("");
  const [openViewDetail, setOpenViewDetail] = useState(false);
  const [dataViewDetail, setDataViewDetail] = useState()
  const [openModalCreate, setOpenModalCreate] = useState(false);
  const [openImport, setOpenImport] = useState(false);
  const [openModalUpdate, setOpenModalUpdate] = useState(false);
  const [dataUpdate, setDateUpdate] = useState([]);

  useEffect(() => {
    fetchUser();
  }, [current, pageSize, filter, sortQuery]);

  const fetchUser = async () => {
    setIsLoading(true)
    let query = `current=${current}&pageSize=${pageSize}`;
    if(filter){
      query += `${filter}`
      setCurrent(1);
    }
    if(sortQuery){
      query += `${sortQuery}`
    }
    const res = await callFetchListUser(query);
    if(res && res.data){
      setListUser(res.data.result);
      setTotal(res.data.meta.total);
    }
    setIsLoading(false)
  }

  const handleDeleteUser = async(id) => {
    const res = await callDeleteUser(id);
    if(res && res.data){
      message.success("delete user success");
      fetchUser();
    }
    else{
      message.error("had error");
    }
  }

  const columns = [
    {
      title: 'Id',
      dataIndex: '_id',
      render: (text, record, index) => {
        return(
          <a href='#' style={{color:'black'}} onClick={() => {
            setDataViewDetail(record);
            setOpenViewDetail(true);
          }}>{record._id}</a>
        )
      }
    },
    {
      title: 'FullName',
      dataIndex: 'fullName',
      sorter: true
    },
    {
      title: 'Email',
      dataIndex: 'email',
      sorter: true
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
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
              onConfirm={() => handleDeleteUser(record._id)}
              okText="Delete"
              cancelText="Cancel"
            >
              <Button type='primary' danger><MdDelete /></Button>
            </Popconfirm>

            <Button type='primary' onClick={() => {
              setOpenModalUpdate(true);
              setDateUpdate(record);
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
    if(listUser.length > 0){
      const worksheet = XLSX.utils.json_to_sheet(listUser);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
      XLSX.writeFile(workbook, "ExportUser.xlsx");
    }
  }

  const renderHeader = () => {
    return(
      <> 
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', height:'30px'}}>
          <h3> Table List User</h3>
          <span style={{display:'flex', gap:'10px'}}>
            <Button icon={<LogoutOutlined />} type='primary' onClick={() => handleExportData()}>
              export
            </Button>
            <Button icon={<CloudDownloadOutlined />} type='primary' onClick={() => setOpenImport(true)}>
              Import
            </Button>
            <Button icon={<PlusOutlined />} type='primary'onClick={() => setOpenModalCreate(true)}>
              add new
            </Button>
            <Button type='ghost' onClick={() => {
              setFilter("");
              setSortQuery("");
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
                        dataSource={listUser}
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
            <UserViewDetail openViewDetail={openViewDetail} 
            setOpenViewDetail={setOpenViewDetail} dataViewDetail={dataViewDetail}
            setDataViewDetail={setDataViewDetail}/>
            <UserModalCreate openModalCreate={openModalCreate}
            setOpenModalCreate={setOpenModalCreate}
            fetchUser={fetchUser}/>
            <UserImport openImport={openImport} setOpenImport={setOpenImport} fetchUser={fetchUser}/>
            <UserModalUpdate openModalUpdate={openModalUpdate} setOpenModalUpdate={setOpenModalUpdate} 
            fetchUser={fetchUser} dataUpdate={dataUpdate} setDateUpdate={setDateUpdate}/>
        </>
    )
}

export default UserTable;