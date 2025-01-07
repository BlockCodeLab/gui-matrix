import { useLayout, useEditor, Text, MenuSection, MenuItem } from '@blockcode/core';
import sb3Converter from '../../lib/sb3-converter';

export default function ImportSB3Item({ itemClassName, openProject }) {
  const { createPrompt } = useLayout();
  const { modified } = useEditor();

  const importSb3 = () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.sb3';
    fileInput.multiple = false;
    fileInput.click();
    fileInput.addEventListener('change', async (e) => {
      const file = e.target.files[0];
      const project = await sb3Converter(file);
      openProject(project);
    });
  };

  const handleImport = () => {
    if (modified) {
      createPrompt({
        title: (
          <Text
            id="gui.projects.notSaved"
            defaultMessage="Not saved"
          />
        ),
        label: (
          <Text
            id="gui.projects.replaceProject"
            defaultMessage="Replace contents of the current project?"
          />
        ),
        onSubmit: importSb3,
      });
    } else {
      importSb3();
    }
  };

  return (
    <MenuSection>
      <MenuItem
        className={itemClassName}
        label={
          <Text
            id="arcade.menu.file.importSB3"
            defaultMessage="Import .sb3 file..."
          />
        }
        onClick={handleImport}
      />
    </MenuSection>
  );
}
