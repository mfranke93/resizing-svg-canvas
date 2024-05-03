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


## Example

For an empty HTML document, create a parent `<div>` element that can be resized.
Within, add a Canvas and an SVG element.
The canvas should fill a yellow rectangle with 20px of padding on each side.
The SVG element should contain a Bèzier curve going from the top left to the bottom right of the yellow rectangle below.
This should be updated each time the parent element is resized.

``` javascript
import ResizeContainer from 'resizing-svg-canvas';

// create a resizable parent element
const main = document.createElement('div');
document.body.appendChild(main);

main.style.position = 'absolute';
main.style.outline = '1px solid rebeccapurple';
main.style.width = '600px';
main.style.height = '400px';
main.style.left = '30px';
main.style.top = '20px';
main.style.resize = 'both';
main.style.overflow = 'hidden';

const resize = new ResizeContainer(main);

const canvas = resize.addCanvasLayer();
const svg = resize.addSvgLayer();

main.addEventListener('resize', evt => {
  // CustomEvent `detail` contains new width and height
  const { width, height } = evt.detail;

  // redraw canvas: yellow rectangle
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = '#ffdd22';
  ctx.fillRect(20, 20, width - 40, height - 40);

  // redraw svg
  svg.innerHTML = `<path stroke="rebeccapurple" stroke-width="2" fill="none" d="M 20 20 C 100 20 ${width - 100} ${height - 20} ${width - 20} ${height - 20}" />`;
});
```

## Files

The ES module build produces a file [`lib/index.js`](lib/index.js), alongside the typing information in [`lib/index.d.ts`](lib/index.d.ts).
A standalone IIFE JavaScript file (to be used as `src` of a `<script>` tag) is built as well: [`lib/resizing-svg-canvas.min.js`](lib/resizing-svg-canvas.min.js).
The IIFE script results in the `ResizeContainer` class being available in the global (`window`) scope.