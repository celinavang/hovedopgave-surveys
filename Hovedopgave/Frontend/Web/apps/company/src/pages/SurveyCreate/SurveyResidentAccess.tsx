import { useMutation, useQuery } from "@apollo/client";
import { mdiTrashCan } from "@mdi/js";
import Icon from "@mdi/react";
import moment from "moment";
import { useState } from "react";
import { set, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Button, CREATE_SURVEY_ACCESS_WITH_SURVEYINSTANCE, GET_ALL_COMPANY_USER_RESIDENT_BY_COMPANY_ID, Input, Textarea } from "shared";
import { DatePicker } from "shared/components/DatePicker";
import { EntityType, Survey, SurveyInput, SurveyRoles } from "shared/graphql/__generated__/graphql";
import { useAuth } from "shared/hooks/useAuth";

export type InviteCreateForm = {
    surveyAccess: {
        entityId: number,
        entityType: EntityType,
        role: SurveyRoles,
        surveyId: number,
        accessGrantorId: number,
    },
    deadline?: number,
    invitationDate: number,
    invitationMessage: string,
}

export const SurveyResidentAccess = (
    props: {
        survey: SurveyInput | Survey,
        canEdit?: boolean,
        onCreated?: () => void,
    }
) => {
    const { survey, onCreated } = props;
    const { company, userAuth } = useAuth();
    const [useDeadline, setUseDeadline] = useState<boolean>(false);

    const methods = useForm<InviteCreateForm>({
        defaultValues: {
            surveyAccess: {
                entityId: 0,
                entityType: EntityType.User,
                role: SurveyRoles.Responder,
                surveyId: Number(survey.id),
                accessGrantorId: Number(userAuth?.userId),
            },
            deadline: undefined,
            invitationDate: moment().unix(),
            invitationMessage: '',
        }
    });

    const [recipents, setRecipents] = useState<number[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>();

    const { data, refetch, loading } = useQuery(GET_ALL_COMPANY_USER_RESIDENT_BY_COMPANY_ID, {
        variables: {
            id: company.id,
        },
    });
    const [inviteMutation] = useMutation(CREATE_SURVEY_ACCESS_WITH_SURVEYINSTANCE);



    const handleAddSelectedUser = (id: number) => {
        if (id) {
            setRecipents((prev) => [...prev, id]);
        }
    }

    const handleInvite = () => {
        if (recipents.length > 0 && survey.id && survey.id !== 0) {
            recipents.forEach(async (recipient) => {
                try {
                    const invite = await inviteMutation({
                        variables: {
                            input: {
                                surveyAccess: {
                                    surveyId: survey.id,
                                    entityId: recipient,
                                    entityType: EntityType.User,
                                    role: SurveyRoles.Responder,
                                    accessGrantorId: Number(userAuth?.user?.id),
                                },
                                deadline: useDeadline ? new Date(Number(methods.getValues('deadline')) * 1000).toString() : undefined,
                                invitationDate: new Date(Number(methods.getValues('invitationDate')) * 1000).toString(),
                                invitationMessage: methods.getValues('invitationMessage') || '',
                            },
                        },
                    })
                    toast.success('Invitation oprettet');
                } catch (error) {
                    toast.error('Fejl ved oprettelse af invitation');
                }
            });
            setRecipents([]);
            methods.reset();
            if (onCreated) {
                onCreated();
            }
        }
    }

    return (
        <div className="flex flex-col gap-2 overflow- m-6 p-2">
            <h2 className="text-2xl font-semibold text-gray-600 pb-2 border-b-2">Opret spørgeskema invitation til borger</h2>
            <div>
                <div>
                    {recipents.length > 0 &&
                        <div className="flex flex-col gap-1 justify-between w-full mb-4">
                            {recipents.map((recipient) => {
                                const user = data?.getAllCompanyUserResidentByCompanyId?.find((user) => user?.id === recipient);
                                return (
                                    <div key={recipient} className="flex flex-row gap-2 items-center justify-between hover:bg-gray-100 p-2 rounded-md">
                                        <p className="text-md font-semibold text-gray-600">{user?.resident?.fullName}</p>
                                        <button className="text-red-500 flex flex-row items-center gap-2"
                                            onClick={() => {
                                                setRecipents((prev) => prev.filter((r) => r !== recipient));
                                            }}
                                        >
                                            <p className="text-sm font-semibold">Fjern</p>
                                            <Icon path={mdiTrashCan} size={.8} />

                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    }
                    <label className="text-lg font-semibold text-gray-600">
                        Modtagere
                    </label>
                    <Input
                        placeholder="Søg..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                        }}
                    />
                    <div className="flex flex-row gap-4 w-full">
                        <div className="flex-1 max-h-[300px] overflow-y-auto">
                            {data?.getAllCompanyUserResidentByCompanyId && data?.getAllCompanyUserResidentByCompanyId?.length > 0 &&
                                <div className="flex flex-col gap-2 border-[1px] border-gray-300 rounded-md p-2 mb-2">
                                    {data?.getAllCompanyUserResidentByCompanyId?.filter((user) => !recipents.includes(Number(user?.resident?.id)) && user?.resident?.fullName?.toLowerCase().includes(searchTerm?.toLowerCase() || '')).map((user) => {
                                        return (
                                            <div key={user?.id} className="flex flex-row items-center gap-2">
                                                <button
                                                    className="flex flex-row items-center gap-2 hover:bg-gray-200 p-2 rounded w-full text-left"
                                                    onClick={() => {
                                                        handleAddSelectedUser(Number(user?.resident?.id));
                                                    }}
                                                >
                                                    {user?.resident?.fullName}
                                                </button>
                                            </div>
                                        );
                                    })}
                                    {data?.getAllCompanyUserResidentByCompanyId?.filter((user) => !recipents.includes(Number(user?.resident?.id)) && user?.resident?.fullName?.toLowerCase().includes(searchTerm?.toLowerCase() || '')).length === 0 && (
                                        <p className="text-sm text-gray-500 text-center">Ingen brugere fundet...</p>
                                    )}
                                </div>
                            }
                        </div>
                    </div>

                </div>
                <div className="flex flex-row gap-2 justify-end items-center">
                    <input
                        type="checkbox"
                        className="w-4 h-4"
                        onChange={(e) => {
                            setUseDeadline(e.target.checked);
                            if (!useDeadline) {
                                methods.setValue('deadline', undefined);
                            }
                        }} />
                    <p>Tilføj deadline?</p>
                </div>
                <div className="flex flex-row justify-between gap-2 relative">
                    <div className="w-1/2">
                        <label>
                            Startdato
                        </label>
                        <DatePicker
                            today={methods.watch('invitationDate') || moment().unix()}
                            error={methods.formState.errors.invitationDate}
                            register={methods.control.register('invitationDate')}
                            minDate={moment().unix()}
                            handleDateSelect={(date) => {
                                methods.setValue('invitationDate', date);
                                if (date > (methods.getValues('deadline') ?? 0)) {
                                    methods.setValue('deadline', date);
                                    methods.trigger('deadline');
                                }
                            }}
                        />
                    </div>
                    <div className="w-1/2 relative">
                        {useDeadline && (
                            <>
                                <label>
                                    Deadline
                                </label>
                                <div className="absolute w-full block ">
                                    <DatePicker
                                        today={methods.watch('deadline') || moment().unix()}
                                        error={methods.formState.errors.deadline}
                                        register={methods.control.register('deadline')}
                                        minDate={methods.watch('invitationDate') || moment().unix()}
                                        handleDateSelect={(date) => {
                                            methods.setValue('deadline', date);
                                        }}
                                    />
                                </div>
                            </>
                        )}
                    </div>

                </div>
                <div>
                    <label>Besked til modtagere</label>
                    <Textarea
                        height="h-24"
                        placeholder="Skriv en besked til modtagerne..."
                        register={methods.register('invitationMessage')}
                        error={methods.formState.errors.invitationMessage}

                    />
                </div>
                <div className="flex flex-row justify-center">
                    <Button
                        className="flex-grow"
                        onClick={() => { handleInvite() }}
                    >
                        Opret invitation
                    </Button>
                </div>
            </div>
        </div>
    );
}