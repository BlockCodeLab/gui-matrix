import { paperCore } from '@blockcode/blocks-player';
import { EventEmitter } from 'node:events';

import { loadImageFromDataURL } from '../../lib/load-image';
import RotationStyle from '../../lib/rotation-style';

import createContour from './create-contour';
import touching from './touching';
import Runtime from './runtime';

const FONT_SIZE = 12;
const LINE_MAX_CHARS = 18;
const DIALOG_RADIUS = 10;
const DIALOG_PADDING = 8;
const DIALOG_HANDLE_HEIGHT = DIALOG_RADIUS * 0.8;
const DIALOG_MIN_WIDTH = DIALOG_RADIUS * 3;
const DIALOG_MIN_HEIGHT = DIALOG_RADIUS * 2 + DIALOG_HANDLE_HEIGHT;

const CLONES_COUNT_LIMIT = 30;

const degToRad = (deg) => (deg * Math.PI) / 180;
const radToDeg = (rad) => (rad * 180) / Math.PI;
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

class Util extends EventEmitter {
  constructor(raster) {
    super();
    this._raster = raster;
    this._variable = new Proxy(this.data, {
      get: (_, name) => {
        const prop = `$${name}`;
        if (Object.hasOwn(this.data, prop)) {
          return this.data[prop];
        }
        return this.stage.data[prop];
      },
      set: (_, name, value) => {
        const prop = `$${name}`;
        if (Object.hasOwn(this.data, prop)) {
          return (this.data[prop] = value);
        }
        this.stage.data[prop] = value;
      },
    });
  }

  get raster() {
    return this._raster;
  }

  get variable() {
    return this._variable;
  }

  get name() {
    return this.raster.name;
  }

  get stageLayer() {
    return paperCore.project.layers.stage;
  }

  get spriteLayer() {
    return paperCore.project.layers.sprite;
  }

  get contourLayer() {
    return paperCore.project.layers.contour;
  }

  get dialogLayer() {
    return paperCore.project.layers.dialog;
  }

  get stage() {
    return this.stageLayer.children[0];
  }

  get runtime() {
    return this._runtime;
  }

  get running() {
    return !this.editing && this.runtime && this.runtime.running;
  }

  get editing() {
    return !!this.spriteLayer.onMouseDown;
  }

  get data() {
    return this.raster.data;
  }

  get assets() {
    return this.data.assets;
  }

  get stageBounds() {
    return new paperCore.Rectangle(
      paperCore.view.center.x - Runtime.VIEW_WIDTH / 2,
      paperCore.view.center.y - Runtime.VIEW_HEIGHT / 2,
      Runtime.VIEW_WIDTH,
      Runtime.VIEW_HEIGHT,
    );
  }

  requestUpdate() {
    if (this.running) {
      this.emit('update');
    }
  }
}

class StageUtil extends Util {
  get backdropName() {
    return this.assets[this.data.frame].name;
  }

  get backdrop() {
    return this.data.frame + 1;
  }

  set backdrop(value) {
    if (typeof value === 'string') {
      let backdrop = +value;
      if (isNaN(backdrop)) {
        backdrop = this.assets.findIndex((asset) => asset.name === value);
        if (backdrop === -1) {
          backdrop = this.assets.findIndex((asset) => asset.id === value);
        }
        if (backdrop === -1) return;
        value = backdrop + 1;
      } else {
        value = backdrop;
      }
    }

    let frame = (value - 1) % this.assets.length;
    if (frame < 0) frame + this.assets.length;

    if (this.editing || frame !== this.data.frame) {
      const asset = this.assets[frame];
      if (!asset) return;

      this.data.frame = frame;
      loadImageFromDataURL(asset).then((image) => {
        this.raster.image = image;
        this.raster.pivot = new paperCore.Point(asset.centerX - asset.width / 2, asset.centerY - asset.height / 2);
        this.raster.position.x = paperCore.view.center.x;
        this.raster.position.y = paperCore.view.center.y;
        this.requestUpdate();
      });
    }
  }
}

class SpriteUtil extends Util {
  static CLONES = [];
  _clones = [];

  get costumeName() {
    return this.assets[this.data.frame].name;
  }

  get costume() {
    return this.data.frame + 1;
  }

