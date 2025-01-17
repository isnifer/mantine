import fs from 'fs-extra';
import path from 'path';
import { globSync } from 'glob';

function updateDemo(demoPath: string) {
  const contents = fs.readFileSync(demoPath).toString();
  if (contents.includes("from '@mantine/ds';")) {
    return;
  }

  const lines = contents.split('\n');
  const imports: string[] = [];

  for (let i = 0; i < lines.length; i += 1) {
    if (lines[i].includes('const code =') || lines[i].includes('const codeTemplate =')) {
      break;
    }

    if (lines[i].includes('import ')) {
      imports.push(lines[i]);
    }
  }

  const lastImport = imports[imports.length - 1];
  const splittedContent = contents.split(lastImport);
  const contentsWithImport = `${
    splittedContent[0]
  }import { MantineDemo } from '@mantine/ds';\n${lastImport}${splittedContent
    .slice(1)
    .join(lastImport)}`;

  fs.writeFileSync(demoPath, contentsWithImport);
}

const demos = globSync(
  path.join(__dirname, '../src/mantine-demos/src/demos/**/*.demo.*.@(ts|tsx)')
);
demos.forEach(updateDemo);

// updateDemo(
//   path.join(__dirname, '../src/mantine-demos/src/demos/carousel/Carousel.demo.animationOffset.tsx')
// );
