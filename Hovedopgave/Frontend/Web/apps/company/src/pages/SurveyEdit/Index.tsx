import { useMutation, useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { ConfirmModal, CREATE_SURVEY_ACCESS, DELETE_SURVEY_ACCESS_BY_ID, GET_SURVEY_BY_ID, Loader, SubPageContainer, UPDATE_SURVEY_ACCESS_ROLE_BY_ID, UPDATE_SURVEY_BY_ID } from "shared";
import { StepperContainer } from "shared/components/Stepper";
import { Step } from "shared/components/Stepper/Stepper"
import { SurveyQuestionOptionInput, SurveyQuestionInput, SurveySectionInput, SurveyInput, Survey, SurveyStatusEnum, QuestionTypeEnum, SurveyAccessInput, SurveyRoles } from "shared/graphql/__generated__/graphql";
import { SurveyInfoStep } from "../SurveyCreate/SurveyInfoStep";
import { SectionStep } from "../SurveyCreate/SectionsStep";
import { SurveyPreviewStep } from "../SurveyCreate/SurveyPreviewStep";
import SurveyShareStep from "../SurveyCreate/SurveyShareStep";
import { useAuth } from "shared/hooks/useAuth";

const labels = [
    { label: "Oplysninger", optional: false },
    { label: "Spørgsmål" },
    { label: "Forhåndsvisning", optional: true },
    { label: "Gem ændringer", optional: false },
]

const defaultStepData: Step[] = labels.map((l, i) => ({
    label: l.label,
    optional: l?.optional,
    status: i === 0 ? "in-progress" : "pending",
}));

export const SurveyEdit = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { userAuth } = useAuth();

    const { data, refetch, loading: queryLoading } = useQuery(GET_SURVEY_BY_ID, {
        variables: { getSurveyById: Number(id) },
        fetchPolicy: "no-cache"
    });

    const [updateSurvey, { loading: mutationLoading }] = useMutation(UPDATE_SURVEY_BY_ID);
    const [createSurveyAccess, { loading: createAccessLoading }] = useMutation(CREATE_SURVEY_ACCESS);
    const [removeSurveyAccess, { loading: removeAccessLoading }] = useMutation(DELETE_SURVEY_ACCESS_BY_ID);
    const [updateSurveyAccess, { loading: updateAccessLoading }] = useMutation(UPDATE_SURVEY_ACCESS_ROLE_BY_ID);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [steps, setSteps] = useState<Step[]>(defaultStepData);

    const methods = useForm<SurveyInput>({
        defaultValues: data?.getSurveyById as SurveyInput || {},
    });

    useEffect(() => {
        if (data?.getSurveyById) {
            const survey: SurveyInput = {
                id: data.getSurveyById.id,
                title: data.getSurveyById.title,
                creatorId: data.getSurveyById.creatorId,
                description: data.getSurveyById.description,
                status: data.getSurveyById.status as SurveyStatusEnum,
                anonymous: false,
                timeEstimate: data.getSurveyById.timeEstimate || undefined,
                sections: (data.getSurveyById.sections ?? []).map((section) => ({
                    id: section?.id || 0,
                    title: section?.title || "",
                    description: section?.description || "",
                    questions: (section?.questions ?? []).map((question) => ({
                        id: question?.id || 0,
                        question: question?.question || "",
                        description: question?.description || undefined,
                        type: question?.type as QuestionTypeEnum,
                        required: question?.required || false,
                        questionOptions: (question?.questionOptions ?? []).map((option) => ({
                            id: option?.id || 0,
                            questionId: question?.id || 0,
                            text: option?.text || "",
                        })),
                    })),
                })),
                surveyAccess: data.getSurveyById.surveyAccess,
            };
            methods.reset(survey);
        }
    }, [data, methods]);

    const onSubmit: SubmitHandler<SurveyInput> = async (formData) => {
        try {
            const { data: updatedData } = await updateSurvey({
                variables: {
                    updateSurveyByIdId: Number(id) as number || 0,
                    input: {
                        ...formData,
                        sections: (formData.sections ?? [])
                            .filter((section): section is SurveySectionInput => section != null)
                            .map((section: SurveySectionInput) => ({
                                ...section,
                                id: Number(section.id),
                                questions: (section.questions ?? [])
                                    .filter((question): question is SurveyQuestionInput => question != null)
                                    .map((question: SurveyQuestionInput) => ({
                                        ...question,
                                        id: question.id || 0,
                                        questionOptions: (question.questionOptions ?? [])
                                            .filter((option): option is SurveyQuestionOptionInput => option != null)
                                            .map((option: SurveyQuestionOptionInput) => ({
                                                ...option,
                                                id: option.id || 0,
                                                questionId: question.id || 0,
                                            })),
                                    })),
                            })),
                        surveyAccess: []
                    },
                },
            });

            if (updatedData) {
                toast.success("Spørgeskemaet er blevet opdateret");
                navigate("/survey");
            }
        } catch (error) {
            console.error(error);
            toast.error("Der opstod en fejl under opdateringen af spørgeskemaet");
        }
    };

    const onReset = () => {
        if (data?.getSurveyById) {
            const survey: SurveyInput = {
                id: data.getSurveyById.id,
                title: data.getSurveyById.title,
                creatorId: data.getSurveyById.creatorId,
                description: data.getSurveyById.description,
                status: data.getSurveyById.status as SurveyStatusEnum,
                anonymous: false,
                timeEstimate: data.getSurveyById.timeEstimate || undefined,
                sections: (data.getSurveyById.sections ?? []).map((section) => ({
                    id: Number(section?.id),
                    title: section?.title || "",
                    description: section?.description || "",
                    questions: (section?.questions ?? []).map((question) => ({
                        id: question?.id || 0,
                        question: question?.question || "",
                        description: question?.description || undefined,
                        type: question?.type as QuestionTypeEnum,
                        required: question?.required || false,
                        questionOptions: (question?.questionOptions ?? []).map((option) => ({
                            id: option?.id || 0,
                            questionId: question?.id || 0,
                            text: option?.text || "",
                        })),
                    })),
                })),
                surveyAccess: data.getSurveyById.surveyAccess?.map((access) => ({
                    id: access?.id || 0,
                    entityId: access?.entityId || 0,
                    role: access?.role,
                })) as SurveyAccessInput[] || [],
            };
            methods.reset(survey);
            setCurrentStep(0);
        }
    };

    if (queryLoading) {
        return (
            <div className="flex items-center justify-center w-full h-full">
                <Loader />
            </div>
        );
    }

    return (
        <SubPageContainer
            title="Rediger spørgeskema"
            back={true}
            description="Her kan du redigere spørgeskemaet"
            descriptionAsInfo
            buttons={[
                {
                    label: "Nulstil",
                    props: {
                        variant: "outlined",
                        color: "neutral",
                        onClick: () => setIsModalOpen(true),
                    },
                },
            ]}
        >
            <ConfirmModal
                onConfirm={async () => {
                    onReset();
                    setIsModalOpen(false);
                    /////////to do
                    return Promise.resolve();
                }}
                title="Vil du nulstille spørgeskemaet?"
                description="Handlingen kan ikke fortrydes"
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />

            <div className="w-full">
                <StepperContainer
                    steps={steps}
                    currentStep={currentStep}
                    canProceed={!mutationLoading}
                    onStepChange={(step: number) => setCurrentStep(step)}
                    onLastStepProceed={() => onSubmit(methods.getValues())}
                    loading={mutationLoading}
                />
            </div>
            <div className="py-6">
                <hr className="border-neutral-300" />
            </div>
            {currentStep === 0 && <SurveyInfoStep methods={methods} />}
            {currentStep === 1 && <SectionStep methods={methods} />}
            {currentStep === 2 && <SurveyPreviewStep methods={methods} />}
            {currentStep === 3 && <SurveyShareStep
                methods={methods}
                canShare={methods.getValues().surveyAccess?.some((access) => access?.entityId === userAuth?.user?.id && (access?.role === SurveyRoles.Creator || access?.role === SurveyRoles.Editor))}
                refetch={refetch}
            />
            }

        </SubPageContainer>
    )

};