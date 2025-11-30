import { useEffect } from "react";
import { useLoaderData, useSearchParams } from "react-router-dom";

import { ContentArea } from "./components/ContentArea";
import { ViewEditToggle } from "./components/ViewEditToggle";
import type { LoaderData, rootLoader } from "./helpers/loader";
import { useAppStore } from "./states/useAppState";

export const Embed = () => {
	const { setState, setCustomFields } = useAppStore();

	const decodedSearchParameters = useLoaderData() as LoaderData<typeof rootLoader>;
	const [searchParams] = useSearchParams();

	useEffect(() => {
		setCustomFields(decodedSearchParameters.customFields);
		setState(decodedSearchParameters.state);
	}, [decodedSearchParameters, setCustomFields, setState]);

	return (
		<div className="h-screen select-none flex flex-col">
			{!searchParams.has("readonly") && (
				<div className="flex gap-4 items-center p-2 mb-2 border-b-1 border-b-[#f1f1f1]">
					<ViewEditToggle />
				</div>
			)}

			<div className="p-2">
				<ContentArea />
			</div>
		</div>
	);
};
