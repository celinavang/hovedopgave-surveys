import { Form, UseFormReturn } from "react-hook-form"
import { Button } from "shared";
import { SectionDisclosure } from "./SectionDisclosure";
import { SurveyInput, SurveySectionInput } from "shared/graphql/__generated__/graphql";

export const SectionStep = (props: { methods: UseFormReturn<SurveyInput, any, undefined> }) => {
    const { methods } = props;
    const { setValue, formState: { errors, }, control } = methods;


    const addSection = () => {
        const newSection: SurveySectionInput = {
            id: 0,
            title: 'Unavngivet sektion',
            description: 'Beskrivelse af sektion',
            questions: [],
        };
        setValue('sections', [...control._formValues.sections, newSection]);
        localStorage.setItem('surveyCache', JSON.stringify(methods.getValues()));
    }

    return (
        <div className="mx-3">
            <Form control={control}>
                <div className="mb-4 pb-4 border-b-2 border-gray-200">
                    <h2 className="text-2xl text-gray-600 font-semibold">Sektioner og spørgsmål</h2>
                    <p className="text-sm text-gray-500">Her kan du tilføje sektioner og spørgsmål til spørgeskemaet.</p>
                </div>
                <div className="">
                    {methods.control._formValues.sections.length === 0 &&
                        <div className="flex flex-col items-center justify-center h-32">
                            <h2 className="text-lg text-gray-500 font-semibold mb-2">Ingen sektioner tilføjet</h2>
                            <p className="text-sm text-gray-400">Klik på knappen nedenfor for at tilføje en sektion.</p>
                        </div>
                    }
                    {methods.control._formValues.sections.map((section: SurveySectionInput, index: number) => (
                        <SectionDisclosure key={index} methods={methods} sectionIndex={index} />
                    ))}
                    <Button
                        onClick={addSection}
                        showPlus
                        className="w-full"
                        color="neutral">
                        Tilføj ny sektion
                    </Button>
                </div>
            </Form >
        </div >
    )
}