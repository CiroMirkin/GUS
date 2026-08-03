import { useState } from 'react'
import { useReminders, useCreateReminder, useUpdateReminder, useDeleteReminder } from '@/hooks/useReminders'
import { Input } from './ui/input'
import { Reminder } from './Reminder'

interface RemindersListProps {
  subjectId: string
}

export function RemindersList({ subjectId }: RemindersListProps) {
  const { data: reminders, isLoading, error } = useReminders(subjectId)
  const createReminder = useCreateReminder(subjectId)
  const updateReminder = useUpdateReminder(subjectId)
  const deleteReminder = useDeleteReminder(subjectId)
  const [newContent, setNewContent] = useState('')

  function handleCreate() {
    const trimmed = newContent.trim()
    if (!trimmed) return
    createReminder.mutate(trimmed, {
      onSuccess: () => setNewContent(''),
    })
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleCreate()
    }
  }

  function handleDelete(reminderId: string) {
    if (confirm('¿Eliminar este recordatorio?')) {
      deleteReminder.mutate(reminderId)
    }
  }

  return (
    <div className="p-1">
      <div className="mb-4">
        <Input
          type="text"
          value={newContent}
          onChange={(e) => setNewContent(e.target.value.slice(0, 200))}
          onKeyDown={handleKeyDown}
          placeholder="Nuevo recordatorio..."
          className="flex-1 px-3 py-2 border rounded text-sm"
          maxLength={200}
        />
      </div>

      {isLoading && <p className="text-gray-500 text-sm">Cargando recordatorios...</p>}
      {error && <p className="text-red-500 text-sm">Error al cargar los recordatorios.</p>}

      <div className="flex flex-col gap-2">
        {reminders?.map((reminder) => (
          <Reminder
            key={reminder.id}
            reminder={reminder}
            onUpdate={updateReminder.mutate}
            onDelete={handleDelete}
            isDeleting={deleteReminder.isPending}
          />
        ))}
      </div>
    </div>
  )
}
