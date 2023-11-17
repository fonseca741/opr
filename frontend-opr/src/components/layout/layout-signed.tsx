import { Flex, useMediaQuery } from "@chakra-ui/react";
import React from "react";
import Header from "../header/header";
import MobileHeader from "../mobile-header/mobile-header";

type LayoutSignedProps = {
  children: React.ReactNode;
};

const LayoutSigned = ({ children }: LayoutSignedProps) => {
  const [isMobile] = useMediaQuery("(max-width: 768px)");

  return (
    <Flex direction="column" width="100%" minHeight="100vh">
      {isMobile ? <MobileHeader /> : <Header />}
      <Flex justify="center" height="full" flex="1">
        <Flex
          backgroundColor="white"
          marginStart="0rem"
          justify="center"
          maxW="100rem"
          w={{ base: "95%", md: "80%" }}
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
