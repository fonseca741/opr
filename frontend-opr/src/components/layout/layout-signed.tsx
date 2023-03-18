import React from "react";
import { Flex } from "@chakra-ui/react";
import { Header } from "components/header";

type LayoutSignedProps = {
  children: React.ReactNode;
};

const LayoutSigned = ({ children }: LayoutSignedProps) => {
  return (
    <Flex>
      <Flex direction="row" width="100%">
        <Flex direction="column" width="100%">
          <Header />
          <Flex marginStart="0rem" justify="center">
            {children}
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default LayoutSigned;