  set costume(value) {
    if (typeof value === 'string') {
      let costume = +value;
      if (isNaN(costume)) {
        costume = this.assets.findIndex((asset) => asset.name === value);
        if (costume === -1) {
          costume = this.assets.findIndex((asset) => asset.id === value);
        }
        if (costume === -1) return;
        value = costume + 1;
      } else {
        value = costume;
      }
    }

    let frame = (value - 1) % this.assets.length;
    if (frame < 0) frame + this.assets.length;

    if (this.editing || frame !== this.data.frame) {
      const asset = this.assets[frame];
      if (!asset) return;

      this.data.frame = frame;
      this.requestUpdate();

      loadImageFromDataURL(asset).then((image) => {
        this.raster.image = image;
        this.raster.pivot = new paperCore.Point(asset.centerX - asset.width / 2, asset.centerY - asset.height / 2);
        this.createContour();
        this.goto(this.x, this.y, true);
      });
    }
  }

  get contour() {
    return this.contourLayer.children[this.name];
  }

  createContour() {
    this.removeContour();
    createContour(this.raster);
  }

  removeContour() {
    if (this.contour) {
      this.contour.remove();
    }
  }

  get x() {
    return Math.round(this.data.x);
  }

  get y() {
    return Math.round(this.data.y);
  }

  set x(x) {
    if (this.editing || x != this.data.x || isNaN(this.raster.position.x)) {
      this.data.x = x;
      this.raster.position.x = paperCore.view.center.x + this.data.x;
      this.requestUpdate();
      if (this.contour) {
        this.contour.position.x = this.raster.position.x;
      }
      if (this.dialog) {
        this.createDialog(this.dialog.data.text, this.dialog.data.style);
      }
    }
  }

  set y(y) {
    if (this.editing || y != this.data.y || isNaN(this.raster.position.y)) {
      this.data.y = y;
      this.raster.position.y = paperCore.view.center.y - this.data.y;
      this.requestUpdate();
      if (this.contour) {
        this.contour.position.y = this.raster.position.y;
      }
      if (this.dialog) {
        this.createDialog(this.dialog.data.text, this.dialog.data.style);
      }
    }
  }

  goto(x, y, force) {
    if (typeof x === 'object') {
      force = y;
      y = x.y;
      x = x.x;
    }
    if (
      this.editing ||
      force ||
      x !== this.data.x ||
      y !== this.data.y ||
      isNaN(this.raster.position.x) ||
      isNaN(this.raster.position.y)
    ) {
      this.data.x = x;
      this.data.y = y;
      this.raster.position.x = paperCore.view.center.x + this.data.x;
      this.raster.position.y = paperCore.view.center.y - this.data.y;
      this.requestUpdate();

      if (this.contour) {
        this.contour.position = this.raster.position;
      }
      if (this.dialog) {
        this.createDialog(this.dialog.data.text, this.dialog.data.style);
      }
    }
  }

  get zIndex() {
    return this.raster.index;
  }

  set zIndex(z) {
    if (z === 'front') {
      this.raster.bringToFront();
    } else if (z === 'back') {
      this.raster.sendToBack();
    } else {
      z = Math.min(Math.max(z, 0), this.spriteLayer.children.length - 1);
      const item = this.spriteLayer.children[z];
      if (z > this.raster.index) {
        this.raster.insertAbove(item);
      } else {
        this.raster.insertBelow(item);
      }
    }
  }

  _size(value) {
    let size = value < 5 ? 5 : value;
    const width = (this.raster.image.width * size) / 100;
    const height = (this.raster.image.height * size) / 100;
    const maxWidth = paperCore.view.viewSize.width * 2;
    const maxHeight = paperCore.view.viewSize.height * 2;
    if (width > maxWidth || height > maxHeight) {
      size = Math.floor(Math.min(maxWidth / this.raster.image.width, maxHeight / this.raster.image.height) * 100);
    }
    return Math.round(size);
  }

  get size() {
    return this._size(this.data.size);
  }

  set size(value) {
    const size = this._size(value);
    if (this.editing || size !== this.data.size) {
      const scaling = size / 100;
      this.data.size = size;
      this.raster.scaling.x = scaling;
      this.raster.scaling.y = scaling;
      this.requestUpdate();

      if (this.contour) {
        this.contour.scaling = this.raster.scaling;
      }
      if (this.dialog) {
        this.createDialog(this.dialog.data.text, this.dialog.data.style);
      }
    }
  }

