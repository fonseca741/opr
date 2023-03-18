import Head from "next/head";
import { SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import LinkNext from "next/link";
import { Box, Flex, Link, Text, useBoolean } from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { Input } from "@/components/input";
import { LayoutDefault } from "@/components/layout";
import { Button } from "@/components/button";
import fetchData from "@/utils/fetch";
import Select from "react-select";
import { useState } from "react";

const schema = yup.object().shape({
  name: yup.string().required("Por favor, digite seu nome."),
  email: yup
    .string()
    .email("Digite um e-mail válido.")
    .required("Por favor, digite um e-mail."),
  password: yup.string().required("Por favor, digite uma senha."),
  passwordConfirmation: yup
    .string()
    .oneOf([yup.ref("password"), null], "As senhas não coincidem."),
});

type SelectProps = {
  value: string;
  label: string;
};

type Inputs = {
  name: string;
  email: string;
  password: string;
  passwordConfirmation: string;
};

const Signup = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({ mode: "onSubmit", resolver: yupResolver(schema) });
  const [permissions, setPermissions] = useState<SelectProps>({
    value: "1",
    label: "Autor",
  });
  const [isLoading, setIsLoading] = useBoolean(false);

  const selectUserRole = (role: string) => {
    switch (role) {
      case "Autor":
        return "author";
      case "Editor":
        return "publisher";
      default:
        return "reviewer";
    }
  };

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      setIsLoading.on();
      await fetchData("POST", "user", {
        ...data,
        role: selectUserRole(permissions.label),
      });
      toast.success("Usuário cadastrado com sucesso!", {
        autoClose: 5000,
      });
      router.replace("/login");
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
        <title>Cadastro</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>

      <Flex
        as="form"
        p={8}
        borderRadius="0.75rem"
        bg="white"
        boxShadow="md"
        w={{ base: "28rem" }}
        h="35rem"
        textColor="gray.700"
        direction="column"
        justifyContent="center"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Input
          label="Nome"
          placeholder="Digite seu nome"
          error={errors.name?.message}
          color="#000"
          _focusVisible={{ borderColor: "#FFD000" }}
          {...register("name")}
        />

        <Input
          label="E-mail"
          placeholder="Digite seu e-mail"
          error={errors.email?.message}
          color="#000"
          _focusVisible={{ borderColor: "#FFD000" }}
          {...register("email")}
        />

        <Text fontSize="sm" mb="2px" alignItems="start" color="neutral.500">
          Permissão
        </Text>
        <Select
          theme={(theme) => ({
            ...theme,
            borderRadius: 0,
            colors: {
              ...theme.colors,
              text: "orangered",
              primary25: "#FFD000",
              primary: "black",
            },
          })}
          defaultValue={permissions}
          onChange={(e) =>
            setPermissions({
              value: e?.value || "1",
              label: e?.label || "Autor",
            })
          }
          options={[
            {
              value: "1",
              label: "Autor",
            },
            {
              value: "2",
              label: "Revisor",
            },
            {
              value: "3",
              label: "Editor",
            },
          ]}
          placeholder="Selecione uma permissão"
        />

        <Box margin="5px 0" />

        <Input
          label="Senha"
          placeholder="Digite sua senha"
          type="password"
          error={errors.password?.message}
          color="#000"
          _focusVisible={{ borderColor: "#FFD000" }}
          {...register("password")}
        />

        <Input
          label="Confirmar senha"
          placeholder="Confirme sua senha"
          type="password"
          error={errors.passwordConfirmation?.message}
          color="#000"
          _focusVisible={{ borderColor: "#FFD000" }}
          {...register("passwordConfirmation")}
        />

        <Button
          type="submit"
          style={{ background: "#FFD000", color: "#000" }}
          title="Cadastrar"
          disabled={isLoading}
          isLoading={isLoading}
        >
          Cadastrar
        </Button>

        <Link
          as={LinkNext}
          href="/login"
          color="#696969"
          fontSize={14}
          marginTop={4}
          textAlign="center"
          _hover={{ textDecoration: "underline" }}
        >
          acessar sistema
        </Link>
      </Flex>
    </LayoutDefault>
  );
};

export default Signup;
