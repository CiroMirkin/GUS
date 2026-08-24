import { Task } from "@/types/task";
import { Subject } from "@/types/subject";
import { useState } from "react";
import { View, Text, Pressable, TextInput, Platform } from "react-native";
import { DateTimePickerEvent } from "@react-native-community/datetimepicker"
import { formatDateLocal, stringToLocalDate } from "@/lib/date";
import DateTimeInput from "../ui/date-time-input";

function TaskEditItem({
  task,
  subjects,
  onSave,
  onCancel,
}: {
  task: Task
  subjects: Subject[]
  onSave: (updates: Partial<Omit<Task, "id" | "done" | "createdAt">>) => void
  onCancel: () => void
}) {
  const [title, setTitle] = useState(task.title)
  const [date, setDate] = useState<Date | null>(() => 
    task.date ? stringToLocalDate(task.date) : null
  )
  const [showPicker, setShowPicker] = useState(false)
  const [note, setNote] = useState(task.note || "")
  const [link, setLink] = useState(task.link || "")
  const [subjectId, setSubjectId] = useState(task.subjectId)

  const onChangeDate = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (Platform.OS === "android") setShowPicker(false)
    if (selectedDate) {
      setDate(selectedDate)
    }
  }

  const openPicker = () => {
    setShowPicker(true)
  }

  const handleSave = () => {
    if (!title.trim()) return
    onSave({
      subjectId: subjectId || undefined,
      title: title.trim(),
      date: date ? formatDateLocal(date) : undefined,
      note: note.trim() || undefined,
      link: link.trim() || undefined,
    })
  }

  return (
    <View className="gap-3 rounded-lg border border-blue-200 bg-blue-50 p-3">
      <Text className="text-sm font-semibold text-blue-800">Editar tarea</Text>

      <View className="flex-row flex-wrap gap-2">
        {subjects.map((s) => (
          <Pressable
            key={s.id}
            onPress={() => setSubjectId(subjectId === s.id ? undefined : s.id)}
            className={`rounded-full px-3 py-1.5 ${
              subjectId === s.id ? "bg-blue-500" : "bg-white"
            }`}
          >
            <Text
              className={`text-xs ${
                subjectId === s.id ? "text-white" : "text-neutral-700"
              }`}
            >
              {s.name}
            </Text>
          </Pressable>
        ))}
      </View>

      <TextInput
        value={title}
        onChangeText={setTitle}
        placeholder="Nombre"
        className="rounded-lg border border-neutral-300 bg-white p-2 text-sm text-neutral-800"
      />

      <Pressable
        onPress={openPicker}
        className="rounded-lg border border-neutral-300 bg-white p-2"
      >
        <Text className="text-sm text-neutral-800">
          {date ? formatDateLocal(date) : "--/--/----"}
        </Text>
      </Pressable>
      {date && (
        <Pressable onPress={() => setDate(null)} className="self-end">
          <Text className="text-xs text-neutral-500 underline">Quitar fecha</Text>
        </Pressable>
      )}
      {showPicker && (
        <DateTimeInput
          value={date ?? new Date()}
          mode="date"
          onChange={onChangeDate}
        />
      )}

      <TextInput
        value={note}
        onChangeText={setNote}
        multiline
        numberOfLines={2}
        placeholder="Notas"
        className="rounded-lg border border-neutral-300 bg-white p-2 text-sm text-neutral-800"
      />
      <TextInput
        value={link}
        onChangeText={setLink}
        placeholder="Enlace"
        className="rounded-lg border border-neutral-300 bg-white p-2 text-sm text-neutral-800"
      />

      <View className="flex-row justify-end gap-2">
        <Pressable
          onPress={onCancel}
          className="rounded-lg bg-neutral-200 px-3 py-1.5"
        >
          <Text className="text-xs font-medium text-neutral-700">Cancelar</Text>
        </Pressable>
        <Pressable
          onPress={handleSave}
          className="rounded-lg bg-blue-500 px-3 py-1.5"
        >
          <Text className="text-xs font-medium text-white">Guardar</Text>
        </Pressable>
      </View>
    </View>
  )
}


export default TaskEditItem
