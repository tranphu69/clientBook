import { Drawer, Descriptions } from 'antd';
import moment from 'moment';

const OrderViewDetail = (props) => {
    const {dataViewDetail, openViewDetail, setOpenViewDetail} = props;
    return(
        <>
            <Drawer width={'35vw'} onClose={() => setOpenViewDetail(false)} open={openViewDetail}>
                <Descriptions title="Order information" bordered column={1}>
                    <Descriptions.Item label="Id">{dataViewDetail._id}</Descriptions.Item>
                    <Descriptions.Item label="Price">
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(dataViewDetail.totalPrice || 0)}
                    </Descriptions.Item>
                    <Descriptions.Item label="Name">{dataViewDetail.name}</Descriptions.Item>
                    <Descriptions.Item label="Address">{dataViewDetail.address}</Descriptions.Item>
                    <Descriptions.Item label="Phone">{dataViewDetail.phone}</Descriptions.Item>
                    <Descriptions.Item label="UpdatedAt">
                        {moment(dataViewDetail.updatedAt).format("DD-MM-YYYY HH:mm:ss")}
                    </Descriptions.Item>
                </Descriptions>
            </Drawer>
        </>
    )
}

export default OrderViewDetail;