import { useRef } from 'react';
import { useImagesContext } from '../../use-context/context';

interface ImageSliderRunnerProps {
    readonly containerWidth: number;
    readonly currentIndex: number;
}

export default function ImageSliderRunner({ containerWidth, currentIndex }: ImageSliderRunnerProps) {
    const images = useImagesContext();

    // Style the width of each img wrapper to be equal to image slider parent container
    const figureWidth = { width: `${containerWidth}px` };

    // Track loaded images by their index
    const loadedImagesRef = useRef<Set<number>>(new Set());

    // Mark current, prev, and next as loaded
    const markLoaded = (index: number) => loadedImagesRef.current.add(index);

    const imagesRunner = images.map((image, index) => {
        const isCurrent = index === currentIndex;
        const isPrev = index === (currentIndex === 0 ? images.length - 1 : currentIndex - 1);
        const isNext = index === (currentIndex === images.length - 1 ? 0 : currentIndex + 1);

        // Mark as loaded if in view or adjacent
        if (isCurrent || isPrev || isNext) {
            markLoaded(index);
        }

        // Should load if ever loaded
        const shouldLoad = loadedImagesRef.current.has(index);

        return (
            <figure key={image.id} data-index={index} style={figureWidth}>
                <img src={shouldLoad ? image.path : undefined} data-src={!shouldLoad ? image.path : ''} alt={'' + image.id} />
            </figure>
        );
    });

    return <div className="image-runner">{imagesRunner}</div>;
}
