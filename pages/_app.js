import appConfig from '../config.json';

const GlobalStyle = () => {
  return (
    <style global jsx>
      {`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          list-style: none:
        }

        body {
          font-family: 'Open Sans', sans-serif;
        }

        html, body, #__next {
          min-height: 100vh;
          display: flex;
          flex: 1;
        }

        #__next {
          flex: 1;
        }

        #__next > * {
          flex: 1;
        }

        ::-webkit-scrollbar {
          width: 10px;
        }
        ::-webkit-scrollbar-track {
          background: ${appConfig.theme.colors.neutrals["600"]};
        }
        ::-webkit-scrollbar-thumb {
          border-radius: 5px;
          background: ${appConfig.theme.colors.neutrals["700"]};
        }
      `}
    </style>
  )
}

export default function App({ Component, pageProps }) {
  return (
    <>
      <GlobalStyle />
      <Component {...pageProps} />
    </>
  );
}