import { Form, UseFormReturn } from "react-hook-form";
import { Input, Textarea, SurveyDisclosure } from "shared";
import { SurveyInput } from "shared/graphql/__generated__/graphql";

export const SurveyInfoStep = (props: { methods: UseFormReturn<SurveyInput, any, undefined> }) => {
    const { methods } = props;
    const { formState: { errors }, control, register } = methods;

    return (
        <div className="mx-3">
            <div className="mb-4 pb-4 border-b-2 border-gray-200">
                <h2 className="text-2xl text-gray-600 font-semibold">Oplysninger</h2>
                <p className="text-sm text-gray-600">Her kan du tilføje oplysninger om spørgeskemaet.</p>
            </div>
            <Form control={control}>
                <SurveyDisclosure
                    showArrow={false}
                    label={control._formValues.title || "Unavngivet spørgeskema"}
                    errors={errors.title || errors.description}
                    canCollapse={false}>
                    <Input
                        register={register("title", { required: 'Titel er påkrævet' })}
                        label="Titel"
                        required={true}
                        placeholder="Indtast titel på spørgeskemaet.."
                        error={errors.title}
                    />
                    <Textarea
                        register={register("description", { required: 'Beskrivelse er påkrævet' })}
                        label="Beskrivelse"
                        placeholder="Indtast beskrivelse af spørgeskemaet.."
                        required={true}
                        error={errors.description}
                        borderClass="text-sm"
                    />
                    <label className="text-md text-gray-700 font-semibold">Forventet tidsforbrug</label>
                    <div className="flex flex-row justify-between">
                        <p className="text-xs text-gray-500 mb-2">Hvor lang tid forventer du, at det tager at besvare spørgeskemaet?</p>
                        <p className="text-md text-gray-400 mb-2">Valgfri</p>
                    </div>
                    <Input
                        type="time"
                        register={register("timeEstimate", { required: false })}

                    />
                    <div className="-mx-4 -mb-4 rounded-b-sm bg-gray-200 p-4 flex flex-row items-center justify-end">
                        <div className="flex flex-col items-end">
                            <div className="flex flex-row items-center justify-center align-center gap-2">
                                <p>Anonym besvarelse</p>
                                <Input
                                    register={register("anonymous")}
                                    type="checkbox"
                                    className="h-6 !w-6"
                                    outerClassName="!h-6"
                                    error={errors.anonymous}
                                />

                            </div>
                            <p className="text-right text-sm text-gray-500">
                                Besvarelserne på spørgeskemaet vil være anonyme.
                            </p>
                        </div>
                    </div>
                </SurveyDisclosure>
            </Form>
        </div>
    )
}