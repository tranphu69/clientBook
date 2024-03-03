import { useLocation } from 'react-router-dom';
import ViewDetail from '../../component/book/ViewDetail';
import { useEffect, useState } from 'react';
import { callBookId } from '../../services/api';

const Book = () => {
    let location = useLocation();
    const [isLoading, setIsLoading] = useState(false);
    let params = new URLSearchParams(location.search);
    const id = params?.get("id");
    const [dataBook, setDataBook] = useState([]);

    useEffect(() => {
        getBookId(id);
    }, [id]);

    const getBookId = async(id) => {
        setIsLoading(true)
        const res = await callBookId(id);
        if(res && res.data){
            let raw = res.data
            raw.items = getImage(raw);
            setDataBook(raw);
        }
        setIsLoading(false);
    }

    const getImage = (raw) => {
        const images = [];
        if(raw.thumbnail){
            images.push(
                {
                    original: `${import.meta.env.VITE_BACKEND_URL}/images/book/${raw.thumbnail}`,
                    thumbnail: `${import.meta.env.VITE_BACKEND_URL}/images/book/${raw.thumbnail}`,
                    originalClass: "original-image",
                    thumbnailClass: "thumbnail-image"
                }
            )
        }
        if(raw.slider){
            raw.slider?.map(item => {
                images.push(
                    {
                        original: `${import.meta.env.VITE_BACKEND_URL}/images/book/${item}`,
                        thumbnail: `${import.meta.env.VITE_BACKEND_URL}/images/book/${item}`,
                        originalClass: "original-image",
                        thumbnailClass: "thumbnail-image"
                    }
                )
            }) 
        }
        return images;
    }

    return(
        <>
            <ViewDetail dataBook={dataBook} isLoading={isLoading}/>
        </>
    )
}

export default Book;