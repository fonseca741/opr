import { theme } from "@/styles/index";
import { ChakraProvider } from "@chakra-ui/react";
import { AuthProvider } from "context";
import type { AppProps } from "next/app";
import { ToastContainer } from "react-toastify";

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
