import { DateTimePickerEvent } from "@react-native-community/datetimepicker"
import { EvaluationType } from "@/types/evaluation"
import { Subject } from "@/types/subject"
import { useState } from "react"
import { Platform, Pressable, ScrollView, Text, TextInput, View } from "react-native"
import clsx from "clsx"
import { formatDateLocal, formatTimeLocal } from "@/lib/date"
import { useEvaluationsStore } from "@/stores/evaluationsStore"
import { router } from "expo-router"
import DateTimeInput from "../ui/date-time-input"

const EVALUATION_TYPES: { value: EvaluationType; label: string }[] = [
  { value: "partial", label: "Parcial" },
  { value: "final", label: "Final" },
  { value: "retake", label: "Recuperatorio" },
  { value: "practical_work", label: "TP" },
  { value: "presentation", label: "Presentación" },
  { value: "task", label: "Tarea" },
]

interface FormState {
  subjectId: string
  title: string
  date: Date
  time: Date | null
  type: EvaluationType
  note: string
  link: string
  topicsRaw: string
  showPicker: boolean
  pickerMode: "date" | "time"
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
    date: new Date(),
    time: null,
    type: "partial",
    note: "",
    link: "",
    topicsRaw: "",
    showPicker: false,
    pickerMode: "date",
  }
}

export default function EvaluationInput({ subjects, subjectId, onCancel }: Props) {
  const [form, setForm] = useState<FormState>(() => getInitialState(subjectId))
  const addEvaluation = useEvaluationsStore((s) => s.addEvaluation)
  const isSubjectLocked = !!subjectId

  const updateField = <K extends keyof FormState>(field: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const onChangeDate = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (Platform.OS === "android") updateField("showPicker", false)
    if (selectedDate) {
      if (form.pickerMode === "date") {
        updateField("date", selectedDate)
      } else {
        updateField("time", selectedDate)
      }
    }
  }

  const openPicker = (mode: "date" | "time") => {
    setForm((prev) => ({ ...prev, pickerMode: mode, showPicker: true }))
  }

  const handleSubmit = () => {
    if (!form.title.trim() || !form.subjectId) return

    const topics = form.topicsRaw
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0)

    addEvaluation({
      subjectId: form.subjectId,
      title: form.title.trim(),
      date: formatDateLocal(form.date),
      time: form.time ? formatTimeLocal(form.time) : undefined,
      type: form.type,
      note: form.note.trim() || undefined,
      link: form.link.trim() || undefined,
      topics: topics.length > 0 ? topics : undefined,
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
      {!isSubjectLocked && subjects && !subjectId && (
        <View className="gap-1">
          <Text className="text-base font-medium text-black">Asignatura *</Text>
          <View className="flex-row flex-wrap gap-2">
            {subjects.map((s) => (
              <Pressable
                key={s.id}
                onPress={() => updateField("subjectId", s.id)}
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
        <Text className="text-base font-medium text-black">Fecha *</Text>
        <Pressable
          onPress={() => openPicker("date")}
          className="w-full rounded-lg border border-black bg-white p-3"
        >
          <Text className="text-base text-black">
            {formatDateLocal(form.date)}
          </Text>
        </Pressable>
      </View>

      <View className="gap-1">
        <Text className="text-base font-medium text-black">Hora (opcional)</Text>
        <Pressable
          onPress={() => openPicker("time")}
          className="w-full rounded-lg border border-black bg-white p-3"
        >
          <Text className="text-base text-black">
            {form.time ? formatTimeLocal(form.time) : "--:--"}
          </Text>
        </Pressable>
        {form.time && (
          <Pressable onPress={() => updateField("time", null)} className="self-end">
            <Text className="text-sm text-red underline">Quitar hora</Text>
          </Pressable>
        )}
        {form.showPicker && (
          <DateTimeInput
            value={form.pickerMode === "date" ? form.date : form.time ?? form.date}
            mode={form.pickerMode}
            onChange={onChangeDate}
          />
        )}
      </View>

      <View className="gap-1">
        <Text className="text-base font-medium text-black">Tipo</Text>
        <View className="flex-row flex-wrap gap-2">
          {EVALUATION_TYPES.map((t) => (
            <Pressable
              key={t.value}
              onPress={() => updateField("type", t.value)}
              className={clsx(
                "rounded-full px-3 py-1.5",
                form.type === t.value ? "bg-blue" : "bg-neutral-200"
              )}
            >
              <Text
                className={clsx(
                  "text-sm font-medium",
                  form.type === t.value ? "text-white" : "text-black"
                )}
              >
                {t.label}
              </Text>
            </Pressable>
          ))}
        </View>
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

      <View className="gap-1">
        <Text className="text-base font-medium text-black">Temas a repasar</Text>
        <TextInput
          value={form.topicsRaw}
          onChangeText={(text) => updateField("topicsRaw", text)}
          placeholder="Separados por coma"
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
