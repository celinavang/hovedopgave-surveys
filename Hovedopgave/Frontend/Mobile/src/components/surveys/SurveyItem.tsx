import { useRouter } from "expo-router";
import { Pressable } from "react-native";
import Text from "@/components/Text";
import View from "@/components/View";
import { DateTime } from "luxon";
import Ionicons from "@expo/vector-icons/Ionicons";



interface SurveyItemprops {
    surveyInstance: {
        id: string,
        deadline?: string;
        invitationDate?: string;
        status?: string;
        surveyAccessId: string;
        surveyAccess?: {
            id: string;
            role: string;
            entityId: string;
            surveyId: string;
            survey?: {
                title?: string;
                createdAt?: string;
                creatorId?: string;
                description?: string;
                id?: string;
            };
        }
        responseDate?: string;
    };
    tab: "AWAITING" | "COMPLETED"

}

export default function SurveyItem({ surveyInstance, tab }: SurveyItemprops) {
    const router = useRouter();
    const { invitationDate, status, surveyAccess, deadline, responseDate } = surveyInstance;

    return (
        <Pressable
            className="flex-row items-start px-1 py-2 pt-3 pb-1"
            onPress={() => router.push(`/signed-in/(tabs)/surveys/${surveyInstance.id}`)}
        >
            <View className="flex-1 bg-white shadow-md rounded-l px-4 py-3 ml-1 mr-2">
                <View className="flex-row justify-between items-center">
                    <View style={{ flex: 1 }}>
                        <Text
                            className="text-base text-black font-semibold w-36"
                            numberOfLines={3}
                        >
                            {surveyAccess?.survey?.title ?? "Ingen titel"}
                        </Text>
                        <Text className="text-sm text-black-500 mt-1">
                            {invitationDate
                                ? `Start dato: ${DateTime.fromISO(invitationDate).toFormat("dd LLL yyyy")}`
                                : "Ingen start dato"}
                        </Text>
                        <Text className="text-sm text-black-500 mt-1">
                            {tab === "COMPLETED"
                            ? responseDate
                                ? `Besvarelsesdato: ${DateTime.fromISO(responseDate).toFormat("dd LLL yyyy")}`
                                : "Ingen besvarelsesdato"
                            : deadline 
                                ? `Svarfrist: ${DateTime.fromISO(deadline).toFormat("dd LLL yyyy")}`
                                : "Ingen svarfrist"
                            }
                        </Text>
                    </View>
                    <View className="mt-2 ml-2">
                        {status === "COMPLETED" ? (
                            <Ionicons name="checkmark-circle-outline" size={28} color="teal" style={{ marginRight: 6}}/>
                            //<View className="w-3 h-3 rounded-full bg-teal-400"/>
                        ) : status === "AWAITING" ? (
                            <Ionicons name="time-outline" size={28} color="orange" style={{ marginRight: 6}}/>
                            //<View className="w-3 h-3 rounded-full bg-yellow-300"/>
                        ) : (
                            //<View className="w-3 h-3 rounded-full bg-gray-300"/>
                            <Ionicons name="alert-circle-outline" size={28} color="gray" style={{ marginRight: 6}}/>
                        )}
                    </View>
                </View>
            </View>

        </Pressable>
    )

}