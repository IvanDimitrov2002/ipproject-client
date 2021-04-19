import { AppProps } from 'next/app';
import 'styles/globals.scss';
import Head from 'next/head';
import 'normalize.css';

const MyApp = ({ Component, pageProps }: AppProps) => {
    return (
        <>
            <Head>
                <title>Survey.io</title>
                <link rel='preconnect' href='https://fonts.gstatic.com' />
                <link
                    href='https://fonts.googleapis.com/css2?family=Nunito+Sans:wght@300;400;600;700&display=swap'
                    rel='stylesheet'
                ></link>
            </Head>
            <Component {...pageProps} />
        </>
    );
};

export default MyApp;
