import { UseFormReturn } from "react-hook-form"
import { QuestionTypeEnum, SurveyInput } from "shared/graphql/__generated__/graphql";
import { SurveyPreview } from "../SurveyOverview/SurveyPreview";

export const SurveyPreviewStep = (props: { methods: UseFormReturn<SurveyInput, any, undefined> }) => {
    const { methods } = props;
    const { formState: { errors, }, control } = methods;

    return (
        <div className="mx-3">
            <div className="mb-4 pb-4 border-b-2 border-gray-200">
                <h2 className="text-2xl text-gray-600 font-semibold">Forhåndsvisning</h2>
                <p className="text-sm text-gray-500">Her kan du se dit oprettede spørgeskema</p>
            </div>
            <SurveyPreview
                survey={control._formValues as SurveyInput}
            />
        </div>
    )
}