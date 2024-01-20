import { Flex, Text } from "@chakra-ui/react";

type LayoutDefaultProps = {
  children: JSX.Element | JSX.Element[];
};

const LayoutDefault = ({ children }: LayoutDefaultProps) => (
  <Flex
    direction={{ base: "column", md: "row" }}
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
        fontSize="50"
        textAlign="center"
        width="60%"
      >
        OpenChair
      </Text>
    </Flex>

    <Flex as="main" flex="0.5" h="100vh" justify="center" align="center">
      {children}
    </Flex>
  </Flex>
);

export default LayoutDefault;
