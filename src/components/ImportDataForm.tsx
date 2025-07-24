import { useState, useRef } from 'react'
import { Upload, FileText, AlertTriangle, CheckCircle, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useImport } from '@/hooks/useImport'

export default function ImportDataForm() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const { importData, loading, progress, resetProgress } = useImport()

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    const files = Array.from(e.dataTransfer.files)
    const file = files[0]
    
    if (file && file.type === 'application/json') {
      setSelectedFile(file)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type === 'application/json') {
      setSelectedFile(file)
    }
  }

  const handleImport = async () => {
    if (!selectedFile) return
    
    try {
      await importData(selectedFile)
    } catch (error) {
      console.error('Erreur d\'import:', error)
    }
  }

  const handleReset = () => {
    setSelectedFile(null)
    resetProgress()
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Importer depuis memor.ia v1
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Avertissement de sécurité */}
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Attention :</strong> Cette opération peut écraser vos données existantes. 
            Les souvenirs avec le même identifiant seront remplacés.
          </AlertDescription>
        </Alert>

        {/* Zone de drop */}
        {!selectedFile && !progress && (
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive 
                ? 'border-primary bg-primary/5' 
                : 'border-border hover:border-primary/50'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">
              Glissez votre fichier d'export ici
            </h3>
            <p className="text-muted-foreground mb-4">
              ou cliquez pour sélectionner un fichier JSON
            </p>
            
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
            >
              Parcourir les fichiers
            </Button>
            
            <input
              ref={fileInputRef}
              type="file"
              accept=".json,application/json"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>
        )}

        {/* Fichier sélectionné */}
        {selectedFile && !progress && (
          <div className="border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="h-8 w-8 text-primary" />
                <div>
                  <p className="font-medium">{selectedFile.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatFileSize(selectedFile.size)}
                  </p>
                </div>
              </div>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={handleReset}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="mt-4 flex gap-3">
              <Button
                onClick={handleImport}
                disabled={loading}
                className="flex-1"
              >
                {loading ? 'Import en cours...' : 'Importer les données'}
              </Button>
              
              <Button
                variant="outline"
                onClick={handleReset}
                disabled={loading}
              >
                Annuler
              </Button>
            </div>
          </div>
        )}

        {/* Barre de progression */}
        {progress && (
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">{progress.step}</span>
                <span className="text-sm text-muted-foreground">
                  {progress.progress}%
                </span>
              </div>
              <Progress value={progress.progress} className="h-2" />
            </div>

            {/* Erreurs */}
            {progress.errors.length > 0 && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <div className="space-y-1">
                    <p><strong>Erreurs rencontrées :</strong></p>
                    <ul className="text-xs space-y-1 max-h-32 overflow-y-auto">
                      {progress.errors.slice(0, 10).map((error, index) => (
                        <li key={index}>• {error}</li>
                      ))}
                      {progress.errors.length > 10 && (
                        <li>... et {progress.errors.length - 10} autres erreurs</li>
                      )}
                    </ul>
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {/* Succès */}
            {progress.completed && progress.success && (
              <Alert className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
                <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                <AlertDescription className="text-green-800 dark:text-green-200">
                  <strong>Import terminé avec succès !</strong>
                  <br />
                  Vos souvenirs ont été importés et sont maintenant disponibles.
                </AlertDescription>
              </Alert>
            )}

            {/* Bouton pour recommencer */}
            {progress.completed && (
              <div className="flex justify-center">
                <Button
                  variant="outline"
                  onClick={handleReset}
                >
                  Importer un autre fichier
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Instructions */}
        <div className="text-sm text-muted-foreground space-y-2">
          <p><strong>Instructions :</strong></p>
          <ul className="space-y-1 ml-4">
            <li>• Exportez vos données depuis memor.ia v1</li>
            <li>• Sélectionnez le fichier JSON téléchargé</li>
            <li>• L'import préservera vos identifiants et dates</li>
            <li>• Les doublons seront automatiquement gérés</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
} 