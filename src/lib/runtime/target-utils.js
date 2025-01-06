import { EventEmitter } from 'node:events';
import { batch } from '@preact/signals';
import { sleep, MathUtils } from '@blockcode/utils';
import { themeColors, openFile, setFile } from '@blockcode/core';
import { loadImageFromAsset } from '@blockcode/paint';
import { Konva } from '@blockcode/blocks';
import { RotationStyle, SpriteDefaultConfig } from '../../components/emulator/emulator-config';

const FontBubbleStyle = {
  // Bubble
  Fill: 'white',
  ShoutFill: '#ffffbb',
  SparkFill: '#ffcccc',
  Stroke: 'rgba(0, 0, 0, 0.15)',
  StrokeWidth: 2,
  MinWidth: 50,
  MaxLineWidth: 170,
  TailSize: 10,
  Radius: 14,
  // Font
  FontFamily: 'Helvetica',
  FontColor: '#575e75',
  FontSize: 12,
  LargeFontSize: 16,
  LineHeight: 1.2,
  Padding: 8,
  // Bubble style
  Talking: false,
  Thinking: true,
};

const MAX_CLONES_LIMIT = 30;

export class TargetUtils extends EventEmitter {
  constructor(runtime) {
    super();
    this._runtime = runtime;
  }

  get runtime() {
    return this._runtime;
  }

  get running() {
    return this.runtime.running;
  }

  get assets() {
    return this.runtime.assets;
  }

  get stage() {
    return this.runtime.stage;
  }

  get backdropLayer() {
    return this.runtime.backdropLayer;
  }

  get paintLayer() {
    return this.runtime.paintLayer;
  }

  get spritesLayer() {
    return this.runtime.spritesLayer;
  }

  get boardLayer() {
    return this.runtime.boardLayer;
  }

  // 编辑操作

  // 重新绘制
  redraw(target) {
    target.clearCache();
    target.cache();
    target.drawHitFromCache();
  }

  // 拖拽开始时激活角色
  active(target) {
    openFile(target.id());
    target.moveToTop();
    target.setAttrs({
      shadowColor: 'black',
      shadowOpacity: 0.5,
    });
    this.redraw(target);
  }

  // 拖拽角色并更新坐标
  dragdrop(target, x, y) {
    const pos = this.stage.getPointerPosition();
    if (pos.x > 0 && pos.x < this.stage.width() && pos.y > 0 && pos.y < this.stage.height()) {
      batch(() => {
        setFile({
          id: target.id(),
          x: Math.round(target.x()),
          y: Math.round(target.y()),
        });
        for (const node of this.spritesLayer.children) {
          setFile({
            id: node.id(),
            zIndex: node.zIndex(),
          });
        }
      });
    } else {
      target.position({ x, y });
    }
    target.setAttrs({
      shadowColor: 'transparent',
      shadowOpacity: 0,
    });
    this.redraw(target);
  }

  // 高亮角色
  highlight(target) {
    const clientRect = target.getClientRect({ relativeTo: this.stage });
    const fillRGB = Konva.Util.getRGB(themeColors.ui.theme.highlight);
    const rect = new Konva.Rect({
      x: clientRect.x,
      y: clientRect.y,
      width: clientRect.width,
      height: clientRect.height,
      fill: `rgba(${fillRGB.r} ${fillRGB.g} ${fillRGB.b} / 0.5)`,
      stroke: themeColors.ui.theme.primary,
      strokeWidth: 2,
      cornerRadius: 6,
    });
    this.boardLayer.add(rect);
    rect.tween = new Konva.Tween({
      node: rect,
      opacity: 0,
      easing: Konva.Easings.EaseOut,
      duration: 0.5,
    });
    rect.tween.play();
    setTimeout(() => rect.destroy(), 1000);
  }

  // 变量和列表
  //

  // 定义变量
  defVariable(target, name, value) {
    target.setAttr(`$${name}`, value);
  }

