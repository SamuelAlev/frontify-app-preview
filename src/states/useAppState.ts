import { create } from "zustand";

export type AppCustomFields = {
	appBridgeMode: "block" | "theme";
	jsPath: string;
	cssPath: string;
};

export type AppState = { settings: Record<string, unknown> } & Record<string, Record<string, unknown>>;

export const appBridgeModeToLabel = {
	block: "Block",
	theme: "Theme",
};

export type AppStore = {
	isEditing: boolean;
	setIsEditing(value: boolean): void;
	state: AppState;
	setState(value: AppState): void;
	settingsStructure: Record<string, unknown>;
	setSettingsStructure(newSettingsStructure: Record<string, unknown>): void;
	customFields: AppCustomFields;
	setCustomFields(value: AppCustomFields): void;
};

export const useAppStore = create<AppStore>()((set) => ({
	isEditing: false,
	setIsEditing(value) {
		set(() => ({ isEditing: value }));
	},
	state: { settings: {} },
	setState(value) {
		set(() => ({ state: value }));
	},
	settingsStructure: {},
	setSettingsStructure(value) {
		set(() => ({ settingsStructure: value }));
	},
	customFields: {
		appBridgeMode: "block",
		jsPath: "",
		cssPath: "",
	},
	setCustomFields(value) {
		set(() => ({ customFields: value }));
	},
}));
