import { OrcidIcon } from "@/assets/icons";
import { Button } from "@/components/button";
import { Input } from "@/components/input";
import { LayoutDefault } from "@/components/layout";
import { Flex, Link, useBoolean } from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAuth } from "context";
import Head from "next/head";
import LinkNext from "next/link";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import fetchData from "utils/fetch";
import * as yup from "yup";

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
    } catch (e: any) {
      if (e.message == "User not found with this email!") {
        toast.error("Usuário não encontrado!", {
          autoClose: 5000,
        });
        return;
      }
      toast.error("Ocorreu um erro ao realizar o login, tente novamente!", {
        autoClose: 5000,
      });
    } finally {
      setIsLoading.off();
    }
  };

  const handleRedirect = () => {
    router.push(`${process.env.NEXT_PUBLIC_ORCID_AUTH_URI}`);
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
        w={{ base: "20rem", md: "28rem" }}
        textColor="gray.700"
        direction="column"
        justifyContent="center"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Input
          label="E-mail"
          placeholder="Digite seu e-mail"
          color="#000"
          _focusVisible={{ borderColor: "primary.100" }}
          error={errors.email?.message}
          {...register("email")}
        />

        <Input
          label="Senha"
          placeholder="Digite sua senha"
          type="password"
          color="#000"
          _focusVisible={{ borderColor: "primary.100" }}
          error={errors.password?.message}
          {...register("password")}
        />

        <Button
          type="submit"
          variant="primary"
          title="Entrar"
          disabled={isLoading}
          isLoading={isLoading}
        >
          Entrar
        </Button>

        <Button
          mt="15px"
          onClick={handleRedirect}
          leftIcon={<OrcidIcon />}
          boxShadow="1px 1px 5px #888888"
        >
          Entrar via Orcid
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
          Cadastrar usuário
        </Link>
      </Flex>
    </LayoutDefault>
  );
};

export default Login;
