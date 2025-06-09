import { UseFormReturn } from "react-hook-form";
import { Button, Input, SurveyDisclosure, Textarea } from "shared";
import { QuestionDisclosure } from "./QuestionDisclosure";
import Icon from "@mdi/react";
import { mdiArrowDown, mdiArrowUp, mdiContentCopy, mdiTrashCan } from "@mdi/js";
import { SurveyQuestionTypeSection } from "./SurveyQuestionTypeSection";
import { useEffect, useState } from "react";
import { SurveyInput } from "shared/graphql/__generated__/graphql";

export const SectionDisclosure = (props: { methods: UseFormReturn<SurveyInput, any, undefined>, sectionIndex: number }) => {
    const { methods, sectionIndex } = props;
    const { setValue, formState: { errors, }, control } = methods;
    const [showQuestionTypes, setShowQuestionTypes] = useState(false);

    const section = control._formValues.sections[sectionIndex];

    const removeSection = (index: number) => {
        const sections = control._formValues.sections.filter((_: any, i: number) => i !== index);
        setValue('sections', sections);
        localStorage.setItem('surveyCache', JSON.stringify(methods.getValues()));
        methods.trigger();
    }

    const moveSection = (index: number, direction: 'up' | 'down') => {
        const sections = control._formValues.sections;
        const sectionToMove = sections[index];
        sections.splice(index, 1);
        if (direction === 'up') {
            sections.splice(index - 1, 0, sectionToMove);
        } else {
            sections.splice(index + 1, 0, sectionToMove);
        }
        setValue('sections', sections);
        localStorage.setItem('surveyCache', JSON.stringify(methods.getValues()));
        methods.trigger();
    }

    const copySection = (index: number) => {
        const sections = control._formValues.sections;
        const sectionToCopy = sections[index];
        const newSection = {
            ...sectionToCopy,
            title: `${sectionToCopy.title} (kopi)`,
        };
        sections.splice(index + 1, 0, newSection);
        setValue('sections', sections);
        localStorage.setItem('surveyCache', JSON.stringify(methods.getValues()));
        methods.trigger();
    }

    useEffect(() => {
        setShowQuestionTypes(false);
    }, [control._formValues.sections]);

    return (
        <div className="mb-4" key={sectionIndex}>
            <SurveyDisclosure
                label={section.title || "Unavngivet sektion"}
                errors={errors.sections?.[sectionIndex]}
                headerChildren={
                    <div className="flex flex-row items-center justify-center align-center gap-5">
                        <div onClick={(e) => { copySection(sectionIndex); e.stopPropagation() }} className="cursor-pointer">
                            <Icon path={mdiContentCopy} size={1} className="text-gray-400" />
                        </div>
                        <div onClick={(e) => { removeSection(sectionIndex); e.stopPropagation() }} className="cursor-pointer">
                            <Icon path={mdiTrashCan} size={1} className="text-gray-400" />
                        </div>
                        <div onClick={(e) => { moveSection(sectionIndex, 'up'); e.stopPropagation() }} className="cursor-pointer">
                            <Icon path={mdiArrowUp} size={1} className={`${sectionIndex === 0 ? 'text-gray-300' : 'text-gray-400'}`} />
                        </div>
                        <div onClick={(e) => { moveSection(sectionIndex, 'down'); e.stopPropagation() }} className="cursor-pointer">
                            <Icon path={mdiArrowDown} size={1} className={`${sectionIndex === control._formValues.sections.length - 1 ? 'text-gray-300' : 'text-gray-400'}`} />
                        </div>
                    </div>
                }
            >
                <h2 className="text-lg text-gray-500 font-semibold mb-2">Oplysninger</h2>
                <Input
                    register={control.register(`sections.${sectionIndex}.title`, { required: "Titel er påkrævet" })}
                    label="Titel på sektion"
                    required={true}
                    error={errors.sections?.[sectionIndex]?.title}

                />
                <Textarea
                    register={control.register(`sections.${sectionIndex}.description`, { required: "Beskrivlse er påkrævet" })}
                    label="Beskrivelse af sektion"
                    required={true}
                    error={errors.sections?.[sectionIndex]?.description}
                    height="h-24"
                    borderClass="text-sm"
                />
                <div className="m-4">
                    <h2 className="text-xl text-gray-500 font-semibold mb-2">Spørgsmål</h2>
                    {section.questions && section.questions.map((question: any, questionIndex: number) => {
                        return (
                            <QuestionDisclosure sectionIndex={sectionIndex} questionIndex={questionIndex} methods={methods} key={questionIndex} />
                        );
                    })}


                    <Button
                        onClick={() => setShowQuestionTypes(!showQuestionTypes)}
                        showPlus
                        className="w-full mt-2"
                        color="neutral"
                        variant="outlined"
                    >
                        Tilføj spørgsmål
                    </Button>

                    {showQuestionTypes &&
                        <div className="m-10">
                            <SurveyQuestionTypeSection methods={methods} sectionIndex={sectionIndex} />
                        </div>
                    }

                </div>
                <div className="-mx-4 -mb-4 rounded-b-sm bg-gray-200 p-4 flex flex-row items-center justify-end">
                    <div>
                    </div>
                </div>
            </SurveyDisclosure >
        </div >
    )
}