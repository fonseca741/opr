import { Button } from "@/components/button";
import { Input } from "@/components/input";
import { LayoutDefault } from "@/components/layout";
import {
  Button as ChakraButton,
  Flex,
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
import { useAuth } from "context";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import Select from "react-select";
import { toast } from "react-toastify";
import fetchData from "utils/fetch";
import * as yup from "yup";

const schema = yup.object().shape({
  email: yup
    .string()
    .email("Digite um e-mail válido.")
    .required("Por favor, digite um e-mail."),
});

type Inputs = {
  email: string;
};

type SelectProps = {
  value: string;
  label: string;
};

type CreateAndLoginResponse = {
  token: string;
  user: {
    id: number;
    isActive: boolean;
    name: string;
    role: string;
    email: string;
    createdAt: string;
    updatedAt: string;
  };
};

const OAuth = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { handleSetToken, handleSetUser } = useAuth();
  const [isLoading, setIsLoading] = useBoolean(false);
  const [permissions, setPermissions] = useState<SelectProps>({
    value: "1",
    label: "Autor",
  });
  const router = useRouter();
  const [orcidResponse, setOrcidResponse] = useState<any>();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({ mode: "onSubmit", resolver: yupResolver(schema) });

  useEffect(() => {
    (async () => {
      if (router.query.code)
        try {
          setIsLoading.on();
          const apiResponse = await fetchData("POST", "user/orcid", {
            orcidCode: router.query.code,
          });

          setOrcidResponse(apiResponse);

          if (!apiResponse.orcid) {
            handleSetToken(apiResponse.token);
            handleSetUser(apiResponse.user);
            router.replace("/");
          }
        } catch (error) {
          toast.error("Ocorreu um erro ao realizar o login pelo orcid", {
            autoClose: 5000,
          });
        } finally {
          setIsLoading.off();
        }
    })();
  }, [router.query.code]);

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
    console.log(data);

    try {
      setIsLoading.on();
      const apiResponse: CreateAndLoginResponse = await fetchData(
        "POST",
        "user?shouldLogin=true",
        {
          ...data,
          role: selectUserRole(permissions.label),
          orcid: orcidResponse!.orcid,
          name: orcidResponse!.name,
        }
      );

      handleSetToken(apiResponse.token);
      handleSetUser(apiResponse.user);
      router.replace("/");
      toast.success("Cadastro realizado com sucesso!", {
        autoClose: 5000,
      });
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
        <title>Complete o Cadastro</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>

      {isLoading ? (
        <Flex flexDirection="column" align="center" justify="center">
          <Text
            width="100%"
            textAlign="center"
            margin="1rem 0 3rem 0"
            fontSize="1.5rem"
            fontWeight="bold"
          >
            Carregando...
          </Text>
        </Flex>
      ) : (
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
          <Text fontWeight="bold" fontSize="xl" mb="10px">
            Complete seu cadastro
          </Text>
          <Text color="neutral.500" mb="40px">
            Precisamos de mais algumas informações para prosseguir, por favor,
            complete as informações abaixo para concluir o seu cadastro.
          </Text>
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

          <Button
            type="submit"
            variant="primary"
            title="Cadastrar"
            disabled={isLoading}
            isLoading={isLoading}
          >
            Cadastrar
          </Button>
        </Flex>
      )}
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

export default OAuth;
