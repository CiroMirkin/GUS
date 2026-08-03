import { useMemo, useState } from 'react'
import { useEvaluations } from '@/hooks/useEvaluations'
import { Plus } from 'lucide-react'
import { EvaluationItem } from './EvaluationItem'
import { NewEvaluationDialog } from './NewEvaluationDialog'
import { Button } from './ui/button'

interface EvaluationsListProps {
  subjectId: string
}

export function EvaluationsList({ subjectId }: EvaluationsListProps) {
  const { data: evaluations, isLoading, error } = useEvaluations(subjectId)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const sortedEvaluations = useMemo(() => {
    if (!evaluations) return evaluations
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    return [...evaluations].sort((a, b) => {
      const aTime = new Date(a.date).getTime()
      const bTime = new Date(b.date).getTime()
      const aIsPast = aTime < today.getTime()
      const bIsPast = bTime < today.getTime()

      if (aIsPast !== bIsPast) return aIsPast ? 1 : -1
      return aTime - bTime
    })
  }, [evaluations])

  return (
    <div className='p-1 w-36'>
      {isLoading && <p className="text-gray-500">Cargando evaluations...</p>}
      {error && <p className="text-red-500">Error al cargar las evaluations.</p>}
      {sortedEvaluations?.map((ev) => (
        <EvaluationItem key={ev.id} evaluation={ev} subjectId={subjectId} />
      ))}
      <NewEvaluationDialog
        subjectId={subjectId}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
      <div className="flex items-center justify-between gap-4 mb-4">
        <Button variant='outline' onClick={() => setIsDialogOpen(true)}>
          <Plus size={16} />
        </Button>
      </div>
    </div>
  )
}
