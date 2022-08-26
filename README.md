Create SVG and Canvas elements inside a given parent element that resizes automatically.

SVG and Canvas elements are explicitly sized (300&times;150px by default).
However, for visualization purposes it is often desirable to have the element resize extrinsically, for example as part of a CSS grid.
In such situations, the contents might need to be redrawn or rescaled.

This library provides one class, `ResizeContainer`.
This function takes one argument, the parent node within which the elements will reside.
This parent node **must** be extrinsically or explicitly sized, either by setting `width` or `min-width`, and `height` or `min-height`, or, for example, by putting it into a grid.
The function then uses a `ResizeObserver` to ensure that the elements' `width`, `height`, and `viewBox` are always updated.
Passing an element to the class constructor will *remove its contents!*

Multiple child elements can be added, one by the other.
For an SVG element, call the `ResizeContainer` object's `addSvgLayer()` method, for a Canvas element, the `addCanvasLayer()` method.
Both methods return the created element.
Elements are stacked by `z-index` in the order of their creation (first created element is the furthest to the back).
The order can be modified by calling the `sort()` function, which takes a comparison function as its argument which is passed to `Array.sort()`.
Elements can be removed from the `ResizeContainer` by passing them to the `removeLayer()` function.

Three additional read-only fields exist on the `ResizeContainer`:
 - `container`: The HTML element of the container itself.
 - `width`: The current width, in pixels, of the container.
 - `height`: The current height, in pixels, of the container.

Each time the parent element is resized, each child element is resized accordingly, and a `CustomEvent` of type `resize` is fired on each element.
The event's `detail` field will contain an object with the new `width` and `height` values.
An identical `CustomEvent` of type `resize` will be fired on the parent element itself.
