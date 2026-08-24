import { useState } from "react"
import { Pressable, Text, View, Modal } from "react-native"
import ButtonIcon from "./button-icon"
import { IconKey } from "@/constants/icons"

export interface Option {
  label: string
  onPress: () => void
}

interface Props {
  options: Option[]
  icon?: IconKey
  classNameButton?: string
}

function Menu({ options, icon = "plus", classNameButton }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <View>
      <ButtonIcon icon={icon} onPress={() => setOpen(true)} className={classNameButton} />

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable
          className="flex-1 bg-black/30"
          onPress={() => setOpen(false)}
        >
          <View className="absolute right-4 top-20 w-48 overflow-hidden rounded-lg border-2 bg-white">
            {options.map((option, index) => (
              <Pressable
                key={option.label}
                onPress={() => {
                  setOpen(false)
                  option.onPress()
                }}
                className={`p-4 ${index !== options.length - 1 ? "border-b-2 border-black" : ""}`}
              >
                <Text className="text-lg font-medium text-black">{option.label}</Text>
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>
    </View>
  )
}

export default Menu
