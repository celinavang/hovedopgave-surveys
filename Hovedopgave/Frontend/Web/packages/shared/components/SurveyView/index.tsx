import { Survey, SurveyInput } from "../../graphql/__generated__/graphql";

export const SurveyView = (props: { survey: Survey | SurveyInput, currentSectionIndex: number }) => {
    const { survey, currentSectionIndex } = props;
    return (
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
    )
}