import { EventEmitter } from 'node:events';
import { batch } from '@preact/signals';
import { sleep, MathUtils, Konva } from '@blockcode/utils';
import { themeColors, openFile, setFile } from '@blockcode/core';
import { loadImageFromAsset } from '@blockcode/paint';
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
  defVariable(target, id, value) {
    target.setAttr(id, value);
  }

  // 设置变量值
  setVariable(userscript, id, value) {
    if (userscript.aborted) return;
    if (userscript.target.getAttr(id) == null) {
      userscript.stage.setAttr(id, value);
    } else {
      userscript.target.setAttr(id, value);
    }
    this.runtime.setMonitorValueById(id, value);
  }

  // 获取变量值
  getVariable(userscript, id) {
    if (userscript.aborted) return;
    if (userscript.target.getAttr(id) == null) {
      return userscript.stage.getAttr(id);
    } else {
      return userscript.target.getAttr(id);
    }
  }

  // 增加变量值
  incVariable(userscript, id, value) {
    if (userscript.aborted) return;
    const oldValue = MathUtils.toNumber(this.getVariable(userscript, id));
    const addValue = MathUtils.toNumber(value);
    this.setVariable(userscript, id, oldValue + addValue);
  }

  // 向列表尾添加值
  pushValueToList(userscript, id, value) {
    if (userscript.aborted) return;
    const list = this.getVariable(userscript, id);
    if (Array.isArray(list)) {
      list.push(value);
      this.setVariable(userscript, id, list);
    }
  }

  // 向列表添加值
  insertValueToList(userscript, id, index, value) {
    if (userscript.aborted) return;
    const list = this.getVariable(userscript, id);
    if (Array.isArray(list)) {
      list.splice(index, 0, value);
      this.setVariable(userscript, id, list);
    }
  }

  setValueToList(userscript, id, index, value) {
    if (userscript.aborted) return;
    const list = this.getVariable(userscript, id);
    if (Array.isArray(list)) {
      list[index] = value;
      this.setVariable(userscript, id, list);
    }
  }

  delAllFromList(userscript, id) {
    if (userscript.aborted) return;
    const list = this.getVariable(userscript, id);
    if (Array.isArray(list)) {
      list.length = 0;
      this.setVariable(userscript, id, list);
    }
  }

  delValueFromList(userscript, id, index) {
    if (userscript.aborted) return;
    const list = this.getVariable(userscript, id);
    if (Array.isArray(list)) {
      list.splice(index, 1);
      this.setVariable(userscript, id, list);
    }
  }

  getValueFromList(userscript, id, index) {
    if (userscript.aborted) return;
    const list = this.getVariable(userscript, id);
    if (Array.isArray(list)) {
      return list[index] ?? '';
    }
    return '';
  }

  getLengthOfList(userscript, id) {
    if (userscript.aborted) return;
    const list = this.getVariable(userscript, id);
    if (Array.isArray(list)) {
      return list.length;
    }
    return 0;
  }

  findValueFromList(userscript, id, value) {
    if (userscript.aborted) return;
    const list = this.getVariable(userscript, id);
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
  moveSteps(userscript, steps) {
    if (userscript.aborted) return;
    const target = userscript.target;
    const direction = target.getAttr('direction');
    const radian = MathUtils.degToRad(SpriteDefaultConfig.Direction - direction);
    const stepsValue = MathUtils.toNumber(steps);
    const dx = stepsValue * Math.cos(radian);
    const dy = stepsValue * Math.sin(radian);
    this.moveTo(userscript, target.x() + dx, target.y() + dy);
  }

  // 右转n度
  turnRight(userscript, deg) {
    if (userscript.aborted) return;
    const degValue = MathUtils.toNumber(deg);
    const direction = userscript.target.getAttr('direction');
    this.towardsTo(userscript, direction + degValue);
  }

  // 左转n度
  turnLeft(userscript, deg) {
    if (userscript.aborted) return;
    const degValue = MathUtils.toNumber(deg);
    this.turnRight(userscript, -degValue);
  }

  // 移动到xy
  moveTo(userscript, x, y) {
    if (userscript.aborted) return;

    const target = userscript.target;
    const pos = target.position();
    const xValue = MathUtils.toNumber(x);
    const yValue = MathUtils.toNumber(y);
    let dx = xValue - pos.x;
    let dy = (yValue - pos.y) * this.stage.scaleY();

    // 避免角色移动到舞台外面
    const fencingMode = userscript.stage.getAttr('fencingMode');
    if (fencingMode !== false) {
      const clientRect = target.getClientRect();
      const left = -clientRect.width * 0.8;
      const right = this.stage.width() - clientRect.width * 0.2;
      const top = -clientRect.height * 0.8;
      const bottom = this.stage.height() - clientRect.height * 0.2;
      const px = clientRect.x + dx;
      const py = clientRect.y + dy;
      if (px < left) {
        dx = left - clientRect.x;
      }
      if (px > right) {
        dx = right - clientRect.x;
      }
      if (py < top) {
        dy = top - clientRect.y;
      }
      if (py > bottom) {
        dy = bottom - clientRect.y;
      }
    }

    pos.x += dx;
    pos.y += -dy;

    target.position(pos);
    this._updateDialog(target);
    this.runtime.update(target);
    this.emit('update', target);

    const id = target.id();
    this.runtime.setMonitorValueById(`${id}.motion_xposition`);
    this.runtime.setMonitorValueById(`${id}.motion_yposition`);
  }

  // 移动到位置
  moveToTarget(userscript, targetId) {
    if (userscript.aborted) return;

    const target = this.runtime.querySelector(`#${targetId}`);
    let pos = target?.position();

    // 随机位置
    if (!pos) {
      const widthEdge = this.stage.width() / 2;
      const heightEdge = this.stage.height() / 2;
      pos = {
        x: MathUtils.random(-widthEdge, widthEdge),
        y: MathUtils.random(-heightEdge, heightEdge),
      };
    }
    this.moveTo(userscript, pos.x, pos.y);
  }

  // 滑行到xy
  async glideTo(userscript, sec, x, y) {
    if (userscript.aborted) return;

    const secValue = MathUtils.toNumber(sec);
    const xValue = MathUtils.toNumber(x);
    const yValue = MathUtils.toNumber(y);
    if (secValue <= 0) {
      this.moveTo(userscript, xValue, yValue);
      return;
    }

    const target = userscript.target;
    const duration = secValue * 1000;
    const startx = target.x();
    const starty = target.y();
    const dx = xValue - startx;
    const dy = yValue - starty;

    let frac;
    let elapsed = 0;
    let start = Date.now();
    while (!userscript.aborted) {
      elapsed = Date.now() - start;
      if (elapsed < duration) {
        frac = elapsed / duration;
        this.moveTo(userscript, startx + dx * frac, starty + dy * frac);
      } else {
        this.moveTo(userscript, xValue, yValue);
        break;
      }
      if (!userscript.warpMode) {
        await this.runtime.nextFrame();
      }
    }
  }

  // 滑行到位置
  glideToTarget(userscript, sec, targetId) {
    if (userscript.aborted) return;

    const target = this.runtime.querySelector(`#${targetId}`);
    let pos = target?.position();

    // 随机位置
    if (!pos) {
      const widthEdge = this.stage.width() / 2;
      const heightEdge = this.stage.height() / 2;
      pos = {
        x: MathUtils.random(-widthEdge, widthEdge),
        y: MathUtils.random(-heightEdge, heightEdge),
      };
    }
    return this.glideTo(userscript, sec, pos.x, pos.y);
  }

  // 旋转
  _rotate(target, direction, rotationStyle) {
    direction = MathUtils.wrapClamp(direction, -179, 180);

    // 根据不同旋转方式产生不同旋转效果
    let rotation = 0;
    let scale = Math.abs(target.scaleX());
    if (rotationStyle === RotationStyle.AllAround) {
      rotation = SpriteDefaultConfig.Direction - direction;
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
    this._updateDialog(target);
    this.runtime.update(target);
    this.emit('update', target);
  }

  // 面向n方向
  towardsTo(userscript, direction) {
    if (userscript.aborted) return;
    const target = userscript.target;
    const directionValue = MathUtils.toNumber(direction);
    const rotationStyle = target.getAttr('rotationStyle');
    this._rotate(target, directionValue, rotationStyle);
    this.runtime.setMonitorValueById(`${target.id()}.motion_direction`);
  }

  // 面向位置
  towardsToTarget(userscript, targetId) {
    if (userscript.aborted) return;

    const target = this.runtime.querySelector(`#${targetId}`);

    // 随机方向
    if (!target) {
      this.towardsTo(userscript, MathUtils.random(0, 359));
      return;
    }

    const pos = target.position();
    const dx = pos.x - userscript.target.x();
    const dy = pos.y - userscript.target.y();
    const direction = SpriteDefaultConfig.Direction - MathUtils.radToDeg(Math.atan2(dy, dx));
    this.towardsTo(userscript, direction);
  }

  // 增加x坐标
  addX(userscript, x) {
    if (userscript.aborted) return;
    const xValue = MathUtils.toNumber(x) + userscript.target.x();
    this.moveTo(userscript, xValue, userscript.target.y());
  }

  // 设置x坐标
  setX(userscript, x) {
    if (userscript.aborted) return;
    this.moveTo(userscript, MathUtils.toNumber(x), userscript.target.y());
  }

  // 增加y坐标
  addY(userscript, y) {
    if (userscript.aborted) return;
    const yValue = MathUtils.toNumber(y) + userscript.target.y();
    this.moveTo(userscript, userscript.target.x(), yValue);
  }

  // 设置y坐标
  setY(userscript, y) {
    if (userscript.aborted) return;
    this.moveTo(userscript, userscript.target.x(), MathUtils.toNumber(y));
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
  edgeBounce(userscript) {
    if (userscript.aborted) return;

    // 查询靠近的边缘
    const target = userscript.target;
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
  setRotationStyle(userscript, rotationStyle) {
    if (userscript.aborted) return;
    const direction = userscript.target.getAttr('direction');
    this._rotate(userscript.target, direction, rotationStyle);
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
      strokeWidth: FontBubbleStyle.StrokeWidth,
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
      id: target.id(),
      name: 'dialog',
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
    const clientRect = target.getClientRect({ relativeTo: this.stage });
    let x = clientRect.x + clientRect.width;
    let y = clientRect.y + clientRect.height + FontBubbleStyle.Padding;

    // 避免对话框超出舞台右边缘
    bubble.scaleX(1);
    if (
      x + target.width() - FontBubbleStyle.Radius - FontBubbleStyle.TailSize + bubble.width() >
      this.stage.width() / 2
    ) {
      bubble.scaleX(-1);
      x = clientRect.x;
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
    } else {
      text.offsetX(0);
    }

    // 移动对话框
    dialog.position({ x, y });
  }

  async _textBubble(target, message, sec, style, bigMode) {
    let dialog = target.getAttr('dialog');
    if (!dialog) {
      dialog = this._dialog(target, style, bigMode);
      target.setAttr('dialog', dialog);
    }
    const messageValue = `${message}`;
    this._updateDialog(target, messageValue, style, bigMode);
    dialog.visible(true);
    dialog.moveToTop();

    if (sec !== false) {
      const secValue = MathUtils.toNumber(sec);
      await sleep(secValue);
      dialog.visible(false);
    }
  }

  // 说
  say(userscript, message, sec = false, bigMode = false) {
    if (userscript.aborted) return;
    return this._textBubble(userscript.target, message, sec, FontBubbleStyle.Talking, bigMode);
  }

  // 思考
  think(userscript, message, sec = false, bigMode = false) {
    if (userscript.aborted) return;
    return this._textBubble(userscript.target, message, sec, FontBubbleStyle.Thinking, bigMode);
  }

  // 切换造型/背景
  async switchFrameTo(userscript, idOrSerialOrName, broadcast = false) {
    if (userscript.aborted) return;

    const target = userscript.target;
    if (target.getAttr('rendering')) return;
    target.setAttr('rendering', true);

    const frames = target.getAttr('frames');
    let frameIdOrName = idOrSerialOrName;

    // 是数字则通过 Serial 查 ID
    if (!isNaN(idOrSerialOrName)) {
      const index = MathUtils.serialToIndex(MathUtils.toNumber(idOrSerialOrName), frames.length);
      frameIdOrName = frames[index];
    }

    // 查找名或ID的资源
    const asset = this.assets.find(
      (res) => [res.id, res.name].includes(frameIdOrName) && frames.indexOf(res.id) !== -1,
    );
    if (!asset) {
      target.setAttr('rendering', false);
      return;
    }

    const frameIndex = frames.indexOf(asset.id);
    const image = await loadImageFromAsset(asset);

    target.clearCache();
    target.setAttrs({
      image,
      frameIndex,
      offsetX: asset.centerX,
      offsetY: asset.centerY,
      rendering: false,
    });
    // target.cache();
    this._updateDialog(target);
    this.runtime.update(target);
    this.emit('update', target);

    if (broadcast) {
      await this.runtime.call(`backdropswitchesto:${asset.id}`);
    }
  }

  // 下一个造型/背景
  nextFrame(userscript, broadcast = false) {
    if (userscript.aborted) return;
    const frames = userscript.target.getAttr('frames');
    const frameIndex = userscript.target.getAttr('frameIndex');
    const serial = MathUtils.indexToSerial(frameIndex, frames.length);
    return this.switchFrameTo(userscript, serial + 1, broadcast);
  }

  // 增加大小
  addSize(userscript, size) {
    if (userscript.aborted) return;
    const sizeValue = MathUtils.toNumber(size) + userscript.target.getAttr('scaleSize');
    this.setSize(userscript, sizeValue);
  }

  // 设置大小
  setSize(userscript, size) {
    if (userscript.aborted) return;

    // 缩放最大不能超过屏幕且不能小于1，最小0.05
    const target = userscript.target;
    const image = target.image();
    const maxScale = Math.min(this.stage.width() / image.width, this.stage.height() / image.height);

    let sizeValue = MathUtils.toNumber(size);
    let scale = MathUtils.clamp(sizeValue / 100, 0.05, Math.max(1, maxScale));
    sizeValue = Math.round(scale * 100);

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
    this._updateDialog(target);
    this.runtime.update(target);
    this.emit('update', target);
    this.runtime.setMonitorValueById(`${target.id()}.looks_size`);
  }

  // 往前移层
  forward(userscript, zindex) {
    if (userscript.aborted) return;
    const target = userscript.target;
    let zindexValue = MathUtils.toNumber(zindex);
    zindexValue = target.zIndex() + zindexValue;
    target.zIndex(MathUtils.clamp(zindexValue, 0, this.spritesLayer.children.length - 1));
    this.runtime.update(target);
    this.emit('update', target);
  }

  // 往后移层
  backward(userscript, zindex) {
    if (userscript.aborted) return;
    const zindexValue = MathUtils.toNumber(zindex);
    this.forward(userscript, -zindexValue);
  }

  getFrameSerialOrName(userscript, serialOrName) {
    if (userscript.aborted) return;

    const frames = userscript.target.getAttr('frames');
    const frameIndex = userscript.target.getAttr('frameIndex');

    if (serialOrName !== 'name') {
      return MathUtils.indexToSerial(frameIndex, frames.length);
    }

    const frameId = frames[frameIndex];
    const asset = this.assets.find((res) => res.id === frameId);
    return asset.name;
  }

  // 增加特效
  addEffect(userscript, mode, value) {
    if (userscript.aborted) return;

    const target = userscript.target;
    let effectValue = MathUtils.toNumber(value);

    if (mode === 'GHOST') {
      effectValue = target.opacity() - effectValue;
    }

    this.setEffect(userscript, mode, effectValue);
  }

  // 设置特效
  setEffect(userscript, mode, value) {
    if (userscript.aborted) return;

    const target = userscript.target;
    const effectValue = MathUtils.toNumber(value);

    if (mode === 'GHOST') {
      let opacity = 1 - effectValue / 100;
      if (opacity > 1) opacity = 1;
      if (opacity < 0) opacity = 0;
      target.opacity(opacity);
    }
  }

  // 清除
  clearEffect(userscript) {
    if (userscript.aborted) return;
    userscript.target.opacity(1);
  }

  // 克隆
  async clone(userscript, target) {
    if (userscript.aborted) return;

    const clones = this.runtime.querySelectorAll('.clone');
    if (clones.length >= MAX_CLONES_LIMIT) return;

    if (typeof target === 'string') {
      target = this.runtime.querySelector(`#${target}`) || this.runtime.querySelector(`.${target}`);
    }
    if (!target) return;

    // 等待造型更新完成
    while (target.getAttr('rendering')) {
      await this.runtime.nextTick();
    }

    // 克隆体克隆需要原始ID
    let id = target.id();
    if (target.hasName('clone')) {
      id = target.name().replace('clone', '').trim();
    }
    const clone = target.clone({
      id: null,
      name: `clone ${id}`,
    });
    this.spritesLayer.add(clone);

    // 重新设置zindex
    clone.zIndex(Math.max(target.zIndex() - 1, 0));

    this.runtime.call(`clonestart:${id}`, clone);
  }

  removeClone(userscript) {
    if (userscript.aborted) return;
    if (userscript.target.hasName('clone')) {
      userscript.target.destroy();
    }
  }
}