  get hidden() {
    return !this.raster.visible;
  }

  set hidden(value) {
    if (value === this.raster.visible) {
      this.raster.visible = !value;
      this.requestUpdate();
    }
  }

  _direction(value) {
    let direction = value % 360;
    if (direction <= -180) {
      direction += 360;
    } else if (direction > 180) {
      direction -= 360;
    }
    return Math.round(direction);
  }

  get direction() {
    return this._direction(this.data.direction);
  }

  set direction(value) {
    this.rotate(this._direction(value), this.rotationStyle);
  }

  get rotationStyle() {
    return this.data.rotationStyle;
  }

  set rotationStyle(value) {
    this.rotate(this.direction, value);
  }

  rotate(direction, style) {
    if (this.editing || direction !== this.data.direction || style !== this.data.rotationStyle) {
      this.data.direction = direction;
      this.data.rotationStyle = style;

      if (this.data.rotationStyle === RotationStyle.ALL_AROUND) {
        this.raster.rotation = this.direction - Runtime.DEFAULT_DIRECTION;
      } else if (this.data.rotationStyle === RotationStyle.HORIZONTAL_FLIP) {
        this.raster.rotation = 0;

        const scalingX = Math.abs(this.raster.scaling.x);
        const scalingY = Math.abs(this.raster.scaling.y);
        this.raster.scaling.x = this.direction < 0 ? -scalingX : scalingX;
        this.raster.scaling.y = scalingY;
        if (this.contour) {
          this.contour.scaling.x = this.raster.scaling.x;
          this.contour.scaling.y = this.raster.scaling.y;
        }
      } else {
        this.raster.rotation = 0;
      }
      this.requestUpdate();

      if (this.contour) {
        this.contour.rotation = this.raster.rotation;
      }
      if (this.dialog) {
        this.createDialog(this.dialog.data.text, this.dialog.data.style);
      }
    }
  }

  move(steps) {
    const radian = degToRad(this.direction - Runtime.DEFAULT_DIRECTION);
    const dx = steps * Math.cos(radian);
    const dy = steps * Math.sin(radian);
    this.goto(this.x + dx, this.y - dy);
  }

  towards(target) {
    if (typeof target === 'number') {
      this.direction = target;
    } else {
      const dx = target.x - this.x;
      const dy = target.y - this.y;
      this.direction = Runtime.DEFAULT_DIRECTION - radToDeg(Math.atan2(dy, dx));
    }
  }

  async glide(duration, x, y) {
    if (typeof x === 'object') {
      y = x.y;
      x = x.x;
    }
    if (duration <= 0) {
      this.goto(x, y);
      return;
    }
    duration *= 1000;

    const startx = this.x;
    const starty = this.y;
    const dx = x - startx;
    const dy = y - starty;
    let frac;
    let elapsed = 0;
    let start = Date.now();
    while (true) {
      await sleep(0);
      elapsed = Date.now() - start;
      if (elapsed < duration) {
        frac = elapsed / duration;
        this.goto(startx + dx * frac, starty + dy * frac);
      } else {
        this.goto(x, y);
        break;
      }
      if (this.editing) break;
    }
  }

  findNearestEdge() {
    let nearestEdge;
    if (this.contour.bounds.top <= this.stageBounds.top) {
      nearestEdge = 'top';
    }
    if (this.contour.bounds.left <= this.stageBounds.left) {
      nearestEdge = 'left';
    }
    if (this.contour.bounds.right >= this.stageBounds.right) {
      nearestEdge = 'right';
    }
    if (this.contour.bounds.bottom >= this.stageBounds.bottom) {
      nearestEdge = 'bottom';
    }
    return nearestEdge;
  }

