import { Disclosure, DisclosureButton, DisclosurePanel, Transition } from "@headlessui/react";
import { mdiChevronUp } from "@mdi/js";
import Icon from "@mdi/react";

const transitionClasses = {
    enter: 'transition-all duration-300 ease-in-out',
    enterFrom: 'max-h-0 opacity-0',
    enterTo: 'max-h-[1000px] opacity-100',
    leave: 'transition-all duration-300 ease-in-out',
    leaveFrom: 'max-h-[1000px] opacity-100',
    leaveTo: 'max-h-0 opacity-0',
};

export const SurveyDisclosure = (props: {
    label?: string;
    errors?: any;
    showArrow?: boolean;
    children: React.ReactNode;
    headerChildren?: React.ReactNode;
    canCollapse?: boolean;
},) => {
    const { label, children, errors, headerChildren, canCollapse = true, showArrow = true } = props;
    return (
        <Disclosure defaultOpen >
            {({ open }) => (
                <>
                    <DisclosureButton
                        style={canCollapse ? {} : { cursor: 'default' }}
                        className={`rounded-t-md w-full ${open || !canCollapse ? '!bg-gray-200' : 'rounded-b-md'} ${errors ? 'bg-red-200' : 'bg-gray-200'} overflow-hidden`}>

                        <div className={`flex flex-row items-center justify-between p-3 px-4`}>
                            {label || showArrow && (
                                <div className="flex flex-row items-center gap-2">
                                    {showArrow && (
                                        <Icon path={mdiChevronUp} size={1} className={`text-gray-500 transition-transform duration-300 ${open ? '' : 'rotate-180'}`} />
                                    )}
                                    {label && (
                                        <h2 className="text-lg text-gray-500 font-semibold flex justify-between items-center">
                                            {label}
                                        </h2>
                                    )}
                                </div>
                            )}
                            {headerChildren}
                        </div>
                    </DisclosureButton>
                    <Transition show={canCollapse ? open : true} {...transitionClasses}>
                        <DisclosurePanel>
                            <div className={`p-4 border-[2px] border-t-0 border-gray-200 rounded-b-md`}>
                                {children}
                            </div>
                        </DisclosurePanel>
                    </Transition>
                </>
            )}
        </Disclosure>
    );
}