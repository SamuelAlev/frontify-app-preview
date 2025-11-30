import brotliPromise from "brotli-wasm";
import { base64ToBytes, bytesToBase64 } from "byte-base64";

export const decompressBrotliData = async (data: string) => {
	const brotli = await brotliPromise;

	const textDecoder = new TextDecoder();

	const decompressedData = brotli.decompress(base64ToBytes(data));
	const decodedData = textDecoder.decode(decompressedData);

	return decodedData;
};

export const compressBrotliData = async (data: string) => {
	const brotli = await brotliPromise;

	const textEncoder = new TextEncoder();

	const encodedData = textEncoder.encode(data);
	const compressedData = brotli.compress(encodedData);

	return bytesToBase64(compressedData);
};
