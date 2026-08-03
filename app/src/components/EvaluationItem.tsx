import { Trash2 } from 'lucide-react'
import { useUpdateEvaluation, useDeleteEvaluation } from '@/hooks/useEvaluations'
import { InlineEditableText, InlineEditableSelect } from './InlineEditableField'
import { Card, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { cn } from '@/lib/utils'
import type { Evaluation } from '@/types/evaluation'
import { evaluationTypes, getDaysUntil } from '@/lib/evaluations'

function getUrgencyClass(dateString: string) {
  const daysUntil = getDaysUntil(dateString)
  if (daysUntil < 0) return 'opacity-50 bg-slate-100'
  if (daysUntil < 3) return 'bg-red-100 border-red-300 dark:bg-red-950 dark:border-red-800'
  if (daysUntil < 6) return 'bg-orange-100 border-orange-300 dark:bg-orange-950 dark:border-orange-800'
  return ''
}

interface EvaluationItemProps {
  evaluation: Evaluation
  subjectId: string
}

export function EvaluationItem({ evaluation, subjectId }: EvaluationItemProps) {
  const updateEvaluation = useUpdateEvaluation(subjectId, evaluation.id)
  const deleteEvaluation = useDeleteEvaluation(subjectId)

  function handleDelete() {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta evaluación?')) {
      deleteEvaluation.mutate(evaluation.id)
    }
  }

  return (
    <Card className={cn('group mb-2 p-2 pt-0', getUrgencyClass(evaluation.date))}>
      <CardHeader className='p-0 pl-1'>
        <div className="flex items-center justify-between gap-2">
          <CardTitle className='leading-sm truncate w-30'>
            <InlineEditableText
              value={evaluation.title}
              className='truncate text-sm'
              onSave={(title) => updateEvaluation.mutate({ ...evaluation, title })}
            />
          </CardTitle>
          <Button
            variant="destructive"
            size="icon"
            onClick={handleDelete}
            disabled={deleteEvaluation.isPending}
            className="opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Trash2 size={16} />
          </Button>
        </div>
        <CardDescription className="flex flex-col items-start gap-1 flex-wrap text-xs">
          <InlineEditableSelect
            value={evaluation.type}
            options={evaluationTypes}
            onSave={(type) => updateEvaluation.mutate({ ...evaluation, type: type as Evaluation['type'] })}
          />
          <div className="flex gap-2">
            <InlineEditableText
            type="date"
            value={evaluation.date}
            className="font-semibold"
            onSave={(date) => updateEvaluation.mutate({ ...evaluation, date })}
          />
          <InlineEditableText
            type="number"
            value={evaluation.grade === null ? "" : String(evaluation.grade)}
            placeholder="S/N"
            onSave={(grade) => updateEvaluation.mutate({ ...evaluation, grade: grade === '' ? null : Number(grade) })}
          />
          </div>
        </CardDescription>
      </CardHeader>
    </Card>
  )
}
