import { View, TouchableOpacity } from "react-native";

import {
    Settings,
    RotateCcw,
    History
} from "lucide-react-native";

interface Props {

    onSettingsPress: () => void;

    onResetPress: () => void;

    onHistoryPress: () => void;

}

export default function TopBar({

    onSettingsPress,

    onResetPress,

    onHistoryPress

}: Props) {

    return (

        <View
            style={{
                position: "absolute",
                top: 55,
                left: 20,
                right: 20,

                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
            }}
        >

            <View
                style={{
                    flexDirection: "row",
                    gap: 15,
                }}
            >

                <TouchableOpacity
                    onPress={onSettingsPress}
                >

                    <Settings
                        color="white"
                        size={24}
                        strokeWidth={2}
                    />

                </TouchableOpacity>

                <TouchableOpacity
                    onPress={onResetPress}
                >

                    <RotateCcw
                        color="white"
                        size={24}
                        strokeWidth={2}
                    />

                </TouchableOpacity>

            </View>

            <TouchableOpacity
                onPress={onHistoryPress}
            >

                <History
                    color="white"
                    size={24}
                    strokeWidth={2}
                />

            </TouchableOpacity>

        </View>

    );

}