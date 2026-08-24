import { IconKey, icons } from "@/constants/icons"
import { Text, View } from "react-native"

interface Props {
  icon?: IconKey
  message?: string
}

function EmptySpace({ icon, message }: Props) {
  const Icon = icon ? icons[icon] : null

  return (
    <View className="items-center justify-center pt-30 opacity-50">
      {Icon && <Icon width={48} height={48} />}
      <Text className="mt-2 text-lg font-semibold text-black">{message}</Text>
    </View>
  )
}

export default EmptySpace
