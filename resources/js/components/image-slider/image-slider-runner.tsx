import { useImagesContext } from '../../use-context/context';

interface ImageSliderRunnerProps {
    readonly container?: HTMLDivElement;
}

export default function ImageSliderRunner({ container }: ImageSliderRunnerProps) {
    const images = useImagesContext();
    const lastImage = images[images.length - 1];
    console.log('container: ');

    // Style the width of each img wrapper to be equal to image slider parent container
    let containerWidth = 0;

    if (container !== undefined) {
        containerWidth = container.getBoundingClientRect().width;
    }

    console.log('containerWidth: ', containerWidth);
    const figureWidth = { width: `${containerWidth}px` };

    let imagesRunner = images.map((image, index) => {
        // Return all images, each wrapped in an HTML element <figure>
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

    imagesRunner.unshift(
        <figure key={'cloned-' + images.length} data-index={images.length - 1} style={figureWidth}>
            <img src={lastImage.path} data-src="" alt={'' + lastImage.id} />
        </figure>,
    );

    return <div className="image-runner">{imagesRunner}</div>;
}
