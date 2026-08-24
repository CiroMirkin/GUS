import { Fragment, useState } from "react"
import { Schedule as ScheduleType } from "@/types/subject"
import { Pressable, View } from "react-native"
import { getMostProximateSchedule, sortSchedulesByDay } from "@/lib/schedule"
import { useSubjectsStore } from "@/stores/subjectsStore"
import ScheduleItem from "./schedule-item"
import ScheduleDetailDrawer from "./schedule-detail-drawer"
import NewScheduleDrawer from "./new-schedule-drawer"

interface Props {
    schedules?: ScheduleType[]
    subjectId: string
}

type DrawerMode = "none" | "detail" | "edit"

function Schedule({ schedules, subjectId }: Props) {
    const deleteSchedule = useSubjectsStore((s) => s.deleteSchedule)
    const [drawerMode, setDrawerMode] = useState<DrawerMode>("none")
    const [selectedSchedule, setSelectedSchedule] = useState<ScheduleType | null>(null)

    if (!schedules || schedules.length === 0) return null

    const sortedSchedules = sortSchedulesByDay(schedules)
    const proximate = getMostProximateSchedule(schedules)

    const handleEdit = (schedule: ScheduleType) => {
        setSelectedSchedule(schedule)
        setDrawerMode("edit")
    }

    const handleDelete = (schedule: ScheduleType) => {
        deleteSchedule(subjectId, schedule.id)
    }

    return (
        <Pressable onPress={() => setDrawerMode("detail")} className="py-4 px-2 mb-4 bg-yellow rounded-lg border-2 border-b-4 flex-row justify-evenly gap-2">
            {sortedSchedules.map((schedule, index) => (
                <Fragment key={schedule.id}>
                    {index > 0 && <View className="w-0.5 bg-black self-stretch" />}
                    <ScheduleItem
                        schedule={schedule}
                        isProximate={proximate?.schedule === schedule}
                    />
                </Fragment>
            ))}

            <ScheduleDetailDrawer
                visible={drawerMode === "detail"}
                onClose={() => setDrawerMode("none")}
                schedules={sortedSchedules}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            <NewScheduleDrawer
                visible={drawerMode === "edit"}
                onClose={() => setDrawerMode("none")}
                subjectId={subjectId}
                schedule={selectedSchedule ?? undefined}
            />
        </Pressable >
    )
}

export default Schedule
