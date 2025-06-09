import { routes } from "@/constants/routes";
import { useMutation, useQuery } from "@apollo/client";
import { mdiAccountLockOpen, mdiDelete, mdiEye, mdiFileDocumentCheck, mdiFileDocumentEdit, mdiFileDocumentMultiple, mdiFileDocumentRefresh, mdiPencil, mdiSort } from "@mdi/js";
import { useEffect, useRef, useState } from "react";
import { ConfirmModal, DELETE_SURVEY_BY_ID, GET_ALL_SURVEYS, Loader, SearchBar, SubPageContainer, SurveyEmployeeShareModal, Table } from "shared";
import TabMenu, { GenericTabItem } from "shared/components/TabMenu";
import { useNavigate } from "react-router-dom";
import { SurveyActions, SurveyRoles, SurveyStatusEnum } from "shared/graphql/__generated__/graphql";
import { DateFormatsEnum, formatDate } from "shared/utils/dateUtils";
import Icon from "@mdi/react";
import { toast } from "react-toastify";
import { useConfirmModal } from "shared/hooks/useConfirmModal";


interface SurveyRow {
    id: number;
    title: string;
    description: string;
    createdAt?: string;
    creator?: {
        id: number;
        fullName: string;
    }
    status?: SurveyStatusEnum | null;
    accessActions?: SurveyActions[];
}

export enum SurveySortOrder {
    Newest = "newest",
    Oldest = "oldest",
}

export const SurveySortOptions = {
    [SurveySortOrder.Newest]: { key: SurveySortOrder.Newest, label: 'Nyeste' },
    [SurveySortOrder.Oldest]: { key: SurveySortOrder.Oldest, label: 'Ældste' },
}

