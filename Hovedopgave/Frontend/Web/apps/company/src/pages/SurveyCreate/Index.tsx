import { SubmitHandler, useForm } from "react-hook-form";
import { EntityType, QuestionTypeEnum, SurveyAccess, SurveyAccessInput, SurveyInput, SurveyRoles, SurveyStatusEnum } from "shared/graphql/__generated__/graphql";
import { useAuth } from "../../hooks/useAuth";
import { ConfirmModal, CREATE_SURVEY, GET_SURVEY_BY_ID } from "shared";
import { PageButton, SubPageContainer } from "shared/components/SubPageContainer";
import { toast } from "react-toastify";
import { from, useMutation, useQuery } from "@apollo/client";
import { StepperContainer } from "shared/components/Stepper";
import { Step } from "shared/components/Stepper/Stepper";
import { useEffect, useState } from "react";
import { SurveyInfoStep } from "./SurveyInfoStep";
import { SectionStep } from "./SectionsStep";
import { SurveyPreviewStep } from "./SurveyPreviewStep";
import SurveyShareStep from "./SurveyShareStep";
import { useLocation, useNavigate } from "react-router-dom";
import { routes } from "@/constants/routes";
import Icon from "@mdi/react";
import { mdiContentSave, mdiContentSavePlus, mdiRestore, mdiRestoreAlert, mdiUndo, mdiUndoVariant } from "@mdi/js";
import { template } from "lodash-es";


export type SurveyCreateForm = {
    title: string;
    description: string;
    creatorId: number;
    timeEstimate?: string;
    status: SurveyStatusEnum;
    anonymous: boolean;
    sections?: SectionCreateForm[] | undefined | null;
}

export type SectionCreateForm = {
    surveyId?: number;
    title: string;
    description: string;
    questions?: QuestionCreateForm[] | null;
}

export type QuestionCreateForm = {
    sectionId?: number;
    question: string;
    description?: string | null;
    type: QuestionTypeEnum;
    required: boolean;
    hasOptions: boolean;
    questionOptions?: OptionCreateForm[] | undefined | null;
}

export type OptionCreateForm = {
    questionId?: number;
    text: string;
}


const labels = [
    { label: 'Oplysninger', optional: false },
    { label: 'Spørgsmål' },
    { label: 'Forhåndsvisning', optional: true },
    { label: 'Publicer', optional: false },
];

const defaultData: SurveyInput = {
    id: 0,
    title: '',
    description: '',
    creatorId: 0,
    status: SurveyStatusEnum.Draft,
    anonymous: false,
    timeEstimate: '',
    sections: [],
    surveyAccess: [],
};

const defaultStepData: Step[] = labels.map((l, i) => ({
    label: l.label,
    optional: l?.optional,
    status: i === 0 ? 'in-progress' : 'pending',
}));

