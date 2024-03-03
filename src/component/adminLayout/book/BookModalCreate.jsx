import { Modal, Form, Input, Col, Row, InputNumber, Select, message, Upload, notification} from 'antd';
import { useEffect, useState } from 'react';
import { callCreateBook, callListCategory, callUploadBookImg } from '../../../services/api';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';

const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
};

const beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
};

const BookModalCreate = (props) => {
    const {openModalCreate} = props;
    const [isSubmit, setIsSubmit] = useState(false);
    const [form] = Form.useForm();
    const [listCategory, setListCategory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingSlider, setLoadingSlider] = useState(false);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const [imageUrl, setImageUrl] = useState();
    const [dataSlider, setDataSlider] = useState([]);
    const [dataThumbnail, setDataThumbnail] = useState([]);

    const handleChange = (info, type) => {
        if (info.file.status === 'uploading') {
          type ? setLoadingSlider(true) : setLoading(true);
          return;
        }
        if (info.file.status === 'done') {
          // Get this url from response in real world.
          getBase64(info.file.originFileObj, (url) => {
            type ? setLoadingSlider(false) : setLoading(false);
            setImageUrl(url);
          });
        }
    };

    useEffect(() => {
        getListCategory();
    },[])

    const getListCategory = async() => {
        const res = await callListCategory();
        if( res && res.data){
            const q = res.data.map(item => {
                return {label: item, value: item}
            })
            setListCategory(q);
        }
    }

    const handleUploadFileThumbnail = async({file, onSuccess, onError}) => {
        const res = await callUploadBookImg(file);
        if(res && res.data){
            setDataThumbnail([{
                name: res.data.fileUploaded,
                uid: file.uid
            }])
            onSuccess('ok');
        }else{
            onError('had error');
        }
    }

    const handleUploadFileSlider = async({file, onSuccess, onError}) => {
        const res = await callUploadBookImg(file);
        if(res && res.data){
            setDataSlider((dataSlider) => [...dataSlider, {
                name: res.data.fileUploaded,
                uid: file.uid
            }])
            onSuccess('ok');
        }else{
            onError('had error');
        }
    }
    const handlePreview = async(file) => {
        getBase64(file.originFileObj, (url) => {
            setPreviewImage(url);
            setPreviewOpen(true);
            setPreviewTitle( file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
        })
    }

    const handleRemoveFile = (file, type) => {
        if(type === 'thumbnail'){
            setDataThumbnail([])
        }
        if(type === 'slider'){
            const newSliser = dataSlider.filter(x => x.uid !== file.uid);
            setDataSlider(newSliser);
        }
    }

    const onFinish = async(values) => { 
        if(dataThumbnail.length === 0){
            message.error("please upload image thumbnail!");
            return;
        }
        if(dataSlider.length === 0){
            message.error("please upload image slider!");
            return
        }
        const {mainText, author, price, sold, quantity, category} = values;
        const thumbnail = dataThumbnail[0].name;
        const slider = dataSlider.map(item => item.name);
        setIsSubmit(true);
        const res = await callCreateBook(thumbnail, slider, mainText, author, price, sold, quantity, category);
        if(res && res.data){
            message.success("Create New Book Success!");
            form.resetFields();
            setDataSlider([]);
            setDataThumbnail([]);
            props.setOpenModalCreate(false); 
            await props.fetchBook();
        }else{
            notification.error({
                message:'had error',
                description: res.message
            });
        }
        setIsSubmit(false);
    }   

    return(
        <>
            <Modal title="Add New Book" open={openModalCreate} 
            onOk={() => { form.submit() }} 
            onCancel={() => {
                props.setOpenModalCreate(false);
                form.resetFields();
            }}
            okText={'Create'}
            confirmLoading={isSubmit}
            width={'800px'}
            >
                <Form
                    form={form}
                    name="basic"
                    labelCol={{ span: 24 }}
                    onFinish={onFinish}
                    autoComplete="off"
                >
                    <Row gutter={15}>
                        <Col span={12}>
                            <Form.Item
                                labelCol={{ span: 24 }}
                                label="BookName"
                                name="mainText"
                                rules={[{ required: true, message: 'Please input your book name!' }]}
                                >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                labelCol={{ span: 24 }}
                                label="Author"
                                name="author"
                                rules={[{ required: true, message: 'Please input your author!' }]}
                                >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item
                                labelCol={{ span: 24 }}
                                label="Price"
                                name="price"
                                rules={[{ required: true, message: 'Please input your Price!' }]}
                                >
                                <InputNumber min={10000} max={500000} addonAfter={'VND'} defaultValue={10000} step={1000} formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}/>
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item
                                labelCol={{ span: 24 }}
                                label="Category"
                                name="category"
                                rules={[{ required: true, message: 'Please input your category!' }]}
                                >
                                <Select
                                    defaultValue={null}
                                    showSearch
                                    allowClear
                                    options={listCategory}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item
                                labelCol={{ span: 24 }}
                                label="Quantity"
                                name="quantity"
                                rules={[{ required: true, message: 'Please input your quantity!' }]}
                                >
                                <InputNumber min={1} max={10000} defaultValue={0} style={{ width: '100%' }}/>
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item
                                labelCol={{ span: 24 }}
                                label="Sold"
                                name="sold"
                                rules={[{ required: true, message: 'Please input your sold!' }]}
                                >
                                <InputNumber min={1} max={10000} defaultValue={0} style={{ width: '100%' }}/>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                labelCol={{ span: 24 }}
                                label="Image Thumbnail"
                                name="thumbnail"
                                >
                                <Upload
                                    name="thumbnail"
                                    listType="picture-card"
                                    className="avatar-uploader"
                                    maxCount={1}
                                    multiple={false}
                                    customRequest={handleUploadFileThumbnail}
                                    beforeUpload={beforeUpload}
                                    onChange={handleChange}
                                    onPreview={handlePreview}
                                    onRemove={(file) => handleRemoveFile(file, 'thumbnail')}
                                >
                                    <div>
                                        {loading ? <LoadingOutlined /> : <PlusOutlined />}
                                        <div style={{ marginTop: 8 }}>Upload</div>
                                    </div>
                                </Upload>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                labelCol={{ span: 24 }}
                                label="Image Slider"
                                name="slider"
                                >
                                <Upload
                                    name="slider"
                                    listType="picture-card"
                                    className="avatar-uploader"
                                    customRequest={handleUploadFileSlider}
                                    beforeUpload={beforeUpload}
                                    onChange={(info) => handleChange(info, 'slider')}
                                    onPreview={handlePreview}
                                    onRemove={(file) => handleRemoveFile(file, 'slider')}
                                >
                                    <div>
                                        {loadingSlider ? <LoadingOutlined /> : <PlusOutlined />}
                                        <div style={{ marginTop: 8 }}>Upload</div>
                                    </div>
                                </Upload>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>
            <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={() => setPreviewOpen(false)}>
                <img alt="example" style={{ width: '100%' }} src={previewImage} />
            </Modal>
        </>
    )
}

export default BookModalCreate;