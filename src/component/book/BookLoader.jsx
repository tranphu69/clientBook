import { Row, Col, Skeleton} from 'antd';

const BookLoader = () => {
    return(
        <>
            <Row gutter={[10, 10]}>
                <Col span={12}>
                    <Skeleton.Input active={true} block={true} style={{width: '100%', height: 350}}/>
                    <div style={{display: 'flex', gap: 30, marginTop: 20, justifyContent:'center'}}>
                        <Skeleton.Image active={true}/>
                        <Skeleton.Image active={true}/>
                        <Skeleton.Image active={true}/>
                    </div>
                </Col>
                <Col span={12}>
                    <Skeleton active={true} paragraph={{rows: 3}}/>
                    <br/>
                    <Skeleton active={true} paragraph={{rows: 2}}/>
                    <div style={{display:'flex', gap: 10, marginTop: 20}}>
                        <Skeleton.Button active={true} style={{width: 100}}/>
                        <Skeleton.Button active={true}  style={{width: 100}}/>
                    </div>
                </Col>
            </Row>
        </>
    )
}

export default BookLoader;