# <ins> This project is to demonstrate an image slider component.</ins> 
## written in react & typescript.

### It loads the images in the storage/app/public/images/ folder.
*It may eventually get built out further to allow the user to upload some new images to show in the slider.*

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

##### The solution:

One could have taken the easiest solution and implemented a Slick carousel but the idea of having less dependencies in a project, seems more efficient. Slick would also encourage the use of jQuery which would just be another dependency. I have decided to build it from scratch, this way we have more control over each step and we dont need to install a massive library just to create a carousel/image-slider.

This solution has five components;
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

### Still needs improvement
On some browsers the touch swipe doesn't invoke the sliding of the scroller. While it might appear to do so when swiping to the next image, if the user was to let go of the image slider before the image has scrolled 50% over then the image slider is to snap back to the current image but this should be animated/slow scroll and might not seem to.

Also another issue on some browsers but not all, when on the first image and clicking the previous navigation button the image slider should take us to the last image. The way this is done that there is initially a cloned image to the left of the first image which gets scrolled into view. When the anmation scroll ends, the image slider jumps to the last image and the user shouldnt see the jump. However in some browsers there is a very quick scroll effect rather than a jump. This could be improved.




