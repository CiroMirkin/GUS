import { icons } from "@/constants/icons";
import { Tabs } from "expo-router";
import { View } from "react-native";
import clsx from "clsx";
import { SvgProps } from "react-native-svg";

const tabs = [
    { name: "index", title: "Inicio", icon: icons.home },
    { name: "notes", title: "Notas", icon: icons.library },
    { name: "pending", title: "Pendientes", icon: icons.calendar_event },
]
type TabIconProps = {
    focused: boolean;
    icon: React.FC<SvgProps>
};

const TabIcon = ({ focused, icon: Icon }: TabIconProps) => {
    return (
        <View className="tabs-icon">
            <View className={clsx('tabs-pill text-black', focused && 'tabs-active')}>
                <Icon width={28} height={28} />
            </View>
        </View>
    );
};

const TabLayout = () => (
    <Tabs
        screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: "#2a94e8",
            tabBarStyle: {
                backgroundColor: "#c8dbd8",
                borderTopWidth: 2,
                borderColor: "#34313a",
                height: 100,
            },
            tabBarItemStyle: {
                paddingTop: 4,
                paddingBottom: 2,
            },
            tabBarLabelStyle: {
                fontSize: 10,
            },
        }}
    >
        {tabs.map((tab) => (
            <Tabs.Screen
                key={tab.name}
                name={tab.name}
                options={{
                    title: tab.title,
                    tabBarIcon: ({ focused }) => (
                        <TabIcon focused={focused} icon={tab.icon} />
                    )
                }}
            />
        ))}

        <Tabs.Screen name="(subject)/[id]" options={{ href: null }} />
        <Tabs.Screen name="note/new" options={{ href: null }} />
        <Tabs.Screen name="note/[id]" options={{ href: null }} />
        <Tabs.Screen name="(evaluation)/new" options={{ href: null }} />
        
        <Tabs.Screen name="task/new" options={{ href: null }} />
    </Tabs>
)

export default TabLayout
