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
  // match from '...'; import('...'); export ... from '...'
  const re = /(?<=from\s+['\"]|import\(|require\()['\"](\.\.\/?[^'"\)]+?)?(?=['\"])?/g
  let patched = 0
  const matches = [...text.matchAll(/(?:from\s+|import\(|require\()['\"](\.\.\/?[^'"\)]+?)['\"]/g)]
  for (const m of matches) {
    const rel = m[1]
    if (!rel) continue
    if (rel.endsWith('.js') || rel.endsWith('.json') || rel.endsWith('.css')) continue
    // ignore package imports
    if (!rel.startsWith('./') && !rel.startsWith('../')) continue
    const candidate = path.resolve(dir, rel + '.js')
    if (fs.existsSync(candidate)) {
      const from = m[0]
      const replaced = from.replace(rel, rel + '.js')
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
