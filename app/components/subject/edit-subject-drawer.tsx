import { useEffect, useState } from "react"
import { Pressable, Text, TextInput, View } from "react-native"
import Drawer from "@/components/ui/drawer"
import { useSubjectsStore } from "@/stores/subjectsStore"

interface Props {
    visible: boolean
    onClose: () => void
    subjectId: string
    currentName: string
}

function EditSubjectNameDrawer({ visible, onClose, subjectId, currentName }: Props) {
    const updateSubject = useSubjectsStore((s) => s.updateSubject)
    const [name, setName] = useState(currentName)

    useEffect(() => {
        if (visible) setName(currentName)
    }, [visible, currentName])

    const handleSubmit = () => {
        if (!name.trim()) return
        updateSubject(subjectId, name.trim())
        onClose()
    }

    return (
        <Drawer visible={visible} onClose={onClose}>
            <Text className="mb-3 text-lg font-bold text-neutral-800">Cambiar nombre</Text>

            <TextInput
                value={name}
                onChangeText={setName}
                autoFocus
                className="w-full rounded-lg border border-black bg-white p-3 text-base text-black"
            />

            <View className="mt-4 flex-row justify-end gap-3">
                <Pressable onPress={onClose} className="px-4 py-2 bg-neutral-100 border-2 border-neutral-300 rounded-lg">
                    <Text className="text-sm text-neutral-500">Cancelar</Text>
                </Pressable>
                <Pressable onPress={handleSubmit} className="rounded-lg bg-green border-2 px-4 py-2">
                    <Text className="text-sm font-medium text-black">Guardar</Text>
                </Pressable>
            </View>
        </Drawer>
    )
}

export default EditSubjectNameDrawer
