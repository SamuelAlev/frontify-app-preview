import { SegmentedControl } from "@frontify/fondue/components";
import type { FC } from "react";

import { type AppCustomFields, useAppStore } from "../states/useAppState";
import { Input } from "./Input";

type AppPanelProps = {
	onChange(value: AppCustomFields): void;
};

export const AppPanel: FC<AppPanelProps> = ({ onChange }) => {
	const { customFields: data } = useAppStore();

	const handleAppBridgeModeChange = (value: AppCustomFields["appBridgeMode"]) => {
		onChange({ ...data, appBridgeMode: value });
	};

	const handleJsPathChange = (value: string) => {
		onChange({ ...data, jsPath: value });
	};

	const handleCssPathChange = (value: string) => {
		onChange({ ...data, cssPath: value });
	};

	return (
		<>
			<div className="flex gap-2 items-center h-8">
				<h1 className="flex-grow text-sm font-mono font-bold">App Bridge mode</h1>
			</div>

			<SegmentedControl.Root
				key="mode"
				defaultValue="block"
				value={data.appBridgeMode}
				onValueChange={(id) => handleAppBridgeModeChange(id as AppCustomFields["appBridgeMode"])}
			>
				<SegmentedControl.Item value="block">Block</SegmentedControl.Item>
				<SegmentedControl.Item value="theme">Theme</SegmentedControl.Item>
			</SegmentedControl.Root>

			<div className="flex gap-2 items-center h-8">
				<h1 className="flex-grow text-sm font-mono font-bold">Artifacts</h1>

				<button
					type="button"
					className="p-2 flex items-center justify-center rounded hover:bg-[#eaebeb]"
					onClick={() => onChange({ appBridgeMode: "block", jsPath: "", cssPath: "" })}
					title="Reset artifacts"
				>
					<div className="i-octicon-trash-16" />
				</button>
			</div>

			<Input placeholder=".js file name" value={data.jsPath} onChange={handleJsPathChange} />
			<Input placeholder=".css file name" value={data.cssPath} onChange={handleCssPathChange} />
		</>
	);
};
