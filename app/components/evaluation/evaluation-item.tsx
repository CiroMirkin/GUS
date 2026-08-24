import { Evaluation, TYPE_LABELS } from "@/types/evaluation"
import { useState } from "react"
import { Pressable, Text, View } from "react-native"
import EvaluationEditItem from "./evaluation-edit-item"
import { getProximityStyle } from "./getProximityStyle"
import { formatDate } from "../../lib/formatDate"
import { getDaysLeft } from "../../lib/getDaysLeft"
import { evaluationToDate } from "@/lib/date"
import { useEvaluationsStore } from "@/stores/evaluationsStore"
import clsx from "clsx"
import { icons } from "@/constants/icons"
import { useSubjectsByCareer } from "@/hooks/useSubjectsByCareer"
import { Linking } from "react-native"
import ButtonIcon from "../ui/button-icon"
import UrlLink from "../ui/url-link"

interface Props {
    item: Evaluation
}

export default function EvaluationItem({ item }: Props) {
    const [isExpanded, setIsExpanded] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const subjects = useSubjectsByCareer()
    const updateEvaluation = useEvaluationsStore((s) => s.updateEvaluation)
    const deleteEvaluation = useEvaluationsStore((s) => s.deleteEvaluation)

    const style = getProximityStyle(evaluationToDate(item))
    const daysLeft = getDaysLeft(evaluationToDate(item))
    const isTextDaysLeft = typeof daysLeft === "string"

    const getSubjectName = (subjectId: string) =>
        subjects.find((s) => s.id === subjectId)?.name || "Asignatura desconocida"

    if (isEditing) {
        return (
            <EvaluationEditItem
                evaluation={item}
                subjects={subjects}
                onSave={(updates) => {
                    updateEvaluation(item.id, updates)
                    setIsEditing(false)
                }}
                onCancel={() => setIsEditing(false)}
            />
        )
    }

    return (
        <Pressable
            onPress={() => setIsExpanded((prev) => !prev)}
            className={clsx("rounded-lg border p-3", style.bg, style.border)}
        >
            <View
                className={clsx(
                    "gap-2",
                    isTextDaysLeft ? "flex-col" : "items-center flex-row"
                )}
            >
                <View
                    className={clsx(
                        "border-black",
                        isTextDaysLeft
                            ? "w-full border-b-2 pb-2"
                            : "items-center border-r-2 px-4 pr-7"
                    )}
                >
                    <Text className={clsx("text-4xl font-bold", isTextDaysLeft ? "text-left" : "text-center")}>{daysLeft}</Text>
                    {!isTextDaysLeft && <Text className="text-lg text-center">Dias</Text>}
                </View>
                <View className={clsx("flex-1 gap-1", !isTextDaysLeft && "pl-4")}>
                    <Text className="text-lg font-semibold text-neutral-800">
                        {item.title}
                    </Text>
                    <Text className="text-md text-black">
                        <Text className="font-semibold">{TYPE_LABELS[item.type]}</Text> · {getSubjectName(item.subjectId)}
                    </Text>
                    <Text className="text-xs font-medium text-black opacity-80">
                        {formatDate(item)}
                    </Text>
                </View>
            </View>

            {isExpanded && (
                <View className="mt-3 gap-2 border-t-2 border-black pt-3">
                    {item.note ? (
                        <Text className="text-base text-black">{item.note}</Text>
                    ) : null}
                    {item.link ? (
                        <UrlLink url={item.link as string} />
                    ) : null}
                    {item.topics && item.topics.length > 0 ? (
                        <View className="gap-1">
                            <Text className="text-base font-medium text-black">
                                Temas a repasar:
                            </Text>
                            <View className="flex-row flex-wrap gap-1">
                                {item.topics.map((topic, idx) => (
                                    <View
                                        key={idx}
                                        className="rounded-full bg-neutral-100 px-2 py-0.5"
                                    >
                                        <Text className="text-xs text-neutral-600">{topic}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                    ) : null}

                    <View className="flex-row justify-end gap-2 pt-4">
                        <ButtonIcon icon="pencil" onPress={() => setIsEditing(true)} className="bg-blue" />
                        <ButtonIcon icon="trash" onPress={() => deleteEvaluation(item.id)} className="bg-red" />
                    </View>
                </View>
            )}
        </Pressable>
    )
}