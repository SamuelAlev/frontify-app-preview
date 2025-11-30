export const getBlockIdFromJsPath = (path: string) => {
	try {
		const url = new URL(path);
		const splittedUrl = url.pathname.slice(1).split(".");
		return splittedUrl.length === 3 ? splittedUrl[0] : "DevCustomBlock";
	} catch {}
};