  async edgeBounce() {
    if (!this.contour) return;

    // Find the nearest edge.
    const nearestEdge = this.findNearestEdge();
    if (!nearestEdge) return; // Not touching any edge.

    // Point away from the nearest edge.
    const radians = degToRad(Runtime.DEFAULT_DIRECTION - this.direction);
    let dx = Math.cos(radians);
    let dy = -Math.sin(radians);
    if (nearestEdge === 'left') {
      dx = Math.max(0.2, Math.abs(dx));
    } else if (nearestEdge === 'top') {
      dy = Math.max(0.2, Math.abs(dy));
    } else if (nearestEdge === 'right') {
      dx = 0 - Math.max(0.2, Math.abs(dx));
    } else if (nearestEdge === 'bottom') {
      dy = 0 - Math.max(0.2, Math.abs(dy));
    }
    this.direction = radToDeg(Math.atan2(dy, dx)) + Runtime.DEFAULT_DIRECTION;

    // Keep within the stage.
    dx = 0;
    dy = 0;
    if (this.contour.bounds.top < this.stageBounds.top) {
      dy += this.stageBounds.top - this.contour.bounds.top;
    }
    if (this.contour.bounds.left < this.stageBounds.left) {
      dx += this.stageBounds.left - this.contour.bounds.left;
    }
    if (this.contour.bounds.right > this.stageBounds.right) {
      dx += this.stageBounds.right - this.contour.bounds.right;
    }
    if (this.contour.bounds.bottom > this.stageBounds.bottom) {
      dy += this.stageBounds.bottom - this.contour.bounds.bottom;
    }
    this.goto(this.x + dx, this.y - dy);
  }

  get dialog() {
    return this.dialogLayer.children[this.name];
  }

