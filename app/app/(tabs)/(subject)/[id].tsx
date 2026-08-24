import { Stack, useLocalSearchParams, useRouter } from "expo-router"
import { Alert, View, Text } from "react-native"
import ScreenScroll from "@/components/screen-scroll"
import { useSubjectsStore } from "@/stores/subjectsStore"
import SubjectContent from "@/components/subject/subject-content"
import Menu from "@/components/ui/menu"
import Schedule from "@/components/subject/schedule"
import { useState } from "react"
import NewScheduleDrawer from "@/components/subject/new-schedule-drawer"
import EditSubjectNameDrawer from "@/components/subject/edit-subject-drawer"

function SubjectScreen() {
    const { id } = useLocalSearchParams<{ id: string }>()
    const subjects = useSubjectsStore((s) => s.subjects)
    const deleteSubject = useSubjectsStore((s) => s.deleteSubject)
    const subject = subjects.find((s) => s.id === id)
    const [scheduleDrawerOpen, setScheduleDrawerOpen] = useState(false)
    const [editNameDrawerOpen, setEditNameDrawerOpen] = useState(false)
    const router = useRouter()

    if (!subject) return null

    const handleDelete = () => {
        Alert.alert(
            "Eliminar asignatura",
            `Esta acción no se puede deshacer.\n\n¿Seguro querés eliminar "${subject.name}"?`,
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Eliminar",
                    style: "destructive",
                    onPress: () => {
                        deleteSubject(subject.id)
                        router.back()
                    },
                },
            ]
        )
    }

    const options = [
        {
          label: "Nueva nota",
          onPress: () => router.push({
            pathname: "/(tabs)/note/new",
            params: { subjectId: subject.id },
          }),
        },
        {
          label: "Nueva evaluación",
          onPress: () => router.push({
            pathname: "/(tabs)/(evaluation)/new",
            params: { subjectId: subject.id },
          }),
        },
        {
          label: "Nueva tarea",
          onPress: () => router.push({
            pathname: "/(tabs)/task/new",
            params: { subjectId: subject.id },
          }),
        },
        {
          label: "Nuevo horario",
          onPress: () => setScheduleDrawerOpen(true),
        },
    ]

    const menuOptions = [
        {
          label: "Editar nombre",
          onPress: () => setEditNameDrawerOpen(true),
        },
        {
          label: "Eliminar",
          onPress: handleDelete,
        },
    ]

    return (
        <ScreenScroll>
            <Stack.Screen options={{ title: "Asignatura", headerShown: false }} />

            <View className="px-4 pt-6">
                <View className="flex-row items-center justify-between pb-4 mb-4">
                    <Text className="text-2xl text-left font-bold">{subject.name}</Text>
                    <View className="flex-row gap-2">
                      <Menu options={options} />
                      <Menu options={menuOptions} icon="dots_vertical" />
                    </View>
                </View>
                <Schedule schedules={subject.schedules} subjectId={subject.id} />

                <SubjectContent subject={subject} />
            </View>

            <NewScheduleDrawer
                visible={scheduleDrawerOpen}
                onClose={() => setScheduleDrawerOpen(false)}
                subjectId={subject.id}
            />

            <EditSubjectNameDrawer
                visible={editNameDrawerOpen}
                onClose={() => setEditNameDrawerOpen(false)}
                subjectId={subject.id}
                currentName={subject.name}
            />
        </ScreenScroll>
    )
}

export default SubjectScreen