  // 设置变量值
  setVariable(target, stage, name, value) {
    if (!this.running) return;
    if (target.getAttr(`$${name}`) == null) {
      stage.setAttr(`$${name}`, value);
    } else {
      target.setAttr(`$${name}`, value);
    }
  }

  // 获取变量值
  getVariable(target, stage, name) {
    if (target.getAttr(`$${name}`) == null) {
      return stage.getAttr(`$${name}`);
    } else {
      return target.getAttr(`$${name}`);
    }
  }

  // 增加变量值
  incVariable(target, stage, name, value) {
    if (!this.running) return;
    const oldValue = MathUtils.toNumber(this.getVariable(target, stage, name));
    const addValue = MathUtils.toNumber(value);
    this.setVariable(target, stage, name, oldValue + addValue);
  }

  // 向列表尾添加值
  pushValueToList(target, stage, name, value) {
    if (!this.running) return;
    const list = this.getVariable(target, stage, name);
    if (Array.isArray(list)) {
      list.push(value);
      this.setVariable(target, stage, name, list);
    }
  }

  // 向列表添加值
  insertValueToList(target, stage, name, index, value) {
    if (!this.running) return;
    const list = this.getVariable(target, stage, name);
    if (Array.isArray(list)) {
      list.splice(index, 0, value);
      this.setVariable(target, stage, name, list);
    }
  }

  setValueToList(target, stage, name, index, value) {
    if (!this.running) return;
    const list = this.getVariable(target, stage, name);
    if (Array.isArray(list)) {
      list[index] = value;
      this.setVariable(target, stage, name, list);
    }
  }

  delAllFromList(target, stage, name) {
    if (!this.running) return;
    const list = this.getVariable(target, stage, name);
    if (Array.isArray(list)) {
      list.length = 0;
      this.setVariable(target, stage, name, list);
    }
  }

  delValueFromList(target, stage, name, index) {
    if (!this.running) return;
    const list = this.getVariable(target, stage, name);
    if (Array.isArray(list)) {
      list.splice(index, 1);
      this.setVariable(target, stage, name, list);
    }
  }

  getValueFromList(target, stage, name, index) {
    if (!this.running) return;
    const list = this.getVariable(target, stage, name);
    if (Array.isArray(list)) {
      return list[index] ?? '';
    }
    return '';
  }

  getLengthOfList(target, stage, name) {
    if (!this.running) return;
    const list = this.getVariable(target, stage, name);
    if (Array.isArray(list)) {
      return list.length;
    }
    return 0;
  }

  findValueFromList(target, stage, name, value) {
    if (!this.running) return;
    const list = this.getVariable(target, stage, name);
    if (Array.isArray(list)) {
      const index = list.indexOf(value);
      if (index === -1) return 0;
      return MathUtils.indexToSerial(index, list.length);
    }
    return 0;
  }

  // 角色运动
  //

  // 移动n步
  moveSteps(target, steps) {
    if (!this.running) return;
    const direction = target.getAttr('direction');
    const radian = MathUtils.degToRad(SpriteDefaultConfig.Direction - direction);
    const stepsValue = MathUtils.toNumber(steps);
    const dx = stepsValue * Math.cos(radian);
    const dy = stepsValue * Math.sin(radian);
    this.moveTo(target, target.x() + dx, target.y() + dy);
  }

  // 右转n度
  turnRight(target, deg) {
    if (!this.running) return;
    const degValue = MathUtils.toNumber(deg);
    const direction = target.getAttr('direction');
    this.towardsTo(target, direction + degValue);
  }

  // 左转n度
  turnLeft(target, deg) {
    if (!this.running) return;
    const degValue = MathUtils.toNumber(deg);
    this.turnRight(target, -degValue);
  }

