import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useCareerReminders } from '@/hooks/useReminders'
import { Link } from '@tanstack/react-router'

export default function UpcomingRemindersSection({ careerId, subjects }: { careerId: string; subjects: { id: string; name: string }[] }) {
  const subjectIds = subjects.map((s) => s.id)
  const { data: reminders, isLoading } = useCareerReminders(careerId, subjectIds)

  if (isLoading) return null
  if (!reminders || reminders.length === 0) return null

  return (
    <Card className="w-50">
      <CardHeader>
        <CardTitle className="text-md">Recordatorios próximos</CardTitle>
        <CardDescription className="flex flex-col gap-2 mt-2">
          {reminders.map((rem) => {
            const subject = subjects.find((s) => s.id === rem.subjectId)
            return (
              <div key={rem.id} className="text-sm border-b p-1 pl-2 rounded last:border-b-0 bg-gray-100">
                <Link
                  to="/career/$career-id/subject/$subject-id"
                  params={{ 'career-id': careerId, 'subject-id': rem.subjectId }}
                  className="font-medium hover:underline"
                >
                  {rem.content}
                </Link>
                <span className="text-gray-500 ml-1">({subject?.name ?? rem.subjectId})</span>
              </div>
            )
          })}
        </CardDescription>
      </CardHeader>
    </Card>
  )
}
