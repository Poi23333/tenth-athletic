#!/usr/bin/env node

import {execFileSync} from 'node:child_process';
import {mkdtempSync, rmSync, writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';

const args = parseArgs(process.argv.slice(2));
const requiredFlags = [
  'code',
  'model',
  'client-name',
  'client-version',
  'artifact-id',
  'revision',
];
const missingFlags = requiredFlags.filter((flag) => !args[flag]);

if (missingFlags.length) {
  console.error(`Missing required flag(s): ${missingFlags.join(', ')}`);
  console.error(
    'Usage: node scripts/validate.mjs --code "const ok = true;" --model MODEL --client-name CLIENT --client-version VERSION --artifact-id ID --revision 1',
  );
  process.exit(1);
}

validateRevision(args.revision);
checkJavaScriptSyntax(args.code);
runProjectCheck('npm', ['run', 'typecheck']);

// eslint-disable-next-line no-console
console.log('Validation passed');
// eslint-disable-next-line no-console
console.log(`artifact-id: ${args['artifact-id']}`);
// eslint-disable-next-line no-console
console.log(`revision: ${args.revision}`);
// eslint-disable-next-line no-console
console.log(`model: ${args.model}`);
// eslint-disable-next-line no-console
console.log(`client: ${args['client-name']}@${args['client-version']}`);

function parseArgs(argv) {
  const parsed = {};

  for (let index = 0; index < argv.length; index += 1) {
    const flag = argv[index];
    if (!flag.startsWith('--')) {
      continue;
    }

    const key = flag.slice(2);
    const value = argv[index + 1];
    if (!value || value.startsWith('--')) {
      parsed[key] = 'true';
      continue;
    }

    parsed[key] = value;
    index += 1;
  }

  return parsed;
}

function validateRevision(revision) {
  if (!/^[1-9]\d*$/.test(revision)) {
    throw new Error('--revision must be a positive integer');
  }
}

function checkJavaScriptSyntax(code) {
  const tempDir = mkdtempSync(join(tmpdir(), 'tenth-athletic-validate-'));
  const tempFile = join(tempDir, 'artifact.mjs');

  try {
    writeFileSync(tempFile, code);
    runProjectCheck(process.execPath, ['--check', tempFile]);
  } finally {
    rmSync(tempDir, {force: true, recursive: true});
  }
}

function runProjectCheck(command, args) {
  execFileSync(command, args, {
    stdio: 'inherit',
  });
}
