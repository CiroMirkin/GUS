import { useState } from "react"
import { Pressable, Text, View } from "react-native"
import { Task } from "@/types/task"
import clsx from "clsx"
import { icons } from "@/constants/icons"
import { useTasksStore } from "@/stores/tasksStore"
import { useSubjectsStore } from "@/stores/subjectsStore"
import { Linking } from "react-native"
import { isTaskUrgent } from "@/lib/task"
import TaskEditItem from "@/components/task/task-edit-item"
import ButtonIcon from "../ui/button-icon"
import UrlLink from "../ui/url-link"

interface Props {
    task: Task
    subjectName?: string
}

export default function TaskItem({ task, subjectName }: Props) {
    const [expanded, setExpanded] = useState(false)
    const [editing, setEditing] = useState(false)
    const toggleTask = useTasksStore((s) => s.toggleTask)
    const deleteTask = useTasksStore((s) => s.deleteTask)
    const updateTask = useTasksStore((s) => s.updateTask)
    const subjects = useSubjectsStore((s) => s.subjects)
    const urgent = isTaskUrgent(task)

    if (editing) {
        return (
            <TaskEditItem
                task={task}
                subjects={subjects}
                onSave={(updates) => {
                    updateTask(task.id, updates)
                    setEditing(false)
                }}
                onCancel={() => setEditing(false)}
            />
        )
    }

    return (
        <Pressable
            onPress={() => setExpanded((prev) => !prev)}
            className={clsx("rounded-lg border-2 p-3", urgent && "bg-yellow")}
        >
            <View className="flex-row items-center gap-2">

            {subjectName && 
                <Text
                className="px-2 py-1 self-end text-xs rounded-xl text-black font-semibold bg-blue/60"
                >
                    {subjectName}
                </Text>
            }
            <Text
                className={clsx(
                    "text-lg font-medium",
                    task.done ? "text-neutral-400 line-through" : "text-black"
                )}
                numberOfLines={expanded ? undefined : 1}
                ellipsizeMode="tail"
                >
                {task.title}
            </Text>
            </View>

            {expanded && (
                <View className="mt-2 flex-col gap-2">
                    {task.date && (
                        <Text className="text-sm text-black font-bold">
                            Fecha limite: {task.date}
                        </Text>
                    )}
                    {task.note && (
                        <Text className="text-base text-neutral-700">{task.note}</Text>
                    )}
                    {task.link && (
                        <UrlLink url={task.link as string} />
                    )}

                    <View className="flex-row items-center justify-end gap-3 pt-4 border-t-2">
                        <ButtonIcon icon="check" onPress={() => toggleTask(task.id)} className={task.done ? "bg-green" : "bg-white"} />
                        <ButtonIcon icon="pencil" onPress={() => setEditing(true)} className="bg-blue" />
                        <ButtonIcon icon="trash" onPress={() => deleteTask(task.id)} className="bg-red" />
                    </View>
                </View>
            )}
        </Pressable>
    )
}
