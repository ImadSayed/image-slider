import { Link } from 'react-router-dom';
import { useImagesContext } from '../use-context/context';

export default function ImageSlider() {
    const images = useImagesContext();
    console.log('ImageSlider', images);

    return <Link to="/go-back">Click here for Image Slider</Link>;
}
