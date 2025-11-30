export const merge = (classes: (string | boolean | null | undefined)[]) => classes.filter(Boolean).join(" ");
