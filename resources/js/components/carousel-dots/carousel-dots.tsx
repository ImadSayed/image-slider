import './carousel-dots.css';

interface CarouselDotsProps {
    readonly currentIndex: number;
    readonly totalSlides: number;
    readonly onDotClick: (index: number) => void;
}

/**
 * CarouselDots component renders the navigation dots for the image carousel.
 * @param currentIndex - The index of the currently active slide.
 * @param totalSlides - The total number of slides in the carousel.
 * @param onDotClick - Callback function to handle dot click events.
 */
export default function CarouselDots({ currentIndex, totalSlides, onDotClick }: CarouselDotsProps) {
    const dots = Array.from({ length: totalSlides }, (_, index) => (
        <div key={index} className="dot-container">
            <button
                type="button"
                className={`dot ${currentIndex === index ? 'active' : ''} ${index < currentIndex + 2 && index > currentIndex - 2 ? 'nearActive' : ''} `}
                data-index={index}
                onClick={() => onDotClick(index)}
                aria-label={`Slide ${index + 1}`}
            ></button>
        </div>
    ));

    return <div className="carousel-dots">{dots}</div>;
}