  createDialog(text, style = 'say') {
    this.removeDialog();
    if (!text || this.hidden) return;

    let clen = 0;
    let llen = 0;
    let line = '';
    const lines = [];
    for (let i = 0; i < text.length; i++) {
      clen = 1 + ~~((text.charCodeAt(i) & 0xff00) !== 0);
      if (llen + clen > LINE_MAX_CHARS) {
        lines.push(line);
        llen = 0;
        line = '';
      }
      llen += clen;
      line += text[i];
    }
    lines.push(line);

    const dialogText = new paperCore.PointText({
      content: lines.join('\n'),
      fontFamily: 'Monaco, Courier New, Consolas, Menlo, monospace',
      fillColor: '#575e75',
      fontSize: `${FONT_SIZE}px`,
    });

    let { width: w, height: h } = dialogText.bounds;
    w += DIALOG_PADDING * 2;
    h += DIALOG_PADDING * 2 + DIALOG_HANDLE_HEIGHT;
    if (w < DIALOG_MIN_WIDTH) w = DIALOG_MIN_WIDTH;
    if (h < DIALOG_MIN_HEIGHT) h = DIALOG_MIN_HEIGHT;

    const place = {
      y: 'top',
      x: 'Right',
    };
    let x = this.contour.bounds.right;
    let y = this.contour.bounds.top + DIALOG_PADDING;

    if (x + w - DIALOG_RADIUS > this.stageBounds.right) {
      place.x = 'Left';
      x = this.contour.bounds.left;
    }
    if (y - h < this.stageBounds.top) {
      place.y = 'bottom';
      y = this.contour.bounds.bottom - DIALOG_PADDING - DIALOG_HANDLE_HEIGHT;
    }

    const dialogSegments = {
      topRight: [
        ...(style === 'think' ? [] : [new paperCore.Point(x - 0.1 * DIALOG_RADIUS, y - 0.2 * DIALOG_RADIUS)]),
        new paperCore.Point(x, y - 0.8 * DIALOG_RADIUS),
        new paperCore.Segment(
          new paperCore.Point(x - DIALOG_RADIUS, y - 1.8 * DIALOG_RADIUS),
          new paperCore.Point(0, DIALOG_RADIUS),
        ),
        new paperCore.Point(x - DIALOG_RADIUS, y - h + DIALOG_RADIUS),
        new paperCore.Segment(new paperCore.Point(x, y - h), new paperCore.Point(-DIALOG_RADIUS, 0)),
        new paperCore.Point(x + w - DIALOG_RADIUS * 2, y - h),
        new paperCore.Segment(
          new paperCore.Point(x + w - DIALOG_RADIUS, y - h + DIALOG_RADIUS),
          new paperCore.Point(0, -DIALOG_RADIUS),
        ),
        new paperCore.Point(x + w - DIALOG_RADIUS, y - 1.8 * DIALOG_RADIUS),
        new paperCore.Segment(
          new paperCore.Point(x + w - DIALOG_RADIUS * 2, y - 0.8 * DIALOG_RADIUS),
          new paperCore.Point(DIALOG_RADIUS, 0),
        ),
        ...(style === 'think'
          ? [
              new paperCore.Point(x + 1.4 * DIALOG_RADIUS, y - 0.8 * DIALOG_RADIUS),
              new paperCore.Segment(
                new paperCore.Point(x, y - 0.8 * DIALOG_RADIUS),
                new paperCore.Point(0.7 * DIALOG_RADIUS, 0.8 * DIALOG_RADIUS),
              ),
            ]
          : [
              new paperCore.Point(x + 0.8 * DIALOG_RADIUS, y - 0.8 * DIALOG_RADIUS),
              new paperCore.Segment(
                new paperCore.Point(x + 0.1 * DIALOG_RADIUS, y - 0.1 * DIALOG_RADIUS),
                new paperCore.Point(0.2 * DIALOG_RADIUS, 0),
              ),
              new paperCore.Segment(
                new paperCore.Point(x - 0.1 * DIALOG_RADIUS, y - 0.2 * DIALOG_RADIUS),
                new paperCore.Point(0, 0.2 * DIALOG_RADIUS),
              ),
            ]),
      ],
      topLeft: [
        ...(style === 'think' ? [] : [new paperCore.Point(x + 0.1 * DIALOG_RADIUS, y - 0.2 * DIALOG_RADIUS)]),
        new paperCore.Point(x, y - 0.8 * DIALOG_RADIUS),
        new paperCore.Segment(
          new paperCore.Point(x + DIALOG_RADIUS, y - 1.8 * DIALOG_RADIUS),
          new paperCore.Point(0, DIALOG_RADIUS),
        ),
        new paperCore.Point(x + DIALOG_RADIUS, y - h + DIALOG_RADIUS),
        new paperCore.Segment(new paperCore.Point(x, y - h), new paperCore.Point(DIALOG_RADIUS, 0)),
        new paperCore.Point(x - w + DIALOG_RADIUS * 2, y - h),
        new paperCore.Segment(
          new paperCore.Point(x - w + DIALOG_RADIUS, y - h + DIALOG_RADIUS),
          new paperCore.Point(0, -DIALOG_RADIUS),
        ),
        new paperCore.Point(x - w + DIALOG_RADIUS, y - 1.8 * DIALOG_RADIUS),
        new paperCore.Segment(
          new paperCore.Point(x - w + DIALOG_RADIUS * 2, y - 0.8 * DIALOG_RADIUS),
          new paperCore.Point(-DIALOG_RADIUS, 0),
        ),
        ...(style === 'think'
          ? [
              new paperCore.Point(x - 1.4 * DIALOG_RADIUS, y - 0.8 * DIALOG_RADIUS),
              new paperCore.Segment(
                new paperCore.Point(x, y - 0.8 * DIALOG_RADIUS),
                new paperCore.Point(-0.7 * DIALOG_RADIUS, 0.8 * DIALOG_RADIUS),
              ),
            ]
          : [
              new paperCore.Point(x - 0.8 * DIALOG_RADIUS, y - 0.8 * DIALOG_RADIUS),
              new paperCore.Segment(
                new paperCore.Point(x - 0.1 * DIALOG_RADIUS, y - 0.1 * DIALOG_RADIUS),
                new paperCore.Point(-0.2 * DIALOG_RADIUS, 0),
              ),
              new paperCore.Segment(
                new paperCore.Point(x + 0.1 * DIALOG_RADIUS, y - 0.2 * DIALOG_RADIUS),
                new paperCore.Point(0, 0.2 * DIALOG_RADIUS),
              ),
            ]),
      ],
      bottomRight: [
        ...(style === 'think' ? [] : [new paperCore.Point(x - 0.1 * DIALOG_RADIUS, y + 0.2 * DIALOG_RADIUS)]),
        new paperCore.Point(x, y + 0.8 * DIALOG_RADIUS),
        new paperCore.Segment(
          new paperCore.Point(x - DIALOG_RADIUS, y + 1.8 * DIALOG_RADIUS),
          new paperCore.Point(0, -DIALOG_RADIUS),
        ),
        new paperCore.Point(x - DIALOG_RADIUS, y + h - DIALOG_RADIUS),
        new paperCore.Segment(new paperCore.Point(x, y + h), new paperCore.Point(-DIALOG_RADIUS, 0)),
        new paperCore.Point(x + w - DIALOG_RADIUS * 2, y + h),
        new paperCore.Segment(
          new paperCore.Point(x + w - DIALOG_RADIUS, y + h - DIALOG_RADIUS),
          new paperCore.Point(0, DIALOG_RADIUS),
        ),
        new paperCore.Point(x + w - DIALOG_RADIUS, y + 1.8 * DIALOG_RADIUS),
        new paperCore.Segment(
          new paperCore.Point(x + w - DIALOG_RADIUS * 2, y + 0.8 * DIALOG_RADIUS),
          new paperCore.Point(DIALOG_RADIUS, 0),
        ),
        ...(style === 'think'
          ? [
              new paperCore.Point(x + 1.4 * DIALOG_RADIUS, y + 0.8 * DIALOG_RADIUS),
              new paperCore.Segment(
                new paperCore.Point(x, y + 0.8 * DIALOG_RADIUS),
                new paperCore.Point(0.7 * DIALOG_RADIUS, -0.8 * DIALOG_RADIUS),
              ),
            ]
          : [
              new paperCore.Point(x + 0.8 * DIALOG_RADIUS, y + 0.8 * DIALOG_RADIUS),
              new paperCore.Segment(
                new paperCore.Point(x + 0.1 * DIALOG_RADIUS, y + 0.1 * DIALOG_RADIUS),
                new paperCore.Point(0.2 * DIALOG_RADIUS, 0),
              ),
              new paperCore.Segment(
                new paperCore.Point(x - 0.1 * DIALOG_RADIUS, y + 0.2 * DIALOG_RADIUS),
                new paperCore.Point(0, -0.2 * DIALOG_RADIUS),
              ),
            ]),
      ],
      bottomLeft: [
        ...(style === 'think' ? [] : [new paperCore.Point(x + 0.1 * DIALOG_RADIUS, y + 0.2 * DIALOG_RADIUS)]),
        new paperCore.Point(x, y + 0.8 * DIALOG_RADIUS),
        new paperCore.Segment(
          new paperCore.Point(x + DIALOG_RADIUS, y + 1.8 * DIALOG_RADIUS),
          new paperCore.Point(0, -DIALOG_RADIUS),
        ),
        new paperCore.Point(x + DIALOG_RADIUS, y + h - DIALOG_RADIUS),
        new paperCore.Segment(new paperCore.Point(x, y + h), new paperCore.Point(DIALOG_RADIUS, 0)),
        new paperCore.Point(x - w + DIALOG_RADIUS * 2, y + h),
        new paperCore.Segment(
          new paperCore.Point(x - w + DIALOG_RADIUS, y + h - DIALOG_RADIUS),
          new paperCore.Point(0, DIALOG_RADIUS),
        ),
        new paperCore.Point(x - w + DIALOG_RADIUS, y + 1.8 * DIALOG_RADIUS),
        new paperCore.Segment(
          new paperCore.Point(x - w + DIALOG_RADIUS * 2, y + 0.8 * DIALOG_RADIUS),
          new paperCore.Point(-DIALOG_RADIUS, 0),
        ),
        ...(style === 'think'
          ? [
              new paperCore.Point(x - 1.4 * DIALOG_RADIUS, y + 0.8 * DIALOG_RADIUS),
              new paperCore.Segment(
                new paperCore.Point(x, y + 0.8 * DIALOG_RADIUS),
                new paperCore.Point(-0.7 * DIALOG_RADIUS, -0.8 * DIALOG_RADIUS),
              ),
            ]
          : [
              new paperCore.Point(x - 0.8 * DIALOG_RADIUS, y + 0.8 * DIALOG_RADIUS),
              new paperCore.Segment(
                new paperCore.Point(x - 0.1 * DIALOG_RADIUS, y + 0.1 * DIALOG_RADIUS),
                new paperCore.Point(-0.2 * DIALOG_RADIUS, 0),
              ),
              new paperCore.Segment(
                new paperCore.Point(x + 0.1 * DIALOG_RADIUS, y + 0.2 * DIALOG_RADIUS),
                new paperCore.Point(0, -0.2 * DIALOG_RADIUS),
              ),
            ]),
      ],
    };

    const dialogShape = new paperCore.Path({
      segments: dialogSegments[`${place.y}${place.x}`],
      strokeWidth: 2,
      strokeColor: 'hsla(0, 0%, 0%, 0.15)',
      fillColor: '#ffffff',
    });

    let textY = dialogShape.bounds.top + DIALOG_PADDING + FONT_SIZE;
    dialogText.point = new paperCore.Point(
      dialogShape.bounds.left + DIALOG_PADDING,
      place.y === 'top' ? textY : style === 'think' ? textY + 0.2 * DIALOG_RADIUS : textY + DIALOG_HANDLE_HEIGHT - 2,
    );

    const dialogGroup = this.dialogLayer.addChild(
      new paperCore.Group({
        name: this.name,
        children: [dialogShape, dialogText],
        data: { style, text },
      }),
    );

    if (style === 'think') {
      const thinkArrow = {
        topRight: [x - 0.2 * DIALOG_RADIUS, y - 0.3 * DIALOG_RADIUS],
        topLeft: [x - 0.2 * DIALOG_RADIUS, y - 0.3 * DIALOG_RADIUS],
        bottomRight: [x - 0.2 * DIALOG_RADIUS, y - 0.3 * DIALOG_RADIUS],
        bottomLeft: [x - 0.2 * DIALOG_RADIUS, y - 0.3 * DIALOG_RADIUS],
      };
      dialogGroup.addChild(
        new paperCore.Path.Ellipse({
          point: thinkArrow[`${place.y}${place.x}`],
          size: [0.7 * DIALOG_RADIUS, 0.5 * DIALOG_RADIUS],
          strokeWidth: 2,
          strokeColor: 'hsla(0, 0%, 0%, 0.15)',
          fillColor: '#ffffff',
        }),
      );
    }
  }

