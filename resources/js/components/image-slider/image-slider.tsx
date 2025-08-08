import { useCallback, useEffect, useRef, useState } from 'react';
import { useImagesContext } from '../../use-context/context';
import ImageSliderRunner from './image-slider-runner';
import './image-slider.css';

interface ImageSliderProps {
    readonly autoSlide?: boolean; // Optional: auto-slide
    readonly slideInterval?: number; // Optional: interval for auto-slide
}

export default function ImageSlider({ autoSlide = false, slideInterval = 3000 }: ImageSliderProps) {
    const images = useImagesContext();
    const [currentIndex, setCurrentIndex] = useState(1);
    // parent wrapper to useRef as it wont change and doesn't need re-drawing if props or imageContext change
    const containerRef = useRef<HTMLDivElement>(null);
    const [containerWidth, setContainerWidth] = useState(0);

    useEffect(() => {
        if (containerRef.current) {
            // Set container width once div is mounted
            setContainerWidth(containerRef.current.getBoundingClientRect().width);
        }
    }, []);

    const scrollSlider = (index: number) => {
        if (containerRef.current) {
            // ScrollLeft is the number of pixels to scroll
            const leftEdgeOfImageToScrollTo: number = index * containerWidth;
            containerRef.current.scrollLeft = leftEdgeOfImageToScrollTo;
        }
    };

    const calculateScrollPoint = useCallback(() => {
        // Scrollbar is the length of the container
        // Once we have the number of pixels to scroll, we can calculate the scroll point
        return containerWidth / (currentIndex * containerWidth);
    }, [currentIndex, containerWidth]);

    useEffect(() => {
        const scrollPoint = calculateScrollPoint();
        scrollSlider(scrollPoint);
    });

    //Handle case where images array is empty
    if (!images || images.length === 0) {
        return <div>No Images provided</div>;
    }

    return (
        <div className="image-slider container" ref={containerRef} data-image="1">
            {containerWidth !== null && <ImageSliderRunner containerWidth={containerWidth} />}
        </div>
    );
}