  // 移动到位置
  moveToTarget(target, target2) {
    if (!this.running) return;

    let pos = target2?.position?.();
    target2 = this.runtime.querySelector(`#${target2}`);

    // 随机位置
    if (!pos) {
      const widthEdge = this.stage.width() / 2;
      const heightEdge = this.stage.height() / 2;
      pos = {
        x: MathUtils.random(-widthEdge, widthEdge),
        y: MathUtils.random(-heightEdge, heightEdge),
      };
    }
    this.moveTo(target, pos.x, pos.y);
  }

  // 移动到xy
  moveTo(target, x, y) {
    if (!this.running) return;
    const pos = {
      x: MathUtils.toNumber(x),
      y: MathUtils.toNumber(y),
    };
    target.position(pos);
    this._updateDialog(target);
    this.runtime.update(target);
  }

  // 滑行到位置
  glideToTarget(target, signal, sec, target2) {
    if (!this.running) return;

    let pos = target2?.position?.();
    target2 = this.runtime.querySelector(`#${target2}`);

    // 随机位置
    if (!pos) {
      const widthEdge = this.stage.width() / 2;
      const heightEdge = this.stage.height() / 2;
      pos = {
        x: MathUtils.random(-widthEdge, widthEdge),
        y: MathUtils.random(-heightEdge, heightEdge),
      };
    }
    return this.glideTo(target, signal, sec, pos.x, pos.y);
  }

  // 滑行到xy
  glideTo(target, signal, sec, x, y, warpMode) {
    if (!this.running) return;

    const secValue = MathUtils.toNumber(sec);
    const xValue = MathUtils.toNumber(x);
    const yValue = MathUtils.toNumber(y);

    if (secValue <= 0) {
      this.moveTo(target, xValue, yValue);
      return;
    }

    return new Promise(async (resolve) => {
      // 中止滑行
      const handleAbort = () => {
        signal.off('abort', handleAbort);
        handleAbort.stopped = true;
        resolve();
      };
      signal.once('abort', handleAbort);

      const duration = secValue * 1000;
      const startx = target.x();
      const starty = target.y();
      const dx = xValue - startx;
      const dy = yValue - starty;

      let frac;
      let elapsed = 0;
      let start = Date.now();

      while (!handleAbort.stopped) {
        elapsed = Date.now() - start;
        if (elapsed < duration) {
          frac = elapsed / duration;
          this.moveTo(target, startx + dx * frac, starty + dy * frac);
        } else {
          this.moveTo(target, xValue, yValue);
          break;
        }
        if (warpMode) continue;
        await this.runtime.nextFrame();
      }
      signal.off('abort', handleAbort);
      resolve();
    });
  }

  // 旋转
  _rotate(target, direction, rotationStyle) {
    direction = MathUtils.wrapClamp(direction, -179, 180);

    // 根据不同旋转方式产生不同旋转效果
    let rotation = 0;
    let scale = Math.abs(target.scaleX());
    if (rotationStyle === RotationStyle.AllAround) {
      // 每30度转动
      rotation = SpriteDefaultConfig.Direction - Math.round(direction / 30) * 30;
    } else if (rotationStyle === RotationStyle.HorizontalFlip) {
      // 镜像
      if (direction < 0) {
        scale = -scale;
      }
    }

    target.setAttrs({
      scaleX: scale,
      rotation,
      direction,
      rotationStyle,
    });
    this.runtime.update(target);
  }

  // 面向n方向
  towardsTo(target, direction) {
    if (!this.running) return;
    const directionValue = MathUtils.toNumber(direction);
    const rotationStyle = target.getAttr('rotationStyle');
    this._rotate(target, directionValue, rotationStyle);
  }

  // 面向位置
  towardsToTarget(target, target2) {
    if (!this.running) return;

    target2 = this.runtime.querySelector(`#${target2}`);

    // 随机方向
    if (!target2) {
      this.towardsTo(target, MathUtils.random(0, 359));
      return;
    }

    const pos = target2.position();
    const dx = pos.x - target.x();
    const dy = pos.y - target.y();
    const direction = MathUtils.radToDeg(Math.atan2(dy, dx));
    this.towardsTo(target, direction);
  }

