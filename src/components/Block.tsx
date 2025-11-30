import { withAppBridgeBlockStubs } from "@frontify/app-bridge/testing";
import { type FC, useEffect, useMemo } from "react";
import useErrorBoundary from "use-error-boundary";

import { useAppResources } from "../hooks/useAppResources";
import { useAppStore } from "../states/useAppState";

type BlockProps = {
	js: string;
	css?: string;
};

export const Block: FC<BlockProps> = ({ js, css }) => {
	const { ErrorBoundary, didCatch, error } = useErrorBoundary();
	const { isEditing, state, setSettingsStructure } = useAppStore();

	const { errors: errorsWhileLoadingResources, App: LoadedBlock, settingsStructure } = useAppResources("block", js, css);

	const BlockWithStubbedAppBridge = useMemo(() => {
		const [BlockWithStubs, appBridge] = withAppBridgeBlockStubs(LoadedBlock || (() => <div />), {
			blockSettings: state.settings,
			blockAssets: state.assets as any,
			editorState: isEditing,
		});

		return function BlockWrapper() {
			return (
				<div data-block={appBridge.context("blockId").get()} className="block">
					<BlockWithStubs />
				</div>
			);
		};
	}, [LoadedBlock, state, isEditing]);

	useEffect(() => setSettingsStructure(settingsStructure), [setSettingsStructure, settingsStructure]);

	return didCatch || errorsWhileLoadingResources ? (
		<div className="flex flex-col gap-2 text-red-8">
			<span className="text-xl">An error has been caught while rendering the block</span>
			<span>{error?.message ?? errorsWhileLoadingResources?.message ?? "No error message received"}</span>
		</div>
	) : (
		<ErrorBoundary>
			<BlockWithStubbedAppBridge />
		</ErrorBoundary>
	);
};
