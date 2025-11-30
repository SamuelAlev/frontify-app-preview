import type { LoaderFunction } from "react-router-dom";
import type { AppCustomFields, AppState } from "../states/useAppState";
import { decompressBrotliData } from "../utils/brotli";

export type LoaderData<TLoaderFn extends LoaderFunction> = Awaited<ReturnType<TLoaderFn>> extends Response | infer D ? D : never;

type SearchParameters = {
	customFields: AppCustomFields;
	state: AppState;
};

const SEARCH_PARAMETERS_KEYS: (keyof SearchParameters)[] = ["customFields", "state"];

export const rootLoader = (async ({ request }) => {
	const url = new URL(request.url);
	const searchParams = url.searchParams;

	const decodedSearchParams: SearchParameters = {
		customFields: {
			appBridgeMode: "block",
			jsPath: "",
			cssPath: "",
		},
		state: { settings: {} },
	};

	for (const parameterKey of SEARCH_PARAMETERS_KEYS) {
		const searchParam = searchParams.get(parameterKey);
		if (searchParam) {
			try {
				decodedSearchParams[parameterKey] = JSON.parse(await decompressBrotliData(searchParam));
			} catch {
				console.error(`Failed to parse ${parameterKey} from search parameters`);
			}
		}
	}

	return decodedSearchParams;
}) satisfies LoaderFunction;