  // 增加x坐标
  addX(target, x) {
    if (!this.running) return;
    const xValue = MathUtils.toNumber(x);
    this.moveTo(target, target.x() + xValue, target.y());
  }

  // 设置x坐标
  setX(target, x) {
    if (!this.running) return;
    this.moveTo(target, MathUtils.toNumber(x), target.y());
  }

  // 增加y坐标
  addY(target, y) {
    if (!this.running) return;
    const yValue = MathUtils.toNumber(y);
    this.moveTo(target, target.x(), target.y() + yValue);
  }

  // 设置y坐标
  setY(target, y) {
    if (!this.running) return;
    this.moveTo(target, target.x(), MathUtils.toNumber(y));
  }

  // 寻找最接近的边缘
  _findNearestEdge(target) {
    const clientRect = target.getClientRect();
    const width = this.stage.width();
    const height = this.stage.height();

    const leftDist = clientRect.x;
    const topDist = clientRect.y;
    const rightDist = width - (clientRect.x + clientRect.width);
    const bottomDist = height - (clientRect.y + clientRect.height);

    let nearestEdge;
    let minDist = Infinity;
    if (leftDist < minDist) {
      minDist = leftDist;
      nearestEdge = 'left';
    }
    if (topDist < minDist) {
      minDist = topDist;
      nearestEdge = 'top';
    }
    if (rightDist < minDist) {
      minDist = rightDist;
      nearestEdge = 'right';
    }
    if (bottomDist < minDist) {
      minDist = bottomDist;
      nearestEdge = 'bottom';
    }
    if (minDist > 0) return;
    return nearestEdge;
  }

  // 碰到边缘反弹
  edgeBounce(target) {
    if (!this.running) return;

    // 查询靠近的边缘
    const nearestEdge = this._findNearestEdge(target);
    if (!nearestEdge) return; // 没有碰到任何边

    // 根据靠近的边缘转向
    let direction = target.getAttr('direction');
    const radians = MathUtils.degToRad(SpriteDefaultConfig.Direction - direction);
    const rotationStyle = target.getAttr('rotationStyle');

    let dx = Math.cos(radians);
    let dy = -Math.sin(radians);
    if (nearestEdge === 'left') {
      dx = Math.max(0.2, Math.abs(dx));
    } else if (nearestEdge === 'right') {
      dx = 0 - Math.max(0.2, Math.abs(dx));
    } else if (nearestEdge === 'top') {
      dy = Math.max(0.2, Math.abs(dy));
    } else if (nearestEdge === 'bottom') {
      dy = 0 - Math.max(0.2, Math.abs(dy));
    }
    direction = MathUtils.radToDeg(Math.atan2(dy, dx)) + SpriteDefaultConfig.Direction;
    this._rotate(target, direction, rotationStyle);

    // 让角色保持在边界内
    // const clientRect = target.getClientRect();
    // const width = this.stage.width();
    // const height = this.stage.height();
    // const right = clientRect.x + clientRect.width;
    // const bottom = clientRect.y + clientRect.height;

    // dx = 0;
    // dy = 0;
    // if (clientRect.x < 0) {
    //   dx += clientRect.x;
    // }
    // if (right > width) {
    //   dx += width - right;
    // }
    // if (clientRect.y < 0) {
    //   dy += clientRect.y;
    // }
    // if (bottom > height) {
    //   dy += bottom - height;
    // }
    // this.moveTo(target, target.x() + dx, target.y() + dy);
  }

  // 设置旋转模式
  setRotationStyle(target, rotationStyle) {
    if (!this.running) return;
    const direction = target.getAttr('direction');
    this._rotate(target, direction, rotationStyle);
  }

  // 角色外观
  //

