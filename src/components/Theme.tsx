import { withAppBridgeThemeStubs } from "@frontify/app-bridge/testing";
import { type FC, useEffect, useMemo } from "react";
import useErrorBoundary from "use-error-boundary";

import { useAppResources } from "../hooks/useAppResources";
import { useAppStore } from "../states/useAppState";

type ThemeProps = {
	js: string;
	css: string;
};

export const Theme: FC<ThemeProps> = ({ js, css }) => {
	const { ErrorBoundary, didCatch, error } = useErrorBoundary();
	const { isEditing, setSettingsStructure } = useAppStore();

	const { errors: errorsWhileLoadingResources, App: LoadedTheme, settingsStructure } = useAppResources("theme", js, css);

	const ThemeWithStubbedAppBridge = useMemo(() => {
		const [ThemeWithStubs, appBridge] = withAppBridgeThemeStubs(LoadedTheme || (() => <div />), {
			themeSettings: {
				cover: {},
				documentPage: {},
				library: {},
			},
			editorState: isEditing,
		});

		appBridge.context.returns({
			get: () => ({ type: "cover" }),
			subscribe: () => () => {},
		});

		return function ThemeWrapper() {
			return (
				<div className="theme">
					<ThemeWithStubs />
				</div>
			);
		};
	}, [LoadedTheme, isEditing]);

	useEffect(() => setSettingsStructure(settingsStructure), [setSettingsStructure, settingsStructure]);

	return didCatch || errorsWhileLoadingResources ? (
		<div className="flex flex-col gap-2 text-red-8">
			<span className="text-xl">An error has been caught while rendering the Theme</span>
			<span>{error?.message ?? errorsWhileLoadingResources?.message ?? "No error message received"}</span>
		</div>
	) : (
		<ErrorBoundary>
			<ThemeWithStubbedAppBridge />
		</ErrorBoundary>
	);
};
