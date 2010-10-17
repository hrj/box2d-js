## Demo

View the demo [here][2].

  [2]: http://lavadip.com/experiments/box2d_demo/

## About this fork

This fork has the following changes over the original:

### New features
  * Spring Joint (simple version, suitable for simulation of soft bodies)

### Code Optimisations
  * Removed dependency on prototype.js
  * Simple optimisations to core library, using for loops.
  * Tried to avoid frequent instantiations of b2Vec2

## About this library

The original box2d-js library is hosted on [sourceforge][1].

  [1]: http://box2d-js.sourceforge.net/        "Box2D JS"

It seems to be currently unmaintained and uses the HTML5 Canvas element for display.


## Demo features

  * Use of SVGs instead of Canvas
     * Using jquery and jquery.svg
     * only create a shape for the first time, then use transformations
     * if static or sleeping then don't redraw

  * throttling of step size and inter-frame delays, to achieve a target FPS.
  * a new demo scene called `drop` to show off spring-joints.
