import { sleepMs, MathUtils } from '@blockcode/utils';
import { Keys } from '@blockcode/core';
import { Runtime } from '@blockcode/blocks';
import { TargetUtils } from './target-utils';

export class ArcadeRuntime extends Runtime {
  constructor(stage, updateTarget, warpMode = false) {
    super(stage, warpMode);

    // 操作工具
    this._targetUtils = new TargetUtils(this);

    // 更新数据
    this._updateTarget = updateTarget;

    // 资源库
    this._assets = null;

    // 声音播放缓存
    this._waves = new Map();

    // 摇杆值
    this._joystick = {
      x: 0,
      y: 0,
    };
  }

  get fps() {
    return 30; // 同步硬件帧率
  }

  get targetUtils() {
    return this._targetUtils;
  }

  get assets() {
    return this._assets;
  }

  get joystick() {
    return this._joystick;
  }

  get wifiConnected() {
    return window.navigator.onLine;
  }

  binding(files, assets) {
    this._assets = assets;
    super.binding(files);
  }

  setData(target, key, value) {
    this._data.set(`${target.id()}.${key}`, value);
  }

  getData(target, key) {
    return this._data.get(`${target.id()}.${key}`);
  }

  hasData(target, key) {
    return this._data.has(`${target.id()}.${key}`);
  }

  stop() {
    // 还原按键
    this._releaseKey('fn');
    this._releaseKey('up');
    this._releaseKey('left');
    this._releaseKey('down');
    this._releaseKey('right');
    this._releaseKey('a');
    this._releaseKey('b');
    this._releaseKey('x');
    this._releaseKey('y');
    this._joystick.x = 0;
    this._joystick.y = 0;

    // 停下所有声音
    this.stopAllWaves();
    this._waves.clear();

    // 移除所有自定义绘图
    this.paintLayer.destroyChildren();
    // 移除所有生成信息，对话框等
    this.boardLayer.destroyChildren();
    // 删除克隆体
    this.querySelectorAll('.clone').forEach((clone) => {
      clone.destroy();
    });

    // 更新背景
    this.backdropLayer.children.forEach((target) => {
      this.update(target);
      this.targetUtils.clearEffect(target);
      this.targetUtils.redraw(target);
    });
    // 更新角色
    this.spritesLayer.children.forEach((target) => {
      // 删除关联的对话框
      target.setAttr('dialog', null);
      // 更新角色本体数据
      if (!target.hasName('clone')) {
        this.update(target);
        this.targetUtils.clearEffect(target);
        this.targetUtils.redraw(target);
      }
    });

    super.stop();
  }

  update(target) {
    if (target.hasName('clone')) return;
    this._updateTarget(target, this);
  }

  when(scriptName, scripter, target = null) {
    if (target) {
      super.when(scriptName, (...args) => {
        // 本体
        scripter(target, ...args);

        const clones = this.querySelectorAll(`.${target.id()}`);
        // 有克隆体时，同时传递给克隆体
        for (const child of clones) {
          scripter(child, ...args);
        }
      });
    } else {
      super.when(scriptName, scripter);
    }
  }

  whenGreaterThen(name, value, scripter, target = null) {
    const key = `${name}>${MathUtils.toNumber(value)}`;
    this._thresholds[key] = false;
    this.when(`threshold:${key}`, scripter, target);
  }

  whenCloneStart(target, scripter) {
    this.define(`clonestart:${target.id()}`, scripter);
  }

  playWave(soundId) {
    let audio = this._waves.get(soundId);
    if (!audio) {
      const data = this._assets.find((sound) => sound.id === soundId);
      if (!data) {
        return Promise.resolve();
      }
      const dataUrl = `data:${data.type};base64,${data.data}`;
      audio = new Audio(dataUrl);
      this._waves.set(soundId, audio);
    }

    return new Promise((resolve) => {
      if (audio.currentTime > 0) {
        audio.pause();
        audio.currentTime = 0;
      }

      if (!this.running) {
        resolve();
        return;
      }

      const handleEnded = () => {
        audio.removeEventListener('ended', handleEnded);
        audio.removeEventListener('pause', handleEnded);
        audio.currentTime = 0;
        resolve();
      };
      audio.addEventListener('ended', handleEnded);
      audio.addEventListener('pause', handleEnded);
      audio.play();
    });
  }

  stopAllWaves() {
    this._waves.forEach((audio) => {
      audio.pause();
      audio.currentTime = 0;
    });
  }

  // 按键和摇杆
  //

  // 摇杆值
  get joystick() {
    return this._joystick;
  }

  get fnKey() {
    return !!this._fnKey;
  }

