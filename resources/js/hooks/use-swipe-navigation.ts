import { useEffect, useRef } from 'react';

type SwipeCallback = () => void;

interface UseSwipeNavigationProps {
    ref: React.RefObject<HTMLElement | null>;
    onSwipeLeft: SwipeCallback;
    onSwipeRight: SwipeCallback;
    containerWidth: number;
    currentIndex: number;
}

/**
 * Custom hook to handle swipe navigation for an image slider.
 * It listens for touch events and determines swipe direction based on touch movement.
 */
export default function useSwipeNavigation({ ref, onSwipeLeft, onSwipeRight, containerWidth, currentIndex }: UseSwipeNavigationProps) {
    const touchStartX = useRef<number | null>(null);
    const lastScrollLeft = useRef<number>(0);

    // Buffer for last few touchmove events
    const moveBuffer = useRef<{ x: number; t: number }[]>([]);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        let dragging = false;

        const handleTouchStart = (e: TouchEvent) => {
            dragging = true;
            touchStartX.current = e.touches[0].clientX;
            lastScrollLeft.current = element.scrollLeft;
            moveBuffer.current = [{ x: e.touches[0].clientX, t: e.timeStamp }];
        };

        const handleTouchMove = (e: TouchEvent) => {
            if (!dragging || touchStartX.current === null) return;
            const deltaX = touchStartX.current - e.touches[0].clientX;
            element.scrollLeft = lastScrollLeft.current + deltaX;
            // Keep last 5 moves
            moveBuffer.current.push({ x: e.touches[0].clientX, t: e.timeStamp });
            if (moveBuffer.current.length > 20) moveBuffer.current.shift();
        };

        const handleTouchEnd = (e: TouchEvent) => {
            dragging = false;
            let initialDirection = '';
            let finalDirection = '';
            if (touchStartX.current === null || moveBuffer.current.length < 2) return;

            const touchEndX = e.changedTouches[0].clientX;
            const totalDiff = touchEndX - touchStartX.current;
            const initialDiff = moveBuffer.current[1].x - moveBuffer.current[0].x;
            const threshold = containerWidth / 2;
            // Calculate velocity and direction of last segment
            const last = moveBuffer.current[moveBuffer.current.length - 1];
            const prev = moveBuffer.current[moveBuffer.current.length - 2];
            const segmentDiff = last.x - prev.x;
            const segmentTime = last.t - prev.t;

            if (initialDiff > 0) {
                initialDirection = 'left';
            } else if (initialDiff < 0) {
                initialDirection = 'right';
            }

            if (segmentDiff > 0) {
                finalDirection = 'left';
            } else if (segmentDiff < 0) {
                finalDirection = 'right';
            }

            const segmentVelocity = Math.abs(segmentDiff) / (segmentTime || 1); // px/ms
            const fastFlickVelocity = 0.6; // px/ms

            // If last segment is a fast flick
            if (segmentVelocity > fastFlickVelocity) {
                // If flick and drag are in same direction, slide
                if (Math.sign(segmentDiff) === Math.sign(totalDiff) && Math.abs(totalDiff) > 0) {
                    // fast flick and same direction
                    if (segmentDiff < 0) {
                        onSwipeLeft();
                    } else if (segmentDiff > 0) {
                        onSwipeRight();
                    }
                } else if (segmentTime < 200 && Math.abs(totalDiff) > containerWidth / 2 && initialDirection !== finalDirection) {
                    // Flick-back: snap back to current image
                    element.scrollTo({ left: (currentIndex + 1) * containerWidth, behavior: 'smooth' });
                }
            }
            // Otherwise, use drag distance
            else if (totalDiff > threshold) {
                onSwipeRight();
            } else if (totalDiff < -threshold) {
                onSwipeLeft();
            }
            // Snap back
            else {
                element.scrollTo({ left: (currentIndex + 1) * containerWidth, behavior: 'smooth' });
            }

            touchStartX.current = null;
            moveBuffer.current = [];
        };

        element.addEventListener('touchstart', handleTouchStart);
        element.addEventListener('touchmove', handleTouchMove);
        element.addEventListener('touchend', handleTouchEnd);

        return () => {
            // Remove Event Listeners on unmount
            element.removeEventListener('touchstart', handleTouchStart);
            element.removeEventListener('touchmove', handleTouchMove);
            element.removeEventListener('touchend', handleTouchEnd);
        };
    }, [ref, onSwipeLeft, onSwipeRight, containerWidth, currentIndex]);
}
