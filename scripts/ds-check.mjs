// Design-system ratchet. The ds/* lint rules are warnings so existing code
// keeps building, but CI fails when any file gains a violation it didn't have.
// Fix violations, then run `npm run ds:baseline` to lock in the lower count.
//   node scripts/ds-check.mjs                    compare with eslint-rules/ds-baseline.json
//   node scripts/ds-check.mjs --update           rewrite the baseline (refuses to raise any count)
//   node scripts/ds-check.mjs --update --force   rewrite even if counts went up (say why in the PR)
import { ESLint } from 'eslint';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import path from 'node:path';

const BASELINE = 'eslint-rules/ds-baseline.json';
const update = process.argv.includes('--update');
const force = process.argv.includes('--force');

const results = await new ESLint().lintFiles(['src']);

// counts[rule][file] = n
const counts = {};
for (const r of results) {
  const file = path.relative(process.cwd(), r.filePath);
  for (const m of r.messages) {
    if (!m.ruleId?.startsWith('ds/')) continue;
    (counts[m.ruleId] ??= {})[file] = (counts[m.ruleId][file] ?? 0) + 1;
  }
}

const baseline = existsSync(BASELINE) ? JSON.parse(readFileSync(BASELINE, 'utf8')) : {};
const sum = (o = {}) => Object.values(o).reduce((a, b) => a + b, 0);
const rules = [...new Set([...Object.keys(baseline), ...Object.keys(counts)])].sort();

const increases = [];
const rows = rules.map((rule) => {
  const now = counts[rule] ?? {};
  const base = baseline[rule] ?? {};
  for (const [file, n] of Object.entries(now)) {
    if (n > (base[file] ?? 0)) increases.push({ rule, file, base: base[file] ?? 0, now: n });
  }
  const b = sum(base);
  const c = sum(now);
  return { rule, baseline: b, now: c, change: c - b };
});

console.table(rows);

if (update) {
  if (increases.length && !force) {
    for (const i of increases) console.error(`Refusing to raise ${i.rule} in ${i.file} (${i.base} → ${i.now}).`);
    console.error('Fix the new violations, or pass --force and explain why in the PR.');
    process.exit(1);
  }
  const sorted = Object.fromEntries(
    Object.keys(counts).sort().map((rule) => [rule, Object.fromEntries(Object.entries(counts[rule]).sort())]),
  );
  writeFileSync(BASELINE, `${JSON.stringify(sorted, null, 2)}\n`);
  console.log(`Wrote ${BASELINE}`);
  process.exit(0);
}

if (increases.length) {
  console.error('\nNew design-system violations:');
  for (const i of increases) console.error(`  ${i.file}  ${i.rule}  ${i.base} → ${i.now}`);
  console.error('\nRun `npx eslint <file>` to see each line. Rules and reasons: docs/DESIGN.md › Enforcement.');
  process.exit(1);
}

if (rows.some((r) => r.change < 0)) console.log('\nCounts went down. Run `npm run ds:baseline` to lock it in.');
console.log('ds:check passed');
