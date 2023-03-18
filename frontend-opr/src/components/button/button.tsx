import { Button as ChackraButton } from "@chakra-ui/react";

const Button = ({ children, ...rest }) => {
  return (
    <ChackraButton
      colorScheme="gray"
      type="submit"
      minW="12rem"
      minH="3rem"
      mt="2rem"
      {...rest}
    >
      {children}
    </ChackraButton>
  );
};

export default Button;
