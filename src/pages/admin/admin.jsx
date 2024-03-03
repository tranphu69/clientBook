import { Row, Col, Skeleton} from 'antd';
import { callDashboard } from '../../services/api';
import { useEffect, useState } from 'react';

const AdminPage = () => {
    const [order, setOrder] = useState();
    const [user, setUser] = useState();
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        dashBoard();
    }, [])

    const dashBoard = async() => {
        setIsLoading(true);
        const res = await callDashboard();
        setOrder(res.data.countOrder);
        setUser(res.data.countUser);
        setIsLoading(false);
    }

    return(
        <>
            {isLoading === true ?
                <Row>
                    <Col span={11} style={{marginRight: 20}}>
                        <Skeleton.Input active={true} block={true} style={{width: '100%', height: 93}}/>
                    </Col>
                    <Col span={11} style={{marginLeft: 20}}>
                        <Skeleton.Input active={true} block={true} style={{width: '100%', height: 93}}/>
                    </Col>
                </Row>
                :
                <Row>
                    <Col span={11} style={{backgroundColor:'white', marginRight: 20}}>
                        <div style={{padding: '20px 40px'}}>
                            <div>Tổng người dùng</div>
                            <div style={{fontSize: 25}}>{user}</div>
                        </div>
                    </Col>
                    <Col span={11} style={{backgroundColor:'white', marginLeft: 20}}>
                        <div style={{padding: '20px 40px'}}>
                            <div>Tổng đơn hàng</div>
                            <div style={{fontSize: 25}}>{order}</div>
                        </div>
                    </Col>
                </Row>
            }
        </>
    )
}

export default AdminPage;