import { DateTimePickerEvent } from "@react-native-community/datetimepicker"
import { Subject } from "@/types/subject"
import { useState } from "react"
import { Platform, Pressable, ScrollView, Text, View } from "react-native"
import TextInput from "../ui/text-input"
import clsx from "clsx"
import { formatDateLocal } from "@/lib/date"
import { useTasksStore } from "@/stores/tasksStore"
import { router } from "expo-router"
import { useCareerStore } from "@/stores/careerStore"
import DateTimeInput from "../ui/date-time-input"

interface FormState {
  subjectId: string
  title: string
  date: Date | null
  note: string
  link: string
  showPicker: boolean
}

interface Props {
  subjects?: Subject[]
  subjectId: string | null
  onCancel?: () => void
}

function getInitialState(subjectId: string | null): FormState {
  return {
    subjectId: subjectId ?? "",
    title: "",
    date: null,
    note: "",
    link: "",
    showPicker: false,
  }
}

export default function TaskInput({ subjects, subjectId, onCancel }: Props) {
  const [form, setForm] = useState<FormState>(() => getInitialState(subjectId))
  const career = useCareerStore(s => s.career)
  const addTask = useTasksStore((s) => s.addTask)
  const isSubjectLocked = !!subjectId

  const updateField = <K extends keyof FormState>(field: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const onChangeDate = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (Platform.OS === "android") updateField("showPicker", false)
    if (selectedDate) {
      updateField("date", selectedDate)
    }
  }

  const openPicker = () => {
    setForm((prev) => ({ ...prev, showPicker: true }))
  }

  const handleSubmit = () => {
    if (!form.title.trim()) return

    addTask({
      careerId: career.id,
      subjectId: form.subjectId || undefined,
      title: form.title.trim(),
      date: form.date ? formatDateLocal(form.date) : undefined,
      note: form.note.trim() || undefined,
      link: form.link.trim() || undefined,
    })

    setForm(getInitialState(subjectId))
    router.back()
  }

  return (
    <ScrollView
      className="w-full"
      contentContainerClassName="flex-col gap-3 px-4 py-2"
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
    >
      {!isSubjectLocked && subjects && (
        <View className="gap-1">
          <Text className="text-base font-medium text-black">Asignatura</Text>
          <View className="flex-row flex-wrap gap-2">
            {subjects.map((s) => (
              <Pressable
                key={s.id}
                onPress={() => updateField("subjectId", form.subjectId === s.id ? "" : s.id)}
                className={clsx(
                  "rounded-full px-3 py-1.5",
                  form.subjectId === s.id ? "bg-blue" : "bg-neutral-200"
                )}
              >
                <Text className={clsx(
                  "text-sm font-medium",
                  form.subjectId === s.id ? "text-white" : "text-black"
                )}>{s.name}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      )}

      <View className="gap-1">
        <Text className="text-base font-medium text-black">Nombre *</Text>
        <TextInput
          value={form.title}
          onChangeText={(text) => updateField("title", text)}
          className="w-full rounded-lg border border-black bg-white p-3 text-base text-black"
        />
      </View>

      <View className="gap-1">
        <Text className="text-base font-medium text-black">Fecha limite (opcional)</Text>
        <Pressable
          onPress={openPicker}
          className="w-full rounded-lg border border-black bg-white p-3"
        >
          <Text className="text-base text-black">
            {form.date ? formatDateLocal(form.date) : "--/--/----"}
          </Text>
        </Pressable>
        {form.date && (
          <Pressable onPress={() => updateField("date", null)} className="self-end">
            <Text className="text-sm text-red underline">Quitar fecha</Text>
          </Pressable>
        )}
        {form.showPicker && (
          <DateTimeInput
            value={form.date ?? new Date()}
            mode="date"
            onChange={onChangeDate}
          />
        )}
      </View>

      <View className="gap-1">
        <Text className="text-base font-medium text-black">Notas</Text>
        <TextInput
          value={form.note}
          onChangeText={(text) => updateField("note", text)}
          multiline
          numberOfLines={3}
          maxLength={5000}
          placeholder="Detalles adicionales..."
          className="w-full rounded-lg border border-black bg-white p-3 text-base text-black"
        />
        <Text className="text-xs text-black">{form.note.length}/5000</Text>
      </View>

      <View className="gap-1">
        <Text className="text-base font-medium text-black">Enlace</Text>
        <TextInput
          value={form.link}
          onChangeText={(text) => updateField("link", text)}
          placeholder="https://..."
          className="w-full rounded-lg border border-black bg-white p-3 text-base text-black"
        />
      </View>

      <View className="flex-row justify-end gap-2 py-2">
        {onCancel && (
          <Pressable onPress={onCancel} className="rounded-lg bg-black px-4 py-2">
            <Text className="text-base font-medium text-black">Cancelar</Text>
          </Pressable>
        )}
        <Pressable onPress={handleSubmit} className="rounded-lg bg-green border-2 px-4 py-2">
          <Text className="text-base font-medium text-black">Crear</Text>
        </Pressable>
      </View>
    </ScrollView>
  )
}
