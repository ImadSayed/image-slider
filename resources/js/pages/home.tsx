import { createContext } from 'react';
import { BrowserRouter } from 'react-router-dom';

export interface Image {
    id: number;
    path: string;
    isActive: boolean;
}

export const ImagesContext = createContext<Image[] | undefined>(undefined);

export interface HomeProps {
    imageUrls: string[];
}

export default function home({ imageUrls }: HomeProps) {
    console.log(imageUrls);

    // Transform string[] to Images[]
    const images: Image[] = imageUrls.map((path, index) => ({
        id: index + 1, // Assign an ID
        path, // The URL passed in from the controller
        isActive: false, // Default value
    }));

    console.log(images);

    return (
        <ImagesContext.Provider value={images}>
            <BrowserRouter>
                {/* <Route path="/" element={<DefaultImageSlider />} /> */}
                {/* <Route path="/animation" element={<AnimatedImageSlider />} /> */}
            </BrowserRouter>
        </ImagesContext.Provider>
    );
}
