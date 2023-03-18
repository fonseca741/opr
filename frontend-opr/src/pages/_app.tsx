import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import { ToastContainer } from "react-toastify";
import { AuthProvider } from "context";
import { theme } from "@/styles/index";

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <AuthProvider>
      <ChakraProvider theme={theme}>
        <ToastContainer />
        <Component {...pageProps} />
      </ChakraProvider>
    </AuthProvider>
  );
};

export default App;
