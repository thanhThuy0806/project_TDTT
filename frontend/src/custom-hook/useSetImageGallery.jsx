import { useEffect, useState } from "react"
import imagePaths from '../../api/image-gallary.json';
import {  useContent } from "../context/contentContext";


// this hook will rerender the image gallery every time the current content is changed
// return the list of the current gallery display
export const useSetImageGallery = () => {
    const context = useContent();
    if (!context) {
        throw new Error("useSetImagesGallery must be used within ContentContextProvider");
    }

    const {content} = context;
    const [images, setImages] = useState(imagePaths[content]);
    // caching
    useEffect(() => {
        const curPaths = imagePaths[content] || [];
        curPaths.forEach(image => {
            const picture = new Image();
            picture.src = image;
        })

        setImages(imagePaths[content]);
    }, [content]);

    return {context, images};
}