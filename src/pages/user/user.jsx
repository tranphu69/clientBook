import { Modal, Row, Tabs} from 'antd';
import UpdateInformation from '../../component/user/UpdateInformation';
import ChangePassword from '../../component/user/ChangePassword';

const User = (props) => {
    const {openAccountManager, setOpenAccountManager} = props;
    const items = [
        {
          key: '1',
          label: 'Cập nhật thông tin',
          children: <UpdateInformation setOpenAccountManager={setOpenAccountManager}/>,
        },
        {
          key: '2',
          label: 'Đổi mật khẩu',
          children: <ChangePassword setOpenAccountManager={setOpenAccountManager}/>,
        }
    ];

    return(
        <>
            <Modal title="Quản lý tài khoản" open={openAccountManager} footer={null} onOk={() => setOpenAccountManager(false)} 
                onCancel={() => setOpenAccountManager(false)} width={700}>
                <Row>
                    <Tabs defaultActiveKey="1" items={items} style={{width:'100%'}}/>
                </Row>
            </Modal>
        </>
    )
}

export default User;