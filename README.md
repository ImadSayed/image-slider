# <ins> This project is to demonstrate an image slider component.</ins> 
### It loads the images in the storage/app/public/images/ folder.
*It may eventually get build further to allow the user to upload some new images to show in the slider.*

To view the image slider in action via a browser, [click here](https://imageslider.imadsayed.co.uk/). You can find a written explnation of the solution approached, at the bottom of this file.

## After cloning the repository and running npm install in your terminal

### Assuming you have PHP installed and it is in your path / system environment variables, run the following in your terminal:
```
php artisan storage:link
```
### This will create a link between your storage and public folder to access the images.

#### --------------------------------------------------------------------------------------------------

### To launch the server and test the imageSlider, locally, run the following in your terminal: 
```
composer run dev
```
#### Alternatively you may start your server separately using: 
```
php artisan serve
```
#### and then start the hot module using
```
npm run dev
```
#### --------------------------------------------------------------------------------------------------

## After starting the server, open a browser and navigate to the URL: 
> http://localhost:8000/
**or**
> http://127.0.0.1:8000/

#### Using the image slider in the broswer;
- [ ] - click on the navigational buttons.
- [ ] - if you are able to use touch mode then try and swipe the slider.
- [ ] - Maybe even try to flick the slide instead of sliding across the entire screen.
- [ ] - select Auto Play in the top right corner.
- [ ] - click on one of the dots in the long line of dots towards the bottom / center of the image slider.

#### --------------------------------------------------------------------------------------------------

## Solution
#### The solution is written in React with typescript and uses the Laravel framework and a little PHP to read images in from the store and provide them to the front end.

##### The React solution:

Five components;
- the image slider parent wrapper, image-slider.tsx
- the image slider list of images, image-slider-runner.tsx
- the navigation buttons, navigation-buttons.tsx
- the swipe navigation, use-swipe-navigation.ts
- the carousel dots, carousel-dots.tsx

If I thought to add some sliding/scrolling animation to the carousel dots, I might have refactored out the animated scroll into it's own hook.
It is currently a function withing the image-slider component.

The navigation-buttons component returns 2 buttons within a div and takes as parameters, call back functions to  
clicking the previous button and secondly clicking the next button.

The use-swipe-navigation component has no displayable components to return. It just provides swipe functionality. It takes as parameters, the container on which the user would swipe,
a callback function for onSwipeLeft, a callback function for onSwipeRight, the image slider container width and the currentIndex representing the current slide.

The carouselDots component returns a parent wrapper div which consists of, for each slide/image to represent, a child div wrapped around a button. The component takes as parameters the current index representing the current slide/image, the total number of slides/images and a callback function for the onDotClick event.

The "image-slider-runner" component returns a wrapper div which consists of, for each image, a html <figure></figure> element and a child image element. The component takes as parameters, the container width in pixels and the current index of the current image.

The "image-slider" component is where everything comes together, where all the event callback functions rest, where the main render is returned and any further logic. imageslider.css provides the styling for this component.





