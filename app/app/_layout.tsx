import "./global.css"
import { Stack, useNavigationContainerRef } from "expo-router"
import { SafeAreaProvider, useSafeAreaInsets } from "react-native-safe-area-context"
import { View } from "react-native"
import { useCareerStore } from "@/stores/careerStore"
import SetUp from "./set-up"
import * as Sentry from "@sentry/react-native"
import { useEffect } from "react"

const navigationIntegration = Sentry.reactNavigationIntegration({
  enableTimeToInitialDisplay: true,
})

Sentry.init({
  dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0,
  integrations: [navigationIntegration],
})

function RootLayout() {
  const navigationRef = useNavigationContainerRef()

  useEffect(() => {
    if (navigationRef?.current) {
      navigationIntegration.registerNavigationContainer(navigationRef)
    }
  }, [navigationRef])

  return (
    <SafeAreaProvider>
      <StackWithInsets />
    </SafeAreaProvider>
  )
}

export default Sentry.wrap(RootLayout)

function StackWithInsets() {
  const insets = useSafeAreaInsets()
  const career = useCareerStore((s) => s.career)

  if (!career.id && !career.name) {
    return (
      <View style={{ flex: 1, paddingTop: insets.top }} className="bg-white">
        <SetUp />
      </View>
    )
  }

  return (
    <View style={{ flex: 1, paddingTop: insets.top }} className="bg-white">
      <Stack screenOptions={{ headerShown: false }} />
    </View>
  )
}

