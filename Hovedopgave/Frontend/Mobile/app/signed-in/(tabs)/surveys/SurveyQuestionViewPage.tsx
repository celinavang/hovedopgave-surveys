import { SurveyQuestionView } from "@/components/surveys/SurveyQuestionView";
import { TouchableOpacity, View, Text } from "react-native";

export default function SurveyQuestionViewPage() {
    return (
        <View style={{ flex: 1, justifyContent: "center" }}>
            <SurveyQuestionView />
            <View
                style={{
                    position: "absolute",
                    bottom: 32,
                    left: 0,
                    right: 0,
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 16,
                    paddingHorizontal: 24,
                }}
            >
                <TouchableOpacity
                    style={{
                        flex: 1,
                        backgroundColor: "#a14acf", 
                        borderRadius: 18,
                        paddingVertical: 12,
                        marginHorizontal: 8,
                        alignItems: "center",
                    }}
                    onPress={() => { /* to do */ }}
                    activeOpacity={0.8}
                >
                    <Text style={{ color: "#fff", fontSize: 16 }}>{"Forrige"}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={{
                        flex: 1,
                        backgroundColor: "#a14acf", 
                        borderRadius: 18,
                        paddingVertical: 12,
                        marginHorizontal: 8,
                        alignItems: "center",
                    }}
                    onPress={() => { /* to do */ }}
                    activeOpacity={0.8}
                >
                    <Text style={{ color: "#fff", fontSize: 16 }}>{"Næste"}</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}