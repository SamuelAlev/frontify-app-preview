import { type ChangeEvent, type FC, useEffect, useRef, useState } from "react";

type InputProps = {
	placeholder?: string;
	value: string;
	onChange(value: string): void;
};

export const Input: FC<InputProps> = ({ placeholder, value, onChange }) => {
	const [cursor, setCursor] = useState(0);
	const ref = useRef<HTMLInputElement>(null);

	useEffect(() => {
		const input: HTMLInputElement | null = ref.current;
		if (input) {
			input.setSelectionRange(cursor, cursor);
		}
	}, [cursor]);

	const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
		event.target.selectionStart && setCursor(event.target.selectionStart);
		onChange?.(event.target.value);
	};

	return (
		<input
			className="w-full resize-none p-2 rounded border-1 border-gray-4 hover:border-gray-8 focus:outline focus:outline-blue-4 focus:outline-offset-2 focus:outline-4 text-sm"
			ref={ref}
			value={value}
			placeholder={placeholder}
			onChange={handleChange}
			draggable={false}
		/>
	);
};
