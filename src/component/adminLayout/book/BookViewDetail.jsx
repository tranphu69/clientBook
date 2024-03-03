import { Drawer, Descriptions, Divider, Modal, Upload } from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const BookViewDetail = (props) => {
    const {openViewDetail, dataViewDetail} = props;
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState("");
    const [previewTitle, setPreviewTitle] = useState("");
    const [fileList, setFileList] = useState([]);

    useEffect(() => {
        if(dataViewDetail){
            let imgThumbnail = {}, imgSlider = [];
            if(dataViewDetail.thumbnail){
                imgThumbnail = {
                    uid: uuidv4(),
                    name: dataViewDetail.thumbnail,
                    status: "done",
                    url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${dataViewDetail.thumbnail}`,
                }
            }
            if(dataViewDetail.slider && dataViewDetail.slider.length > 0){
                dataViewDetail.slider.map(item => {
                    imgSlider.push({
                        uid: uuidv4(),
                        name: item,
                        status: 'done',
                        url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${item}`,
                    })
                })
            }
            setFileList([imgThumbnail,...imgSlider])
        }
    }, [dataViewDetail])
    
  const handleCancel = () => setPreviewOpen(false);

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || (file.preview));
    setPreviewOpen(true);
    setPreviewTitle(
      file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
    );
  };

    const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);
    const formatCurrency = (price) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    }
    return(
        <>
            <Drawer width={'45vw'} title="" onClose={() => {props.setOpenViewDetail(false); props.setDataViewDetail(null);}} open={openViewDetail}>
                <Descriptions title="Book Information" bordered column={1}>
                    <Descriptions.Item label="Id">{dataViewDetail?._id}</Descriptions.Item>
                    <Descriptions.Item label="BookName">{dataViewDetail?.mainText}</Descriptions.Item>
                    <Descriptions.Item label="Author">{dataViewDetail?.author}</Descriptions.Item>
                    <Descriptions.Item label="Price">{formatCurrency(dataViewDetail?.price)}</Descriptions.Item>
                    <Descriptions.Item label="Category">{dataViewDetail?.category}</Descriptions.Item>
                    <Descriptions.Item label="Quantity">{dataViewDetail?.quantity}</Descriptions.Item>
                    <Descriptions.Item label="Sold">{dataViewDetail?.sold}</Descriptions.Item>
                    <Descriptions.Item label="CreatedAt">
                       {moment(dataViewDetail?.createdAt).format("DD-MM-YYYY HH:mm:ss")}
                    </Descriptions.Item>
                    <Descriptions.Item label="UpdatedAt">
                       {moment(dataViewDetail?.updatedAt).format("DD-MM-YYYY HH:mm:ss")}
                    </Descriptions.Item>
                </Descriptions>
                <Divider orientation='left'> Book Image </Divider>
                <Upload
                    action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                    listType="picture-card"
                    fileList={fileList}
                    onPreview={handlePreview}
                    onChange={handleChange}
                    showUploadList={
                        {showRemoveIcon: false}
                    }
                ></Upload>
                <Modal
                    open={previewOpen}
                    title={previewTitle}
                    footer={null}
                    onCancel={handleCancel}
                >
                    <img alt="example" style={{ width: "100%" }} src={previewImage} />
                </Modal>
            </Drawer>
        </>
    )
}

export default BookViewDetail;