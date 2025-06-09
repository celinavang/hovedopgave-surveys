import Icon from "@mdi/react";
import { Survey, SurveyInput, SurveyInstance } from "../../graphql/__generated__/graphql";
import { mdiAccount, mdiCalendar, mdiClock, mdiListStatus } from "@mdi/js";
import { DateFormatsEnum, formatDate } from "../../utils/dateUtils";

export const SurveyInfoCard = (props: {
    survey?: Survey | SurveyInput,
    instance: SurveyInstance,
    displayTimeEstimate?: boolean
}) => {
    const { survey, instance, displayTimeEstimate = true } = props;
    const surveyItem = survey ? survey : instance?.surveyAccess?.survey;

    if (!surveyItem) {
        return <div>Ingen data tilgængelig</div>;
    }

    const timeString = () => {
        const hour = Number(instance?.surveyAccess?.survey?.timeEstimate?.split(":")[0]);
        const minute = Number(instance?.surveyAccess?.survey?.timeEstimate?.split(":")[1]);
        const time = hour + (hour > 1 ? " timer" : " time ") + ' og ' + (minute > 1 ? " " + minute + " minutter" : "minut");
        return time;
    }

    return (
        <div className="flex flex-row gap-2">
            <div className="mt-4 bg-white rounded-lg p-6 flex flex-col gap-4 flex-1">
                <div>
                    <h2 className="text-2xl font-semibold text-gray-600 mb-2">{surveyItem?.title}</h2>
                    {displayTimeEstimate && surveyItem?.timeEstimate && (
                        <div className="flex flex-row items-center text-sm gap-2 text-gray-600">
                            <Icon path={mdiClock} size={.5} />
                            <p>{'Forventet tidsforbrug '}
                                <span className="font-bold">
                                    {timeString() || 'ikke angivet'}
                                </span>
                            </p>
                        </div>
                    )}
                    <div className=" my-2" />
                    <p className="text-sm text-gray-500">Beskrivelse af spørgeskemaet</p>
                    <p className="text-gray-600">{surveyItem?.description}</p>
                    {instance?.invitationMessage && (
                        <div className="mt-2">
                            <p className="text-sm text-gray-500">Besked fra afsender</p>
                            <p className="text-gray-600">{instance?.invitationMessage}</p>
                        </div>
                    )}
                </div>
            </div>
            <div className="mt-4 bg-white rounded-lg p-6  flex flex-col gap-2 flex-2">
                <h2 className="text-gray-600 font-bold mb-1 border-b-2 pb-2">Oplysninger</h2>
                <div className="flex flex-row gap-4 text-gray-600 justify-between">
                    <div className="flex flex-row gap-3">
                        <Icon path={mdiAccount} size={1} />
                        <label className="">
                            Inviteret af
                        </label>
                    </div>
                    <p className="font-semibold">
                        {instance?.invitedBy?.fullName}
                    </p>
                </div>
                <div className="flex flex-row gap-4 text-gray-600 justify-between">
                    <div className="flex flex-row gap-3">
                        <Icon path={mdiCalendar} size={1} />
                        <label className="">Dato</label>
                    </div>
                    <p className="font-semibold">
                        {formatDate(instance.invitationDate, DateFormatsEnum.DD_MM_YYYY)}
                    </p>
                </div>
                <div className="flex flex-row gap-4 text-gray-600 justify-between">
                    <div className="flex flex-row gap-3">
                        <Icon path={mdiClock} size={1} />
                        <label className="">Deadline</label>
                    </div>
                    <p className="font-semibold">
                        {formatDate(instance?.deadline || '', DateFormatsEnum.DD_MM_YYYY)}
                    </p>
                </div>
                <div className="flex flex-row gap-4 text-gray-600 justify-between">
                    <div className="flex flex-row gap-3">
                        <Icon path={mdiListStatus} size={1} />
                        <label className="">Status</label>
                    </div>
                    <p className="font-semibold">
                        {instance?.status === 'COMPLETED' ? 'Afsluttet' : 'Ubesvaret'}
                    </p>
                </div>
            </div>
        </div>
    )
}