import { useState } from "react";
import { SurveyInstance, SurveySection } from "../../graphql/__generated__/graphql";

export const SurveyResponse = (props: {
    surveyInstance: SurveyInstance;
}) => {
    const { surveyInstance } = props;
    const [currentSectionIndex, setCurrentSectionIndex] = useState<number>(0);
    const [currentSection, setCurrentSection] = useState<SurveySection | null>(null);

    return (
        {

        }
    );

}