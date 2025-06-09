import { routes } from "@/constants/routes";
import { useQuery } from "@apollo/client";
import { mdiArrowRight, mdiPlus } from "@mdi/js";
import Icon from "@mdi/react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, GET_SURVEY_ACCESS_BY_ID, SubPageContainer, Table } from "shared";
import { SurveyInstance, SurveyInstanceStatusEnum } from "shared/graphql/__generated__/graphql";
import { DateFormatsEnum, formatDate } from "shared/utils/dateUtils";

const tabs = [
    { label: 'Invitationer', value: 0 },
    { label: 'Besvarelser', value: 1 },
];

export const SurveyInstancePage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [selectedTab, setSelectedTab] = useState<number>(0);
    const [showCreateInvitation, setShowCreateInvitation] = useState<boolean>(false);

    const { data, error, loading } = useQuery(GET_SURVEY_ACCESS_BY_ID, {
        variables: { getSurveyAccessByIdId: Number(id) },
    });
    if (loading) return <div>Loading...</div>;
    if (error || !data || !data.getSurveyAccessById) return <div>Error: {error?.message || 'Intet spørgeskema fundet'}</div>;
    return (
        <SubPageContainer
            back={true}
            title={"Spørgeskema invitation"}
        >
            <div className="flex flex-row justify-between">
                <div>
                    <h2 className="text-xl font-semibold text-gray-500">Deltager information</h2>
                    <p>Navn: {data.getSurveyAccessById.user?.fullName}</p>
                    <p></p>
                </div>
                <div>
                    <Button
                        onClick={() => {
                            setShowCreateInvitation(true);
                        }}
                    >
                        <div className="flex flex-row items-center gap-2">
                            <Icon path={mdiPlus} size={1} />
                            <p>Opret invitation</p>
                        </div>
                    </Button>
                </div>
            </div>
            <div className="flex flex-row justify-end">
                <div className="flex flex-row bg-white mb-2">
                    {tabs.map((tab) => (
                        <button
                            key={tab.value}
                            className={`p-4 text-gray-500 border-b-2 ${selectedTab === tab.value ? 'border-primary' : 'border-gray-200'}`}
                            onClick={() => setSelectedTab(tab.value)}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>
            <div className="bg-white w-full p-4 border-b-2 border-gray-200">
                {selectedTab === 0 && (
                    <div>
                        <h3 className="text-lg font-semibold text-gray-600">Invitationer</h3>
                        <p>Her kan du se invitationer til spørgeskemaet.</p>
                        <Table<SurveyInstance>
                            headers={['Start dato', 'Deadline', 'Besked til modtager', 'Status']}
                            bulk={{ disabled: true }}
                            edit={{ disabled: true, validateAccess: () => { return false } }}
                            onItemClick={(item => {
                                navigate(routes.surveyResponse.replace(':id', String(item.id)))
                            }
                            )}
                            className='border rounded-md border-neutral-200 table-fixed min-w-[900px]'
                            items={data.getSurveyAccessById.surveyInstances?.toSorted((a, b) => {
                                const aDate = a?.invitationDate ?? '';
                                const bDate = b?.invitationDate ?? '';
                                return aDate.localeCompare(bDate);
                            }) as SurveyInstance[] || []}
                            RenderItem={({ item }) => (
                                <>
                                    <td className="py-4 px-6 w-44">
                                        {formatDate(String(item.invitationDate), DateFormatsEnum.DD_MM_YYYY)}
                                    </td>
                                    <td className="py-2 px-6 w-44">
                                        {item.deadline ? formatDate(String(item.deadline), DateFormatsEnum.DD_MM_YYYY) : 'Ingen deadline'}
                                    </td>
                                    <td className="py-2 px-6 text-ellipsis ">
                                        {item.invitationMessage ? item.invitationMessage : ''}
                                    </td>
                                    <td className="py-2 px-6 flex w-40 text-center font-semibold">
                                        {item.status === SurveyInstanceStatusEnum.Awaiting && (
                                            <>
                                                {item.deadline && Number(item.deadline) < new Date().getTime() && item.status === SurveyInstanceStatusEnum.Awaiting ? (
                                                    <span className="bg-red-300 rounded-sm py-2 px-3 flex-grow">Overskredet</span>
                                                ) : (
                                                    <span className="bg-yellow-300 rounded-sm py-2 px-3 flex-grow">Afventer</span>
                                                )}
                                            </>
                                        )}
                                        {item.status === SurveyInstanceStatusEnum.Completed && <span className="bg-teal rounded-sm py-2 px-3 flex-grow">Besvaret</span>}
                                    </td>
                                </>
                            )}
                        />
                    </div>
                )}
                {selectedTab === 1 && (
                    <div>
                        <h3 className="text-lg font-semibold text-gray-600">Besvarelser</h3>
                        <p>Her kan du se besvarelser til spørgeskemaet.</p>
                        <Table<SurveyInstance>
                            items={data.getSurveyAccessById.surveyInstances?.filter((instance) => instance?.status === SurveyInstanceStatusEnum.Completed).toSorted((a, b) => {
                                const aDate = a?.invitationDate ?? '';
                                const bDate = b?.invitationDate ?? '';
                                return aDate.localeCompare(bDate);
                            }
                            ) as SurveyInstance[] || []}
                            headers={['Start dato', 'Deadline', 'Besked til modtager', 'Besvaret']}
                            bulk={{ disabled: true }}
                            edit={{ disabled: true, validateAccess: () => { return false } }}
                            className='border rounded-md border-neutral-200 table-fixed min-w-[900px]'
                            onItemClick={(item => {
                                navigate(routes.surveyResponse.replace(':id', String(item.id)))
                            }
                            )}
                            RenderItem={({ item }) => (
                                <>
                                    <td className="py-4 px-6 w-44">
                                        {formatDate(String(item.invitationDate), DateFormatsEnum.DD_MM_YYYY)}
                                    </td>
                                    <td className="py-2 px-6 w-44">
                                        {item.deadline ? formatDate(String(item.deadline), DateFormatsEnum.DD_MM_YYYY) : 'Ingen deadline sat'}
                                    </td>
                                    <td className="py-2 px-6 text-ellipsis">
                                        {item.invitationMessage ? item.invitationMessage : ''}
                                    </td>
                                    <td className="py-2 px-6">
                                        {item.responseDate ? formatDate(String(item.responseDate), DateFormatsEnum.DD_MM_YYYY) : 'Ikke besvaret'}
                                    </td>
                                </>
                            )}
                        />
                    </div>
                )}
            </div>
        </SubPageContainer >
    )
}