export const SurveyPage = () => {

    const navigate = useNavigate();
    const [sortOption, setSortOption] = useState<SurveySortOrder>(SurveySortOrder.Newest);

    const { data, loading, refetch } = useQuery(GET_ALL_SURVEYS, {
        variables: {
            input: {
            }
        },
        fetchPolicy: 'no-cache',
    });

    const [deleteSurvey] = useMutation(DELETE_SURVEY_BY_ID, {
        refetchQueries: [{ query: GET_ALL_SURVEYS }],
        awaitRefetchQueries: true,
    })

    const handleDeleteSurvey = async (id: number) => {
        try {
            await deleteSurvey({ variables: { deleteSurveyByIdId: id } });
            await refetch();
            toast.success("Spørgeskemaet blev slettet");
        } catch (err) {
            toast.error("Der opstod en fejl under sletning af spørgeskemaet.");
        }
    };

    const { isModalOpen, openModal, closeModal, handleConfirm } = useConfirmModal(handleDeleteSurvey);

    const [selectedTab, setSelectedTab] = useState<SurveyStatusEnum | null>(null);
    const [search, setSearch] = useState<string>("");
    const [activeMenuId, setActiveMenuId] = useState<number | null>(null);

    const [accessModalOpen, setAccessModalOpen] = useState(false);
    const [selectedSurvey, setSelectedSurvey] = useState<any>(null);


    const menuRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setActiveMenuId(null);
            }
        };

        document.addEventListener('mousedown', handleOutsideClick);
        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, []);

    const handleMenuToggle = (id: number | null) => {
        setActiveMenuId((prev) => (prev === id ? null : id))
    }

    const handleMenuClick = (action: string, id: number | null) => {
        setActiveMenuId(null);
        if (action === 'edit' && id) {
            navigate(routes.surveyEdit.replace(":id", String(id)));
        } else if (action === 'delete' && id) {
            openModal(id);
        } else if (action === 'access' && id) {
            const survey = surveys.find((s: any) => s.id === id);
            setSelectedSurvey(survey);
            setAccessModalOpen(true);
        }
    };


    if (loading) {
        return (
            <div className="flex items-center justify-center w-full h-full">
                <Loader />
            </div>
        );
    }

    const tabItems: GenericTabItem<SurveyStatusEnum | null>[] = [
        {
            value: null,
            title: 'Alle',
            icon: mdiFileDocumentMultiple,
            isSelected: selectedTab === null,
        },
        {
            value: SurveyStatusEnum.Published,
            title: 'Offentliggjort',
            icon: mdiFileDocumentCheck,
            isSelected: selectedTab === SurveyStatusEnum.Published,
        },
        {
            value: SurveyStatusEnum.Template,
            title: 'Skabelon',
            icon: mdiFileDocumentRefresh,
            isSelected: selectedTab === SurveyStatusEnum.Template,
        },
        {
            value: SurveyStatusEnum.Draft,
            title: 'Kladde',
            icon: mdiFileDocumentEdit,
            isSelected: selectedTab === SurveyStatusEnum.Draft,
        }

    ]

    const surveys = (data?.getAllSurveys ?? []).map((survey: any) => ({
        id: survey?.id,
        title: survey?.title,
        description: survey?.description,
        createdAt: survey?.createdAt,
        creator: survey?.creator,
        status: survey?.status,
        accessActions: survey?.accessActions,
    })).filter((survey: any) => {
        const matchesTab = selectedTab === null || survey?.status === selectedTab;
        const matchesSearch =
            search.trim() === '' ||
            survey?.title?.toLowerCase().includes(search.toLowerCase()) ||
            survey?.description?.toLowerCase().includes(search.toLowerCase());
        return matchesTab && matchesSearch;
    }).toSorted((a, b) => {
        return sortOption === SurveySortOrder.Newest ? Number(b.createdAt) < Number(a.createdAt) ? -1 : 1 :
            Number(b.createdAt) > Number(a.createdAt) ? -1 : 1;
    });


    return (
        <SubPageContainer
            title="Spørgeskemaer"
            back
            description={"Her kan du se dine spørgeskemaer."}
            descriptionAsInfo
            buttons={
                [
                    {
                        label: 'Opret spørgeskema',
                        props: {
                            variant: "contained",
                            showPlus: true,
                            onClick: () => {
                                navigate(routes.surveyCreate);
                            },
                        },
                    },
                ]
            }
        >
            <ConfirmModal
                onConfirm={handleConfirm}
                title={`Er du sikker på, at du vil slette spørgeskemaet?`}
                description={'Handlingen kan ikke fortrydes'}
                isOpen={isModalOpen}
                onClose={closeModal}
            />
            <SurveyEmployeeShareModal
                isOpen={accessModalOpen}
                closeModal={() => setAccessModalOpen(false)}
                refetch={refetch}
                survey={data?.getAllSurveys?.find((s: any) => s.id === selectedSurvey?.id) || null}
                canEdit={true}
            />
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
                        <select
                            value={sortOption}
                            onChange={e => setSortOption(e.target.value as SurveySortOrder)}
                            className="border-none rounded px-10 py-2 focus:outline-none hover:border-gray-400 cursor-pointer transition-colors"
                        >
                            {Object.values(SurveySortOptions).map(option => (
                                <option key={option.key} value={option.key}>{option.label}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>
            <div className="w-full overflow-x-auto">
                {surveys.length === 0 ? (
                    <div className="flex items-center justify-center pt-20">
                        <p className="text-lg text-gray-700">Der er ingen spørgeskemaer endnu</p>
                    </div>
                ) : (
                    <Table<SurveyRow>
                        edit={{
                            disabled: false,
                            options: [
                                { label: 'Rediger', icon: mdiPencil, color: '', onClick: (elements, data) => { handleMenuClick('edit', data.id) }, isValid: (item) => { return item.accessActions?.includes(SurveyActions.Edit) === true } },
                                { label: 'Slet', icon: mdiDelete, color: 'text-red-500', onClick: (elements, data) => { handleMenuClick('delete', data.id) }, isValid: (item) => { return item.accessActions?.includes(SurveyActions.Delete) === true } },
                                { label: 'Del', icon: mdiAccountLockOpen, color: '', onClick: (elements, data) => { handleMenuClick('access', data.id) }, isValid: (item) => { return item.accessActions?.includes(SurveyActions.Invite) === true } },
                                { label: 'Opret fra skabelon', icon: mdiFileDocumentEdit, color: '', onClick: (elements, data) => { navigate(routes.surveyCreate, { state: { templateid: data.id } }) }, isValid: (item) => { return item.status === SurveyStatusEnum.Template } },
                            ],
                            validateAccess: (item) => { return true },
                        }}
                        headers={['Titel', 'Opretter', 'Oprettet', 'Status']}
                        items={surveys as SurveyRow[]}
                        className='border rounded-md border-neutral-200 table-fixed min-w-[900px]'
                        bulk={{ disabled: true }}
                        onItemClick={(item) => navigate(routes.surveyOverview.replace(':id', String(item.id)))}
                        RenderItem={({ item, selected }) => {
                            return (
                                <>
                                    <td className={`py-2 px-6 text-sm text-gray-900 max-w-[300px] ${selected.includes(item.id) ? 'bg-neutral-200' : ''}`}>
                                        <p className="line-clamp-1 text-ellipsis overflow-hidden">{item?.title}</p>
                                    </td>

                                    <td className={`py-2 px-6 max-w-[400px] w-40 ${activeMenuId === item.id ? 'bg-neutral-200' : ''}`}>
                                        <p className="text-sm text-gray-900">{item?.creator?.fullName}</p>
                                    </td>
                                    <td className={`py-2 px-6 text-sm text-gray-900 whitespace-nowrap ${activeMenuId === item.id ? 'bg-neutral-200' : ''}`}>
                                        <p>{`${formatDate(String(item.createdAt), DateFormatsEnum.DD_MM_YYYY)}`}</p>
                                    </td>
                                    <td className={`py-2 px-6 max-w-[200px] w-20 text-sm ${activeMenuId === item.id ? 'bg-neutral-200' : ''}`}>
                                        {item.status ? (
                                            <>
                                                <div className={`flex items-center max-w-[150px] justify-center flex-grow text-center py-1 px-4 rounded font-semibold ${item.status === SurveyStatusEnum.Published ? 'bg-teal' : item.status === SurveyStatusEnum.Template ? 'bg-yellow-300' : 'bg-purple-300'} flex items-center mr-2`}>
                                                    {(item.status === SurveyStatusEnum.Published ? 'Offentliggjort' : item.status === SurveyStatusEnum.Template ? 'Skabelon' : 'Kladde')}
                                                </div>
                                            </>
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

        </SubPageContainer >
    );
}