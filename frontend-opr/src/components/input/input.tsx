import React, { forwardRef } from "react";
import {
  Input as ChackraInput,
  InputProps as ChackraInputProps,
  Box,
} from "@chakra-ui/react";
import { Text } from "@/components/text";
import { InputError } from "@/components/input";

type InputProps = ChackraInputProps & {
  error?: any;
  name: string;
  label: string;
  readOnly?: boolean;
  disabled?: boolean;
};

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ name, error, label, ...props }, ref) => {
    return (
      <>
        <Text fontSize="sm" mb="2px" alignItems="start" color="neutral.500">
          {label}
        </Text>
        <ChackraInput
          name={name}
          id={name}
          ref={ref}
          height="3.5rem"
          {...props}
        />
        {error ? <InputError>{error}</InputError> : <Box h="1.625rem" />}
      </>
    );
  }
);

Input.displayName = "Input";

export default Input;
