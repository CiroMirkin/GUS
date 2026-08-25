import { Link } from "expo-router"
import { Text, View } from "react-native"
import { Note } from "@/types/note"

interface Props {
    note: Note
    subjectName?: string
}

function firstLine(content: string) {
    return content.trimStart().split("\n")[0]
}

export default function NoteItem({ note, subjectName }: Props) {
    return (
        <Link
            href={{
                pathname: "/(tabs)/note/[id]",
                params: { id: note.id }
            }}
            asChild
        >
            <View className="flex-col gap-2 rounded-lg border-2 bg-[#abdef1] p-2 px-3">
                <Text numberOfLines={1} className="text-base text-black">
                    {firstLine(note.content)}
                </Text>

                <View className="flex-row justify-between items-center">
                    {subjectName && (
                        <Text className="px-2 py-1 self-end text-xs rounded-xl text-black font-semibold bg-green">
                            {subjectName}
                        </Text>
                    )}
                    <Text className="text-xs text-neutral-500">
                        {new Date(note.createdAt).toLocaleString()}
                    </Text>
                </View>
            </View>
        </Link>
    )
}
