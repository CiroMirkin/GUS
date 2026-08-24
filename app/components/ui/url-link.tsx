import { Linking, Pressable, Text } from "react-native"
import * as Clipboard from "expo-clipboard"
import * as Haptics from "expo-haptics"
import { icons } from "@/constants/icons"
import cn from "@/lib/cn"

interface Props {
    url: string
    className?: string
}

function UrlLink({ url, className, }: Props) {
    const handleCopy = async () => {
        await Clipboard.setStringAsync(url)
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
    }

    return (
        <Pressable
            onPress={() => Linking.openURL(url)}
            onLongPress={handleCopy}
            className={cn("flex-row items-center gap-2", className)}
        >
            <icons.link width={16} height={16} />
            <Text className="flex-1 text-base text-black underline" numberOfLines={1}>
                {url}
            </Text>
        </Pressable>
    )
}

export default UrlLink
