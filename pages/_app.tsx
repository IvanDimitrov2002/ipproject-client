import { AppProps } from 'next/app';
import 'styles/globals.scss';
import Head from 'next/head';

const MyApp = ({ Component, pageProps }: AppProps) => {
    return (
        <>
            <Head>
                <title>Survey.io</title>
            </Head>
            <Component {...pageProps} />
        </>
    );
};

export default MyApp;
