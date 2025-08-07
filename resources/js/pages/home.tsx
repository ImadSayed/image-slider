import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Image } from '../types/index';
import { ImagesContext } from '../use-context/context';
import Homepage from './homepage';

// Expect an array of image URLs being passed in via props
export interface HomeProps {
    imageUrls: string[];
}

export default function home({ imageUrls }: HomeProps) {
    console.log('props', imageUrls);

    // Transform string[] to Images[]
    const images: Image[] = imageUrls.map((path, index) => ({
        id: index + 1, // Assign an ID
        path, // The URL passed in from the controller
        isActive: false, // Default value
    }));

    console.log('home', images);

    return (
        <ImagesContext.Provider value={images}>
            <BrowserRouter>
                <Routes>
                    {<Route path="/" element={<Homepage />} />}
                </Routes>
            </BrowserRouter>
        </ImagesContext.Provider>
    );
}
