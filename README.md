# CircularSlider

This is a Javascript component that allows you to create sliders.

## Properties

`CircularSlider` class accepts an object with options listed below:
- `container`: id of container
- `color`: color of stroke
- `max`: maximum value of the slider.
- `min`: minimum value of the slider.
- `step`: step for values on the slider.
- `radius`: radius of the circular slider (in px).
- `title`: title (label) of the slider.
- `strokeWidth`: width of the slider stroke. [optional]
- `nOfSteps`: number of divisions or steps on the slider. [optional]

## Usage

Create a new slider by initializing the `CircularSlider` class and passing an object with the desired properties. Then call the `render` method on the slider to display it on the page.

```javascript
const slider1 = new CircularSlider({ 
    container: 'sliderContainer', 
    color: 'red', 
    max: 100, 
    min: 0, 
    step: 1, 
    radius: 50, 
    title: 'Volume', 
    strokeWidth: 20, 
    nOfSteps: 50 
});
slider1.render();
