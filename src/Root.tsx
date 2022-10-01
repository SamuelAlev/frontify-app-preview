import { useCallback, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { bytesToBase64 } from 'byte-base64';
import brotliPromise from 'brotli-wasm';

import { Header } from './Header';
import { Container } from './components';
import { useDecodeUrl, useSetEditingShortcut } from './hooks';
import { ParametersSidebar } from './ParametersSidebar';
import { ContentArea } from './ContentArea';
import { useBlockState } from './states';

export const Root = () => {
    const { setSettings, setData } = useBlockState();

    const [searchParams, setSearchParams] = useSearchParams();
    const { data, settings } = useDecodeUrl(searchParams);
    useEffect(() => setData(data), [data, setData]);
    useEffect(() => setSettings(settings), [settings, setSettings]);

    useSetEditingShortcut();

    const computeHashAndSetUrl = useCallback(
        async (key: string, value: string) => {
            const url = new URL(window.location.href);

            if (value) {
                const brotli = await brotliPromise;

                const textEncoder = new TextEncoder();

                const uncompressedData = textEncoder.encode(value);
                const compressedData = brotli.compress(uncompressedData);

                const b64encoded = bytesToBase64(compressedData);
                url.searchParams.set(key, b64encoded);
            } else {
                url.searchParams.delete(key);
            }

            setSearchParams(url.searchParams, { replace: true });
        },
        [setSearchParams],
    );

    return (
        <div className="divide-y divide-[#f1f1f1] select-none flex flex-col">
            <Header />

            <div className="w-full flex justify-center">
                <Container>
                    <div className="pt-4 flex flex-col-reverse justify-end lg:flex-row lg:divide-x lg:divide-[#f1f1f1]">
                        <aside className="lg:w-4/12 xl:2/12 p-4 lg:pr-6 flex flex-col gap-6">
                            <ParametersSidebar
                                onDataChange={(value) => computeHashAndSetUrl('data', value)}
                                onSettingsChange={(value) => computeHashAndSetUrl('settings', value)}
                            />
                        </aside>
                        <main className="lg:w-8/12 xl:10/12 p-4 lg:pl-6 flex flex-col gap-4">
                            <ContentArea />
                        </main>
                    </div>
                </Container>
            </div>
        </div>
    );
};
