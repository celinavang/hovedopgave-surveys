import Ionicons from "@expo/vector-icons/Ionicons";
import { DateTime } from "luxon";
import { Button, Text, View } from "react-native";
import Space from "../Space";
import { ScrollView } from "react-native-gesture-handler";
import { router } from "expo-router";

export default function SurveyInfoCard({ survey, instance }: { survey?: any, instance: any }) {
    const surveyItem = survey ? survey : instance?.surveyAccess?.survey;

    if (!surveyItem) {
        return <Text>Ingen data tilgængelig</Text>
    }

    const timeString = () => {
        const timeEstimate = instance?.surveyAccess?.survey?.timeEstimate;
        if (!timeEstimate) return "Ikke angivet";
        const hour = Number(instance?.surveyAccess?.survey?.timeEstimate?.split(":")[0]);
        const minute = Number(instance?.surveyAccess?.survey?.timeEstimate?.split(":")[1]);
        const time = hour + (hour > 1 ? " timer" : " time ") + ' og ' + (minute > 1 ? " " + minute + " minutter" : "minut");
        return time;
    };

    return (

        <View style={{ flex: 1, backgroundColor: "#f3f4f6", alignItems: "center", justifyContent: "center" }}>
            <View
                style={{
                    backgroundColor: "white",
                    borderRadius: 8,
                    padding: 36,
                    width: "92%",
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.12,
                    shadowRadius: 8,
                    elevation: 4,

                }}
            >
                <ScrollView contentContainerStyle={{ padding: 10, alignItems: "center", flexGrow: 1 }}>
                    <Text
                        style={{ fontSize: 28, fontWeight: "bold", color: "#333", marginBottom: 14, textAlign: "center" }}
                        numberOfLines={2}
                    >
                        {surveyItem.title || "Ingen titel"}
                    </Text>

                    <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 6 }}>
                        <Ionicons name="time" size={18} color="#666" style={{ marginRight: 6 }} />
                        <Text style={{ color: "#666", fontSize: 16 }}>
                            Forventet tidsforbrug: <Text style={{ fontWeight: "bold", fontSize: 16 }}>{timeString()}</Text>
                        </Text>
                    </View>
                    <Text style={{ fontSize: 16, color: "#666", marginBottom: 2, fontWeight: "bold" }}>Beskrivelse af spørgeskemaet</Text>
                    <Text
                        style={{ color: "#444", marginBottom: 12, textAlign: "center", fontSize: 16 }}
                        numberOfLines={2}
                    >
                        {surveyItem?.description}
                    </Text>

                    <Space size="md" />

                    <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 4 }}>
                        <Ionicons name="bar-chart-sharp" size={60} color="#6618a1" style={{ marginRight: 6 }} />
                    </View>

                    <Space size="md" />

                    <View style={{ marginTop: 20, paddingTop: 8 }}>
                        <Text
                            style={{
                                color: "#666",
                                fontWeight: "bold",
                                marginBottom: 6,
                                fontSize: 18,
                                borderBottomWidth: 2,
                                borderBottomColor: "#eee",
                                paddingBottom: 6,
                                textAlign: "center"
                            }}
                        >
                            Oplysninger
                        </Text>

                        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 4 }}>
                            <Ionicons name="person" size={16} color="#666" style={{ marginRight: 6 }} />
                            <Text style={{ color: "#666", fontSize: 16 }}>
                                Inviteret af: <Text style={{ fontWeight: "bold", fontSize: 16 }}>
                                    {instance?.invitedBy?.fullName || "Ukendt"}
                                </Text>
                            </Text>
                        </View>

                        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 4 }}>
                            <Ionicons name="calendar-clear-outline" size={16} color="#666" style={{ marginRight: 6 }} />
                            <Text style={{ color: "#666", fontSize: 16 }}>
                                Dato: <Text style={{ fontWeight: "bold", fontSize: 16 }}>
                                    {instance.invitationDate ? DateTime.fromISO(instance.invitationDate).toFormat("dd/MM/yyyy") : "-"}
                                </Text>
                            </Text>
                        </View>

                        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 4 }}>
                            <Ionicons name="time" size={16} color="#666" style={{ marginRight: 6 }} />
                            <Text style={{ color: "#666", fontSize: 16 }}>
                                Deadline: <Text style={{ fontWeight: "bold", fontSize: 16 }}>
                                    {instance.deadline ? DateTime.fromISO(instance.deadline).toFormat("dd/MM/yyyy") : "-"}
                                </Text>
                            </Text>
                        </View>

                        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 4 }}>
                            <Ionicons name="list" size={16} color="#666" style={{ marginRight: 6 }} />
                            <Text style={{ color: "#666", fontSize: 16 }}>
                                Status: <Text style={{ fontWeight: "bold", fontSize: 16 }}>
                                    {instance?.status === 'COMPLETED' ? 'Afsluttet' : 'Ubesvaret'}
                                </Text>
                            </Text>
                        </View>
                    </View>
                </ScrollView>
                <View style={{ marginTop: 24, }}>
                    <Button
                        title={instance?.status === "COMPLETED" ? "Se din besvarelse" : "Fortsæt til besvarelse"}
                        onPress={() => {
                            if (instance?.status === "COMPLETED") {
                                //Navigate to response view
                            } else {
                                router.push("/signed-in/(tabs)/surveys/SurveyQuestionViewPage");
                            }
                        }}
                        color="#14b8a6"
                    />
                </View>
            </View>
        </View>
    )
}