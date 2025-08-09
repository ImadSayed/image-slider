import { useImagesContext } from '../../use-context/context';

export default function ImageSliderRunner({ containerWidth }: { readonly containerWidth: number }) {
    const images = useImagesContext();

    // Style the width of each img wrapper to be equal to image slider parent container
    const figureWidth = { width: `${containerWidth}px` };

    const imagesRunner = images.map((image, index) => {
        // Return all images, each wrapped in an HTML element <figure>
        // load img for last, 1st and second images
        // Store image path in data-src for lazy loading
        return (
            <figure key={image.id} data-index={index} style={figureWidth}>
                <img
                    src={index <= 1 || index === images.length - 1 ? image.path : undefined}
                    data-src={index > 1 && index < images.length - 1 ? image.path : ''}
                    alt={'' + image.id}
                />
            </figure>
        );
    });

    return <div className="image-runner">{imagesRunner}</div>;
}
