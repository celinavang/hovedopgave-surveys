import { useQuery } from "@apollo/client";
import { GET_SURVEY_RESPONSE_BY_INSTANCE_ID, SurveySectionView } from "shared";
import { SurveyInstance, SurveyResponseCreateInput, SurveySection } from "shared/graphql/__generated__/graphql";
import { useEffect, useState } from "react";

interface SurveyResponseProps {
    instance: SurveyInstance;
    currentSectionIndex: number;
}

export default function SurveyResponseView({ instance, currentSectionIndex }: SurveyResponseProps) {
    const [currentSection, setCurrentSection] = useState<SurveySection | null>(null);
    const { data, loading, error } = useQuery(GET_SURVEY_RESPONSE_BY_INSTANCE_ID, {
        variables: {
            instanceId: instance.id,
        },
        fetchPolicy: 'no-cache',
    });
    const surveyResponse = data?.getSurveyResponseByInstanceId;

    useEffect(() => {
        if (instance?.surveyAccess?.survey?.sections) {
            setCurrentSection(instance?.surveyAccess?.survey.sections.at(currentSectionIndex) as SurveySection || null);
        }
    }, [instance, currentSectionIndex]);


    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    const answers: SurveyResponseCreateInput[] = surveyResponse?.map((response: {
        __typename?: "SurveyResponse";
        id: number;
        questionId: number;
        optionId?: number | null;
        userInput?: string | null;
    }) => ({
        questionId: response.questionId,
        instanceId: instance.id,
        optionId: response.optionId ?? undefined,
        userInput: response.userInput ?? undefined,
    })) || [];

    return (
        <>
            <div className="w-full">
                {currentSection && (
                    <div key={currentSection.id} className="mb-4">
                        <SurveySectionView
                            section={currentSection}
                            answers={answers}
                            onSetAnswer={(questionId: number, optionId: number, userInput?: string) => {
                            }} />
                    </div>
                )}
            </div>
        </>
    );
}
