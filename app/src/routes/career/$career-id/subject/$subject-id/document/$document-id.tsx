import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useRef, useState } from 'react'
import { useDocument, useUpdateDocument, useDeleteDocument } from '@/hooks/useDocuments'
import { MarkdownEditor } from '@/components/MarkdownEditor'
import { DocumentsList } from '@/components/DocumentsList'
import { InlineEditableText } from '@/components/InlineEditableField'
import { exportAsMarkdown } from '@/lib/exportDocument'
import { Button } from '@/components/ui/button'
import type { Document } from '@/types/document'

const AUTOSAVE_DELAY = 1000

export const Route = createFileRoute('/career/$career-id/subject/$subject-id/document/$document-id')({
  component: DocumentDetail,
})

function DocumentDetail() {
  const { 'career-id': careerId, 'subject-id': subjectId, 'document-id': documentId } = Route.useParams()
  const navigate = useNavigate()
  const { data: document, isLoading, error } = useDocument(subjectId, documentId)
  const updateDocument = useUpdateDocument(subjectId, documentId)
  const deleteDocument = useDeleteDocument(subjectId)

  function handleDelete() {
    if (window.confirm('¿Estás seguro de que quieres eliminar este document?')) {
      deleteDocument.mutate(documentId, {
        onSuccess: () => navigate({ to: '/career/$career-id/subject/$subject-id', params: { 'career-id': careerId, 'subject-id': subjectId } }),
      })
    }
  }

  if (isLoading) return <p className="text-gray-500">Cargando...</p>
  if (error) return <p className="text-red-500">Error al cargar el document.</p>
  if (!document) return <p className="text-gray-500">Document no encontrado.</p>

  return (
    <DocumentForm
      key={documentId}
      document={document}
      careerId={careerId}
      subjectId={subjectId}
      onSave={(data) => updateDocument.mutate(data)}
      isSaving={updateDocument.isPending}
      onDelete={handleDelete}
      isDeleting={deleteDocument.isPending}
    />
  )
}

function DocumentForm({
  document,
  careerId,
  subjectId,
  onSave,
  isSaving,
  onDelete,
  isDeleting,
}: {
  document: Document
  careerId: string
  subjectId: string
  onSave: (data: { title: string; content: string }) => void
  isSaving: boolean
  onDelete: () => void
  isDeleting: boolean
}) {
  const [title, setTitle] = useState(document.title as string)
  const [content, setContent] = useState(document.content as string)
  const isFirstRender = useRef(true)

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    const timeout = setTimeout(() => {
      onSave({ title, content })
    }, AUTOSAVE_DELAY)
    return () => clearTimeout(timeout)
  }, [title, content])

  return (
    <div className="w-full grid place-items-center print:hidden">
      <div className="w-full max-w-7xl">
        <InlineEditableText
          value={title}
          onSave={setTitle}
          placeholder="Título del documento"
          className="w-full px-4 block text-2xl font-semibold"
        />
      </div>
      <div className="mb-4 w-full max-w-7xl">
        <MarkdownEditor value={content} onChange={setContent} />
      </div>
      <div className="w-full max-w-7xl flex flex-wrap items-center gap-2">
        <Button
          variant="destructive"
          onClick={onDelete}
          disabled={isDeleting}
        >
          {isDeleting ? 'Eliminando...' : 'Eliminar'}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => exportAsMarkdown(title, content)}
        >
          Exportar .md
        </Button>
        {isSaving && <span className="text-sm text-gray-500">Guardado automático...</span>}
      </div>
      <div className="w-full max-w-7xl mt-8 pt-6 border-t">
        <DocumentsList subjectId={subjectId} careerId={careerId} />
      </div>
    </div>
  )
}
