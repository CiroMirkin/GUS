import { useQuery, useQueries, useMutation, useQueryClient } from "@tanstack/react-query"
import { collection, getDocs, doc, addDoc, updateDoc, deleteDoc, query, orderBy } from "firebase/firestore"
import { db } from "@/lib/firebase"
import type { Reminder } from "@/types/reminder"

function getDocsRef(subjectId: string) {
  return collection(db, "subjects", subjectId, "reminders")
}

function getDocRef(subjectId: string, reminderId: string) {
  return doc(db, "subjects", subjectId, "reminders", reminderId)
}

async function fetchReminders(subjectId: string): Promise<Reminder[]> {
  const q = query(getDocsRef(subjectId), orderBy("createdAt", "desc"))
  const snapshot = await getDocs(q)
  return snapshot.docs.map((d) => ({
    id: d.id,
    subjectId,
    ...d.data(),
  })) as Reminder[]
}

export function useReminders(subjectId: string) {
  return useQuery({
    queryKey: ["reminders", subjectId],
    queryFn: () => fetchReminders(subjectId),
  })
}

type UpdateReminderData = Partial<Pick<Reminder, "content" | "done">> & { id: string }

export function useCreateReminder(subjectId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (content: string) =>
      addDoc(getDocsRef(subjectId), {
        subjectId,
        content,
        done: false,
        createdAt: new Date().toISOString(),
      }),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reminders", subjectId] })
    },

    onError: (err) => {
      console.error("Error al crear el recordatorio:", err)
    },
  })
}

export function useUpdateReminder(subjectId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...data }: UpdateReminderData) =>
      updateDoc(getDocRef(subjectId, id), data),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reminders", subjectId] })
    },

    onError: (err) => {
      console.error("Error al guardar el recordatorio:", err)
    },
  })
}

export function useDeleteReminder(subjectId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (reminderId: string) =>
      deleteDoc(getDocRef(subjectId, reminderId)),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reminders", subjectId] })
    },

    onError: (err) => {
      console.error("Error al eliminar el recordatorio:", err)
    },
  })
}

export function useCareerReminders(_careerId: string, subjectIds: string[]) {
  const results = useQueries({
    queries: subjectIds.map((subjectId) => ({
      queryKey: ["reminders", subjectId],
      queryFn: () => fetchReminders(subjectId),
    })),
  })

  const allReminders = results.flatMap((r, i) =>
    (r.data ?? []).map((rem) => ({ ...rem, _subjectIndex: i }))
  )

  const pending = allReminders.filter((r) => !r.done)

  pending.sort((a, b) => a.createdAt.localeCompare(b.createdAt))

  return {
    data: pending,
    isLoading: results.some((r) => r.isLoading),
    error: results.find((r) => r.error)?.error ?? null,
  }
}
