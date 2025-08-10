import { useEffect } from 'react';

interface NavigationButtonsProps {
    readonly clickPrevious: () => void;
    readonly clickNext: () => void;
}

/**
 * Custom component to handle click navigation for left and right buttons.
 * @param clickPrevious - Callback for left button click.
 * @param clickNext - Callback for right button click.
 */
export default function NavigationButtons({ clickPrevious, clickNext }: NavigationButtonsProps) {
    const handleClick = (direction: 'prev' | 'next') => {
        const event = new CustomEvent('navigation-button-click', { detail: { direction } });
        document.dispatchEvent(event);
    };

    useEffect(() => {
        const handleNavigationButtonClick = (event: Event) => {
            const customEvent = event as CustomEvent;
            const { direction } = customEvent.detail;
            if (direction === 'prev') {
                clickPrevious();
            } else if (direction === 'next') {
                clickNext();
            }
        };

        document.addEventListener('navigation-button-click', handleNavigationButtonClick);

        return () => {
            // Destroy on unmount
            document.removeEventListener('navigation-button-click', handleNavigationButtonClick);
        };
    });

    return (
        <div className="navigation-buttons">
            <button className="previous-button" onClick={() => handleClick('prev')}>
                <span>Prev</span>
            </button>
            <button className="next-button" onClick={() => handleClick('next')}>
                <span>Next</span>
            </button>
        </div>
    );
}
