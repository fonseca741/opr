import { Flex } from "@chakra-ui/react";
import { Header } from "components/header";
import React from "react";

type LayoutSignedProps = {
  children: React.ReactNode;
};

const LayoutSigned = ({ children }: LayoutSignedProps) => {
  return (
    <Flex direction="column" width="100%">
      <Header />
      <Flex justify="center">
        <Flex
          marginStart="0rem"
          justify="center"
          borderRadius="1rem"
          maxW="100rem"
          w="80%"
        >
          {children}
        </Flex>
      </Flex>
    </Flex>
  );
};

export default LayoutSigned;
