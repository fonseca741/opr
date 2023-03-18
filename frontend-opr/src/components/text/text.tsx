import React, { ReactNode } from "react";
import {
  Text as ChackraText,
  TextProps as ChackraTextProps,
} from "@chakra-ui/react";

type TextProps = ChackraTextProps & {
  children: ReactNode;
};

const Text = ({ children, ...props }: TextProps) => {
  return <ChackraText {...props}>{children}</ChackraText>;
};

export default Text;