  removeDialog() {
    if (this.dialog) {
      this.dialog.remove();
    }
  }

  async say(text, wait = 0) {
    if (!this.running) return;
    this.createDialog(text);
    if (wait > 0) {
      await sleep(wait * 1000);
      this.removeDialog();
    }
  }

  async think(text, wait = 0) {
    if (!this.running) return;
    this.createDialog(text, 'think');
    if (wait > 0) {
      await sleep(wait * 1000);
      this.removeDialog();
    }
  }

  get clones() {
    return this._clones;
  }

  clone() {
    if (SpriteUtil.CLONES.length < CLONES_COUNT_LIMIT) {
      const raster = this.raster.clone(false);
      const origin = raster.data.origin ? raster.data.origin : this;
      raster.data.origin = origin;
      raster.util = new SpriteUtil(raster);
      raster.util._runtime = origin.runtime;
      raster.util.createContour();
      raster.insertBelow(origin.raster);
      origin.runtime.emit(`clonestart:${origin.name}`, raster);
      origin.clones.push(raster);
      SpriteUtil.CLONES.push(raster);
    }
  }

  remove() {
    if (this.data.origin) {
      SpriteUtil.CLONES.splice(SpriteUtil.CLONES.indexOf(this.raster), 1);
      this.data.origin.clones.splice(this.data.origin.clones.indexOf(this.raster), 1);
      this.removeDialog();
      this.removeContour();
      this.raster.remove();
    }
  }

  isTouching(target, exact = false) {
    if (!target) {
      return !!this.findNearestEdge();
    }
    if (this.hidden) return false;
    for (const clone of target.clones) {
      if (clone.util.hidden) continue;
      if (touching(this.contour, clone.util.contour, exact)) {
        return true;
      }
    }
    if (target.hidden) return false;
    return touching(this.contour, target.contour, exact);
  }

  distanceTo(target) {
    if (!target) {
      target = { x: 0, y: 0 };
    }
    const dx = target.x - this.x;
    const dy = target.y - this.y;
    return Math.sqrt(dx * dx + dy * dy);
  }
}

export default function createUtil(raster, isStage = false) {
  return isStage ? new StageUtil(raster) : new SpriteUtil(raster);
}
