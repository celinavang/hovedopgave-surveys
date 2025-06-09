import { useLocalSearchParams } from "expo-router";
import { surveyTest } from "./surveyTestData";
import { Text, View} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import SurveyInfoCard from "@/components/surveys/SurveyInfoCard";



export default function SurveyInstancePage() {
    const surveyInstance = surveyTest[0]

    if (!surveyInstance) {
        return <Text>Der er ingen spørgeskemaer</Text>
    }

    return (
      <View style={{ flex: 1, backgroundColor: "f3f4f6", justifyContent: "center", alignItems: "center" }}>
        <SurveyInfoCard instance={surveyInstance}/>
      </View>
    )
}