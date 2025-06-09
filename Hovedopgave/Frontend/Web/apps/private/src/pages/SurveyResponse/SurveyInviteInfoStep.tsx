import { mdiAccount, mdiCalendar, mdiClock, mdiListStatus } from "@mdi/js";
import Icon from "@mdi/react";
import { SurveyInfoCard } from "shared";
import { Survey, SurveyInstance } from "shared/graphql/__generated__/graphql";
import { DateFormatsEnum, formatDate } from "shared/utils/dateUtils";

interface SurveyInviteInfoStepProps {
    instance: SurveyInstance;
}
export default function SurveyInviteInfoStep(props: SurveyInviteInfoStepProps) {
    const { instance } = props;
    const survey = instance?.surveyAccess?.survey;

    return (
        <>
            <SurveyInfoCard
                survey={survey as Survey}
                instance={instance}
            />
        </>
    )
}