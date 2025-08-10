import { useCallback, useEffect, useRef, useState } from 'react';
import { useSwipeNavigation } from '../../hooks/use-swipe-navigation';
import { useImagesContext } from '../../use-context/context';
import CarouselDots from '../carousel-dots/carousel-dots'; // Import carousel dots
import NavigationButtons from '../navigation-buttons'; // Import nav buttons
import SlideToggle from '../ui/slide-toggle';
import ImageSliderRunner from './image-slider-runner'; // Import images in slider
import './image-slider.css';

interface ImageSliderProps {
    readonly slideInterval?: number; // Optional: interval for auto-slide
}

export default function ImageSlider({ slideInterval = 2500 }: ImageSliderProps) {
    const images = useImagesContext();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isJumping, setIsJumping] = useState(false);
    const [autoSlideEnabled, setAutoSlideEnabled] = useState(false);
    // parent wrapper to useRef as it wont change and doesn't need re-drawing if props or imageContext change
    const containerRef = useRef<HTMLDivElement>(null);
    const dotWrapperRef = useRef<HTMLDivElement>(null);
    const [containerWidth, setContainerWidth] = useState(0);

    const updateContainerWidth = () => {
        if (containerRef.current) {
            setContainerWidth(containerRef.current.getBoundingClientRect().width);
        }
    };

    useEffect(() => {
        // Set width on mount
        updateContainerWidth();

        // Update width on window resize
        window.addEventListener('resize', updateContainerWidth);

        // Cleanup
        return () => {
            window.removeEventListener('resize', updateContainerWidth);
        };
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

        // This should take effect whenever any of the following are updated
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

    // Swipe Navigation
    useSwipeNavigation(containerRef, goToNext, goToPrevious, containerWidth, currentIndex);

    // Auto slide enabled
    useEffect(() => {
        if (autoSlideEnabled) {
            const slideTimer = setInterval(goToNext, slideInterval);
            return () => clearInterval(slideTimer);
        }
    }, [autoSlideEnabled, slideInterval, goToNext]);

    // Click on a dot to update the currentIndex
    const goToSlide = useCallback(
        (index: number) => {
            if (index < 0 || index >= images.length) {
                return false;
            }
            setCurrentIndex(index);
        },
        [images],
    );

    //Handle case where images array is empty
    if (!images || images.length === 0) {
        return <div>No Images provided</div>;
    }

    return (
        <div className="image-slider" data-image="1">
            <div className="slide-toggle">
                <SlideToggle onToggle={setAutoSlideEnabled} initial={autoSlideEnabled} />
            </div>
            <NavigationButtons clickPrevious={goToPrevious} clickNext={goToNext} />
            <div className="container" ref={containerRef}>
                {containerWidth !== null && <ImageSliderRunner containerWidth={containerWidth} currentIndex={currentIndex} />}
            </div>
            <div className="carousel-dot-wrapper" ref={dotWrapperRef}>
                <CarouselDots currentIndex={currentIndex} totalSlides={images.length} onDotClick={goToSlide} />
            </div>
        </div>
    );
}
