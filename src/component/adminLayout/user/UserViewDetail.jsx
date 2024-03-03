import { Drawer, Badge, Descriptions } from 'antd';
import moment from 'moment';

const UserViewDetail = (props) => {
    const {openViewDetail, dataViewDetail} = props;
    return(
        <>
            <Drawer width={'35vw'} title="" onClose={() => {props.setOpenViewDetail(false); props.setDataViewDetail(null);}} open={openViewDetail}>
                <Descriptions title="User Information" bordered column={1}>
                    <Descriptions.Item label="Id">{dataViewDetail?._id}</Descriptions.Item>
                    <Descriptions.Item label="FullName">{dataViewDetail?.fullName}</Descriptions.Item>
                    <Descriptions.Item label="Email">{dataViewDetail?.email}</Descriptions.Item>
                    <Descriptions.Item label="Role">{dataViewDetail?.role}</Descriptions.Item>
                    <Descriptions.Item label="Phone">{dataViewDetail?.phone}</Descriptions.Item>
                    <Descriptions.Item label="CreatedAt">
                       {moment(dataViewDetail?.createdAt).format("DD-MM-YYYY HH:mm:ss")}
                    </Descriptions.Item>
                    <Descriptions.Item label="UpdatedAt">
                       {moment(dataViewDetail?.updatedAt).format("DD-MM-YYYY HH:mm:ss")}
                    </Descriptions.Item>
                </Descriptions>
            </Drawer>
        </>
    )
}

export default UserViewDetail;