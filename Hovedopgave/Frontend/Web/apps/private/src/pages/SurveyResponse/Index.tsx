import { useMutation, useQuery } from "@apollo/client"
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import { BULK_CREATE_SURVEY_RESPONSE, Button, GET_SURVEY_INSTANCE_BY_ID, GET_SURVEY_RESPONSE_BY_INSTANCE_ID, SubPageContainer, UPDATE_SURVEY_INSTANCE_STATUS_BY_ID, } from "shared"
import { Survey, SurveyInstance, SurveyInstanceStatusEnum, SurveyQuestion, SurveyResponseCreateInput, SurveySection } from "shared/graphql/__generated__/graphql";
import { SurveySectionView } from "shared";
import Icon from "@mdi/react";
import { mdiChevronLeft, mdiChevronRight } from "@mdi/js";
import SurveyResponseView from "./SurveyResponse";
import SurveyInviteInfoStep from "./SurveyInviteInfoStep";
import { toast } from "react-toastify";
import SurveyEndStep from "./SurveyEndStep";

const steps = [
    'Oplysninger',
    'Spørgsmål',
    'Afslut',
];

export default function SurveyInstanceView() {
    const { id } = useParams();
    const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState<SurveyResponseCreateInput[]>([]);
    const [unansweredQuestions, setUnansweredQuestions] = useState<SurveyQuestion[]>([]);

    const [CreateResponse] = useMutation(BULK_CREATE_SURVEY_RESPONSE);
    const [UpdateInvitationStatus] = useMutation(UPDATE_SURVEY_INSTANCE_STATUS_BY_ID, {
        variables: {
            updateSurveyInstanceStatusByIdId: Number(id),
            status: SurveyInstanceStatusEnum.Completed,
        }
    })

    const { data, loading, error, refetch } = useQuery(GET_SURVEY_INSTANCE_BY_ID, {
        variables: {
            getSurveyInstanceByIdId: Number(id) || 0,
        },
        fetchPolicy: 'no-cache',
    })

    const survey = data?.getSurveyInstanceById?.surveyAccess.survey as Survey;
    const instance = data?.getSurveyInstanceById as SurveyInstance;

    const handleAnswerChange = (questionId: number, optionId: number, userInput?: string) => {
        setAnswers((prevAnswers: SurveyResponseCreateInput[]) => {
            const existingAnswerIndex = prevAnswers.findIndex((a) => a.questionId === questionId);
            if (existingAnswerIndex > -1) {
                const updatedAnswers = [...prevAnswers];
                updatedAnswers[existingAnswerIndex].optionId = optionId;
                updatedAnswers[existingAnswerIndex].userInput = userInput;
                return updatedAnswers;
            } else {
                return [...prevAnswers, { questionId, instanceId: Number(id), optionId: optionId, userInput }];
            }
        });
    };

    const handleSubmit = () => {
        const allQuestionsAnswered = checkAllQuestionsAnswered();
        if (!allQuestionsAnswered) {
            return;
        }
        try {
            CreateResponse({
                variables: {
                    input: answers,
                },
            }).then((response) => {
                UpdateInvitationStatus().then(() => {
                    toast.success("Din besvarelse er sendt.");
                    refetch();
                    setCurrentStep(2);
                }).catch((error) => {
                    console.error('Error updating survey invitation status:', error);
                });
            }).catch((error) => {
                console.error('Error creating survey response:', error);
            });
        } catch (error) {
            console.error('An error occurred while submitting the survey:', error);
        }
    }

    const checkAllQuestionsAnswered = (): boolean => {
        const allQuestions =
            survey?.sections?.flatMap((section) =>
                section?.questions?.filter((q): q is SurveyQuestion => q != null) ?? []
            ) ?? [];
        if (!allQuestions.length) return true;

        const unansweredQuestions = allQuestions.filter(question => question.required && !answers.find(answer => answer.questionId === question.id));
        setUnansweredQuestions(unansweredQuestions || []);
        return unansweredQuestions.length === 0;
    }

    const checkQuestionsAnsweredForSection = (section: SurveySection): boolean => {
        if (!section.questions) return true;
        const unansweredQuestions = section.questions.filter(question => question?.required && !answers.find(answer => answer.questionId === question?.id)) as SurveyQuestion[];
        setUnansweredQuestions(unansweredQuestions || []);
        return unansweredQuestions.length === 0;
    }

    const handleChangeSection = (direction: 'next' | 'prev') => {
        if (!survey?.sections) return;
        if (direction === 'next') {
            const questionCheck = checkQuestionsAnsweredForSection(survey?.sections[currentSectionIndex] as SurveySection);
            if (!questionCheck && instance?.status !== SurveyInstanceStatusEnum.Completed) {
                toast.error("Besvar venligst alle påkrævede spørgsmål.");
                return;
            }
            if (currentSectionIndex < (survey?.sections?.length || 0) - 1) {
                setCurrentSectionIndex(currentSectionIndex + 1);
            }
        } else {
            if (currentSectionIndex > 0) {
                setCurrentSectionIndex(currentSectionIndex - 1);
            }
        }
    }

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    return (
        <SubPageContainer
            title={instance?.status === SurveyInstanceStatusEnum.Completed ? "Besvarelse af " + survey?.title : "Besvar '" + survey?.title + "'"}
            description={instance?.status === SurveyInstanceStatusEnum.Completed ? "Her kan du se din besvarelse af spørgeskemaet " + survey?.title + "." : "Besvar venligst undersøgelsen nedenfor."}
            back={true}>
            <div className="w-full">
                <div className={`h-[4px] w-full rounded-full bg-purple-500`} />
                <div className="mb-4 p-8 bg-gray-200 rounded-lg">
                    {currentStep !== 0 && (
                        <>
                            <p className="text-xs text-gray-500">Spørgeskema</p>
                            <div className="flex flex-row items-center gap-2 justify-between">
                                <h2 className="text-2xl font-semibold text-gray-600">{survey?.title}</h2>
                                {instance?.status === SurveyInstanceStatusEnum.Completed && (
                                    <div className="bg-teal rounded-lg p-2">
                                        <p className="text-sm font-semibold">Besvaret</p>
                                    </div>
                                )}
                            </div>
                            <p className="text-gray-600">{survey?.description}</p>
                        </>
                    )
                    }
                    {currentStep === 1 && (
                        <>
                            <div className="my-6 bg-white rounded-lg px-6 py-4 flex flex-row justify-center items-center px-12 relative">
                                {survey?.sections && survey.sections.map((section, index) => (
                                    <div className="flex flex-row items-center gap-2" key={section?.id}>
                                        {index !== 0 && (
                                            <div className="h-[2px] w-16 bg-gray-300 -mt-6 ml-2" />
                                        )}
                                        <div className="flex flex-col items-center gap-2">
                                            <div className={`${currentSectionIndex === index ? 'bg-purple-500' : 'bg-gray-300'} w-5 h-5 rounded-full`} />
                                            <p className="text-xs font-semibold text-gray-500">Sektion. {index + 1}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div>
                                {instance?.status !== SurveyInstanceStatusEnum.Completed ? (
                                    <>
                                        {survey?.sections && survey.sections[currentSectionIndex] && (
                                            <SurveySectionView
                                                key={survey.sections[currentSectionIndex].id}
                                                section={survey.sections[currentSectionIndex]}
                                                answers={answers}
                                                unansweredQuestions={unansweredQuestions}
                                                onSetAnswer={(questionId, optionId, userInput) => {
                                                    if (instance?.status !== SurveyInstanceStatusEnum.Completed) {
                                                        handleAnswerChange(questionId, optionId, userInput);
                                                    }
                                                }} />
                                        )}
                                        {currentSectionIndex + 1 === (survey?.sections?.length) &&
                                            <Button className="mt-4" onClick={handleSubmit}>
                                                Send besvarelse
                                            </Button>
                                        }
                                    </>
                                ) : (
                                    <SurveyResponseView
                                        instance={data?.getSurveyInstanceById as SurveyInstance}
                                        currentSectionIndex={currentSectionIndex}
                                    />
                                )}
                            </div>
                            {survey?.sections && survey.sections.length > 1 && (
                                <div className="flex flex-row justify-center gap-5 w-full mt-4">
                                    <div className="flex flex-row items-center" onClick={() => handleChangeSection('prev')}>
                                        <p className={`${currentSectionIndex > 0 ? 'text-gray-500' : 'text-gray-300'} font-semibold text-sm`}>Forrige sektion</p>
                                        <Icon path={mdiChevronLeft} size={2} className={`${currentSectionIndex > 0 ? 'text-gray-500' : 'text-gray-300'}`} />
                                    </div>
                                    <div className="flex flex-row items-center" onClick={() => handleChangeSection('next')}>
                                        <Icon path={mdiChevronRight} size={2} className={`${currentSectionIndex < ((survey?.sections?.length ?? 0) - 1) ? 'text-gray-500' : 'text-gray-300'}`} />
                                        <p className="text-gray-600 font-semibold text-sm">Næste sektion</p>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                    {currentStep === 0 && (
                        <div className="flex flex-col gap-4 ">
                            <SurveyInviteInfoStep instance={instance as SurveyInstance} />
                            <div className="flex flex-col gap-4 w-1/2 mx-auto">
                                <Button onClick={() => setCurrentStep(1)}>{instance?.status === SurveyInstanceStatusEnum.Completed ? 'Se din besvarelse' : 'Fortsæt til besvarelse'}</Button>
                            </div>
                        </div>
                    )}
                    {currentStep === 2 && (
                        <div className="">
                            <SurveyEndStep instance={instance as SurveyInstance} />
                        </div>
                    )}
                </div>
            </div>
        </SubPageContainer >
    )
}
