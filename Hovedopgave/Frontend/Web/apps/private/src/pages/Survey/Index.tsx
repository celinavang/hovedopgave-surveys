import { routes } from "@/constants/routes"
import { useQuery } from "@apollo/client"
import { mdiChevronUp, mdiFileClock, mdiFileDocumentCheck, mdiSort } from "@mdi/js"
import Icon from "@mdi/react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { GET_ALL_SURVEY_INSTANCES, Loader, SearchBar, SubPageContainer, Table } from "shared"
import TabMenu, { GenericTabItem } from "shared/components/TabMenu"
import { SurveyInstanceStatusEnum, User } from "shared/graphql/__generated__/graphql"
import { DateFormatsEnum, formatDate } from "shared/utils/dateUtils"

interface SurveyInstanceRow {
    id: number | null
    title: string
    description: string
    invitationDate?: string | null
    deadline: string
    status?: SurveyInstanceStatusEnum | null
    responseDate?: string | null
    invitedBy?: User | null
}

export enum SurveyInstanceSortOrder {
    EarliestDeadline = "earliestDeadline",
    LatestDeadline = "latestDeadline",
    RecentAnswer = "recentAnswer",
    LatestAnswer = "latestAnswer",

}

export const SurveyInstanceSortDeadlineOptions = {
    [SurveyInstanceSortOrder.EarliestDeadline]: { key: SurveyInstanceSortOrder.EarliestDeadline, label: 'Nærmeste deadline' },
    [SurveyInstanceSortOrder.LatestDeadline]: { key: SurveyInstanceSortOrder.LatestDeadline, label: 'Fjerneste deadline' },
}

export const SurveyInstanceSortAnswerOptions = {
    [SurveyInstanceSortOrder.RecentAnswer]: { key: SurveyInstanceSortOrder.RecentAnswer, label: 'Seneste besvarelse' },
    [SurveyInstanceSortOrder.LatestAnswer]: { key: SurveyInstanceSortOrder.LatestAnswer, label: 'Ældste besvarelse' },
}

