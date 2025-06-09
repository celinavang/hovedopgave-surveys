import { mdiStar } from "@mdi/js";
import { QuestionTypeEnum, SurveyQuestion, SurveyQuestionInput, SurveyResponseCreateInput } from "../../graphql/__generated__/graphql";
import Icon from "@mdi/react";

export const SurveyQuestionView = (props: {
    canAnswer: boolean;
    question: SurveyQuestionInput | SurveyQuestion,
    questionIndex?: number,
    currentAnswer?: SurveyResponseCreateInput,
    hasError?: boolean,
    setAnswer?: (optionId: number, userInput?: string) => void,
}) => {
    const { question, questionIndex, currentAnswer, canAnswer, hasError, setAnswer } = props;

    const renderQuestionType = (questionIndex: number, question: SurveyQuestion | SurveyQuestionInput) => {
        switch (question.type) {
            case QuestionTypeEnum.Textsection:
                return null;
            case QuestionTypeEnum.Rating:
                return (
                    <div className="flex flex-row gap-2">
                        {question.questionOptions?.map((option) => (
                            <div key={option?.id} onClick={() => setAnswer ? setAnswer(Number(option?.id)) : null}>
                                <Icon path={mdiStar} size={1} className={`${currentAnswer?.optionId === option?.id ? 'text-yellow-500' :
                                    (question.questionOptions?.findIndex((o) => o?.id === currentAnswer?.optionId) ?? 0) > (question.questionOptions?.findIndex((o) => o?.id === option?.id) ?? 0) ? 'text-yellow-500' : 'text-gray-300'}`} />
                            </div>
                        ))}
                    </div>
                )
            case QuestionTypeEnum.Textinput:
                return (
                    <textarea
                        placeholder="Skriv dit svar her"
                        className="w-full p-2 border border-gray-300 rounded"
                        value={currentAnswer?.userInput || ""}
                        onChange={(e) => setAnswer ? setAnswer(currentAnswer?.optionId || 0, e.target.value) : null}
                    />
                );
            case QuestionTypeEnum.Likert:
                return (
                    <div className="flex flex-row">
                        {question.questionOptions?.map((option) => (
                            <div key={option?.id} className="flex flex-col items-center w-full">
                                <span className="text-md text-gray-600 font-semibold bg-gray-200 w-full h-full flex justify-center items-center p-2 text-center mb-4">{option?.text}</span>
                                <input
                                    type="radio"
                                    name={`question-${question.id}`}
                                    value={Number(option?.id)}
                                    id={`option-${option?.id}`}
                                    checked={currentAnswer?.optionId === option?.id}
                                    onChange={() => setAnswer ? setAnswer(Number(option?.id)) : null}
                                    disabled={!canAnswer}
                                />
                            </div>
                        ))}
                    </div>
                )
            case QuestionTypeEnum.Single:
            default:
                return (
                    <div>
                        {question.questionOptions?.map((option) => (
                            <div key={option?.id} className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    name={`question-${question.id}`}
                                    value={Number(option?.id)}
                                    id={`option-${option?.id}`}
                                    checked={currentAnswer?.optionId === option?.id}
                                    onChange={() => setAnswer ? setAnswer(Number(option?.id)) : null}
                                    disabled={!canAnswer}
                                />
                                <label htmlFor={`option-${option?.id}`}>{option?.text}</label>
                            </div>
                        ))}
                    </div>
                )
        }
    }

    return (
        <div className="flex flex-col gap-2 border-b-2 p-4 last:border-b-0 border-gray-200">
            <div className="flex flex-row justify-between items-center">
                <div>
                    <p className="text-xs font-semibold text-gray-400 mb-[1px]">Spørgsmål {questionIndex}</p>
                    <h2 className={`${hasError ? 'text-red-500' : 'text-gray-500'} font-semibold text-lg`}>{question.question}</h2>
                    <p className="text-gray-600 text-sm">{question.description}</p>
                </div>
                <div>
                    {question.required && <span className={`${hasError ? 'text-red-500' : 'text-gray-400'} text-xs font-semibold`}>Besvarelse påkrævet</span>}
                </div>
            </div>
            {renderQuestionType(questionIndex as number, question)}
        </div>
    )
}