import { Text, View } from "react-native"
import { Link } from "expo-router"
import { Subject } from "@/types/subject"
import { icons } from "@/constants/icons"
import { getUpcomingScheduleInfo, formatMinutes, UpcomingScheduleInfo } from "@/lib/schedule"
import cn from "@/lib/cn"

interface Props {
  subjects: Subject[]
  onDelete: (id: string) => void
}

export default function SubjectList({ subjects, onDelete }: Props) {
  if (!subjects.length) return;

  return (
    <View className="w-full border-2 rounded-lg mt-4 overflow-hidden">
      {subjects.map((item, index) => {
        const scheduleInfo = getUpcomingScheduleInfo(item.schedules)
        const remainingLabel = getRemainingLabel(scheduleInfo)

        return (
          <Link
            key={item.id}
            href={{
              pathname: "/(tabs)/(subject)/[id]",
              params: { id: item.id },
            }}
            className={`bg-orange ${index !== subjects.length - 1 ? "border-b-2 border-black" : ""
              }`}
          >
            <View className="w-full flex-row items-center justify-between p-4">
              <View>
                <ScheduleLabel scheduleInfo={scheduleInfo} remainingLabel={remainingLabel} />
                <Text className="text-xl font-medium text-black">
                  {item.name}
                </Text>
              </View>
              <icons.chevron_right width={24} height={24} />
            </View>
          </Link>
        )
      })}
    </View>
  )
}

interface LabelProps {
  scheduleInfo: UpcomingScheduleInfo | null
  remainingLabel: string | null
}

function ScheduleLabel({ scheduleInfo, remainingLabel }: LabelProps) {
  if (remainingLabel) {
    return <Text className="text-xs font-bold text-black">{remainingLabel}</Text>
  }

  if (!scheduleInfo) return null

  return (
    <Text className={cn("text-xs text-black", scheduleInfo.isToday ? "font-bold" : "font-semibold opacity-60")}>
      {scheduleInfo.label}
    </Text>
  )
}

const REMAINING_THRESHOLD_MINUTES = 180

function getRemainingLabel(scheduleInfo: UpcomingScheduleInfo | null): string | null {
  if (
    scheduleInfo?.status === "before"
    && scheduleInfo.minutesUntilStart !== null
    && scheduleInfo.minutesUntilStart <= REMAINING_THRESHOLD_MINUTES
  ) {
    return `Empieza en ${formatMinutes(scheduleInfo.minutesUntilStart)}`
  }

  if (scheduleInfo?.status === "during" && scheduleInfo.minutesUntilEnd !== null) {
    return `Termina en ${formatMinutes(scheduleInfo.minutesUntilEnd)}`
  }

  return null
}