import * as Tabs from "@radix-ui/react-tabs";
import { AnimatePresence, motion } from "motion/react";
import { type FC, type MouseEvent, useCallback, useMemo, useRef, useState } from "react";

import type { AppCustomFields, AppState as AppStateType } from "../states/useAppState";
import { AppPanel } from "./AppPanel";
import { AppState } from "./AppStates";

type SidebarProps = {
	onCustomFieldsChange(value: AppCustomFields): void;
	onStateChange(value: AppStateType): void;
};

const tabs = [
	{ id: "app", label: "App", icon: "i-octicon-file-directory" },
	{ id: "state", label: "State", icon: "i-octicon-gear" },
];

export const Sidebar: FC<SidebarProps> = ({ onCustomFieldsChange, onStateChange }) => {
	const tabsParentRef = useRef<HTMLDivElement | null>(null);
	const [hoveredItem, setHoveredItem] = useState<HTMLButtonElement | null>(null);
	const url = new URL(window.location.href);

	const positionTabBubble = useMemo(() => {
		const tabsParentRect = tabsParentRef.current?.getBoundingClientRect();
		const hoveredItemRect = hoveredItem?.getBoundingClientRect();
		if (!tabsParentRect || !hoveredItemRect) {
			return undefined;
		}

		return {
			x: hoveredItemRect.left - tabsParentRect.left,
			y: hoveredItemRect.top - tabsParentRect.top,
			width: hoveredItemRect.width,
			height: hoveredItemRect.height - 8,
		};
	}, [hoveredItem]);

	const handleMouseLeave = useCallback(() => {
		setHoveredItem(null);
	}, []);

	const handleMouseOver = useCallback((event: MouseEvent<HTMLButtonElement>) => {
		setHoveredItem(event.currentTarget);
	}, []);

	return (
		<Tabs.Root defaultValue={tabs[0].id} className="flex flex-col w-full">
			<Tabs.List className="mb-6 w-fit relative inline-flex items-center" ref={tabsParentRef} onMouseLeave={handleMouseLeave}>
				<AnimatePresence>
					{positionTabBubble !== undefined && (
						<motion.div
							layoutId="bubble"
							className="absolute inset-0 rounded-full bg-[#eaebeb]"
							transition={{ type: "tween", ease: "easeOut", duration: 0.15 }}
							initial={{ ...positionTabBubble, opacity: 0 }}
							animate={{ ...positionTabBubble, opacity: 1 }}
							exit={{ ...positionTabBubble, opacity: 0 }}
						/>
					)}
				</AnimatePresence>

				{tabs.map((item) => {
					const itemUrl = new URL(url.href);
					itemUrl.searchParams.set("tab", item.label.toLowerCase());

					return (
						<Tabs.Trigger
							key={item.id}
							value={item.id}
							className="relative flex items-center px-3 pt-1.5 pb-3.5 text-[#2d3232] transition gap-2 text-sm transition-colors md:text-base border-b-2 border-b-transparent data-[state=active]:border-b-[#2d3232]"
							onMouseOver={handleMouseOver}
						>
							<div className={item.icon} />
							{item.label}
						</Tabs.Trigger>
					);
				})}
			</Tabs.List>

			<Tabs.Content value="app">
				<div className="flex flex-col gap-4">
					<AppPanel onChange={onCustomFieldsChange} />
				</div>
			</Tabs.Content>
			<Tabs.Content value="state">
				<div className="flex flex-col gap-4">
					<AppState onChange={onStateChange} />
				</div>
			</Tabs.Content>
		</Tabs.Root>
	);
};