  get upKey() {
    return !!this._upKey;
  }

  get leftKey() {
    return !!this._leftKey;
  }

  get downKey() {
    return !!this._downKey;
  }

  get rightKey() {
    return !!this._rightKey;
  }

  get aKey() {
    return !!this._aKey;
  }

  get bKey() {
    return !!this._bKey;
  }

  get xKey() {
    return !!this._xKey;
  }

  get yKey() {
    return !!this._yKey;
  }

  get anyKey() {
    return (
      this.fnKey ||
      this.upKey ||
      this.leftKey ||
      this.downKey ||
      this.rightKey ||
      this.aKey ||
      this.bKey ||
      this.xKey ||
      this.yKey
    );
  }

  _pressKey(key) {
    this[`_${key}Key`] = true;
    this.run(`keypressed:${key}`);
    this.run(`keypressed:any`);
  }

  _releaseKey(key) {
    this[`_${key}Key`] = false;
  }

  // 监听按键按下
  handleKeyDown(e) {
    if (e.altKey || e.shiftKey) {
      this._pressKey('fn');
      return;
    }
    switch (e.code) {
      case Keys.UP:
        this._pressKey('up');
        return;
      case Keys.LEFT:
        this._pressKey('left');
        return;
      case Keys.DOWN:
        this._pressKey('down');
        return;
      case Keys.RIGHT:
        this._pressKey('right');
        return;
      case Keys.A:
        this._pressKey('a');
        return;
      case Keys.B:
        this._pressKey('b');
        return;
      case Keys.X:
        this._pressKey('x');
        return;
      case Keys.Y:
        this._pressKey('y');
        return;
    }
  }

  // 监听按键抬起
  handleKeyUp(e) {
    if (e.altKey || e.shiftKey) {
      this._releaseKey('fn');
      return;
    }
    switch (e.code) {
      case Keys.UP:
        this._releaseKey('up');
        return;
      case Keys.LEFT:
        this._releaseKey('left');
        return;
      case Keys.DOWN:
        this._releaseKey('down');
        return;
      case Keys.RIGHT:
        this._releaseKey('right');
        return;
      case Keys.A:
        this._releaseKey('a');
        return;
      case Keys.B:
        this._releaseKey('b');
        return;
      case Keys.X:
        this._releaseKey('x');
        return;
      case Keys.Y:
        this._releaseKey('y');
        return;
    }
  }

  // 事件
  //

  // 控制
  //

  // 侦测
  //

  // 碰撞
  isTouching(target, target2) {
    if (!this.running) return;

    // 自己隐藏则跳过
    if (target.visible() === false) {
      return false;
    }

    target2 = this.querySelector(`#${target2}`);

    // 舞台边缘碰撞
    if (!target2) {
      const nearestEdge = this.targetUtils._findNearestEdge(target);
      return !!nearestEdge;
    }

    // 查找角色和克隆体
    const targets = [].concat(target2, this.querySelectorAll(`.${target2.id()}`));

    // 角色和克隆体碰撞
    for (target2 of targets) {
      // 隐藏的角色跳过
      if (target2?.visible?.()) {
        if (Konva.Util.haveIntersection(target.getClientRect(), target2.getClientRect())) {
          return true;
        }
      }
    }
    return false;
  }

  // 距离
  distanceTo(target, target2) {
    if (!this.running) return;

    target2 = this.querySelector(`#${target2}`);
    // 到中心的距离
    const pos2 = target2 ? target2.position() : { x: 0, y: 0 };

    // 到角色的距离
    const pos = target.position();
    const dx = pos2.x - pos.x;
    const dy = pos2.y - pos.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  // 侦测其他角色和舞台
  sensingOf(target, attr) {
    target = this.querySelector(`#${target}`);
    if (!target) return;

    const frames = target.getAttr('frames');
    const frameIndex = target.getAttr('frameIndex');

    // 帧序号
    if (attr === 'frameSerial') {
      return MathUtils.indexToSerial(frameIndex, frames.length);
    }

    // 帧名称
    if (attr === 'frameName') {
      const frameId = frames[frameIndex];
      const frame = this.assets.find((res) => res.id === frameId);
      return frame.name;
    }

    const value = target.getAttr(attr);

    // 坐标
    if (attr === 'x' || attr === 'y') {
      return Math.round(value);
    }

    // 大小
    if (attr === 'scaleSize') {
      return Math.floor(value, 2);
    }

    // 方向
    if (attr === 'direction') {
      return MathUtils.wrapClamp(Math.floor(value), -179, 180);
    }

    return value;
  }
}
