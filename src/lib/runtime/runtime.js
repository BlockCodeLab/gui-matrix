import { MathUtils, KonvaUtils } from '@blockcode/utils';
import { Keys } from '@blockcode/core';
import { Runtime } from '@blockcode/blocks';
import { TargetUtils } from './target-utils';

export class MatrixRuntime extends Runtime {
  constructor(stage, updateTarget, warpMode = false) {
    super(stage, warpMode);

    // 操作工具
    this._targetUtils = new TargetUtils(this);

    // 更新数据
    this._updateTarget = updateTarget;

    // 文件库
    this._files = null;

    // 资源库
    this._assets = null;

    // 声音播放缓存
    this._waves = new Map();

    // 摇杆值
    this._joystick = {
      x: 0,
      y: 0,
    };

    this._waveVolume = 60;
    this.on('start', () => this.setMonitorValueById('sound_volume', this.waveVolume));
  }

  get fps() {
    return 30; // 硬件理想帧率
  }

  get targetUtils() {
    return this._targetUtils;
  }

  get files() {
    return this._files;
  }

  get assets() {
    return this._assets;
  }

  get wifiConnected() {
    return window.navigator.onLine;
  }

  binding(files, assets) {
    this._files = files;
    this._assets = assets;
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
    // 移除对话框
    this.querySelectorAll('.dialog').forEach((dialog) => dialog.destroy());
    // 删除克隆体
    this.querySelectorAll('.clone').forEach((clone) => clone.destroy());

    // 更新背景
    this.backdropLayer.children.forEach((target) => {
      this.update(target);
      this.targetUtils.clearEffect({ target });
      this.targetUtils.redraw(target);
    });
    // 更新角色
    this.spritesLayer.children.forEach((target) => {
      // 删除关联的对话框
      target.setAttr('dialog', null);
      // 更新角色本体数据
      if (!target.hasName('clone')) {
        this.update(target);
        this.targetUtils.clearEffect({ target });
        this.targetUtils.redraw(target);
      }
    });
    super.stop();
  }

  update(target) {
    if (target.hasName('clone')) return;
    this._updateTarget(target, this);
  }

  when(scriptName, script, target = null) {
    if (target) {
      super.when(scriptName, (...args) => {
        // 本体
        script(target, ...args);

        const clones = this.querySelectorAll(`.${target.id()}`);
        // 有克隆体时，同时传递给克隆体
        for (const child of clones) {
          script(child, ...args);
        }
      });
    } else {
      super.when(scriptName, script);
    }
  }

  whenGreaterThen(name, value, script, target = null) {
    const key = `${name}>${MathUtils.toNumber(value)}`;
    this._thresholds.set(key, false);
    this.when(`threshold:${key}`, script, target);
  }

  whenCloneStart(target, script) {
    this.onEvent(`clonestart:${target.id()}`, script);
  }

