import { type FC, useState } from "react";

import { type AppCustomFields, type AppState as AppStateType, appBridgeModeToLabel, useAppStore } from "../states/useAppState";
import { Textarea } from "./Textarea";

type AppStateProps = {
	onChange(value: AppStateType): void;
};

const modeToStateKeys: Record<AppCustomFields["appBridgeMode"], string[]> = {
	block: ["settings", "assets", "templates"],
	theme: ["settings", "assets"],
};

export const AppState: FC<AppStateProps> = ({ onChange }) => {
	const { state, customFields } = useAppStore();

	return (
		<>
			{modeToStateKeys[customFields.appBridgeMode]?.map((key) => {
				// TODO: FIX ME
				// biome-ignore lint/correctness/useHookAtTopLevel: <explanation>
				const [value, setValue] = useState(JSON.stringify(state[key], null, 4));

				const handleReset = () => {
					onChange({ ...state, [key]: {} });
					setValue("{}");
				};

				const handleBlur = (value: string) => {
					try {
						onChange({ ...state, [key]: JSON.parse(value) });
					} catch {
						console.error("Failed to parse JSON");
					}
				};

				return (
					<>
						<div className="flex gap-2 items-center h-8">
							<h1 className="flex-grow text-sm font-mono font-bold">
								{appBridgeModeToLabel[customFields.appBridgeMode]} {key}
							</h1>

							<button
								type="button"
								className="p-2 flex items-center justify-center rounded hover:bg-[#eaebeb]"
								onClick={handleReset}
								title={`Reset ${appBridgeModeToLabel[customFields.appBridgeMode]} ${key}`}
							>
								<div className="i-octicon-trash-16" />
							</button>
						</div>

						<Textarea
							value={value}
							defaultValue={JSON.stringify(state[key], null, 4)}
							placeholder="{}"
							onChange={setValue}
							onBlur={handleBlur}
						/>
					</>
				);
			})}
		</>
	);
};
