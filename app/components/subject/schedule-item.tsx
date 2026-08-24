import { MODALITY_LABELS, ScheduleModality, Schedule as ScheduleType } from "@/types/subject"
import { Text, View } from "react-native"
import { useScheduleTimeInfo } from "@/hooks/useScheduleTimeInfo"
import { formatMinutes } from "@/lib/schedule"
import cn from "@/lib/cn"

interface LabelProps {
    label: string
    time?: string
    modality?: ScheduleModality
}

function ScheduleLabel({ label, time, modality }: LabelProps) {
    return (
        <View className="flex-col gap-px items-start">
            <View className="flex-row gap-2 items-center">
                <Text className="text-xs font-bold">{label}</Text>
                {modality &&
                <Text className={cn(
                    "text-xs font-semibold rounded pt-px px-2",
                    modality == "in_person" ? "bg-green" : "bg-blue/50",
                )}>
                    {MODALITY_LABELS[modality].at(0)?.toUpperCase()}
                </Text>
                }
            </View>
            <Text className="text-2xl font-semibold">
                {time ? `${time}hs` : ""}
            </Text>
        </View>
    )
}

interface ItemProps {
    schedule: ScheduleType
    isProximate: boolean
}

const TODAY_STATUSES = ["before", "during", "after", "no-time"]

function ScheduleItem({ schedule, isProximate }: ItemProps) {
    const { status, minutesUntilStart, minutesUntilEnd } = useScheduleTimeInfo(schedule)
    const itIsToday = TODAY_STATUSES.includes(status)
    const isDimmed = !itIsToday && !isProximate

    let label = schedule.day
    let time = schedule.startTime

    if (itIsToday) {
        label = "Hoy"
    }
    else if (status === "tomorrow") {
        label = schedule.startTime ? "Mañana" : ""
        time = schedule.startTime ?? "Mañana"
    }

    return (
        <View className={cn("px-2 pr-4", isDimmed && "opacity-60")}>
            <ScheduleLabel label={label} time={time} modality={schedule.modality} />
            {status === "before" && minutesUntilStart !== null && (
                <Text className="text-xs font-semibold">Empieza en {formatMinutes(minutesUntilStart)}</Text>
            )}
            {status === "during" && minutesUntilEnd !== null && (
                <Text className="text-xs font-semibold">Termina en {formatMinutes(minutesUntilEnd)}</Text>
            )}
        </View>
    )
}

export default ScheduleItem
