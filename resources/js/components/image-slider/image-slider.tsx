import { useCallback, useEffect, useRef, useState } from 'react';
import { useSwipeNavigation } from '../../hooks/use-swipe-navigation';
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
    const [isJumping, setIsJumping] = useState(false);
    // parent wrapper to useRef as it wont change and doesn't need re-drawing if props or imageContext change
    const containerRef = useRef<HTMLDivElement>(null);
    const imageSliderRef = useRef<HTMLDivElement>(null);
    const [containerWidth, setContainerWidth] = useState(0);

    useEffect(() => {
        if (containerRef.current) {
            // Set container width once div is mounted
            setContainerWidth(containerRef.current.getBoundingClientRect().width);
        }
    }, []);

    useEffect(() => {
        if (containerRef.current && containerWidth > 0) {
            // Instantly jump to the first real image (index 1, because of the leading clone)
            containerRef.current.scrollLeft = containerWidth;
        }
        // This will take place after the containerWidth is set on page load
    }, [containerWidth]);

    function animateScroll(element: HTMLElement, to: number, duration = 400, cb?: () => void) {
        const start = element.scrollLeft;
        const change = to - start;
        const startTime = performance.now();

        function animate(time: number) {
            const elapsed = time - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease-in-out cubic
            const ease = progress < 0.5 ? 4 * progress * progress * progress : 1 - Math.pow(-2 * progress + 2, 3) / 2;
            element.scrollLeft = start + change * ease;
            // Continue animating until the duration is complete
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else if (cb) {
                cb();
            }
        }
        requestAnimationFrame(animate);
    }
    useEffect(() => {
        if (!containerRef.current) {
            return;
        }
        const scrollToIndex = currentIndex + 1; // +1 for the leading clone
        if (isJumping) {
            // Instantly jump to real first/last image (no animation)
            containerRef.current.scrollLeft = (currentIndex + 1) * containerWidth;
            setIsJumping(false);
        } else {
            animateScroll(containerRef.current, scrollToIndex * containerWidth, 400);
        }
        // This should take effect whenever currentIndex is updated
    }, [currentIndex, containerWidth, isJumping]);

    const goToPrevious = useCallback(() => {
        if (currentIndex === 0) {
            // Animate to the clone (scrollLeft = 0)
            if (containerRef.current) {
                animateScroll(containerRef.current, 0, 400, () => {
                    setIsJumping(true);
                    setCurrentIndex(images.length - 1);
                });
            }
        } else {
            setCurrentIndex(currentIndex - 1);
        }
    }, [currentIndex, images.length]);

    const goToNext = useCallback(() => {
        if (currentIndex === images.length - 1) {
            // Animate to the clone (scrollLeft = (images.length + 1) * containerWidth)
            if (containerRef.current) {
                animateScroll(containerRef.current, (images.length + 1) * containerWidth, 400, () => {
                    setIsJumping(true);
                    setCurrentIndex(0);
                });
            }
        } else {
            setCurrentIndex(currentIndex + 1);
        }
    }, [currentIndex, images.length, containerWidth]);

    useSwipeNavigation(containerRef, goToNext, goToPrevious, containerWidth, currentIndex);

    //Handle case where images array is empty
    if (!images || images.length === 0) {
        return <div>No Images provided</div>;
    }

    return (
        <div className="image-slider" data-image="1" ref={imageSliderRef}>
            <NavigationButtons clickPrevious={goToPrevious} clickNext={goToNext} />
            <div className="container" ref={containerRef}>
                {containerWidth !== null && <ImageSliderRunner containerWidth={containerWidth} currentIndex={currentIndex} />}
            </div>
        </div>
    );
}