  // 生成对话泡泡
  _dialog(target, thinkingStyle = false, strikingStyle = false) {
    const text = new Konva.Text({
      text: '',
      width: FontBubbleStyle.MaxLineWidth,
      fontSize: strikingStyle ? FontBubbleStyle.LargeFontSize : FontBubbleStyle.FontSize,
      fontFamily: FontBubbleStyle.FontFamily,
      lineHeight: FontBubbleStyle.LineHeight,
      fill: FontBubbleStyle.FontColor,
      padding: FontBubbleStyle.Padding,
      scaleY: this.stage.scaleY(),
      align: 'left',
    });

    const bubble = new Konva.Shape({
      width: 50,
      height: text.height() + FontBubbleStyle.TailSize,
      fill: 'white',
      stroke: 'rgba(0, 0, 0, 0.15)',
      strokeWidth: 3,
      lineJoin: 'round',
      lineCap: 'round',
      thinking: thinkingStyle,
      sceneFunc(ctx, shape) {
        const width = shape.width();
        const height = shape.height();

        ctx.beginPath();
        ctx.moveTo(FontBubbleStyle.Radius, FontBubbleStyle.TailSize);
        // 左下角
        ctx.arcTo(
          0,
          FontBubbleStyle.TailSize,
          0,
          FontBubbleStyle.TailSize + FontBubbleStyle.Radius,
          FontBubbleStyle.Radius,
        );
        // 左边
        ctx.lineTo(0, height - FontBubbleStyle.Radius);
        // 左上角
        ctx.arcTo(0, height, FontBubbleStyle.Radius, height, FontBubbleStyle.Radius);
        // 上边
        ctx.lineTo(width - FontBubbleStyle.Radius, height);
        // 右上角
        ctx.arcTo(width, height, width, height - FontBubbleStyle.Radius, FontBubbleStyle.Radius);
        // 右边
        ctx.lineTo(width, FontBubbleStyle.TailSize + FontBubbleStyle.Radius);
        // 右下角
        ctx.arcTo(
          width,
          FontBubbleStyle.TailSize,
          width - FontBubbleStyle.Radius,
          FontBubbleStyle.TailSize,
          FontBubbleStyle.Radius,
        );
        // 下边
        ctx.lineTo(FontBubbleStyle.Radius + FontBubbleStyle.TailSize * 1.5, FontBubbleStyle.TailSize);
        // 尾巴
        if (shape.getAttr('thinking')) {
          ctx.ellipse(
            FontBubbleStyle.Radius + FontBubbleStyle.TailSize,
            FontBubbleStyle.TailSize,
            FontBubbleStyle.TailSize / 2,
            FontBubbleStyle.TailSize / 3,
            0,
            0,
            Math.PI,
            true,
          );
          ctx.moveTo(FontBubbleStyle.Radius + FontBubbleStyle.TailSize / 2, FontBubbleStyle.TailSize);
          ctx.lineTo(FontBubbleStyle.Radius, FontBubbleStyle.TailSize);
          ctx.closePath();

          ctx.moveTo(FontBubbleStyle.Radius + FontBubbleStyle.TailSize / 3, FontBubbleStyle.TailSize / 3);
          ctx.ellipse(
            FontBubbleStyle.Radius,
            FontBubbleStyle.TailSize / 3,
            FontBubbleStyle.TailSize / 2.5,
            FontBubbleStyle.TailSize / 3.5,
            0,
            0,
            2 * Math.PI,
          );

          ctx.moveTo(FontBubbleStyle.Radius / 3 + FontBubbleStyle.TailSize / 4, 0);
          ctx.ellipse(
            FontBubbleStyle.Radius / 3,
            0,
            FontBubbleStyle.TailSize / 4,
            FontBubbleStyle.TailSize / 5,
            0,
            0,
            2 * Math.PI,
          );
        } else {
          ctx.quadraticCurveTo(FontBubbleStyle.Radius + FontBubbleStyle.TailSize / 2, 0, FontBubbleStyle.Radius / 2, 0);
          ctx.lineTo(FontBubbleStyle.Radius, FontBubbleStyle.TailSize);
        }

        ctx.fillStrokeShape(shape);
      },
    });

    const dialog = new Konva.Group({
      id: `${target.id()}_dialog`,
      transformsEnabled: 'position',
    });

    // 显示对话泡泡
    dialog.add(bubble);
    dialog.add(text);
    this.boardLayer.add(dialog);
    return dialog;
  }

