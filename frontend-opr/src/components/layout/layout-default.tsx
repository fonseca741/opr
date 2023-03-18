import React from "react";
import { Flex, Text } from "@chakra-ui/react";

type LayoutDefaultProps = {
  children: JSX.Element | JSX.Element[];
};

const LayoutDefault = ({ children }: LayoutDefaultProps) => (
  <Flex direction="row">
    <Flex
      minWidth="full"
      minHeight="100vh"
      alignItems="center"
      justifyContent="center"
    >
      <Flex
        as="main"
        bg="#0F171F"
        flex="0.5"
        h="100vh"
        justify="center"
        align="center"
      >
        <Text
          color="#fff"
          fontWeight="bold"
          fontSize="35"
          textAlign="center"
          width="60%"
        >
          SOFTWARE PARA APOIO À OPEN PEER REVIEW
        </Text>
      </Flex>

      <Flex as="main" flex="0.5" h="100vh" justify="center" align="center">
        {children}
      </Flex>
    </Flex>
  </Flex>
);

export default LayoutDefault;
