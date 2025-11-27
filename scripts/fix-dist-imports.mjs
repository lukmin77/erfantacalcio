import fs from 'fs'
import path from 'path'

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  const files = []
  for (const e of entries) {
    const res = path.resolve(dir, e.name)
    if (e.isDirectory()) files.push(...walk(res))
    else if (e.isFile() && res.endsWith('.js')) files.push(res)
  }
  return files
}

function replaceImports(file) {
  let text = fs.readFileSync(file, 'utf8')
  const dir = path.dirname(file)
  // match from '...'; import('...'); require('...') and capture aliases (~/) or relative paths
  let patched = 0
  const matches = [...text.matchAll(/(?:from\s+|import\(|require\()['\"]((?:~\/|\.{1,2}\/)[^'"\)]+?)['\"]/g)]
  for (const m of matches) {
    const spec = m[1]
    if (!spec) continue
    if (spec.endsWith('.js') || spec.endsWith('.json') || spec.endsWith('.css')) continue

    // Handle tsconfig alias imports starting with '~/'
    if (spec.startsWith('~/')) {
      const target = path.resolve(process.cwd(), 'dist', spec.slice(2) + '.js')
      if (!fs.existsSync(target)) continue
      let relPath = path.relative(dir, target)
      // ensure posix separators for ESM import paths
      relPath = relPath.split(path.sep).join('/')
      if (!relPath.startsWith('.')) relPath = './' + relPath
      const from = m[0]
      const replaced = from.replace(spec, relPath)
      text = text.replace(from, replaced)
      patched++
      continue
    }

    // Handle relative imports (./ or ../)
    if (!spec.startsWith('./') && !spec.startsWith('../')) continue
    const candidateFile = path.resolve(dir, spec + '.js')
    if (fs.existsSync(candidateFile)) {
      const from = m[0]
      const replaced = from.replace(spec, spec + '.js')
      text = text.replace(from, replaced)
      patched++
      continue
    }
    // If the spec points to a directory which contains index.js, expand to ./dir/index.js
    const candidateDir = path.resolve(dir, spec)
    const indexFile = path.join(candidateDir, 'index.js')
    if (fs.existsSync(indexFile)) {
      // compute relative path from file dir to indexFile
      let relPath = path.relative(dir, indexFile).split(path.sep).join('/')
      if (!relPath.startsWith('.')) relPath = './' + relPath
      const from = m[0]
      const replaced = from.replace(spec, relPath)
      text = text.replace(from, replaced)
      patched++
    }
  }
  if (patched > 0) fs.writeFileSync(file, text, 'utf8')
  return patched
}

async function main() {
  const root = path.resolve(process.cwd(), 'dist')
  if (!fs.existsSync(root)) {
    console.log('dist not found, skipping import fixes')
    process.exit(0)
  }
  const files = walk(root)
  let total = 0
  for (const f of files) {
    const p = replaceImports(f)
    total += p
  }
  console.log(`Import-fix: scanned ${files.length} js files, patched ${total} files`)
}

main().catch((err) => {
  console.error(err)
  process.exit(2)
})
