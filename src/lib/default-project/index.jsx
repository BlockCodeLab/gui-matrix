import { Text } from '@blockcode/core';
import backdrop from './backdrop';
import costume1 from './costume1';
import costume2 from './costume2';
import sprite1 from './sprite1';
import stage from './stage';

export const defaultProject = {
  assets: [
    Object.assign(backdrop, {
      name: (
        <Text
          id="matrix.defaultProject.backdropName"
          defaultMessage="backdrop"
        />
      ),
    }),
    Object.assign(costume1, {
      name: (
        <>
          <Text
            id="matrix.defaultProject.costumeName"
            defaultMessage="costume"
          />
          1
        </>
      ),
    }),
    Object.assign(costume2, {
      name: (
        <>
          <Text
            id="matrix.defaultProject.costumeName"
            defaultMessage="costume"
          />
          2
        </>
      ),
    }),
  ],
  files: [stage, sprite1],
  fileId: sprite1.id,
};
