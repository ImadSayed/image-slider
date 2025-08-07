import { useRef } from 'react';
import { useImagesContext } from '../../use-context/context';
import ImageSliderRunner from './image-slider-runner';
import './image-slider.css';

interface ImageSliderProps {
    readonly autoSlide?: boolean; // Optional: auto-slide
    readonly slideInterval?: number; // Optional: interval for auto-slide
}

export default function ImageSlider({ autoSlide = false, slideInterval = 3000 }: ImageSliderProps) {
    const images = useImagesContext();
    // parent wrapper to useRef as it wont change and doesn't need re-drawing if props or imageContext change
    const containerRef = useRef<HTMLDivElement>(null);
    // Pass parent wrapper to child component
    const childElements = containerRef.current ? ImageSliderRunner({ container: containerRef.current }) : null;

    //Handle case where images array is empty
    if (!images || images.length === 0) {
        return <div>No Images provided</div>;
    }

    return (
        <div className="image-slider container" ref={containerRef} data-image="1">
            {childElements}
        </div>
    );
}
