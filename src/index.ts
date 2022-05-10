interface ReturnValue {
  svg: SVGSVGElement;
  parentNode: HTMLElement;

  initialWidth: number;
  initialHeight: number;

  cleanup: () => void;
};

export function createResizingSVG(parentNode: HTMLElement): ReturnValue {
  parentNode.innerHTML = '';
  const oldDisplay = parentNode.style.display;
  const oldPosition = parentNode.style.position;
  parentNode.style.display = 'grid';
  parentNode.style.position = 'relative';

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.style.position = 'absolute';
  parentNode.appendChild(svg);

  const resize = (width: number, height: number) => {
    svg.setAttribute('width', `${width}`);
    svg.setAttribute('height', `${height}`);
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
  };

  const { width, height } = parentNode.getBoundingClientRect();
  resize(width, height);

  const obs = new ResizeObserver(([ { contentBoxSize: [{ inlineSize, blockSize }] } ]) => {
    resize(inlineSize, blockSize);
    svg.dispatchEvent(new CustomEvent('resize', { detail: { width: inlineSize, height: blockSize } }));
  });

  obs.observe(parentNode);
  const cleanup = () => {
    parentNode.innerHTML = '';
    parentNode.style.display = oldDisplay;
    parentNode.style.position = oldPosition;
    obs.disconnect();
  };

  return {
    svg,
    parentNode,
    cleanup,
    initialWidth: width,
    initialHeight: height,
  };
}
