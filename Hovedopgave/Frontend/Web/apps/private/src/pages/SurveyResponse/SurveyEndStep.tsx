import { SurveyInstance } from "shared/graphql/__generated__/graphql";

interface SurveyEndStepProps {
    instance: SurveyInstance;
}
export default function SurveyEndStep({ instance }: SurveyEndStepProps) {
    return (
        <div className="flex flex-col gap-2 p-4">
            <h2 className="text-xl font-semibold text-gray-700">Din besvarelse er blevet sendt.</h2>
            <p className="text-sm text-gray-500">For at se din besvarelse igen, kan du gå til afsluttede spørgeskemaer.</p>
        </div>
    );
};