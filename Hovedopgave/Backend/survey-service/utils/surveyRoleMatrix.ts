import { BasicKintellaRoles, EntityRoleMatrix } from "@kintella/shared";
import { EntityType, KintellaRoleEnum, SurveyActions } from "../generatedTypes";
import { CREATE_READ_EDIT_DELETE, READ, NONE } from "./privilegeUtils";

const groupRoleMatrix: Record<KintellaRoleEnum, Record<SurveyActions, 1 | 0>> = {
    [KintellaRoleEnum.CompanyOwner]: CREATE_READ_EDIT_DELETE,
    [KintellaRoleEnum.CompanyAdmin]: CREATE_READ_EDIT_DELETE,
    [KintellaRoleEnum.Owner]: CREATE_READ_EDIT_DELETE,
    [KintellaRoleEnum.Admin]: CREATE_READ_EDIT_DELETE,
    [KintellaRoleEnum.Employee]: CREATE_READ_EDIT_DELETE,
    [KintellaRoleEnum.PrimaryRelative]: NONE,
    [KintellaRoleEnum.UserToEmployee]: READ,
    [KintellaRoleEnum.User]: READ,
    [KintellaRoleEnum.EmployeeToUser]: READ,
    [KintellaRoleEnum.Relative]: NONE,
    [KintellaRoleEnum.Resident]: READ,
    [KintellaRoleEnum.External]: NONE,
};
const userRoleMatrix: Record<KintellaRoleEnum, Record<SurveyActions, 1 | 0>> = {
    [KintellaRoleEnum.CompanyOwner]: CREATE_READ_EDIT_DELETE,
    [KintellaRoleEnum.CompanyAdmin]: CREATE_READ_EDIT_DELETE,
    [KintellaRoleEnum.Owner]: CREATE_READ_EDIT_DELETE,
    [KintellaRoleEnum.Admin]: CREATE_READ_EDIT_DELETE,
    [KintellaRoleEnum.Employee]: CREATE_READ_EDIT_DELETE,
    [KintellaRoleEnum.PrimaryRelative]: NONE,
    [KintellaRoleEnum.Relative]: NONE,
    [KintellaRoleEnum.UserToEmployee]: NONE,
    [KintellaRoleEnum.Resident]: NONE,
    [KintellaRoleEnum.User]: NONE,
    [KintellaRoleEnum.EmployeeToUser]: NONE, // READ?
    [KintellaRoleEnum.External]: NONE,
};
const companyRoleMatrix: Record<BasicKintellaRoles, Record<SurveyActions, 1 | 0>> = {
    [KintellaRoleEnum.CompanyOwner]: CREATE_READ_EDIT_DELETE,
    [KintellaRoleEnum.CompanyAdmin]: CREATE_READ_EDIT_DELETE,
    [KintellaRoleEnum.Owner]: CREATE_READ_EDIT_DELETE,
    [KintellaRoleEnum.Admin]: CREATE_READ_EDIT_DELETE,
    [KintellaRoleEnum.Employee]: CREATE_READ_EDIT_DELETE,
    [KintellaRoleEnum.PrimaryRelative]: NONE,
    [KintellaRoleEnum.Relative]: NONE,
    [KintellaRoleEnum.Resident]: NONE,
    [KintellaRoleEnum.User]: NONE,
    [KintellaRoleEnum.External]: NONE,   
}
export const surveyRoleMatrix = {
    [EntityType.Organization]: companyRoleMatrix,
    [EntityType.Division]: companyRoleMatrix,
    [EntityType.Company]: companyRoleMatrix,
    [EntityType.Group]: groupRoleMatrix,
    [EntityType.User]: userRoleMatrix,
} as EntityRoleMatrix<SurveyActions>;