import { useEffect } from "react";

import { useAppStore } from "../states/useAppState";

export const useSetEditingShortcut = () => {
	const { isEditing, setIsEditing } = useAppStore();

	const toggleEditingState = (event: KeyboardEvent) => {
		if (event.key === "e" && (event.metaKey || event.ctrlKey) && !event.altKey) {
			setIsEditing(!isEditing);
			return false;
		}
	};

	useEffect(() => {
		document.addEventListener("keydown", toggleEditingState);

		return () => {
			document.removeEventListener("keydown", toggleEditingState);
		};
	});
};
