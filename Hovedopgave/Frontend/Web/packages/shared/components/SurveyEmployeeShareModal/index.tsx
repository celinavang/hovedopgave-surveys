import { ModalContainer } from "../ModalContainer";
import SurveyEmployeeShare from "/home/kintella_admin/repos/kintella-web/apps/company/src/pages/SurveyCreate/SurveyEmployeeAccess";

export const SurveyEmployeeShareModal = ({
    isOpen,
    closeModal,
    survey,
    changeRole,
    createAccess,
    removeAccess,
    canEdit,
    refetch
}: {
    isOpen: boolean;
    closeModal: () => void;
    survey: any;
    changeRole?: (access: any) => void;
    createAccess?: (access: any) => void;
    removeAccess?: (id: number, entityId: number) => void;
    canEdit?: boolean;
    refetch?: () => void;
}) => (
    <ModalContainer isOpen={isOpen} closeModal={closeModal}>
        <SurveyEmployeeShare
            survey={survey}
            changeRole={changeRole || undefined}
            createAccess={createAccess || undefined}
            removeAccess={removeAccess || undefined}
            canEdit={canEdit}
            refetch={refetch}
        />
    </ModalContainer>
);



