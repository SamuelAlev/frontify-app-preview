import { useCallback, useEffect, useMemo, useState } from "react";

import { getBlockIdFromJsPath as getAppIdFromJsPath } from "../helpers/getBlockIdFromJsPath";

export const useAppResources = (mode: "block" | "theme", jsPath: string, cssPath?: string) => {
	const [loading, setLoading] = useState(true);
	const [errors, setErrors] = useState<Error | null>(null);
	const id = getAppIdFromJsPath(jsPath);

	const removeAppResources = useCallback(() => {
		const scriptElements = document.querySelectorAll(["script[data-app-script]", "link[data-app-style]"].join(", "));

		for (const element of scriptElements) {
			element.parentNode?.removeChild(element);
		}
	}, []);

	const loadAppScript = useCallback((path: string) => {
		return new Promise<void>((resolve, reject) => {
			const scriptElement = document.createElement("script");
			scriptElement.setAttribute("src", path);
			scriptElement.setAttribute("data-app-script", "");

			scriptElement.onload = () => resolve();
			scriptElement.onerror = () => reject(new Error("Could not load the app script"));

			document.head.appendChild(scriptElement);
		});
	}, []);

	const loadAppStyle = useCallback((path: string) => {
		return new Promise<void>((resolve, reject) => {
			const linkElement = document.createElement("link");
			linkElement.setAttribute("rel", "stylesheet");
			linkElement.setAttribute("href", path);
			linkElement.setAttribute("data-app-style", "");

			linkElement.onload = () => resolve();
			linkElement.onerror = () => reject(new Error("Could not load the app style"));

			document.head.appendChild(linkElement);
		});
	}, []);

	useEffect(() => {
		const initApp = async () => {
			setLoading(true);

			try {
				await Promise.all([loadAppScript(jsPath), ...(cssPath ? [loadAppStyle(cssPath)] : [])]);
				setErrors(null);
			} catch (error) {
				setErrors(error as Error);
			} finally {
				setLoading(false);
			}
		};

		initApp();

		return () => {
			removeAppResources();
		};
	}, [jsPath, cssPath, loadAppScript, loadAppStyle, removeAppResources]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	const App = useMemo(() => {
		if (!loading && !errors) {
			if (mode === "block") {
				return window[id as keyof Window]?.block;
			}

			if (mode === "theme") {
				return window[id as keyof Window]?.templates.cover.default.component;
			}

			throw new Error("Invalid mode provided. Only 'block' and 'theme' are allowed.");
		}
	}, [loading, errors, id, mode, window[id as keyof Window]?.[mode]]);

	const settingsStructure = useMemo(() => !loading && !errors && window[id as keyof Window]?.settings, [id, errors, loading]);

	return { loading, errors, App, settingsStructure };
};
