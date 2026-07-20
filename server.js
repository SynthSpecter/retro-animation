/**
 * FR : Petit serveur statique sans dépendance pour le développement local.
 * EN: Tiny dependency-free static server for local development.
 */
const http = require('node:http')
const path = require('node:path')
const fs = require('node:fs/promises')

const ROOT = __dirname
const PORT = Number(process.env.PORT) || 4173

// FR : Les types usuels évitent que le navigateur interprète mal les ressources.
// EN: Common MIME types prevent the browser from misreading assets.
const MIME_TYPES = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
}

/**
 * FR : Résout une URL en restant strictement dans le dossier du projet.
 * EN: Resolves a URL while staying strictly inside the project directory.
 */
function resolveRequestPath(url) {
  const pathname = decodeURIComponent(new URL(url, 'http://localhost').pathname)
  const requestedPath = pathname === '/' ? '/index.html' : pathname
  const absolutePath = path.resolve(ROOT, `.${requestedPath}`)

  return absolutePath.startsWith(ROOT) ? absolutePath : null
}

// FR : Chaque requête reçoit le fichier local demandé ou une réponse explicite.
// EN: Every request receives the requested local file or an explicit response.
const server = http.createServer(async (request, response) => {
  const filePath = resolveRequestPath(request.url || '/')

  if (!filePath) {
    response.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' })
    response.end('Forbidden')
    return
  }

  try {
    const content = await fs.readFile(filePath)
    const extension = path.extname(filePath).toLowerCase()
    const contentType = MIME_TYPES[extension] || 'application/octet-stream'

    response.writeHead(200, {
      'Cache-Control': 'no-store',
      'Content-Type': contentType,
    })
    response.end(content)
  } catch (error) {
    const status = error.code === 'ENOENT' ? 404 : 500
    response.writeHead(status, { 'Content-Type': 'text/plain; charset=utf-8' })
    response.end(status === 404 ? 'Not found' : 'Internal server error')
  }
})

server.listen(PORT, '127.0.0.1', () => {
  console.log(`Synthverse is running at http://127.0.0.1:${PORT}`)
})
