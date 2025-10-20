import { nanoid } from '@blockcode/utils';
import backdrop from './backdrop';
import costume1 from './costume1';
import costume2 from './costume2';
import sprite1 from './sprite1';
import stage from './stage';

export function createDefaultProject() {
  backdrop.id = nanoid();
  costume1.id = nanoid();
  costume2.id = nanoid();

  sprite1.id = nanoid();
  sprite1.assets = [costume1.id, costume2.id];

  stage.id = '_stage_';
  stage.assets = [backdrop.id];

  return {
    assets: [backdrop, costume1, costume2],
    files: [stage, sprite1],
    fileId: sprite1.id,
  };
}