  // 更新对话泡泡
  _updateDialog(target, message, thinkingStyle, strikingStyle) {
    const dialog = target.getAttr('dialog');
    if (!dialog) return;

    const [bubble, text] = dialog.children;

    // 修改样式
    if (typeof thinkingStyle === 'boolean') {
      bubble.setAttr('thinking', thinkingStyle);
    }
    if (typeof strikingStyle === 'boolean') {
      text.fontSize(strikingStyle ? FontBubbleStyle.LargeFontSize : FontBubbleStyle.FontSize);
      if (strikingStyle) {
        bubble.setAttr('fill', thinkingStyle ? FontBubbleStyle.SparkFill : FontBubbleStyle.ShoutFill);
      } else {
        bubble.setAttr('fill', 'white');
      }
    }

    // 更新文字
    if (message) {
      text.width(FontBubbleStyle.MaxLineWidth);
      text.text(message);

      // 单行文本时适应文本宽度。
      const textWidth = text.getTextWidth();
      const fontHeight = text.fontSize() * text.lineHeight();
      if (text.height() < fontHeight * 2 + text.padding() * 2) {
        text.width(2 + textWidth + text.padding() * 2);
      }

      bubble.setAttrs({
        width: Math.max(50, text.width()),
        height: text.height() + FontBubbleStyle.TailSize,
      });
    }

    // 修改位置
    const offsetScale = Math.abs(target.scaleX());
    const offsetX = (target.width() * offsetScale) / 2 - FontBubbleStyle.Radius;
    let x = target.x() + offsetX;
    let y = target.y() + (target.height() * offsetScale) / 2;

    // 避免对话框超出舞台右边缘
    bubble.scaleX(1);
    if (
      x + target.width() - FontBubbleStyle.Radius - FontBubbleStyle.TailSize + bubble.width() >
      this.stage.width() / 2
    ) {
      bubble.scaleX(-1);
      x = target.x() - offsetX;
    }

    // 避免对话框超出舞台顶部
    if (y + bubble.height() > this.stage.height() / 2) {
      const offsetY = y + bubble.height() - this.stage.height() / 2;
      y -= offsetY;
    }

    // 修正对话框方向
    if (bubble.scaleY() > 0) {
      text.offsetY(bubble.height());
    } else {
      text.offsetY(-FontBubbleStyle.TailSize);
    }
    if (bubble.scaleX() < 0) {
      text.offsetX(bubble.width());
    }

    // 移动对话框
    dialog.position({ x, y });
  }

  _textBubble(target, signal, message, sec, thinkingStyle, strikingStyle) {
    if (!this.running) return;

    let dialog = target.getAttr('dialog');
    if (!dialog) {
      dialog = this._dialog(target, thinkingStyle, strikingStyle);
      target.setAttr('dialog', dialog);
    }
    this._updateDialog(target, message, thinkingStyle, strikingStyle);
    dialog.visible(true);

    const secValue = MathUtils.toNumber(sec);
    if (!secValue) return;

    return new Promise(async (resolve) => {
      const handleAbort = () => {
        signal.off('abort', handleAbort);
        resolve();
      };
      signal.once('abort', handleAbort);

      await sleep(secValue);
      dialog.visible(false);

      signal.off('abort', handleAbort);
      resolve();
    });
  }

  // 说
  say(target, signal, message, sec = 0, isShout = false) {
    if (!this.running) return;
    return this._textBubble(target, signal, message, sec, FontBubbleStyle.Talking, isShout);
  }

  // 思考
  think(target, signal, message, sec = 0, isSpark = false) {
    if (!this.running) return;
    return this._textBubble(target, signal, message, sec, FontBubbleStyle.Thinking, isSpark);
  }

