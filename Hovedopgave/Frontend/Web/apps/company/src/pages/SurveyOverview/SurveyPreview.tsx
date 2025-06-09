import { mdiChevronLeft, mdiChevronRight } from "@mdi/js";
import Icon from "@mdi/react";
import { useState } from "react";
import { SurveySectionView } from "shared";
import { SurveyInput } from "shared/graphql/__generated__/graphql";

export const SurveyPreview = (props: { survey: SurveyInput }) => {
    const { survey } = props;
    const [currentSectionIndex, setCurrentSectionIndex] = useState<number>(0);

    const handleSectionChange = (change: 'prev' | 'next') => {
        if (change === 'next') {
            setCurrentSectionIndex((prevIndex) => Math.min(prevIndex + 1, (survey?.sections?.length || 1) - 1));
        } else {
            setCurrentSectionIndex((prevIndex) => Math.max(prevIndex - 1, 0));
        }
    };

    return (
        <div className="">
            <div className={`h-[4px] w-full rounded-full bg-purple-500`} />
            <div className="mb-4 p-8 bg-gray-200 rounded-lg">
                <p className="text-xs text-gray-500">Spørgeskema</p>
                <div className="flex flex-row items-center gap-2 justify-between">
                    <h2 className="text-2xl font-semibold text-gray-600">{survey?.title}</h2>
                </div>
                <p className="text-gray-600 mb-6">{survey?.description}</p>
                {survey?.sections && survey.sections.length > 1 && (
                    <div className="mb-6 bg-white rounded-lg px-6 py-4 flex flex-row justify-center items-center px-12 relative">
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
                )}
                {survey?.sections && survey.sections.length > 0 && (
                    survey.sections[currentSectionIndex] && (
                        <SurveySectionView
                            section={survey.sections[currentSectionIndex]}
                            answers={[]}
                            onSetAnswer={() => { }}
                            canAnswer={false}
                        />
                    )
                )}
                {survey.sections?.length === 0 && (
                    <div className="px-4 mb-4">
                        <h2 className="text-xl font-semibold text-gray-500">Ingen sektioner</h2>
                        <p className="text-md text-gray-500 mb-4">Der er ikke blevet oprettet nogen sektioner i dette spørgeskema.</p>
                    </div>
                )}
                {survey?.sections && survey.sections.length > 1 && (
                    <div className="flex flex-row justify-center gap-5 w-full mt-4">
                        <div className="flex flex-row items-center" onClick={() => handleSectionChange('prev')}>
                            <p className={`${currentSectionIndex > 0 ? 'text-gray-500' : 'text-gray-300'} font-semibold text-sm`}>Forrige sektion</p>
                            <Icon path={mdiChevronLeft} size={2} className={`${currentSectionIndex > 0 ? 'text-gray-500' : 'text-gray-300'}`} />
                        </div>
                        <div className="flex flex-row items-center" onClick={() => handleSectionChange('next')}>
                            <Icon path={mdiChevronRight} size={2} className={`${currentSectionIndex < ((survey?.sections?.length ?? 0) - 1) ? 'text-gray-500' : 'text-gray-300'}`} />
                            <p className="text-gray-600 font-semibold text-sm">Næste sektion</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}