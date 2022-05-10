Create an SVG element inside a given parent element that resizes automatically.

SVG elements are explicitly sized (300&times;150px by default).
However, for visualization purposes it is often desirable to have the SVG element resize extrinsically, for example as part of a CSS grid.
In such situations, the SVG contents might need to be redrawn or rescaled.

This library provides one function, `createResizingSVG`.
This function takes one argument, the parent node within which the SVG element will reside.
This parent node **must** be extrinsically or explicitly sized, either by setting `width` or `min-width`, and `height` or `min-height`, or, for example, by putting it into a grid.
The function then uses a `ResizeObserver` to ensure that the SVG element's `width`, `height`, and `viewBox` are always updated.
Calling `createResizingSVG` will *remove the contents of its argument HTML element!*
It returns an object with three elements:

 - `svg`: the SVG element node itself
 - `parentNode`: the parent node
 - `initialWidth`: the current width of the SVG element
 - `initialHeight`: the current height of the SVG element
 - `cleanup`: a zero-argument function with no return value that clears the `ResizeObserver` and removes the contents of `parentNode`

Each time the parent element is resized, the SVG element is resized accordingly, and a `CustomEvent` of type `resize` is fired on the SVG element.
The event's `detail` field will contain an object with the new `width` and `height` values.