  playWave(soundId) {
    let audio = this._waves.get(soundId);
    if (!audio) {
      const data = this.assets.find((sound) => sound.id === soundId);
      if (!data) return;
      const dataUrl = `data:${data.type};base64,${data.data}`;
      audio = new Audio(dataUrl);
      audio.volume = this.waveVolume / 100;
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

  get waveVolume() {
    return this._waveVolume;
  }

  set waveVolume(vol) {
    this._waveVolume = MathUtils.clamp(MathUtils.toNumber(vol), 0, 100);
    this._waves.forEach((audio) => {
      audio.volume = this.waveVolume / 100;
    });
    this.setMonitorValueById('sound_volume', this.waveVolume);
  }

  setMonitorValue(label, value) {
    if (label) {
      const monitor = label.getAttr('monitor');
      if (!value) {
        const target = this.querySelector(`#${monitor.groupId}`);
        if (target) {
          switch (monitor.id) {
            case 'motion_xposition':
              value = Math.round(target.x());
              break;
            case 'motion_yposition':
              value = Math.round(target.y());
              break;
            case 'motion_direction':
              value = MathUtils.wrapClamp(Math.floor(target.getAttr('direction')), -179, 180);
              break;
            case 'looks_size':
              value = Math.floor(target.getAttr('scaleSize'));
              break;
            default:
              value = 0;
              break;
          }
        }
      }
      super.setMonitorValue(label, value);
    }
  }

  // 按键
  //

  get anyKey() {
    return (
      this.spaceKey ||
      this.upKey ||
      this.leftKey ||
      this.downKey ||
      this.rightKey ||
      this.aKey ||
      this.bKey ||
      this.cKey ||
      this.dKey ||
      this.eKey ||
      this.fKey ||
      this.gKey ||
      this.hKey ||
      this.iKey ||
      this.jKey ||
      this.kKey ||
      this.lKey ||
      this.mKey ||
      this.nKey ||
      this.oKey ||
      this.pKey ||
      this.qKey ||
      this.rKey ||
      this.sKey ||
      this.tKey ||
      this.uKey ||
      this.vKey ||
      this.wKey ||
      this.xKey ||
      this.yKey ||
      this.zKey ||
      this['0Key'] ||
      this['1Key'] ||
      this['2Key'] ||
      this['3Key'] ||
      this['4Key'] ||
      this['5Key'] ||
      this['6Key'] ||
      this['7Key'] ||
      this['8Key'] ||
      this['9Key']
    );
  }

  _pressKey(key) {
    this[`${key}Key`] = true;
    this.call(`keypressed:${key}`);
    this.call(`keypressed:any`);
  }

  _releaseKey(key) {
    this[`_${key}Key`] = false;
  }

  // 监听按键按下
  handleKeyDown(e) {
    switch (e.code) {
      case Keys.SPACE:
        this._pressKey('space');
        return;
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
      case Keys.C:
        this._pressKey('c');
        return;
      case Keys.D:
        this._pressKey('d');
        return;
      case Keys.E:
        this._pressKey('e');
        return;
      case Keys.F:
        this._pressKey('f');
        return;
      case Keys.G:
        this._pressKey('g');
        return;
      case Keys.H:
        this._pressKey('h');
        return;
      case Keys.I:
        this._pressKey('i');
        return;
      case Keys.J:
        this._pressKey('j');
        return;
      case Keys.K:
        this._pressKey('k');
        return;
      case Keys.L:
        this._pressKey('l');
        return;
      case Keys.M:
        this._pressKey('m');
        return;
      case Keys.N:
        this._pressKey('n');
        return;
      case Keys.O:
        this._pressKey('o');
        return;
      case Keys.P:
        this._pressKey('p');
        return;
      case Keys.Q:
        this._pressKey('q');
        return;
      case Keys.R:
        this._pressKey('r');
        return;
      case Keys.S:
        this._pressKey('s');
        return;
      case Keys.T:
        this._pressKey('t');
        return;
      case Keys.U:
        this._pressKey('u');
        return;
      case Keys.V:
        this._pressKey('v');
        return;
      case Keys.W:
        this._pressKey('w');
        return;
      case Keys.X:
        this._pressKey('x');
        return;
      case Keys.Y:
        this._pressKey('y');
        return;
      case Keys.Z:
        this._pressKey('z');
        return;
      case Keys.D0:
        this._pressKey('0');
        return;
      case Keys.D1:
        this._pressKey('1');
        return;
      case Keys.D2:
        this._pressKey('2');
        return;
      case Keys.D3:
        this._pressKey('3');
        return;
      case Keys.D4:
        this._pressKey('4');
        return;
      case Keys.D5:
        this._pressKey('5');
        return;
      case Keys.D6:
        this._pressKey('6');
        return;
      case Keys.D7:
        this._pressKey('7');
        return;
      case Keys.D8:
        this._pressKey('8');
        return;
      case Keys.D9:
        this._pressKey('9');
        return;
    }
  }

  // 监听按键抬起
  handleKeyUp(e) {
    switch (e.code) {
      case Keys.SPACE:
        this._releaseKey('space');
        return;
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
      case Keys.C:
        this._releaseKey('c');
        return;
      case Keys.D:
        this._releaseKey('d');
        return;
      case Keys.E:
        this._releaseKey('e');
        return;
      case Keys.F:
        this._releaseKey('f');
        return;
      case Keys.G:
        this._releaseKey('g');
        return;
      case Keys.H:
        this._releaseKey('h');
        return;
      case Keys.I:
        this._releaseKey('i');
        return;
      case Keys.J:
        this._releaseKey('j');
        return;
      case Keys.K:
        this._releaseKey('k');
        return;
      case Keys.L:
        this._releaseKey('l');
        return;
      case Keys.M:
        this._releaseKey('m');
        return;
      case Keys.N:
        this._releaseKey('n');
        return;
      case Keys.O:
        this._releaseKey('o');
        return;
      case Keys.P:
        this._releaseKey('p');
        return;
      case Keys.Q:
        this._releaseKey('q');
        return;
      case Keys.R:
        this._releaseKey('r');
        return;
      case Keys.S:
        this._releaseKey('s');
        return;
      case Keys.T:
        this._releaseKey('t');
        return;
      case Keys.U:
        this._releaseKey('u');
        return;
      case Keys.V:
        this._releaseKey('v');
        return;
      case Keys.W:
        this._releaseKey('w');
        return;
      case Keys.X:
        this._releaseKey('x');
        return;
      case Keys.Y:
        this._releaseKey('y');
        return;
      case Keys.Z:
        this._releaseKey('z');
        return;
      case Keys.D0:
        this._releaseKey('0');
        return;
      case Keys.D1:
        this._releaseKey('1');
        return;
      case Keys.D2:
        this._releaseKey('2');
        return;
      case Keys.D3:
        this._releaseKey('3');
        return;
      case Keys.D4:
        this._releaseKey('4');
        return;
      case Keys.D5:
        this._releaseKey('5');
        return;
      case Keys.D6:
        this._releaseKey('6');
        return;
      case Keys.D7:
        this._releaseKey('7');
        return;
      case Keys.D8:
        this._releaseKey('8');
        return;
      case Keys.D9:
        this._releaseKey('9');
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
    // 自己隐藏则跳过
    if (target.visible() === false) {
      return false;
    }

    // 检查名字或id
    target2 = this.querySelector(`#${target2}`) ?? this.querySelector(`.${target2}`);

    // 舞台边缘碰撞
    if (!target2) {
      const nearestEdge = this.targetUtils._findNearestEdge(target);
      return !!nearestEdge;
    }

    // 查找角色和克隆体
    const targets = this.querySelectorAll(`.${target2.id()}`).concat(target2);

    // 角色和克隆体碰撞
    for (target2 of targets) {
      // 隐藏的角色跳过
      if (target2?.visible()) {
        if (KonvaUtils.checkConvexHullsCollision(target, target2)) {
          return true;
        }
      }
    }
    return false;
  }

  // 距离
  distanceTo(target, target2) {
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

  // 设置舞台围栏
  setFencingMode(mode = True) {
    const stage = this.querySelector(`#_stage_`);
    stage.setAttr('fencingMode', mode);
    this.emit('update', stage);
  }
}
