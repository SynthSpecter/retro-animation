/**
 * FR : Enregistre l'image courante sans réintroduire un atelier de génération.
 * EN: Saves the current frame without reintroducing a generation studio.
 */
class SnapshotExporter {
  constructor(canvas) {
    this.canvas = canvas
  }

  /**
   * FR : Convertit le Canvas en PNG et déclenche un téléchargement local.
   * EN: Converts the Canvas to PNG and starts a local download.
   */
  save() {
    const filename = `synthverse-frame-${Date.now()}.png`

    this.canvas.toBlob((blob) => {
      if (!blob) {
        return
      }

      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.download = filename
      link.href = url
      link.click()

      window.setTimeout(() => URL.revokeObjectURL(url), 1000)
    }, 'image/png')
  }
}

window.SnapshotExporter = SnapshotExporter
