import { useMutation, useQuery } from "@apollo/client";
import { mdiAccountMultiple, mdiAccountMultiplePlus, mdiArrowRight, mdiChevronLeft, mdiPencilOutline, mdiPlus, mdiPublish, mdiTrashCanOutline } from "@mdi/js";
import Icon from "@mdi/react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, ConfirmModal, DELETE_SURVEY_BY_ID, GET_ALL_SURVEY_ACCESS, GET_SURVEY_BY_ID, ModalContainer, translateSurveyStatus } from "shared";
import TabMenu, { TabItemBase } from "shared/components/TabMenu";
import { Survey, SurveyActions, SurveyInput, SurveyRoles, SurveyStatusEnum } from "shared/graphql/__generated__/graphql";
import SurveyEmployeeShare from "../SurveyCreate/SurveyEmployeeAccess";
import { SurveyPreview } from "./SurveyPreview";
import { routes } from "@/constants/routes";
import { SurveyResidentAccess } from "../SurveyCreate/SurveyResidentAccess";

export const SurveyOverview = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [createInviteOpen, setCreateInviteOpen] = useState(false);
    const [createAccessOpen, setCreateAccessOpen] = useState(false);
    const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

    const [selectedTab, setSelectedTab] = useState<number>(0);

    const { data, loading, error, refetch } = useQuery(GET_SURVEY_BY_ID, {
        variables: {
            getSurveyById: Number(id),
        },
        fetchPolicy: 'no-cache',
    },
    );
    const { data: accessData, loading: accessLoading, error: accessError, refetch: accessRefetch } = useQuery(GET_ALL_SURVEY_ACCESS, {
        variables: {
            input: {
                surveyId: Number(id),
                role: SurveyRoles.Responder
            }
        },
        fetchPolicy: 'no-cache',
    });

    const allTabs: TabItemBase[] = [
        {
            title: 'Oversigt',
            isSelected: selectedTab === 0,
        },
        {
            title: 'Forhåndsvisning',
            isSelected: selectedTab === 1,
        },
        {
            title: 'Deltagere',
            isSelected: selectedTab === 2,
        },
    ]

    const [deleteSurvey] = useMutation(DELETE_SURVEY_BY_ID, {
        variables: {
            deleteSurveyByIdId: Number(id),
        }
    });

    const handleDeleteSurvey = async () => {
        try {
            await deleteSurvey();
            navigate(routes.survey);
        } catch (error) {
            console.error("Error deleting survey:", error);
        }
    };

    const survey: Survey = data?.getSurveyById as Survey;
    if (error) return <div className="w-full h-full p-6 flex flex-col items-center justify-center">Fejl ved indlæsning..</div>;

    if (loading || accessLoading) return <div className="w-full h-full p-6 flex flex-col items-center justify-center"><p>Loading</p></div>;

    return (
        <div className="w-full h-full flex flex-col">
            <ModalContainer
                isOpen={createAccessOpen && selectedTab === 0}
                closeModal={() => { setCreateAccessOpen(false); }}
            >
                <SurveyEmployeeShare
                    survey={survey as Survey}
                    canEdit={survey?.accessType === SurveyRoles.Creator || survey?.accessType === SurveyRoles.Editor}
                    refetch={refetch}
                />
            </ModalContainer>
            <div className="px-6 pt-4 flex flex-row ">
                <div className="flex flex-row items-center content-center w-full">
                    <div onClick={() => navigate(-1)}>
                        <Icon path={mdiChevronLeft} size={1.5} className='mr-4 -ml-2 cursor-pointer text-primary' />
                    </div>
                    <h2 className="text-3xl font-bold leading-none line-clamp-1 text-ellipsis w-full">
                        Spørgeskema
                    </h2>
                </div>
                <div className="flex flex-row w-full justify-end">
                    <TabMenu
                        items={survey.status === SurveyStatusEnum.Template ? allTabs.slice(0, 2) : allTabs}
                        onSelect={(index) => {
                            setSelectedTab(index);
                        }}
                    />
                </div>
            </div>
            <ConfirmModal
                onConfirm={() => handleDeleteSurvey()}
                title={`Er du sikker på, at du vil slette spørgeskemaet?`}
                description={'Handlingen kan ikke fortrydes'}
                isOpen={confirmDeleteOpen}
                onClose={() => { setConfirmDeleteOpen(false); }}
            />
            <div className="mb-2 border-b-2 border-gray-200 py-2 flex flex-row items-center justify-between mx-6">
                <h2 className="text-2xl font-semibold text-gray-600">{selectedTab === 0 ? survey.title : selectedTab === 1 ? 'Forhåndsvisning' : selectedTab === 2 ? 'Deltagere' : 'Besvarelser'}</h2>
                <div className="flex flex-row items-center">
                    {survey.accessActions?.includes(SurveyActions.Share) &&
                        <button className="p-2 rounded-md hover:bg-gray-200" onClick={() => { setCreateAccessOpen(true); }}>
                            <Icon
                                path={mdiAccountMultiplePlus}
                                size={1}
                                className="text-gray-500 hover:text-gray-500"
                            />
                        </button>
                    }
                    {survey.accessActions?.includes(SurveyActions.Edit) &&
                        <button className="p-2 rounded-md hover:bg-gray-200" onClick={() => navigate(routes.surveyEdit.replace(':id', id || ''))}>
                            <Icon
                                path={mdiPencilOutline}
                                size={1}
                                className="text-gray-500 hover:text-gray-500"
                            />
                        </button>
                    }
                    {survey.accessActions?.includes(SurveyActions.Delete) &&
                        <button className="p-2 rounded-md hover:bg-gray-200" onClick={() => { setConfirmDeleteOpen(true); }}>
                            <Icon
                                path={mdiTrashCanOutline}
                                size={1}
                                className="text-gray-500 hover:text-gray-500"
                            />
                        </button>
                    }
                </div>
            </div>
            {selectedTab === 0 &&

                <div className="mx-6 mb-4 flex flex-col">

                    <div className="py-2 rounded-lg">

                        <div className="flex flex-row mb-4 w-full gap-6 justify-between border-b-[1px] border-gray-200 pb-4">
                            <div className="flex flex-col">
                                <div className="flex flex-col mb-4 gap-2 ">
                                    <p className="text-gray-600 text-md">
                                        {survey?.description}
                                    </p>
                                </div>
                                <table className="table-auto h-max">
                                    <tbody>
                                        <tr>
                                            <td className="text-gray-400 text-md w-24 py-1">
                                                Titel
                                            </td>
                                            <td className="text-gray-600 text-md ">
                                                {survey?.title}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="text-gray-400 text-md w-24 py-1">
                                                Opretter
                                            </td>
                                            <td className="text-gray-600 text-md ">
                                                {survey?.creator?.fullName}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="text-gray-400 text-md w-24 py-1">
                                                Dato
                                            </td>
                                            <td className="text-gray-600 text-md ">
                                                {new Date(Number(survey?.createdAt)).toLocaleDateString('da-DK', {
                                                    year: 'numeric',
                                                    month: '2-digit',
                                                    day: '2-digit',
                                                })}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="text-gray-400 text-md w-24 py-1">
                                                Status
                                            </td>
                                            <td className="text-gray-600 text-md ">
                                                {translateSurveyStatus(survey?.status as SurveyStatusEnum)}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div className="">
                                <div className="flex flex-row items-center gap-1 my-1 text-gray-500">
                                    <Icon path={mdiAccountMultiple} size={.7} />
                                    <p className="text-sm font-semibold ">Delt med</p>
                                </div>
                                <div className="bg-gray-50 py-2 px-4 pb-3 rounded border-[1px] border-b-2 border-gray-200 w-60 flex flex-col gap-2">
                                    {survey?.surveyAccess?.filter((a) => a?.role !== SurveyRoles.Responder).map((access) => (
                                        <div key={access?.id} className="flex flex-col">
                                            <div className="flex flex-row items-center">
                                                {access?.user?.fullName}
                                            </div>
                                            <p className="text-gray-500 text-xs">{access?.role !== SurveyRoles.Creator ? `Delt af ${access?.accessGrantor?.fullName}` : 'Opretter'} </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            }
            {
                selectedTab === 1 &&
                <div className="px-6">
                    <div className="mb-2 flex flex-row items-center justify-between">

                        <div className="flex flex-row items-center">
                            {survey?.status !== SurveyStatusEnum.Published && (survey?.accessType === SurveyRoles.Creator || survey?.accessType === SurveyRoles.Editor) &&
                                <>
                                    <button className="p-2 rounded-md hover:bg-gray-200" onClick={() => navigate(routes.surveyEdit.replace(':id', id || ''))}>
                                        <Icon
                                            path={mdiPencilOutline}
                                            size={1}
                                            className="text-gray-500 hover:text-gray-500"
                                        />
                                    </button>
                                    {survey?.accessType === SurveyRoles.Creator && (
                                        <button className="p-2 rounded-md hover:bg-gray-200" onClick={() => { }}>
                                            <Icon
                                                path={mdiTrashCanOutline}
                                                size={1}
                                                className="text-gray-500 hover:text-gray-500"
                                            />
                                        </button>
                                    )}
                                </>
                            }

                        </div>
                    </div>
                    <SurveyPreview
                        survey={survey as SurveyInput}
                    />
                </div>
            }
            {
                selectedTab === 2 &&
                <div className="py-2 mx-6 mb-4 gap-2 flex flex-col">
                    {survey?.status !== SurveyStatusEnum.Template && survey?.status !== SurveyStatusEnum.Draft && (
                        <div className="flex flex-row items-center justify-end">
                            <Button
                                onClick={() => {
                                    createInviteOpen ? setCreateInviteOpen(false) : setCreateInviteOpen(true);
                                }}
                            >
                                <div className="flex flex-row items-center gap-2">
                                    <Icon path={mdiPlus} size={1} />
                                    <p>Opret invitation</p>
                                </div>
                            </Button>
                        </div>
                    )}
                    <div className="border-2 border-gray-200 p-6 rounded-lg">
                        <div className="mt-4">
                            {accessData?.getAllSurveyAccess && accessData.getAllSurveyAccess.length > 0 ? (
                                accessData.getAllSurveyAccess.map((access) => (
                                    <div
                                        onClick={(e) => navigate(routes.surveyInstance.replace(':id', access?.id?.toString() || ''))}
                                        key={access?.id}
                                        className="flex flex-row items-center hover:bg-gray-200 py-2 px-4 rounded-lg mb-2">
                                        <div>
                                            {access?.user?.imageUrl &&
                                                <img
                                                    src={access?.user?.imageUrl || undefined}
                                                    className="object-cover w-10 h-10 rounded-full mr-4"
                                                    alt={`${access?.user?.fullName}'s profile`}
                                                />
                                            }
                                            {!access?.user?.imageUrl &&
                                                <div className="bg-gray-300 w-10 h-10 rounded-full mr-4 flex items-center justify-center">
                                                    <p className="text-gray-500 text-sm">{access?.user?.fullName?.charAt(0)}</p>
                                                </div>
                                            }
                                        </div>
                                        <div>
                                            <p className="text-gray-700 text-lg font-semibold">{access?.user?.fullName}</p>
                                            <p className="text-gray-500">Inviteret af {access?.accessGrantor?.fullName || ''}</p>
                                        </div>
                                        <div className="text-gray-500 text-sm ml-auto">
                                            {access?.surveyInstances?.length || 'Ingen'} invitationer
                                        </div>
                                        <div className="flex flex-row items-center ml-10"
                                            onClick={() => { navigate(routes.surveyInstance.replace(':id', access?.id?.toString() || '')) }}>
                                            <Icon
                                                path={mdiArrowRight}
                                                size={1}
                                                className="text-gray-500 ml-auto"
                                            />
                                        </div>
                                    </div>
                                )
                                )) : (
                                survey?.status !== SurveyStatusEnum.Draft ? (
                                    <div className="text-gray-500 text-center">
                                        Ingen deltagere fundet.
                                    </div>
                                ) : (
                                    <div className="text-gray-500 text-center flex flex-col items-center gap-4">
                                        <div>
                                            <h2 className="text-lg font-semibold">Dette spørgeskema er ikke udgivet. </h2>
                                            <p>Udgiv spørgeksemaet for at invitere deltagere.</p>
                                        </div>
                                        <Button>
                                            <div className="flex flex-row items-center gap-2">
                                                <Icon path={mdiPublish} size={1} />
                                                <p>Udgiv spørgeskema</p>
                                            </div>
                                        </Button>
                                    </div>
                                )
                            )}
                        </div>
                    </div>
                    <ModalContainer
                        isOpen={createInviteOpen && selectedTab === 2}
                        closeModal={() => { setCreateInviteOpen(false); }}
                        fullWidth={true}
                        className="overflow-visible"
                    >
                        <SurveyResidentAccess
                            survey={survey as Survey}
                            canEdit={survey?.accessType === SurveyRoles.Creator || survey?.accessType === SurveyRoles.Editor}
                            onCreated={() => {
                                accessRefetch();
                                setCreateInviteOpen(false);
                            }}
                        />
                    </ModalContainer>
                </div>
            }

        </div >
    )
}