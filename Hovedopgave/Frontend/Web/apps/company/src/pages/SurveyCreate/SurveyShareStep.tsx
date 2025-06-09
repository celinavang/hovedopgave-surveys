import { UseFormReturn } from "react-hook-form";
import { useAuth } from "shared/hooks/useAuth";
import SurveyEmployeeShare from "./SurveyEmployeeAccess";
import { SurveyAccessInput, SurveyInput } from "shared/graphql/__generated__/graphql";

export default function SurveyShareStep(props: {
    methods: UseFormReturn<SurveyInput, any, undefined>,
    createAccess?: (access: SurveyAccessInput) => void,
    removeAccess?: (id: number, entityId: number) => void,
    changeRole?: (access: SurveyAccessInput) => void
    refetch?: () => void,
    canShare?: boolean
}) {
    const { methods, createAccess, removeAccess, changeRole, canShare, refetch } = props;
    const { userAuth } = useAuth();

    return (
        <div>
            <SurveyEmployeeShare
                survey={methods.getValues() as SurveyInput}
                canEdit={canShare}
                changeRole={changeRole ? changeRole : undefined}
                createAccess={createAccess ? createAccess : undefined}
                removeAccess={removeAccess ? removeAccess : undefined}
                refetch={refetch ? refetch : undefined}
            />
        </div>
    );
}