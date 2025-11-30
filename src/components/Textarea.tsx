import type { ChangeEvent, FC } from "react";
import TextareaAutosize from "react-textarea-autosize";

type TextareaProps = {
	placeholder?: string;
	value: string;
	defaultValue?: string;
	minRows?: number;
	onChange?: (value: string) => void;
	onBlur?: (value: string) => void;
};

export const Textarea: FC<TextareaProps> = ({ placeholder, value, defaultValue, minRows = 10, onChange, onBlur }) => {
	const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
		onChange?.(event.target.value);
	};

	const handleBlur = (event: ChangeEvent<HTMLTextAreaElement>) => {
		onBlur?.(event.target.value);
	};

	return (
		<TextareaAutosize
			className="w-full resize-none p-2 rounded border-1 border-gray-4 hover:border-gray-8 focus:outline focus:outline-blue-4 focus:outline-offset-2 focus:outline-4 text-sm"
			value={value}
			defaultValue={defaultValue}
			placeholder={placeholder}
			onChange={handleChange}
			onBlur={handleBlur}
			minRows={minRows}
			draggable={false}
		/>
	);
};