  // 切换造型/背景
  switchFrameTo(target, signal, idOrSerial) {
    if (!this.running) return;

    const frames = target.getAttr('frames');
    let frameId = idOrSerial;

    // 通过 Serial 查 ID
    if (!isNaN(idOrSerial)) {
      const index = MathUtils.serialToIndex(MathUtils.toNumber(idOrSerial), frames.length);
      frameId = frames[index];
    }
    const asset = this.assets.find((res) => res.id === frameId);
    if (!asset) return;

    return new Promise(async (resolve) => {
      const handleAbort = () => {
        signal.off('abort', handleAbort);
        resolve();
      };
      signal.once('abort', handleAbort);

      const image = await loadImageFromAsset(asset);
      target.clearCache();
      target.setAttrs({
        image,
        offsetX: asset.centerX,
        offsetY: asset.centerY,
        frameIndex: frames.indexOf(frameId),
      });
      target.cache();
      this.runtime.update(target);

      signal.off('abort', handleAbort);
      resolve();
    });
  }

  // 下一个造型/背景
  nextFrame(target, signal) {
    if (!this.running) return;
    const frames = target.getAttr('frames');
    const frameIndex = target.getAttr('frameIndex');
    const serial = MathUtils.indexToSerial(frameIndex, frames.length);
    return this.switchFrameTo(target, signal, serial + 1);
  }

  // 增加大小
  addSize(target, size) {
    let sizeValue = MathUtils.toNumber(size);
    sizeValue += target.getAttr('scaleSize');
    this.setSize(target, sizeValue);
  }

  // 设置大小
  setSize(target, size) {
    if (!this.running) return;

    let sizeValue = MathUtils.toNumber(size);

    // 整倍缩放,缩放最大不能超过屏幕且不能小于1，最小0.5
    const image = target.image();
    let maxScale = Math.min(this.stage.width() / image.width, this.stage.height() / image.height);
    let scale = MathUtils.clamp(Math.floor(sizeValue / 100), 0.5, Math.max(1, Math.floor(maxScale)));

    // 是否要镜像
    if (
      target.getAttr('rotationStyle') === RotationStyle.HorizontalFlip &&
      MathUtils.wrapClamp(target.getAttr('direction'), -179, 180) < 0
    ) {
      scale = -scale;
    }

    target.setAttrs({
      scaleSize: sizeValue,
      scaleX: scale,
      scaleY: this.stage.scaleY() * Math.abs(scale),
    });
    this.runtime.update(target);
  }

  // 往前移层
  forward(target, zindex) {
    let zindexValue = MathUtils.toNumber(zindex);
    zindexValue = target.zIndex() + zindexValue;
    target.zIndex(MathUtils.clamp(zindexValue, 0, this.spritesLayer.children.length - 1));
    this.runtime.update(target);
  }

  // 往后移层
  backward(target, zindex) {
    const zindexValue = MathUtils.toNumber(zindex);
    this.forward(target, -zindexValue);
  }

  getFrameSerialOrName(target, serialOrName) {
    const frames = target.getAttr('frames');
    const frameIndex = target.getAttr('frameIndex');

    if (serialOrName !== 'name') {
      return MathUtils.indexToSerial(frameIndex, frames.length);
    }

    const frameId = frames[frameIndex];
    const asset = this.assets.find((res) => res.id === frameId);
    return asset.name;
  }

  // TODO: 舞台外观
  //

  // 控制
  //

  // 克隆
  clone(target) {
    if (!this.running) return;

    const clones = this.runtime.querySelectorAll('.clone');
    if (clones.length >= MAX_CLONES_LIMIT) return;

    if (typeof target === 'string') {
      target = this.runtime.querySelector(`#${target}`);
    }

    const clone = target.clone({
      id: null,
      name: `clone ${target.id()}`,
    });
    this.spritesLayer.add(clone);
    this.runtime.run(`clonestart:${target.id()}`, clone);

    // 重新设置zindex
    clone.zIndex(Math.max(target.zIndex() - 1, 0));
  }
}