export const SurveyCreate = () => {
    const location = useLocation();
    const templateId = location.state?.templateid as number | undefined;
    const [createSurvey, { loading }] = useMutation(CREATE_SURVEY);

    const navigate = useNavigate();
    const localRawSteps = localStorage.getItem('stepsSurvey');
    const localRawData = localStorage.getItem('surveyCache');
    const localStep = localStorage.getItem('stepSurvey') || '0';


    const data = localRawData ? JSON.parse(localRawData) : defaultData;
    const stepData = localRawSteps && !templateId ? JSON.parse(localRawSteps) : defaultStepData;
    const initialStep = parseInt(localStep);

    const [isModalOpen, setIsModalOpen] = useState(false);

    const [currentStep, setCurrentStep] = useState<number>(0);
    const [steps, setSteps] = useState<Array<Step>>(stepData);
    const methods = useForm<SurveyInput>({ defaultValues: data });

    const { userAuth } = useAuth();

    const { data: templateData, loading: templateLoading } = useQuery(GET_SURVEY_BY_ID, {
        variables: {
            getSurveyById: templateId || 0,
        },
    });

    useEffect(() => {
        const subscription = methods.watch((values) => {
            localStorage.setItem('surveyCache', JSON.stringify(values));
            methods.trigger().then(() => methods.clearErrors());
        });
        return () => subscription.unsubscribe();
    }, [methods.register]);

    const onSubmit: SubmitHandler<SurveyInput> = async (data) => {
        const survey = {
            ...data,
            creatorId: userAuth?.id,
            timeEstimate: String(data.timeEstimate)
        } as SurveyInput;

        try {
            const { data: surveyData } = await createSurvey({
                variables: {
                    input: {
                        ...survey,
                    }
                }
            });
            if (surveyData) {
                toast.success('Spørgeskema oprettet');
                setSteps(defaultStepData);
                setCurrentStep(0);
                methods.reset(defaultData);
                localStorage.removeItem('stepSurvey');
                localStorage.removeItem('surveyCache');
                localStorage.removeItem('stepsSurvey');
                navigate(routes.survey);
            }
        }
        catch (error) {
            console.error(error);
            toast.error('Fejl ved oprettelse af spørgeskema');
        }
    };

    const handleAddAccess = (acces: SurveyAccessInput) => {
        if (methods.control._formValues.surveyAccess?.some((a: SurveyAccess) => a.entityId === acces.entityId)) {
            return;
        }
        const access: SurveyAccessInput = {
            entityId: acces.entityId,
            entityType: EntityType.User,
            accessGrantorId: userAuth?.user?.id as number,
            role: SurveyRoles.Editor
        }
        methods.setValue('surveyAccess', [...(methods.getValues('surveyAccess') || []), access]);
    }
    const handleRemoveAccess = (id: number, entityId: number) => {
        const access = methods.control._formValues.surveyAccess?.find((access: SurveyAccess) => access.entityId === entityId);
        if (access) {
            methods.setValue('surveyAccess', methods.control._formValues.surveyAccess.filter((a: SurveyAccess) => a.entityId !== access.entityId));
        }
    }

    const handleChangeRole = (acc: SurveyAccessInput) => {
        const access = methods.control._formValues.surveyAccess?.find((access: SurveyAccess) => access.entityId === acc.entityId);
        if (access) {
            const updatedAccess = { ...access, role: acc.role };
            methods.setValue('surveyAccess', methods.control._formValues.surveyAccess.map((a: SurveyAccess) => a.entityId === access.entityId ? updatedAccess : a));
        }
    }

    useEffect(() => {
        setCurrentStep(initialStep);
    }, []);

    useEffect(() => {
        console.log('templateId', templateId);
        if (templateId && !templateLoading && templateData) {
            const survey = templateData.getSurveyById;
            methods.reset({
                id: undefined,
                creatorId: userAuth?.id || 0,
                title: survey?.title || '',
                description: survey?.description || '',
                timeEstimate: survey?.timeEstimate || '',
                status: SurveyStatusEnum.Published,
                sections: survey?.sections?.map((s) => ({
                    id: undefined,
                    title: s?.title || '',
                    description: s?.description || '',
                    questions: s?.questions?.map((q) => ({
                        question: q?.question || '',
                        description: q?.description || null,
                        type: q?.type || QuestionTypeEnum.Single,
                        required: q?.required || false,
                        questionOptions: q?.questionOptions?.map((o) => ({
                            text: o?.text || '',
                        })),
                    })),
                })),
            });
            setSteps(defaultStepData);
            setCurrentStep(0);
        }
    }, []);

    useEffect(() => {
        if (methods.getValues('id') === 0) {
            localStorage.setItem('stepSurvey', currentStep.toString());
            localStorage.setItem('surveyCache', JSON.stringify(methods.getValues()));
            localStorage.setItem('stepsSurvey', JSON.stringify(steps));
        }
    }, [currentStep, methods, steps, methods.setValue]);

    const setNewPrevStepStatus = (i: number, newStep: number) => i === newStep && steps[newStep].status === 'completed' ? 'in-progress' : steps[i].status;
    const onStepChange = (step: number) => {
        if (loading) return;
        const direction = step > currentStep ? 'next' : 'prev';
        const currentLabel = labels[currentStep];
        const isCurrentStepOptional = currentLabel.optional;

        methods.trigger().then((isValid) => {
            if (direction === 'prev') {
                if (isCurrentStepOptional) {
                    const isOnlastStep = currentStep === steps.length - 1;
                    const leaveStep = isOnlastStep ? 'pending' : 'completed';
                    if (isValid) {
                        setSteps(steps.map((s, i) => ({
                            ...s,
                            status: i === currentStep ? leaveStep : setNewPrevStepStatus(i, step),
                        })));
                    } else {
                        setSteps(steps.map((s, i) => ({
                            ...s,
                            status: i === currentStep ? 'pending' : setNewPrevStepStatus(i, step),
                        })));
                    }
                    setCurrentStep(step);
                    return;
                }
                if (isValid) {
                    setSteps(steps.map((s, i) => ({
                        ...s,
                        status: i === currentStep ? 'completed' : setNewPrevStepStatus(i, step),
                    })))
                    setCurrentStep(step);
                    return;

                } else {
                    setSteps(steps.map((s, i) => ({
                        ...s,
                        status: i === currentStep ? 'pending' : setNewPrevStepStatus(i, step),
                    })))
                    setCurrentStep(step);
                    return;
                }
            }
            if (direction === 'next') {
                if (isCurrentStepOptional) {
                    setSteps(steps.map((s, i) => ({
                        ...s,
                        status: i === currentStep ? 'completed' : i === step ? 'in-progress' : steps[i].status,
                    })));
                    setCurrentStep(step);
                    return;
                }
                if (isValid && !isCurrentStepOptional) {
                    setSteps(steps.map((s, i) => ({
                        ...s,
                        status: i === currentStep ? 'completed' : i === step ? 'in-progress' : steps[i].status,
                    })));
                    setCurrentStep(step);
                    return;
                }
                if (!isValid && !isCurrentStepOptional) {
                    toast.error('Udfyld venligst påkrævede felter');
                    setSteps(steps.map((s, i) => ({
                        ...s,
                        status: i === currentStep ? 'in-progress' : steps[i].status,
                    })))
                    return;
                }
            }
        });
    }

    const onReset = () => {
        setSteps(defaultStepData);
        setCurrentStep(0);
        methods.reset(defaultData);
        localStorage.removeItem('stepSurvey');
        localStorage.removeItem('surveyCache');
        localStorage.removeItem('stepsSurvey');
    }

    useEffect(() => {
        localStorage.setItem('surveyCache', JSON.stringify(methods.getValues()));
    }, [methods]);


    return (
        <SubPageContainer
            title="Opret spørgeskema"
            back={true}
            description={"Her kan du oprette et spørgeskema til dine respondenter. Du kan tilføje sektioner og spørgsmål til spørgeskemaet, samt indstille modtagere og indstillinger for spørgeskemaet."}
            descriptionAsInfo
            buttons={
                (currentStep === 3 || methods.control._formState.isValid ? [
                    {
                        props: {
                            style: { minWidth: '0px', paddingInlineEnd: '14px' },
                            onClick: () => {
                                methods.setValue('status', SurveyStatusEnum.Template);
                                onSubmit(methods.getValues());
                            },
                            variant: 'outlined',
                            color: 'primary',
                            children: <Icon path={mdiContentSavePlus} size={.8} className="" />,
                        },
                        label: 'Gem som skabelon',
                    },
                    {
                        props: {
                            style: { minWidth: '0px', paddingInlineEnd: '14px' },
                            onClick: () => { onSubmit(methods.getValues()); },
                            variant: 'outlined',
                            color: 'primary',
                            children: <Icon path={mdiContentSave} size={.8} className="" />,
                        },
                        label: 'Gem kladde',
                    }
                ] as PageButton[] : [] as PageButton[])
                    .concat([{
                        props: {
                            style: { minWidth: '0px', paddingInlineEnd: '14px' },
                            onClick: () => { setIsModalOpen(true); },
                            variant: 'outlined',
                            color: 'danger',
                            children: <Icon path={mdiUndoVariant} size={.8} className="" />,
                        },
                        label: 'Nulstil',
                    },
                    ])}
        >
            <ConfirmModal
                onConfirm={async () => {
                    onReset();
                    setIsModalOpen(false);
                    return Promise.resolve();
                }}
                title={`Vil du nulstille spørgeskemaet?`}
                description={'Handlingen kan ikke fortrydes'}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />

            <div className="w-full">
                <StepperContainer
                    steps={steps}
                    currentStep={currentStep}
                    canProceed={!loading}
                    onStepChange={onStepChange}
                    onLastStepProceed={() => onSubmit(methods.getValues())}
                    loading={loading}
                />
            </div>
            <div className='py-6'>
                <hr className='border-neutral-300' />
            </div>
            {currentStep === 0 && <SurveyInfoStep methods={methods} />}
            {currentStep === 1 && <SectionStep methods={methods} />}
            {currentStep === 2 && <SurveyPreviewStep methods={methods} />}
            {
                currentStep === 3 && <SurveyShareStep methods={methods}
                    createAccess={handleAddAccess}
                    removeAccess={handleRemoveAccess}
                    changeRole={handleChangeRole}
                    canShare={true}
                />
            }
        </SubPageContainer >
    )
}


