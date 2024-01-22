import { Button } from "@/components/button";
import { Input } from "@/components/input";
import { LayoutDefault } from "@/components/layout";
import fetchData from "@/utils/fetch";
import {
  Box,
  Button as ChakraButton,
  Flex,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  useBoolean,
  useDisclosure,
} from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import Head from "next/head";
import LinkNext from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import Select from "react-select";
import { toast } from "react-toastify";
import * as yup from "yup";

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
  const { isOpen, onOpen, onClose } = useDisclosure();
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
      toast.error("Ocorreu um erro ao realizar o cadastro, tente novamente!", {
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
        w={{ base: "20rem", md: "28rem" }}
        h="35rem"
        textColor="gray.700"
        direction="column"
        justifyContent="center"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Input
          label="Nome*"
          placeholder="Digite seu nome"
          error={errors.name?.message}
          color="#000"
          _focusVisible={{ borderColor: "primary.100" }}
          {...register("name")}
        />

        <Input
          label="E-mail*"
          placeholder="Digite seu e-mail"
          error={errors.email?.message}
          color="#000"
          _focusVisible={{ borderColor: "primary.100" }}
          {...register("email")}
        />

        <Text fontSize="sm" mb="2px" alignItems="start" color="neutral.500">
          Permissão*
        </Text>

        <Select
          theme={(theme) => ({
            ...theme,
            borderRadius: 5,
            colors: {
              ...theme.colors,
              text: "orangered",
              primary25: "primary.100",
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
        <Flex direction="row" alignSelf="center">
          <ChakraButton mt="10px" size="sm" onClick={onOpen}>
            Ver permissão dos papéis
          </ChakraButton>
        </Flex>

        <Box margin="5px 0" />

        <Input
          label="Senha*"
          placeholder="Digite sua senha"
          type="password"
          error={errors.password?.message}
          color="#000"
          _focusVisible={{ borderColor: "primary.100" }}
          {...register("password")}
        />

        <Input
          label="Confirmar senha*"
          placeholder="Confirme sua senha"
          type="password"
          error={errors.passwordConfirmation?.message}
          color="#000"
          _focusVisible={{ borderColor: "primary.100" }}
          {...register("passwordConfirmation")}
        />

        <Button
          type="submit"
          variant="primary"
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
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Descrição dos papeis</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Todos os papeis tem permissão para fazer a listagem de artefatos,
            eventos e revisões, se tratando de Ciência Aberta, todo o processo
            ficará disponível de forma pública.
            <br />
            <br />
            <strong>Revisor:</strong> O revisor, assim que associado à um evento
            científico, poderá realizar revisões dos artefatos submetidos, dando
            início a uma discussão.
            <br />
            <br />
            <strong>Autor:</strong> O autor, poderá realizar submissões de
            artefatos para eventos científicos já cadastrados e assim que algum
            revisor iniciar uma discussão sobre o item submetido, poderá também
            participar da discussão de seu próprio artefato.
            <br />
            <br />
            <strong>Editor:</strong> O editor é o responsável pela criação e
            edição dos eventos científicos, poderá adicionar qualquer usuário
            cadastrado na ferramenta como Chair, que também ficará responsável
            pelo gerenciamento do evento.
          </ModalBody>
        </ModalContent>
      </Modal>
    </LayoutDefault>
  );
};

export default Signup;
