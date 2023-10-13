import { Flex } from "@chakra-ui/react";
import { Header } from "components/header";
import React from "react";

type LayoutSignedProps = {
  children: React.ReactNode;
};

const LayoutSigned = ({ children }: LayoutSignedProps) => {
  return (
    <Flex direction="column" width="100%" minHeight="100vh">
      <Header />
      <Flex justify="center" height="full" flex="1">
        <Flex
          backgroundColor="white"
          marginStart="0rem"
          justify="center"
          maxW="100rem"
          w="80%"
          padding={7}
          boxShadow="2px 2px 10px rgba(0, 0, 0, 0.1)"
        >
          {children}
        </Flex>
      </Flex>
    </Flex>
  );
};

export default LayoutSigned;
