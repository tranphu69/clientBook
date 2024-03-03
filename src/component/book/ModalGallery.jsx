import { Col, Image, Modal, Row } from "antd";
import { useEffect, useRef, useState } from "react";
import ImageGallery from 'react-image-gallery';
import './book.scss';

const ModalGallery = (props) => {
    const { isOpen, setIsOpen, currentIndex, items, title } = props;
    const [activeIndex, setActiveIndex] = useState(0);
    const refGallery = useRef(null);

    useEffect(() => {
        if (isOpen) {
            setActiveIndex(currentIndex);
        }
    }, [isOpen, currentIndex])

    return (
        <Modal
            width={'60vw'}
            open={isOpen}
            onCancel={() => setIsOpen(false)}
            footer={null}
            closable={false}
            className="modal-gallery"
        >
            <Row gutter={[10, 10]}>
                <Col span={20}>
                    <ImageGallery
                        ref={refGallery}
                        items={items}
                        showPlayButton={false}
                        showFullscreenButton={false}
                        startIndex={currentIndex}
                        showThumbnails={false}
                        onSlide={(i) => setActiveIndex(i)}
                        slideDuration={0}
                    />
                </Col>
                <Col span={4}>
                    <div style={{textAlign:'center', marginBottom:5, fontWeight:'450'}}>{title}</div>
                    <div>
                        <Row gutter={[10, 10]}>
                            {
                                items?.map((item, i) => {
                                    return (
                                        <Col key={`image-${i}`}>
                                            <Image
                                                wrapperClassName={"img-normal"}
                                                width={100}
                                                height={100}
                                                src={item.original}
                                                preview={false}
                                                onClick={() => {
                                                    refGallery.current.slideToIndex(i);
                                                }}
                                            />
                                            <div className={activeIndex === i ? "active" : ""}></div>
                                        </Col>
                                    )
                                })
                            }
                        </Row>
                    </div>
                </Col>
            </Row>
        </Modal>
    )
}

export default ModalGallery;