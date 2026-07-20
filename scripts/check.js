/**
 * FR : Contrôle statique léger, sans paquet externe ni configuration complexe.
 * EN: Lightweight static validation with no external package or complex setup.
 */
const fs = require('node:fs')
const path = require('node:path')
const vm = require('node:vm')
const { spawnSync } = require('node:child_process')

const ROOT = path.resolve(__dirname, '..')
const INDEX_PATH = path.join(ROOT, 'index.html')
const errors = []

/**
 * FR : Ajoute une erreur lisible au rapport final.
 * EN: Adds a readable error to the final report.
 */
function reportError(message) {
  errors.push(message)
}

/**
 * FR : Vérifie la syntaxe de chaque fichier JavaScript avec Node.
 * EN: Checks every JavaScript file's syntax with Node.
 */
function checkJavaScriptSyntax() {
  const files = [
    'server.js',
    ...fs
      .readdirSync(path.join(ROOT, 'scripts'))
      .filter((file) => file.endsWith('.js'))
      .map((file) => path.join('scripts', file)),
  ]

  for (const file of files) {
    const result = spawnSync(process.execPath, ['--check', path.join(ROOT, file)], {
      encoding: 'utf8',
    })

    if (result.status !== 0) {
      reportError(`${file}: ${result.stderr.trim()}`)
    }
  }
}

/**
 * FR : Vérifie que toutes les ressources locales déclarées dans le HTML existent.
 * EN: Verifies that every local resource declared in HTML exists.
 */
function checkHtmlReferences() {
  const html = fs.readFileSync(INDEX_PATH, 'utf8')
  const references = [...html.matchAll(/(?:href|src)="([^"]+)"/g)].map(
    (match) => match[1],
  )

  for (const reference of references) {
    if (
      reference.startsWith('#') ||
      reference.startsWith('http://') ||
      reference.startsWith('https://')
    ) {
      continue
    }

    const cleanReference = reference.split('?')[0]
    if (!fs.existsSync(path.join(ROOT, cleanReference))) {
      reportError(`Missing local resource: ${reference}`)
    }
  }

  if (/<script[^>]+type=["']module["']/.test(html)) {
    reportError('index.html must remain compatible with direct file opening.')
  }

  if (/https?:\/\//.test(html)) {
    reportError('index.html contains an external URL.')
  }
}

/**
 * FR : Charge les traductions dans un bac à sable et compare leurs clés.
 * EN: Loads translations in a sandbox and compares their keys.
 */
function checkTranslations() {
  const source = fs.readFileSync(
    path.join(ROOT, 'scripts', 'translations.js'),
    'utf8',
  )
  const sandbox = { window: {} }

  vm.runInNewContext(source, sandbox)
  const dictionaries = sandbox.window.RETRO_I18N?.dictionaries

  if (!dictionaries?.fr || !dictionaries?.en) {
    reportError('French and English dictionaries are required.')
    return
  }

  const frenchKeys = Object.keys(dictionaries.fr).sort()
  const englishKeys = Object.keys(dictionaries.en).sort()

  if (JSON.stringify(frenchKeys) !== JSON.stringify(englishKeys)) {
    reportError('French and English translation keys do not match.')
  }
}

checkJavaScriptSyntax()
checkHtmlReferences()
checkTranslations()

if (errors.length > 0) {
  console.error('Validation failed:')
  errors.forEach((error) => console.error(`- ${error}`))
  process.exit(1)
}

console.log('Validation passed: syntax, local resources and translations are valid.')
