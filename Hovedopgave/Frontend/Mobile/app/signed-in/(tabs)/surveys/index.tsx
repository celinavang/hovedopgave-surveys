import Screen from "@/components/layout/Screen";
import Text from "@/components/Text";
import { gql } from "graphql-tag";
import { useQuery } from "@apollo/client";
import FlatListWithCollapsibleHeader from "@/components/FlatListWithCollapsibleHeader";
import SurveyItem from "@/components/surveys/SurveyItem";
import { useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { surveyTest } from "./surveyTestData";


export default function SurveysPage() {



    /*  const GET_ALL_SURVEY_INSTANCES = gql`
         query GetAllSurveyInstances($input: GetAllSurveyInstancesInput!) {
             getAllSurveyInstances(input: $input) {
                 deadline
                 id
                 invitationDate
                 responseDate
                 status
                 surveyAccessId
                 surveyAccess {
                     id
                     role
                     surveyId
                     entityId
                     survey {
                         title
                         createdAt
                         creatorId
                         description
                         id
                     }  
                 } 
             }
         }
         
     `;
 
     const { data, error, refetch, loading } = useQuery<{
         getAllSurveyInstances: SurveyInstance[];
     }>(GET_ALL_SURVEY_INSTANCES, {
         variables: {
             input: {},
         },
         fetchPolicy: "no-cache",
     }); */
    const [selectedTab, setSelectedTab] = useState<"AWAITING" | "COMPLETED">("AWAITING");

    // Replace with actual query data
    const surveyInstances = surveyTest ?? []

    const awaitingSurveys = surveyInstances.filter(s => s.status === "AWAITING");
    const completedSurveys = surveyInstances.filter(s => s.status === "COMPLETED");


    return (
        <Screen
            isRootScreen
            handleScrollManually
            handleInsetsManually
        >
            <View className="flex flex-row gap-0 justify-start border-t border-gray-200">
                <TouchableOpacity
                    className={`${selectedTab === "AWAITING" ? "border-purple-600" : "border-gray-200"} flex-1 items-center px-2 py-3 border-b-2 bg-white`}
                    onPress={() => setSelectedTab("AWAITING")}
                >
                    <Text className={`text-xl font-semibold px-2 ${selectedTab === "AWAITING" ? "text-purple-700" : "text-gray-500"}`}>
                        Afventer
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    className={`${selectedTab === "COMPLETED" ? "border-purple-600" : "border-gray-200"} flex-1 items-center px-2 py-3 border-b-2 bg-white`}
                    onPress={() => setSelectedTab("COMPLETED")}
                >
                    <Text className={`text-xl font-semibold px-2 ${selectedTab === "COMPLETED" ? "text-purple-700" : "text-gray-500"}`}>
                        Afsluttet
                    </Text>
                </TouchableOpacity>
            </View>


            <FlatListWithCollapsibleHeader
                className="bg-gray-100 pt-3"
                scrollEnabled
                /* onRefresh={refetch}
                refreshing={loading} */
                data={selectedTab === "AWAITING" ? awaitingSurveys : completedSurveys}
                onEndReachedThreshold={1}
                header={undefined}
                /*  ListEmptyComponent={error != null ? (
                     <Text>Der er sket en fejl</Text>
                 ) : !loading ? (
                     <Text className="text-center text-base pt-20">Der er ingen spørgeskemaer endnu</Text>
                 ) : (
                     <Text className="text-center pt-24 text-md">Indlæser</Text>
                 )} */
                renderItem={({ item }) => <SurveyItem surveyInstance={item} tab={selectedTab} />}
                ListEmptyComponent={
                    <Text className="text-center text-base pt-20">
                        {selectedTab === "AWAITING"
                            ? "Du har ingen spørgeskemaer der afventer svar"
                            : "Du har ingen besvarede spørgeskemaer endnu"}
                    </Text>
                }
            />

        </Screen>
    )
}