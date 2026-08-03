import { useState } from 'react'
import { useNotes, useCreateNote, useUpdateNote, useDeleteNote } from '@/hooks/useNotes'
import { Input } from './ui/input'
import { Note } from './Note'

interface NotesListProps {
  subjectId: string
}

export function NotesList({ subjectId }: NotesListProps) {
  const { data: notes, isLoading, error } = useNotes(subjectId)
  const createNote = useCreateNote(subjectId)
  const updateNote = useUpdateNote(subjectId)
  const deleteNote = useDeleteNote(subjectId)
  const [newContent, setNewContent] = useState('')

  function handleCreate() {
    const trimmed = newContent.trim()
    if (!trimmed) return
    createNote.mutate(trimmed, {
      onSuccess: () => setNewContent(''),
    })
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleCreate()
    }
  }

  function handleDelete(noteId: string) {
    if (confirm('¿Eliminar esta nota?')) {
      deleteNote.mutate(noteId)
    }
  }

  return (
    <>
      <div>
        <Input
          type="text"
          value={newContent}
          onChange={(e) => setNewContent(e.target.value.slice(0, 200))}
          onKeyDown={handleKeyDown}
          placeholder="Nueva nota..."
          className="flex-1 px-3 py-2 border rounded text-sm"
          maxLength={200}
        />
      </div>

      {isLoading && <p className="text-gray-500 text-sm">Cargando notas...</p>}
      {error && <p className="text-red-500 text-sm">Error al cargar las notas.</p>}

      <div className="flex flex-col gap-2">
        {notes?.map((note) => (
          <Note
            key={note.id}
            content={note.content}
            createdAt={note.createdAt}
            onSave={(content) => updateNote.mutate({ noteId: note.id, content })}
            onDelete={() => handleDelete(note.id)}
            isDeleting={deleteNote.isPending}
          />
        ))}
      </div>
    </>
  )
}
