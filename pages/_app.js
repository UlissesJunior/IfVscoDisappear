import { GlobalStyle } from "../src/styles/GlobalStyle";
import Head from "next/head";
function MyApp({ Component, pageProps }) {
  return (
    <>
      <GlobalStyle />
      <Head>
        <title>IF VSCO DISAPPEAR</title>
        <link rel="shortcut icon" href="/favicon.ico" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
