import { mdiCheckCircle, mdiPencilBox, mdiStar, mdiTableRow, mdiTextBox } from "@mdi/js"
import Icon from "@mdi/react"
import { QuestionTypeEnum, SurveyInput } from "shared/graphql/__generated__/graphql"
import { OptionCreateForm } from "./Index"
import { UseFormReturn } from "react-hook-form"

type SurveyQuestionTypeSectionProps = {
    icon: string
    title: string
    questionValues: SurveyQuestionTypeValues
}

type SurveyQuestionTypeValues = {
    question?: string;
    type: QuestionTypeEnum;
    required?: boolean;
    questionOptions?: OptionCreateForm[] | undefined | null;
}

const SurveyQuestionTypesDefaults: SurveyQuestionTypeSectionProps[] = [
    {
        icon: mdiCheckCircle,
        title: 'Valg',
        questionValues: {
            type: QuestionTypeEnum.Single,
            questionOptions: [
                { text: 'Svarmulighed 1' },
            ],
            required: true,
        }
    },
    {
        icon: mdiTextBox,
        title: 'Tekst sektion',
        questionValues: {
            type: QuestionTypeEnum.Textsection,
            required: false,
            question: 'Nyt tekst sektion',
        }
    },
    {
        icon: mdiStar,
        title: 'Bedømmelse',
        questionValues: {
            // endnu ikke implementeret
            type: QuestionTypeEnum.Rating,
            question: 'Nyt rangering spørgsmål',
            questionOptions: [
                { text: '1' },
                { text: '2' },
                { text: '3' },
                { text: '4' },
                { text: '5' },
            ],
            required: true,
        }
    },
    {
        icon: mdiPencilBox,
        title: 'Tekst svar',
        questionValues: {
            type: QuestionTypeEnum.Textinput,
            question: 'Nyt tekst spørgsmål',
            required: true,
        }
    },
    {
        icon: mdiTableRow,
        title: 'Likert',
        questionValues: {
            type: QuestionTypeEnum.Likert,
            question: 'Nyt Likert spørgsmål',
            questionOptions: [
                { text: 'Meget enig' },
                { text: 'Enig' },
                { text: 'Delvist enig' },
                { text: 'Uenig' },
                { text: 'Meget uenig' },
            ],
            required: true,
        }
    }
]


export const SurveyQuestionTypeSection = (props: { methods: UseFormReturn<SurveyInput, any, undefined>, sectionIndex: number }) => {
    const { methods, sectionIndex } = props;
    const { setValue, formState: { errors }, control } = methods;

    const addQuestion = (questionValues: SurveyQuestionTypeValues) => {
        const newQuestion = {
            question: '',
            ...questionValues,
        };
        const sections = control._formValues.sections;
        sections[sectionIndex].questions.push(newQuestion);
        setValue('sections', sections);
        localStorage.setItem('surveyCache', JSON.stringify(methods.getValues()));
        methods.trigger();
    }

    return (
        <div className="flex flex-row gap-4 justify-center mt-4 flex-wrap">
            {Object.entries(SurveyQuestionTypesDefaults).map(([key, value]) => {
                return (
                    <div
                        key={key}
                        onClick={() => addQuestion(value.questionValues)}
                        className="p-5 min-w-[150px] flex-wrap border-purple-500 border-2 rounded-lg flex flex-row gap-2 items-center justify-center cursor-pointer hover:bg-purple-100 transition-all duration-200 ease-in-out">
                        <Icon path={value.icon} size={1} className="text-purple-500" />
                        <span className="text-wrap text-center">{value.title}</span>
                    </div>
                )
            })}
        </div>
    )
}