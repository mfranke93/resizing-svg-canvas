type ChildNode = SVGSVGElement | HTMLCanvasElement;

export default class ResizeContainer {
  private children: Array<ChildNode> = [];
  private readonly observer: ResizeObserver;

  private _cachedWidth: number = 0;
  private _cachedHeight: number = 0;

  constructor(
    private readonly _container: HTMLElement,
  ) {
    this._container.innerHTML = '';
    this._container.style.display = 'block';
    this._container.style.position = 'relative';
    this._container.style.isolation = 'isolate';

    this.observer = new ResizeObserver(( [{ contentBoxSize: [{ inlineSize, blockSize }]}] ) => this.handleResizeEvent(inlineSize, blockSize));
    this.observer.observe(this._container);

    const { width, height } = this._container.getBoundingClientRect();
    this.handleResizeEvent(width, height);
  }

  private handleResizeEvent(width: number, height: number): void {
    this._cachedWidth = width;
    this._cachedHeight = height;

    this.children.forEach(child => this.resizeChild(child));

    this._container.dispatchEvent(
      new CustomEvent('resize', {
        detail: { width, height, },
        bubbles: false,
      }));
  }

  private resizeChild(child: ChildNode): void {
    child.setAttribute('width', `${this._cachedWidth}`);
    child.setAttribute('height', `${this._cachedHeight}`);
    if (child instanceof SVGSVGElement) child.setAttribute('viewBox', `0 0 ${this._cachedWidth} ${this._cachedHeight}`);

    child.dispatchEvent(
      new CustomEvent('resize', {
        detail: { width: this._cachedWidth, height: this._cachedHeight, },
        bubbles: false,
      }));
  }

  addSvgLayer(): SVGSVGElement {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.style.position = 'absolute';  // this is so that it does not affect the size of the wrapper element
    svg.style.zIndex = `${this.children.length + 1}`;

    this._container.appendChild(svg);
    this.children.push(svg);
    this.resizeChild(svg);

    return svg;
  }

  addCanvasLayer(): HTMLCanvasElement {
    const canvas = document.createElement('canvas');
    canvas.style.position = 'absolute';  // this is so that it does not affect the size of the wrapper element
    canvas.style.zIndex = `${this.children.length + 1}`;

    this._container.appendChild(canvas);
    this.children.push(canvas);
    this.resizeChild(canvas);

    return canvas;
  }

  removeLayer(layer: ChildNode): void {
    const idx = this.children.indexOf(layer);

    if (idx === -1) return console.warn('no such layer in ResizeContainer:', layer);

    this.children = [ ...this.children.slice(0, idx), ...this.children.slice(idx + 1) ];
    this._container.removeChild(layer);
  }

  sort(comp: ((a: ChildNode, b: ChildNode) => number)): void {
    this.children
      .sort(comp)
      .forEach((child, index) => child.style.zIndex = (index + 1).toString());
  }

  get container(): HTMLElement {
    return this._container;
  }

  get width(): number {
    return this._cachedWidth;
  }

  get height(): number {
    return this._cachedHeight;
  }
};
