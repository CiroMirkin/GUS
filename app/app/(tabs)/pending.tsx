import EvaluationList from "@/components/evaluation/evaluation-list"
import ScreenScroll from "@/components/screen-scroll"
import { useEvaluationsStore } from "@/stores/evaluationsStore"
import { useShallow } from 'zustand/react/shallow'
import { Text, View } from "react-native"
import { useRouter } from "expo-router"
import EmptySpace from "@/components/ui/empty-space"
import { evaluationToDate } from "@/lib/date"
import Menu from "@/components/ui/menu"
import TaskList from "@/components/task/task-list"
import { useTasksStore } from "@/stores/tasksStore"

export default function PendingTab() {
  const evaluations = useEvaluationsStore(
    useShallow((s) => {
      const startOfToday = new Date()
      startOfToday.setHours(0, 0, 0, 0)

      return s.evaluations
        .filter((e) => evaluationToDate(e).getTime() >= startOfToday.getTime())
        .sort((a, b) => evaluationToDate(a).getTime() - evaluationToDate(b).getTime())
    }),
  )
  const tasks = useTasksStore(
    useShallow((s) => s.tasks.filter((t) => !t.done))
  )

  const router = useRouter()
  const options = [
    {
      label: "Nueva evaluación",
      onPress: () => router.push({
        pathname: "/(tabs)/(evaluation)/new",
        params: { subjectId: null },
      }),
    },
    {
      label: "Nueva tarea",
      onPress: () => router.push({
        pathname: "/(tabs)/task/new",
        params: { subjectId: null },
      }),
    },
  ]

  const empty = (!evaluations || !evaluations.length) && (!tasks || !tasks.length)

  return (
    <ScreenScroll>
      <View className="flex-row items-center justify-between px-4 pt-6 pb-4">
        <Text className="text-2xl font-bold text-black">Pendientes</Text>
        <Menu options={options} />
      </View>

      <View className="px-4 flex-col gap-4">
        {empty && <EmptySpace icon="calendar_event" message="Por el momento no hay evaluaciones" />}

        <EvaluationList evaluations={evaluations} />
        <TaskList tasks={tasks} showSubjectName />
      </View>
    </ScreenScroll>
  )
}
