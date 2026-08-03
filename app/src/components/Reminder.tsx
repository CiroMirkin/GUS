import { Trash2, Check } from 'lucide-react'
import { MiniMarkdownEditor } from './MiniMarkdownEditor'
import { Card, CardHeader } from './ui/card'
import { Button } from './ui/button'
import { cn } from '@/lib/utils'
import type { Reminder as ReminderType } from '@/types/reminder'
import { InlineEditableText } from './InlineEditableField'

interface ReminderProps {
  reminder: ReminderType
  onUpdate: (patch: Partial<ReminderType> & { id: string }) => void
  onDelete: (id: string) => void
  isDeleting?: boolean
}

export function Reminder({ reminder, onUpdate, onDelete, isDeleting }: ReminderProps) {
  return (
    <Card className={cn('group', reminder.done && 'opacity-50')}>
        <CardHeader className="w-full">
            <div className="flex items-center gap-2">
                <Button
                    variant={reminder.done ? 'default' : 'outline'}
                    size="icon"
                    onClick={() => onUpdate({ id: reminder.id, done: !reminder.done })}
                    className="w-6 h-6 shrink-0"
                >
                    <Check size={12} />
                </Button>

                <div className="flex-1 text-base">
                    <InlineEditableText
                        value={reminder.content}
                        onSave={(content) => onUpdate({ id: reminder.id, content })}
                        placeholder="Agregar notas..."
                    />
                </div>

                <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => onDelete(reminder.id)}
                    disabled={isDeleting}
                    className="opacity-0 group-hover:opacity-100 transition-opacity w-6 h-6 shrink-0"
                >
                    <Trash2 size={12} />
                </Button>
            </div>
        </CardHeader>
    </Card>
  )
}
