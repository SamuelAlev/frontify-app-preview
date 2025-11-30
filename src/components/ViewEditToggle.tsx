import { type FC, useEffect } from "react";

import { useSetEditingShortcut } from "../hooks/useSetEditingShortcut";
import { useAppStore } from "../states/useAppState";
import { isMac } from "../utils/isMac";
import { merge } from "../utils/merge";

export const ViewEditToggle: FC = () => {
	const { isEditing, setIsEditing } = useAppStore();

	useEffect(() => {
		document.body.classList[isEditing ? "add" : "remove"]("editor-enabled");
	}, [isEditing]);

	useSetEditingShortcut();

	return (
		<div className="flex gap-2 items-center justify-center">
			<button
				type="button"
				className={merge([
					"p-2 flex items-center justify-center rounded",
					!isEditing ? "bg-[#424747] text-white" : "hover:bg-[#eaebeb]",
				])}
				onClick={() => setIsEditing(false)}
				title={`Switch to view mode (${isMac ? "⌘+e" : "ctrl+e"})`}
			>
				<div className="i-octicon-eye-16" />
			</button>
			<button
				type="button"
				className={merge([
					"p-2 flex items-center justify-center rounded",
					isEditing ? "bg-[#424747] text-white" : "hover:bg-[#eaebeb]",
				])}
				onClick={() => setIsEditing(true)}
				title={`Switch to edit mode (${isMac ? "⌘+e" : "ctrl+e"})`}
			>
				<div className="i-octicon-pencil-16" />
			</button>
		</div>
	);
};