export const SurveyPage = () => {

    const navigate = useNavigate();

    const [selectedTab, setSelectedTab] = useState<SurveyInstanceStatusEnum | null>(SurveyInstanceStatusEnum.Awaiting);
    const [search, setSearch] = useState<string>("");
    const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
    const [sortDeadline, setSortDeadline] = useState<SurveyInstanceSortOrder>(SurveyInstanceSortOrder.EarliestDeadline);
    const [sortAnswer, setSortAnswer] = useState<SurveyInstanceSortOrder>(SurveyInstanceSortOrder.RecentAnswer);


    const { data, loading, refetch } = useQuery(GET_ALL_SURVEY_INSTANCES, {
        variables: {
            input: {
                status: selectedTab,
            }
        },
        fetchPolicy: 'no-cache',
    });


    console.log('data', data)

    if (loading) {
        return (
            <div className="flex items-center justify-center w-full h-full">
                <Loader />
            </div>
        );
    }

    const tabItems: GenericTabItem<SurveyInstanceStatusEnum | null>[] = [
        {
            value: SurveyInstanceStatusEnum.Awaiting,
            title: 'Afventer',
            icon: mdiFileClock,
            isSelected: selectedTab === SurveyInstanceStatusEnum.Awaiting,

        },
        {
            value: SurveyInstanceStatusEnum.Completed,
            title: 'Afsluttet',
            icon: mdiFileDocumentCheck,
            isSelected: selectedTab === SurveyInstanceStatusEnum.Completed,

        }
    ]

    const surveyInstances = (data?.getAllSurveyInstances ?? [])
        .map(surveyInstance => ({
            id: surveyInstance.id ?? null,
            title: surveyInstance.surveyAccess?.survey?.title ?? '',
            description: surveyInstance.surveyAccess?.survey?.description ?? '',
            deadline: surveyInstance.deadline ?? '',
            status: surveyInstance.status,
            responseDate: surveyInstance.responseDate,
            invitedBy: surveyInstance.invitedBy,
            invitationDate: surveyInstance.invitationDate,
        }))
        .filter((surveyInstance: SurveyInstanceRow) => {
            const matchesSearch =
                search.trim() === "" ||
                surveyInstance.title.toLowerCase().includes(search.toLowerCase()) ||
                surveyInstance.invitedBy?.fullName?.toLowerCase().includes(search.toLowerCase())
            return matchesSearch;
        }).toSorted((a, b) => {
            if (selectedTab === SurveyInstanceStatusEnum.Awaiting) {
                if (sortDeadline === SurveyInstanceSortOrder.EarliestDeadline) {
                    // Sort by earliest deadline first
                    return Number(a.deadline) - Number(b.deadline);
                } else {
                    // Sort by latest deadline first
                    return Number(b.deadline) - Number(a.deadline);
                }
            } else {
                if (sortAnswer === SurveyInstanceSortOrder.RecentAnswer) {
                    // Sort by most recent answer first
                    return Number(b.responseDate ?? 0) - Number(a.responseDate ?? 0);
                } else {
                    // Sort by oldest answer first
                    return Number(a.responseDate ?? 0) - Number(b.responseDate ?? 0);
                }
            }
        })



    const groupedSurveyInstances = surveyInstances.reduce((acc, survey) => {
        if (!acc[survey.title]) {
            acc[survey.title] = [];
        }
        acc[survey.title].push(survey);
        return acc;
    }, {} as Record<string, SurveyInstanceRow[]>);

    const toggleSection = (title: string) => {
        setOpenSections((prev) => ({
            ...prev,
            [title]: !prev[title],
        }));
    };

    return (
        <SubPageContainer
            title="Spørgeskemaer"
            back
            description={"Her kan du se dine spørgeskemaer."}
            descriptionAsInfo
        >
            <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center mb-2 gap-4 md:gap-8">
                <div className="w-full md:w-auto">
                    <TabMenu
                        items={tabItems}
                        onSelect={(item) => {
                            setSelectedTab(tabItems[item].value);
                        }}
                    />
                </div>
                <div className="flex items-center gap-2">
                    <SearchBar
                        placeholder="Søg..."
                        value={search}
                        onChange={(string => setSearch(string))}
                        className="w-[300px]"
                    />
                    <div className="relative  inline-block">
                        <Icon
                            path={mdiSort}
                            size={1}
                            className="absolute left-2 top-2 text-gray-500 pointer-events-none"
                        />
                        {selectedTab === SurveyInstanceStatusEnum.Awaiting ? (
                            <select
                                value={sortDeadline}
                                onChange={e => setSortDeadline(e.target.value as SurveyInstanceSortOrder)}
                                className="border-none rounded px-10 py-2 focus:outline-none hover:border-gray-400 cursor-pointer transition-colors"
                            >
                                {Object.values(SurveyInstanceSortDeadlineOptions).map(option => (
                                    <option key={option.key} value={option.key}>{option.label}</option>
                                ))}
                            </select>
                        ) : (
                            <select
                                value={sortAnswer}
                                onChange={e => setSortAnswer(e.target.value as SurveyInstanceSortOrder)}
                                className="border-none rounded px-10 py-2 focus:outline-none hover:border-gray-400 cursor-pointer transition-colors"
                            >
                                {Object.values(SurveyInstanceSortAnswerOptions).map(option => (
                                    <option key={option.key} value={option.key}>{option.label}</option>
                                ))}
                            </select>
                        )}
                    </div>
                </div>
            </div>
            <div className="w-full overflow-x-auto">
                {surveyInstances.length === 0 ? (
                    <div className="flex items-center justify-center pt-20">
                        <p className="text-lg text-gray-700">Der er ingen spørgeskemaer endnu</p>
                    </div>
                ) : selectedTab === SurveyInstanceStatusEnum.Completed ? (
                    <div>
                        {Object.entries(groupedSurveyInstances).map(([title, surveys]) => (
                            <div key={title} className="mb-4 border rounded-md">
                                <div
                                    className="flex justify-between items-center px-4 py-2 bg-gray-200 cursor-pointer"
                                    onClick={() => toggleSection(title)}
                                >
                                    <span className="font-semibold">{title}</span>
                                    <Icon path={mdiChevronUp} size={1} className={`text-gray-500 transition-transform duration-300 ${openSections[title] ? '' : 'rotate-180'}`} />
                                </div>

                                {openSections[title] && (
                                    <div className="p-4">
                                        <Table<SurveyInstanceRow>
                                            headers={['Besvarelsesdato', 'Inviteret af', 'Deadline', 'Status']}
                                            items={surveys}
                                            className="border rounded-md border-neutral-200 table-fixed w-full"
                                            bulk={{ disabled: true }}
                                            onItemClick={(item) => navigate(routes.surveyInvite.replace(':id', String(item.id)))}
                                            RenderItem={({ item }) => {
                                                return (
                                                    <>
                                                        <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap overflow-hidden text-ellipsis">
                                                            <p>{`${formatDate(String(item.responseDate), DateFormatsEnum.DD_MM_YYYY)}`}</p>
                                                        </td>
                                                        <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap overflow-hidden text-ellipsis">
                                                            <p>{item.invitedBy?.fullName}</p>
                                                        </td>
                                                        <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap overflow-hidden text-ellipsis">
                                                            <p>{`${formatDate(String(item.deadline), DateFormatsEnum.DD_MM_YYYY)}`}</p>
                                                        </td>
                                                        <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap overflow-hidden text-ellipsis">
                                                            <span className="bg-teal text-black py-1 px-4 rounded-md font-semibold">
                                                                Besvaret
                                                            </span>
                                                        </td>
                                                    </>
                                                );
                                            }}
                                        />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <Table<SurveyInstanceRow>
                        headers={['Titel', 'Inviteret af', 'Start dato', 'Deadline', 'Status']}
                        items={surveyInstances}
                        className='border rounded-md border-neutral-200 min-w-[900px] '
                        bulk={{ disabled: true }}
                        edit={{ disabled: true, validateAccess: () => (false) }}
                        onItemClick={(item) => navigate(routes.surveyInvite.replace(':id', String(item.id)))}
                        RenderItem={({ item }) => {
                            return (
                                <>
                                    <td className="px-6 py-4 text-sm text-gray-900">
                                        <p className="line-clamp-1 text-ellipsis overflow-hidden w-full">{item.title}</p>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900">
                                        <p>{item.invitedBy?.fullName}</p>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900 w-44 ">
                                        <p>{`${formatDate(String(item.invitationDate), DateFormatsEnum.DD_MM_YYYY)}`}</p>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900 w-44">
                                        <p>{`${formatDate(String(item.deadline), DateFormatsEnum.DD_MM_YYYY)}`}</p>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900 w-56">
                                        {item.status ? (
                                            (item.status as SurveyInstanceStatusEnum) === SurveyInstanceStatusEnum.Awaiting ? (
                                                <button className="bg-yellow-300 text-black py-1 px-4 rounded-md font-semibold">
                                                    Afventer
                                                </button>
                                            ) : (item.status as SurveyInstanceStatusEnum) === SurveyInstanceStatusEnum.Completed ? (
                                                <button className="bg-teal text-black py-1 px-4 rounded-md font-semibold">
                                                    Besvaret
                                                </button>
                                            ) : null
                                        ) : (
                                            <span className="text-gray-900">Ingen status</span>
                                        )}
                                    </td>
                                </>
                            );
                        }}
                    />
                )}
            </div>

        </SubPageContainer>
    );

}