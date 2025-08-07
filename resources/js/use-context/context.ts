import { createContext, useContext } from 'react';
import { Image } from '../types/index';

export const ImagesContext = createContext<Image[] | undefined>(undefined);

export function useImagesContext() {
    const images = useContext(ImagesContext);

    // Handle the case that images, passed into createContext, is undefined
    if (images === undefined) {
        throw new Error('useImagesContext must be used with an ImagesContext');
    }

    return images;
}
