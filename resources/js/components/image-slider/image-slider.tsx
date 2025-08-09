import { useCallback, useEffect, useRef, useState } from 'react';
import { useImagesContext } from '../../use-context/context';
import NavigationButtons from '../navigation-buttons'; // Import nav buttons
import ImageSliderRunner from './image-slider-runner'; // Import images in slider
import './image-slider.css';
interface ImageSliderProps {
    readonly autoSlide?: boolean; // Optional: auto-slide
    readonly slideInterval?: number; // Optional: interval for auto-slide
}

export default function ImageSlider({ autoSlide = false, slideInterval = 3000 }: ImageSliderProps) {
    const images = useImagesContext();
    const [currentIndex, setCurrentIndex] = useState(0);
    // parent wrapper to useRef as it wont change and doesn't need re-drawing if props or imageContext change
    const containerRef = useRef<HTMLDivElement>(null);
    const [containerWidth, setContainerWidth] = useState(0);

    useEffect(() => {
        if (containerRef.current) {
            // Set container width once div is mounted
            setContainerWidth(containerRef.current.getBoundingClientRect().width);
        }
    }, []);

    function animateScroll(element: HTMLElement, to: number, duration = 400) {
        const start = element.scrollLeft;
        const change = to - start;
        const startTime = performance.now();

        function animate(time: number) {
            const elapsed = time - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease-in-out cubic
            const ease = progress < 0.5 ? 4 * progress * progress * progress : 1 - Math.pow(-2 * progress + 2, 3) / 2;
            element.scrollLeft = start + change * ease;
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        }
        requestAnimationFrame(animate);
    }
    useEffect(() => {
        if (containerRef.current) {
            // ScrollLeft is the number of pixels to scroll
            const leftEdgeOfImageToScrollTo: number = currentIndex * containerWidth;
            animateScroll(containerRef.current, leftEdgeOfImageToScrollTo, 400);
        }
        // This should take effect whenever currentIndex is updated
    }, [currentIndex, containerWidth]);

    const goToPrevious = useCallback(() => {
        // If currentIndex is the first image, go to the last image
        setCurrentIndex(() => (currentIndex === 0 ? images.length - 1 : currentIndex - 1));
    }, [currentIndex, images.length]);

    const goToNext = useCallback(() => {
        // If currentIndex is the last image, go back to the first image
        setCurrentIndex(() => (currentIndex === images.length - 1 ? 0 : currentIndex + 1));
    }, [currentIndex, images.length]);

    //Handle case where images array is empty
    if (!images || images.length === 0) {
        return <div>No Images provided</div>;
    }

    return (
        <div className="image-slider" data-image="1">
            <NavigationButtons clickPrevious={goToPrevious} clickNext={goToNext} />
            <div className="container" ref={containerRef}>
                {containerWidth !== null && <ImageSliderRunner containerWidth={containerWidth} currentIndex={currentIndex} />}
            </div>
        </div>
    );
}
