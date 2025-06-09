import { useMutation, useQuery } from "@apollo/client";
import { mdiChevronLeft, mdiChevronRight, mdiTrashCan } from "@mdi/js";
import Icon from "@mdi/react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { CREATE_SURVEY_ACCESS, DELETE_SURVEY_ACCESS_BY_ID, GET_ALL_COMPANY_USERS_BY_COMPANY_ID_AND_TYPE, Input, Select, SurveyDisclosure, surveyEmployeeRoles, translateSurveyAccessRole, UPDATE_SURVEY_ACCESS_ROLE_BY_ID } from "shared";
import { CompanyUser, EntityType, PaginationInput, Survey, SurveyAccessInput, SurveyInput, SurveyRoles, UserTypeEnum } from "shared/graphql/__generated__/graphql";
import { useAuth } from "shared/hooks/useAuth";

const SurveyEmployeeShare = (props: {
    survey: SurveyInput | Survey,
    changeRole?: (access: SurveyAccessInput) => void,
    createAccess?: (access: SurveyAccessInput) => void,
    removeAccess?: (id: number, entityId: number) => void,
    canEdit?: boolean
    refetch?: () => void
}) => {
    const { survey, changeRole, createAccess, removeAccess, canEdit, refetch } = props;
    const { userAuth, company } = useAuth();
    const [allEmployees, setAllEmployees] = useState<CompanyUser[]>([]);
    const [employees, setEmployees] = useState<CompanyUser[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>();
    const [page, setPage] = useState<number>(0);
    const roles = surveyEmployeeRoles;
    const [pagination, setPagination] = useState<PaginationInput>({
        page: page,
        size: 10,
    });
    const { data, refetch: refetchEmployees, loading } = useQuery(GET_ALL_COMPANY_USERS_BY_COMPANY_ID_AND_TYPE, {
        variables: {
            input: {
                type: UserTypeEnum.Employee,
                companyId: company?.id,
                nameSearch: searchTerm ?? undefined,
                pageInput: {
                    pagination,
                    sort: ['createdAt', 'asc'],
                },
            },
        },
        fetchPolicy: 'no-cache',
    });
    const [createAccessMutation] = useMutation(CREATE_SURVEY_ACCESS);
    const [removeAccessMutation] = useMutation(DELETE_SURVEY_ACCESS_BY_ID);
    const [changeRoleMutation] = useMutation(UPDATE_SURVEY_ACCESS_ROLE_BY_ID);

    const handlePageChange = (page: number) => {
        setPage(page);
        setPagination({
            ...pagination,
            page: page,
        });
        refetchEmployees();
    };

    const handleCreateAccess = (access: SurveyAccessInput) => {
        if (survey.surveyAccess?.some((a) => a?.entityId === access.entityId)) {
            toast.error('Adgang allerede givet');
            return;
        }
        if (!survey?.id || survey?.id === 0) {
            toast.error('Ingen undersøgelse valgt');
            return;
        }
        if (access.entityId) {
            try {
                createAccessMutation({
                    variables: {
                        input: {
                            entityId: access.entityId,
                            entityType: access.entityType,
                            role: access.role,
                            accessGrantorId: Number(userAuth?.user?.id),
                            surveyId: Number(survey.id),
                        },
                    }
                }).then((res) => { refetch ? refetch() : null; toast.success('Adgang givet'); })
            } catch (error) {
                toast.error('Fejl ved oprettelse af adgang');
            }
        } else {
            toast.error('Ingen medarbejder valgt');
        }
    };

    const handleRemoveAccess = (id: number, entityId: number) => {
        if (!survey?.id || survey?.id === 0) {
            toast.error('Ingen undersøgelse valgt');
            return;
        }
        if (id) {
            try {
                removeAccessMutation({
                    variables: {
                        deleteSurveyAccessByIdId: id,
                    }
                }).then(() => {
                    refetch ? refetch() : null;
                    refetchEmployees();
                }).catch((error) => {
                    toast.error('Fejl ved fjernelse af adgang');
                });
            } catch (error) {
                toast.error('Fejl ved fjernelse af adgang');
            }
        }
    };

    const handleChangeRole = (access: SurveyAccessInput) => {
        if (!survey?.id || survey?.id === 0) {
            toast.error('Ingen undersøgelse valgt');
            return;
        }
        if (access.id && access.id !== 0) {
            try {
                changeRoleMutation({
                    variables: {
                        updateSurveyAccessRoleByIdId: access.id,
                        role: access.role,
                    }
                }).then(() => {
                    refetch ? refetch() : null;
                    refetchEmployees();
                }).catch((error) => {
                    toast.error('Fejl ved ændring af adgang');
                });
            } catch (error) {
                toast.error('Fejl ved ændring af adgang');
            }
        }
    };

    useEffect(() => {
        if (data?.getAllCompanyUsersByCompanyIdAndType) {
            setAllEmployees(data.getAllCompanyUsersByCompanyIdAndType.items as CompanyUser[]);
            let items: CompanyUser[] = data.getAllCompanyUsersByCompanyIdAndType.items?.filter((u) =>
                u?.user?.id !== userAuth?.user?.id &&
                !survey.surveyAccess?.some((access) => access && access.entityId === u?.user?.id
                )
            ) as CompanyUser[];
            setEmployees(items);
        }
    }, [data, survey.surveyAccess]);

    return (
        <SurveyDisclosure
            showArrow={false}
            canCollapse={false}
            headerChildren={<h2 className="text-lg text-gray-600">{props.canEdit ? <>Giv medarbejdere adgang</> : <>Adgang</>}</h2>}
        >
            <div className="flex flex-col gap-2">
                {survey?.surveyAccess && survey?.surveyAccess?.length > 0 && (
                    <>
                        <div className="flex flex-col gap-2 p-2">
                            <h2 className="text-lg text-gray-600 font-semibold border-b-2 border-gray-200 pb-2">Medarbejdere med adgang</h2>

                            {survey.surveyAccess
                                .filter((a): a is SurveyAccessInput => !!a && a.role !== SurveyRoles.Responder)
                                .map((access) =>
                                    access ? (
                                        <div key={access.id} className="flex flex-row items-center gap-2 hover:bg-gray-200 justify-between p-2 rounded">
                                            <div className="flex flex-col">
                                                <p className="text-lg text-gray-600 font-semibold">
                                                    {allEmployees.find((e) => e.user?.id === access.entityId)?.user?.fullName || ''}
                                                </p>

                                                <p className="text-sm text-gray-500">
                                                    {access.role !== SurveyRoles.Creator ? (
                                                        <>
                                                            {translateSurveyAccessRole(access.role as SurveyRoles)} adgang tilføjet af {allEmployees.find((e) => e.user?.id === access.accessGrantorId)?.user?.fullName || ''}
                                                        </>
                                                    ) : <>
                                                        <span className="text-red-500">Opretter</span> - kan ikke ændres
                                                    </>}
                                                </p>

                                            </div>
                                            {canEdit && (
                                                <div className="flex flex-row items-center gap-2 w-1/2 justify-end">
                                                    <Select
                                                        wrapperClass="w-44"
                                                        value={access.role}
                                                        options={access.role === SurveyRoles.Creator ? [{ value: SurveyRoles.Creator, label: translateSurveyAccessRole(SurveyRoles.Creator) }] : roles}
                                                        onchange={(e) => {
                                                            changeRole ? changeRole({ id: access.id || 0, entityId: access.entityId as number, role: e.target.value as SurveyRoles, accessGrantorId: access.accessGrantorId as number, entityType: EntityType.User }) :
                                                                handleChangeRole({ id: access.id || 0, entityId: access.entityId as number, role: e.target.value as SurveyRoles, accessGrantorId: access.accessGrantorId as number, entityType: EntityType.User })
                                                        }}
                                                        disabled={access.entityId === userAuth?.user?.id || access.role === SurveyRoles.Creator}
                                                    />

                                                    <button
                                                        className={`p-2 rounded items-center flex flex-row gap-2 disabled:bg-gray-300 bg-red-500 hover:bg-red-600`}
                                                        onClick={() => { removeAccess ? removeAccess(access.id || 0, access.entityId) : handleRemoveAccess(access.id || 0, access.entityId) }}
                                                        disabled={access.entityId === userAuth?.user?.id || access.role === SurveyRoles.Creator}
                                                    >
                                                        <Icon path={mdiTrashCan} size={1} className="text-white" />
                                                        <span className="text-white text-sm ">Fjern adgang</span>
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    ) : null
                                )}
                        </div>
                    </>
                )}
                {canEdit && <>
                    <div>
                        <Input
                            type="text"
                            placeholder="Søg medarbejdere"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-col gap-2 border-[1px] rounded-lg border-gray-200 p-2">
                        {employees.length === 0 && (
                            <div className="flex flex-row items-center justify-center gap-2">
                                <p className="text-sm text-gray-500">Ingen medarbejdere fundet</p>
                            </div>
                        )}
                        {employees.map((user) => (
                            <div key={user?.id} className="flex flex-row items-center gap-2">
                                <button
                                    className="flex flex-row items-center gap-2 hover:bg-gray-200 p-2 rounded w-full text-left"
                                    onClick={() => {
                                        createAccess ? createAccess({
                                            entityId: user?.user?.id as number,
                                            entityType: EntityType.User,
                                            role: SurveyRoles.Editor,
                                            accessGrantorId: userAuth?.user?.id as number,
                                        }) : handleCreateAccess({
                                            entityId: user?.user?.id as number,
                                            entityType: EntityType.User,
                                            role: SurveyRoles.Editor,
                                            accessGrantorId: userAuth?.user?.id as number,
                                        });
                                    }}>
                                    {user?.user?.fullName}
                                </button>
                            </div>
                        ))}
                    </div>
                    <div className="flex flex-row items-center gap-2 justify-center">
                        {!loading && employees.length > 0 && (
                            <>
                                <button
                                    onClick={() => handlePageChange(page - 1)}
                                    className={`${data?.getAllCompanyUsersByCompanyIdAndType?.pageInfo?.hasNextPage ? 'bg-blue-500' : 'bg-gray-300'} text-white font-semibold py-1 px-2 rounded`}>
                                    <Icon path={mdiChevronLeft} size={1} className="text-white" />
                                </button>
                                <span className="text-sm text-gray-500">{data?.getAllCompanyUsersByCompanyIdAndType?.pageInfo?.currentPage as number + 1 || 0} / {data?.getAllCompanyUsersByCompanyIdAndType?.pageInfo?.totalPages || 0}</span>
                                <button
                                    onClick={() => handlePageChange(page + 1)}
                                    className={`${data?.getAllCompanyUsersByCompanyIdAndType?.pageInfo?.hasPreviousPage ? 'bg-blue-500' : 'bg-gray-300'} text-white font-semibold py-1 px-2 rounded`}>
                                    <Icon path={mdiChevronRight} size={1} className="text-white" />
                                </button>
                            </>
                        )}
                    </div>
                </>
                }
            </div >
        </SurveyDisclosure >
    );
}
export default SurveyEmployeeShare;