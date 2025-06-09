import { useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";
import { GET_SURVEY_INSTANCE_BY_ID, GET_SURVEY_RESPONSE_BY_INSTANCE_ID, SubPageContainer, SurveyInfoCard, SurveySectionView } from "shared";
import { Survey, SurveyInstance, SurveyInstanceStatusEnum, SurveyQuestion, SurveyResponse, SurveySection } from "shared/graphql/__generated__/graphql";

export const SurveyResponsePage = () => {
    const { id } = useParams<{ id: string }>();
    const { data } = useQuery(GET_SURVEY_RESPONSE_BY_INSTANCE_ID, {
        variables: { instanceId: Number(id) },
        fetchPolicy: 'no-cache',
    });
    const { data: instanceData } = useQuery(GET_SURVEY_INSTANCE_BY_ID, {
        variables: { getSurveyInstanceByIdId: Number(id) },
        fetchPolicy: 'no-cache',
    });
    const instance = instanceData?.getSurveyInstanceById as SurveyInstance | null;
    const surveyResponse = data?.getSurveyResponseByInstanceId as SurveyResponse[] | null;
    const survey = instanceData?.getSurveyInstanceById?.surveyAccess?.survey as Survey | null;

    return (
        <SubPageContainer
            back
            title={`Besvarelse af ${survey?.title || 'undersøgelse'}`}
        >
            <SurveyInfoCard
                survey={survey as Survey}
                instance={instance as SurveyInstance}
                displayTimeEstimate={false}
            />
            {instanceData?.getSurveyInstanceById?.status === SurveyInstanceStatusEnum.Completed ? (
                <div className="mt-4">
                    <h2 className="text-2xl font-semibold text-gray-600 mb-2">
                        Bevarelse
                    </h2>
                    <div className="border-t-2 border-gray-200 pt-2">
                        {survey && survey.sections?.map((section, index) => {
                            if (!section) return null;
                            return (
                                <div className="mb-4" key={section.id}>
                                    <SurveySectionView
                                        section={section as SurveySection}
                                        answers={data?.getSurveyResponseByInstanceId as SurveyResponse[] || []}
                                        canAnswer={false}
                                    />
                                </div>
                            );
                        })}
                    </div>
                </div>
            ) : (
                <div className="p-6 mt-4 w-full flex flex-col items-center justify-center ">
                    <p className="text-xl text-gray-500 font-semibold">Denne invitation er ikke besvaret.</p>
                    <p className="text-gray-500">Besvarelsen kan ikke vises, da den ikke er afsluttet.</p>
                </div>
            )
            }
        </SubPageContainer >
    );
}