import { SubmitHandler, useForm } from "react-hook-form";
import Head from "next/head";
import * as yup from "yup";
import { toast } from "react-toastify";
import LinkNext from "next/link";
import { useRouter } from "next/navigation";
import { Flex, Link, useBoolean } from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { Input } from "@/components/input";
import { LayoutDefault } from "@/components/layout";
import { Button } from "@/components/button";
import fetchData from "utils/fetch";
import { useAuth } from "context";

const schema = yup.object().shape({
  email: yup
    .string()
    .email("Digite um e-mail válido.")
    .required("Por favor, digite um e-mail."),
  password: yup.string().required("Por favor, digite uma senha."),
});

type Inputs = {
  email: string;
  password: string;
};

const Login = () => {
  const router = useRouter();
  const { handleSetToken, handleSetUser } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({ mode: "onSubmit", resolver: yupResolver(schema) });
  const [isLoading, setIsLoading] = useBoolean(false);

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      setIsLoading.on();
      const response = await fetchData("POST", "user/login", data);
      handleSetToken(response.token);
      handleSetUser(response.user);
      router.replace("/");
    } catch {
      toast.error("Ocorreu um erro ao realizar o login, tente novamente!", {
        autoClose: 5000,
      });
    } finally {
      setIsLoading.off();
    }
  };

  return (
    <LayoutDefault>
      <Head>
        <title>Login</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Flex
        as="form"
        p={8}
        borderRadius="0.75rem"
        bg="white"
        boxShadow="md"
        w={{ base: "28rem" }}
        h="25rem"
        textColor="gray.700"
        direction="column"
        justifyContent="center"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Input
          label="E-mail"
          placeholder="Digite seu e-mail"
          color="#000"
          _focusVisible={{ borderColor: "#FFD000" }}
          error={errors.email?.message}
          {...register("email")}
        />

        <Input
          label="Senha"
          placeholder="Digite sua senha"
          type="password"
          color="#000"
          _focusVisible={{ borderColor: "#FFD000" }}
          error={errors.password?.message}
          {...register("password")}
        />

        <Button
          type="submit"
          style={{ background: "#FFD000", color: "#000" }}
          title="Entrar"
          disabled={isLoading}
          isLoading={isLoading}
        >
          Entrar
        </Button>

        <Link
          as={LinkNext}
          href="/signup"
          color="#696969"
          fontSize={14}
          marginTop={4}
          textAlign="center"
          _hover={{ textDecoration: "underline" }}
        >
          cadastrar usuário
        </Link>
      </Flex>
    </LayoutDefault>
  );
};

export default Login;
