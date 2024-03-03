import { Modal } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import { message, Upload, Table } from 'antd';
import * as XLSX from "xlsx";
import { useState } from 'react';
import { callBulkCreateUser } from '../../../../services/api';
import templateFile from './template.xlsx?url';

const { Dragger } = Upload;

const UserImport = (props) => {
  const {openImport} = props;
  const [dataExcel, setDataExcel] = useState([]);

  const dummyRequest = ({file, onSuccess}) => {
    setTimeout(() => {
        onSuccess("ok");
    }, 1000);
}

const propsUpload = {
    name: 'file',
    multiple: true,
    maxCount: 1,
    accept: ".xlsx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    customRequest: dummyRequest,
    onChange(info) {
      const { status } = info.file;
      if (status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (status === 'done') {
        if(info.fileList && info.fileList.length > 0){
          const file = info.fileList[0].originFileObj;
          const reader = new FileReader();
          reader.readAsArrayBuffer(file);
          reader.onload = function (e){
            const data = new Uint8Array(reader.result);
            const workbook = XLSX.read(data, {type: 'array'});
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            const json = XLSX.utils.sheet_to_json(sheet, {
              header:['fullName', 'email', 'phone'],
              range: 1
            })
            if(json && json.length > 0) {
              setDataExcel(json);
            } 
          }
        }
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e) {
      console.log('Dropped files', e.dataTransfer.files);
    },
};

const handleSubmit = async() => {
  const data = dataExcel.map((item) => {
    item.password = '123456';
    return item
  })
  const res = await callBulkCreateUser(data);
  if( res && res.data && res.data.countSuccess){
    message.success(" Upload data success");
    setDataExcel([]);
    props.setOpenImport(false);
    props.fetchUser();
  }else{
    message.error(" Upload data fail ");
    setDataExcel([]);
    props.setOpenImport(false);
  }
}

  return (
    <>
      <Modal title="Import data user" 
      open={openImport} 
      onOk={() => handleSubmit()} 
      onCancel={() => {
        props.setOpenImport(false);
        setDataExcel([])}}
      okText={"Import data"}
      okButtonProps={{
        disabled: dataExcel.length < 1
      }}
      maskClosable={false}>
       <Dragger {...propsUpload}>
            <p className="ant-upload-drag-icon">
             <InboxOutlined />
            </p>
            <p className="ant-upload-text">Click or drag file to this area to upload</p>
            <p className="ant-upload-hint">
            Support for a single or bulk upload. Only accept .csv, .xls, .xlsx. or
            &nbsp; <a onClick={e => e.stopPropagation()} href={templateFile} download> Download Sample File </a>
            </p>
        </Dragger>
        <div>
            <Table
                title={() => <span>Upload data:</span>}
                dataSource={dataExcel}
                columns={[
                    {dataIndex: "fullName", title:'FullName'},
                    {dataIndex: "email", title: "Email"},
                    {dataIndex: "phone", title: "Phone"}
                ]}
                pagination = {
                  {
                    hideOnSinglePage: true
                  }
                }
            />
        </div>
      </Modal>
    </>
  );
};

export default UserImport;