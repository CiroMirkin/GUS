import Modal from "react-native-modal"
import { KeyboardAvoidingView, Platform, View } from "react-native"

interface Props {
  visible: boolean
  onClose: () => void
  children: React.ReactNode
}

export default function Drawer({ visible, onClose, children }: Props) {
  return (
    <Modal
      isVisible={visible}
      onBackdropPress={onClose}
      onSwipeComplete={onClose}
      swipeDirection="down"
      style={{ margin: 0, justifyContent: "flex-end" }}
      backdropOpacity={0.4}
      backdropColor="black"
      animationIn="slideInUp"
      animationOut="slideOutDown"
      animationInTiming={300}
      animationOutTiming={300}
      propagateSwipe
      statusBarTranslucent
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View className="w-full rounded-t-2xl bg-white p-4 pb-20 border-2 border-b-0 border-neutral-200">
          <View className="mb-4 items-center">
            <View className="h-1.5 w-12 rounded-full bg-neutral-300" />
          </View>
          {children}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  )
}
