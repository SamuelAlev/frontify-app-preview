import { useEffect } from "react";
import { NavLink, useLoaderData, useSearchParams } from "react-router-dom";

import { ContentArea } from "./components/ContentArea";
import { Sidebar } from "./components/Sidebar";
import { ViewEditToggle } from "./components/ViewEditToggle";
import type { LoaderData, rootLoader } from "./helpers/loader";
import frontifyNookLogo from "./img/frontify.svg";
import { type AppCustomFields, type AppState, appBridgeModeToLabel, useAppStore } from "./states/useAppState";
import { compressBrotliData } from "./utils/brotli";

export const Root = () => {
	const { setState, setCustomFields, customFields } = useAppStore();

	const decodedSearchParameters = useLoaderData() as LoaderData<typeof rootLoader>;
	const [searchParams, setSearchParams] = useSearchParams();

	useEffect(() => {
		if (decodedSearchParameters.customFields) {
			setCustomFields(decodedSearchParameters.customFields);
		}

		if (decodedSearchParameters.state) {
			setState(decodedSearchParameters.state);
		}
	}, [decodedSearchParameters, setCustomFields, setState]);

	const handleCustomFieldsChange = async (newCustomFields: AppCustomFields) => {
		const url = new URL(window.location.href);

		setCustomFields(newCustomFields);
		url.searchParams.set("customFields", await compressBrotliData(JSON.stringify(newCustomFields)));

		setSearchParams(url.searchParams);
	};

	const handleStateChange = async (newState: AppState) => {
		const url = new URL(window.location.href);

		setState(newState);
		url.searchParams.set("state", await compressBrotliData(JSON.stringify(newState)));

		setSearchParams(url.searchParams);
	};

	return (
		<div className="select-none w-full h-[100dvh] w-full flex flex-col">
			<header className="w-full min-h-20 h-20 flex font-sans items-center justify-center z-10 col-span-4 border-b border-b-[#f1f1f1]">
				<div className="px-10 w-full flex">
					<div className="flex-grow flex gap-4 items-center">
						<img className="h-5 w-5" src={frontifyNookLogo} alt="Frontify nook logo" />
						<div className="flex gap-1 items-center justify-center">
							<span className="text-gray-5/50 hidden md:block">Developer Resources</span>

							<div className="i-octicon-chevron-right-24 text-gray-5/50 text-xl hidden md:block" />

							<a className="whitespace-nowrap" href="/">
								App Preview
							</a>
						</div>
					</div>
					{/* biome-ignore lint/a11y/useAnchorContent: link with icon + aria label */}
					<a
						className="i-octicon-mark-github-16 text-2xl hover:text-gray-7"
						target="_blank"
						rel="noreferrer"
						href="https://github.com/SamuelAlev/frontify-app-preview"
						title="Go to the GitHub repository"
						aria-label="Go to the GitHub repository"
					/>
				</div>
			</header>

			<div className="h-full grid grid-cols-1 lg:grid-cols-4 lg:divide-x lg:divide-[#f1f1f1]">
				<aside className="flex px-10 py-6 overflow-y-auto">
					<Sidebar onCustomFieldsChange={handleCustomFieldsChange} onStateChange={handleStateChange} />
				</aside>

				<main className="px-10 py-6 flex flex-col gap-4 col-span-3">
					<div className="flex items-center">
						<h1 className="text-lg font-mono font-bold mr-4">{appBridgeModeToLabel[customFields.appBridgeMode]} Preview</h1>

						<ViewEditToggle />

						<NavLink
							to={`/v1/embed?${searchParams.toString()}`}
							title="Open app embed"
							className="ml-2 p-2 flex items-center justify-center rounded hover:bg-[#eaebeb]"
						>
							<div className="i-octicon-link-external-16" />
						</NavLink>
					</div>

					<ContentArea />
				</main>
			</div>
		</div>
	);
};
