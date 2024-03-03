import { useState } from "react";
import ViewOrder from "../../component/order/ViewOrder";
import { Steps, Result, Button} from 'antd';
import Payment from "../../component/order/Payment";
import { useNavigate } from 'react-router-dom';
import ViewDetail from "../../component/book/ViewDetail";

const order = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [total, setTotal] = useState(0);
    const navigate = useNavigate();
    
    return(
        <div style={{background: '#efefef', padding: '20px 0'}}>
            <div className="order-steps">
                <Steps
                    current={currentStep}
                    status={'finish'}
                    items={[
                        {
                            title: 'Đơn hàng',
                        },
                        {
                            title: 'Đặt hàng',
                        },
                        {
                            title: 'Đặt thành công',
                        },
                    ]}
                />
            </div>
            {currentStep === 0 &&
                <ViewOrder setCurrentStep={setCurrentStep} total={total} setTotal={setTotal}/>
            }
            {currentStep === 1 &&
                <Payment setCurrentStep={setCurrentStep} total={total}/>
            }
            {currentStep === 2 &&
                <Result
                style={{minHeight: 400}}
                status="success"
                title="Đơn hàng đã được đặt thành công !!!"
                extra={[
                  <Button type="primary" onClick={() => navigate('/history')}> Xem lịch sử </Button>
                ]}
              />
            }
        </div>
    )
}
export default order;