import { NavLink } from 'react-router-dom';
import { Block } from './Block';

import { EXAMPLE_BLOCK } from '../constants';
import { appBridgeModeToLabel, useAppStore } from '../states/useAppState';

export const ContentArea = () => {
    const { customFields } = useAppStore();

    return customFields?.jsPath ? (
        <Block js={customFields.jsPath} css={customFields.cssPath} />
    ) : (
        <div className="flex flex-col gap-4">
            <span>Add some {appBridgeModeToLabel[customFields.appBridgeMode]} data and state to have a preview.</span>

            {customFields.appBridgeMode === 'block' ? (
                <div className="flex gap-4 overflow-x-auto">
                    <NavLink to={EXAMPLE_BLOCK} className="py-2 px-4 inline whitespace-nowrap rounded bg-[#424747] hover:bg-[#2d3232] text-white" title="Go to example">
                        Example
                    </NavLink>
                </div>
            ) : null}

            {customFields.appBridgeMode === 'theme' ? (
                <div className="flex gap-4 overflow-x-auto">
                    <NavLink to="#" className="py-2 px-4 inline whitespace-nowrap rounded bg-[#424747] hover:bg-[#2d3232] text-white" title="Go to example">
                        Example (soon)
                    </NavLink>
                </div>
            ) : null}
        </div>
    );
};
