import { mdiArrowDown, mdiArrowUp, mdiContentCopy, mdiPlus, mdiStar, mdiStarCheckOutline, mdiStarOutline, mdiTrashCan } from "@mdi/js";
import { Button, Input, SurveyDisclosure, Textarea } from "shared";
import { UseFormReturn } from "react-hook-form";
import Icon from "@mdi/react";
import { QuestionTypeEnum, SurveyInput } from "shared/graphql/__generated__/graphql";
import { Tooltip } from "react-tooltip";
import { useState } from "react";

export const QuestionDisclosure = (props: { methods: UseFormReturn<SurveyInput, any, undefined>, sectionIndex: number, questionIndex: number }) => {
    const { methods, sectionIndex, questionIndex } = props;
    const { setValue, formState: { errors }, control } = methods;
    const question = control._formValues.sections[sectionIndex].questions[questionIndex];
    const [showDescription, setShowDescription] = useState(false);

    const removeQuestion = (sectionIndex: number, questionIndex: number) => {
        const sections = control._formValues.sections;
        sections[sectionIndex].questions = sections[sectionIndex].questions.filter((_: any, i: number) => i !== questionIndex);
        setValue('sections', sections);
        localStorage.setItem('surveyCache', JSON.stringify(methods.getValues()));
        methods.trigger();
    }

    const addOption = (sectionIndex: number, questionIndex: number) => {
        const newOption = {
            text: 'Ny svarmulighed',
        };
        const sections = control._formValues.sections;
        sections[sectionIndex].questions[questionIndex].questionOptions.push(newOption);
        setValue('sections', sections);
        localStorage.setItem('surveyCache', JSON.stringify(methods.getValues()));
        methods.trigger();
    }

    const removeOption = (sectionIndex: number, questionIndex: number, optionIndex: number) => {
        const sections = control._formValues.sections;
        sections[sectionIndex].questions[questionIndex].questionOptions = sections[sectionIndex].questions[questionIndex].questionOptions.filter((_: any, i: number) => i !== optionIndex);
        setValue('sections', sections);
        localStorage.setItem('surveyCache', JSON.stringify(methods.getValues()));
        methods.trigger();
    }


    const copyQuestion = (sectionIndex: number, questionIndex: number) => {
        const questions = control._formValues.sections[sectionIndex].questions;
        const questionToCopy = questions[questionIndex];
        const newQuestion = {
            ...questionToCopy,
            question: `${questionToCopy.question} (kopi)`,
        };
        questions.splice(questionIndex + 1, 0, newQuestion);
        setValue('sections', control._formValues.sections);
        localStorage.setItem('surveyCache', JSON.stringify(methods.getValues()));
        methods.trigger();

    }

    const moveQuestion = (sectionIndex: number, questionIndex: number, direction: 'up' | 'down') => {
        const sections = control._formValues.sections;
        const questionToMove = sections[sectionIndex].questions[questionIndex];
        sections[sectionIndex].questions.splice(questionIndex, 1);
        if (direction === 'up') {
            sections[sectionIndex].questions.splice(questionIndex - 1, 0, questionToMove);
        } else {
            sections[sectionIndex].questions.splice(questionIndex + 1, 0, questionToMove);
        }
        setValue('sections', sections);
        localStorage.setItem('surveyCache', JSON.stringify(methods.getValues()));
        methods.trigger();
    }

    const moveOption = (sectionIndex: number, questionIndex: number, optionIndex: number, direction: 'up' | 'down') => {
        const sections = control._formValues.sections;
        const optionToMove = sections[sectionIndex].questions[questionIndex].questionOptions[optionIndex];
        sections[sectionIndex].questions[questionIndex].questionOptions.splice(optionIndex, 1);
        if (direction === 'up') {
            sections[sectionIndex].questions[questionIndex].questionOptions.splice(optionIndex - 1, 0, optionToMove);
        } else {
            sections[sectionIndex].questions[questionIndex].questionOptions.splice(optionIndex + 1, 0, optionToMove);
        }
        setValue('sections', sections);
        localStorage.setItem('surveyCache', JSON.stringify(methods.getValues()));
        methods.trigger();
    }
    const copyOption = (sectionIndex: number, questionIndex: number, optionIndex: number) => {
        const sections = control._formValues.sections;
        const optionToCopy = sections[sectionIndex].questions[questionIndex].questionOptions[optionIndex];
        const newOption = {
            ...optionToCopy,

        };
        sections[sectionIndex].questions[questionIndex].questionOptions.splice(optionIndex + 1, 0, newOption);
        setValue('sections', sections);
        localStorage.setItem('surveyCache', JSON.stringify(methods.getValues()));
        methods.trigger();
    }

    const renderQuestionType = (type: QuestionTypeEnum) => {
        switch (type) {
            case QuestionTypeEnum.Textsection:
                return (
                    <div>
                        <Textarea
                            register={control.register(`sections.${sectionIndex}.questions.${questionIndex}.question`, { required: "Titel er påkrævet" })}
                            error={errors.sections?.[sectionIndex]?.questions?.[questionIndex]?.question}
                            label="Sektionstekst"
                            required
                            height="h-24"
                        />
                    </div>
                );
            case QuestionTypeEnum.Textinput:
                return (
                    null
                );
            case QuestionTypeEnum.Rating:
                return (
                    <div>
                        <div className="flex flex-row">
                            {
                                question.questionOptions && question.questionOptions.map((option: any, optionIndex: number) => (
                                    <div key={optionIndex} className="flex flex-row items-center gap-2 mb-4">
                                        <div>
                                            <Icon path={mdiStarOutline} size={2} className="text-gray-400" />
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                );
            case QuestionTypeEnum.Likert:
                return (
                    <div className="flex flex-col w-full">
                        <h2 className="text-md font-semibold text-gray-500">Svarmuligheder</h2>
                        <p className="text-sm text-gray-500 mb-5">Her kan du tilføje svarmuligheder til spørgsmålet.</p>
                        <div className="flex flex-row items-center gap-2 mb-4 w-full justify-between">
                            {question.questionOptions && question.questionOptions.map((option: any, optionIndex: number) => (
                                <div className="" key={optionIndex}>
                                    <div className="flex flex-row items-start group transition duration-200 ease-in-out hover:bg-gray-100 rounded-lg ">
                                        <div className="flex flex-col items-center w-full">
                                            <Input
                                                register={control.register(`sections.${sectionIndex}.questions.${questionIndex}.questionOptions.${optionIndex}.text`, { required: "Titel er påkrævet" })}

                                            />
                                            <input type="checkbox" className="rounded-full mb-[12px]" disabled />
                                        </div>
                                        <button className=" mt-2" onClick={(e) => { removeOption(sectionIndex, questionIndex, optionIndex); e.stopPropagation() }}>
                                            <Icon path={mdiTrashCan} size={1} className="text-red-400 cursor-pointer " />
                                        </button>
                                    </div>
                                </div>
                            ))}
                            <div className="flex flex-col mb-3 items-center w-32">
                                <button
                                    onClick={(e) => {
                                        addOption(sectionIndex, questionIndex);
                                        e.stopPropagation();
                                    }}
                                >
                                    <Icon path={mdiPlus} size={1.3} className="text-gray-400" />
                                </button>
                                <p className="text-sm text-gray-500">Tilføj svarmulighed</p>
                            </div>
                        </div>
                    </div>
                )
            case QuestionTypeEnum.Single:
            default:
                return (
                    <div>
                        <div className="m-4">
                            <h2 className="text-md font-semibold text-gray-500">Svarmuligheder</h2>
                            <p className="text-sm text-gray-500 mb-5">Her kan du tilføje svarmuligheder til spørgsmålet.</p>
                            {question.questionOptions && question.questionOptions.map((option: any, optionIndex: number) => (
                                <div key={optionIndex} className="flex flex-row items-center  gap-2">
                                    <input type="checkbox" className="rounded-full mb-[12px]" disabled />
                                    <Input
                                        register={control.register(`sections.${sectionIndex}.questions.${questionIndex}.questionOptions.${optionIndex}.text`, { required: "Titel er påkrævet" })}
                                        error={errors.sections?.[sectionIndex]?.questions?.[questionIndex]?.questionOptions?.[optionIndex]?.text}
                                        outerClassName="w-full"
                                    />
                                    <div className="mb-[12px] flex flex-row items-center gap-2">
                                        <div data-tooltip-id={`tooltip-${sectionIndex}-${questionIndex}-${optionIndex}`}>
                                            <Tooltip id={`tooltip-${sectionIndex}-${questionIndex}-${optionIndex}`} content="Kopier svarmulighed" variant="light" className="shadow-xl !text-sm text-gray-500" />
                                            <div onClick={(e) => { copyOption(sectionIndex, questionIndex, optionIndex); e.stopPropagation() }} className="cursor-pointer">
                                                <Icon path={mdiContentCopy} size={1} className="text-teal" />
                                            </div>
                                        </div>
                                        <div onClick={(e) => { removeOption(sectionIndex, questionIndex, optionIndex); e.stopPropagation() }} className="cursor-pointer">
                                            <Icon path={mdiTrashCan} size={1} className="text-red-400 cursor-pointer" />
                                        </div>
                                        <div onClick={(e) => { moveOption(sectionIndex, questionIndex, optionIndex, 'up'); e.stopPropagation() }} className="cursor-pointer">
                                            <Icon path={mdiArrowUp} size={1} className={`${optionIndex === 0 ? 'text-gray-300' : 'text-gray-500'}`} />
                                        </div>
                                        <div onClick={(e) => { moveOption(sectionIndex, questionIndex, optionIndex, 'down'); e.stopPropagation() }} className="cursor-pointer">
                                            <Icon path={mdiArrowDown} size={1} className={`${optionIndex === question.questionOptions.length - 1 ? 'text-gray-300' : 'text-gray-500'}`} />
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <Button onClick={() => addOption(sectionIndex, questionIndex)} showPlus className="w-full mt-2" color="neutral" variant="outlined">
                                Tilføj svarmulighed
                            </Button>
                        </div>
                    </div>
                );
        }
    }

    return (
        <div className="mb-2" key={questionIndex}>
            <SurveyDisclosure
                label={`Spørgsmål ${questionIndex + 1}`}
                errors={errors.sections?.[sectionIndex]?.questions?.[questionIndex]}
                headerChildren={
                    <div className="flex flex-row items-center justify-center align-center gap-5">
                        <div onClick={(e) => { copyQuestion(sectionIndex, questionIndex); e.stopPropagation() }} className="cursor-pointer">
                            <Icon path={mdiContentCopy} size={1} className="text-gray-400" />
                        </div>
                        <div onClick={(e) => { removeQuestion(sectionIndex, questionIndex); e.stopPropagation() }} className="cursor-pointer">
                            <Icon path={mdiTrashCan} size={1} className="text-gray-400" />
                        </div>
                        <div onClick={(e) => { moveQuestion(sectionIndex, questionIndex, 'up'); e.stopPropagation() }} className="cursor-pointer">
                            <Icon path={mdiArrowUp} size={1} className={`${questionIndex === 0 ? 'text-gray-300' : 'text-gray-400'}`} />
                        </div>
                        <div onClick={(e) => { moveQuestion(sectionIndex, questionIndex, 'down'); e.stopPropagation() }} className="cursor-pointer">
                            <Icon path={mdiArrowDown} size={1} className={`${questionIndex === control._formValues.sections[sectionIndex].questions.length - 1 ? 'text-gray-300' : 'text-gray-400'}`} />
                        </div>
                    </div>
                }
            >
                {question.type !== QuestionTypeEnum.Textsection && (
                    <Input
                        register={control.register(`sections.${sectionIndex}.questions.${questionIndex}.question`, { required: "Titel er påkrævet" })}
                        error={errors.sections?.[sectionIndex]?.questions?.[questionIndex]?.question}
                        outerClassName="w-full h-auto"
                        label="Spørgsmålstekst"
                    />)}
                {showDescription &&
                    <Textarea
                        register={control.register(`sections.${sectionIndex}.questions.${questionIndex}.description`)}
                        label="Beskrivelse"
                        placeholder="Indtast beskrivelse.."
                        description="Valgfri"
                        height="h-16"
                        borderClass="text-sm"
                        descriptionClass="text-xs text-gray-500 mb-2"
                    />}
                {renderQuestionType(question.type)}
                {question.type !== QuestionTypeEnum.Textsection && (
                    <div className="-mx-4 -mb-4 rounded-b-sm bg-gray-200 p-4 flex flex-row items-center justify-end">
                        <div className="flex flex-row items-center gap-2 mr-4">
                            <p className="text-sm font-semibold text-gray-500">Tilføj beskrivelse til spørgsmål</p>
                            <Input type="checkbox" onChange={(e) => setShowDescription(e.target.checked)} className="h-6 !w-6" outerClassName="!h-6" />
                        </div>
                        <div className="flex flex-row items-center gap-2">
                            <p className="text-sm font-semibold text-gray-500">Svar påkrævet</p>
                            <Input type="checkbox" register={control.register(`sections.${sectionIndex}.questions.${questionIndex}.required`)} className="h-6 !w-6" outerClassName="!h-6" />
                        </div>
                    </div>
                )}
            </SurveyDisclosure>
        </div>
    )
}