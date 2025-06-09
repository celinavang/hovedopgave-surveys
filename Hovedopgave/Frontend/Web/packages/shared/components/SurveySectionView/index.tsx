import { SurveyQuestion, SurveyResponse, SurveyResponseCreateInput, SurveySection, SurveySectionInput } from "../../graphql/__generated__/graphql";
import { SurveyQuestionView } from "../SurveyQuestionView";

export const SurveySectionView = (
    props: {
        section: SurveySection | SurveySectionInput;
        answers?: SurveyResponse[] | SurveyResponseCreateInput[];
        unansweredQuestions?: SurveyQuestion[];
        canAnswer?: boolean;
        onSetAnswer?: (questionId: number, optionId: number, userInput?: string) => void;
    }
) => {
    const { section, onSetAnswer, answers, unansweredQuestions, canAnswer } = props;
    return (
        <div className="">
            <h2 className="text-xl font-semibold text-gray-600">{section.title}</h2>
            <p className="text-gray-600">{section.description}</p>
            <div className="mt-4 bg-white rounded-lg p-6 flex flex-col gap-4">
                {section.questions && section.questions.map((question) => (
                    <SurveyQuestionView
                        key={question?.id}
                        questionIndex={section.questions?.findIndex((q) => q?.id === question?.id) || 0 + 1}
                        question={question as SurveyQuestion}
                        hasError={!!unansweredQuestions?.find((q) => q.id === question?.id)}
                        currentAnswer={answers?.find((a) => a.questionId === question?.id) || undefined}
                        setAnswer={(optionId, userInput) => onSetAnswer ? onSetAnswer(Number(question?.id), optionId, userInput) : null}
                        canAnswer={canAnswer ?? true}
                    />
                ))}
            </div>
        </div>
    );
}