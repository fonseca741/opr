import Head from "next/head";
import { LayoutSigned } from "@/components/layout";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import {
  Avatar,
  Flex,
  Button,
  useBoolean,
  Divider,
  Text,
} from "@chakra-ui/react";
import { Input } from "@/components/input";
import authRoute from "@/utils/auth";
import { useAuth } from "context";
import fetchData from "utils/fetch";
import { useEffect, useState } from "react";
import { formattStringToDots } from "../utils";
import { useRouter } from "next/router";
import {
  EventProps,
  UserProps,
  ArticleProps as GlobalArticleProps,
} from "common/types";

type Inputs = {
  name: string;
};

type ArticleProps = GlobalArticleProps & {
  creator: UserProps;
};

const Profile = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();
  const { user, handleSetUser } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useBoolean(false);
  const [events, setEvents] = useState<EventProps[]>([]);
  const [articles, setArticles] = useState<ArticleProps[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const apiEventResponse = await fetchData(
          "GET",
          `event/user/${user.id}`
        );
        const apiArticleResponse = await fetchData(
          "GET",
          `article/user/${user.id}`
        );

        setEvents(apiEventResponse);
        setArticles(apiArticleResponse);
      } catch (error) {
        toast.error("Ocorreu um erro ao buscar seus dados, tente novamente!", {
          autoClose: 5000,
        });
      }
    })();
  }, [user.id]);

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      setIsLoading.on();
      await fetchData("PUT", `user/${user.id}`, data);
      handleSetUser({
        ...user,
        name: data.name,
      });
    } catch {
      toast.error("Ocorreu ao alterar seus dados, tente novamente!", {
        autoClose: 5000,
      });
    } finally {
      setIsLoading.off();
    }
  };

  const selectUserRole = (role: string) => {
    switch (role) {
      case "admin":
        return "Administrador";
      case "author":
        return "Autor";
      case "publisher":
        return "Editor";
      default:
        return "Revisor";
    }
  };

  return (
    <LayoutSigned>
      <Head>
        <title>Meu perfil</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>

      <Flex width="100%" padding="2rem 3rem" direction="column">
        <Flex alignItems="center" flexDirection="column">
          <Avatar
            size="2xl"
            name={user.name}
            bg="#000"
            color="#fff"
            border="0.125rem solid #000"
            marginBottom="1.5rem"
          />
        </Flex>

        <Flex
          as="form"
          width="100%"
          padding="1rem"
          direction="column"
          onSubmit={handleSubmit(onSubmit)}
        >
          <Flex align="flex-start" direction="column">
            <Flex justify="flex-start" wrap="wrap" w="100%" mb="0.3125rem">
              <Flex
                flex={1}
                direction="column"
                mr={{ base: "0", sm: "1rem" }}
                minW="13.75rem"
              >
                <Input
                  label="Nome"
                  placeholder="Digite seu nome"
                  defaultValue={user.name}
                  _focusVisible={{ borderColor: "#FFD000" }}
                  error={errors.name?.message}
                  {...register("name")}
                />
              </Flex>

              <Flex
                flex={1}
                direction="column"
                mr={{ base: "0", sm: "1rem" }}
                minW="13.75rem"
              >
                <Input
                  name="email"
                  label="E-mail"
                  value={user.email}
                  readOnly
                  disabled
                />
              </Flex>
            </Flex>

            <Flex justify="flex-start" wrap="wrap" w="100%" mb="0.3125rem">
              <Flex
                flex={1}
                direction="column"
                mr={{ base: "0", sm: "1rem" }}
                minW="13.75rem"
              >
                <Input
                  name="permission"
                  label="Permissão"
                  value={selectUserRole(user.role).toUpperCase()}
                  readOnly
                  disabled
                />
              </Flex>

              <Flex
                flex={1}
                direction="column"
                mr={{ base: "0", sm: "1rem" }}
                minW="13.75rem"
              >
                <Input
                  name="status"
                  label="Status"
                  value={user.isActive ? "ATIVO" : "INATIVO"}
                  readOnly
                  disabled
                />
              </Flex>
            </Flex>
          </Flex>

          <Flex
            w="100%"
            px="1rem"
            align="center"
            justify="flex-end"
            alignItems="center"
          >
            <Button
              h="3.25rem"
              type="submit"
              disabled={isLoading}
              isLoading={isLoading}
              style={{ background: "#FFD000", color: "#000" }}
              title="Atualizar meus dados"
            >
              Atualizar meus dados
            </Button>
          </Flex>
        </Flex>

        <Divider mt="3rem" />

        <Text
          width="100%"
          textAlign="center"
          margin="1rem 0 3rem 0"
          fontSize="1.5rem"
          fontWeight="bold"
        >
          Artigos submetidos
        </Text>

        <Flex justify="flex-start" wrap="wrap" w="100%" mb="0.3125rem">
          {articles.length > 0 ? (
            articles.map((article) => (
              <Flex
                justify="flex-start"
                wrap="wrap"
                w="100%"
                mb="0.3125rem"
                key={article.id}
              >
                <Flex
                  flex={1}
                  direction="column"
                  mr={{ base: "0", sm: "1rem" }}
                  minW="13.75rem"
                >
                  <Input
                    name="name"
                    label="Nome"
                    _focusVisible={{ borderColor: "#FFD000" }}
                    defaultValue={article.name}
                    readOnly
                    disabled
                  />
                </Flex>

                <Flex
                  flex={1}
                  direction="column"
                  mr={{ base: "0", sm: "1rem" }}
                  minW="13.75rem"
                >
                  <Input
                    name="description"
                    label="Descrição"
                    defaultValue={formattStringToDots(article.description, 30)}
                    _focusVisible={{ borderColor: "#FFD000" }}
                    readOnly
                    disabled
                  />
                </Flex>

                <Flex
                  flex={0.5}
                  direction="column"
                  mr={{ base: "0", sm: "1rem" }}
                  minW="13.75rem"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Button
                    style={{ background: "#FFD000", color: "#000" }}
                    title="Ver detalhes"
                    onClick={() => router.replace(`article/${article.id}`)}
                  >
                    Ver detalhes
                  </Button>
                </Flex>
              </Flex>
            ))
          ) : (
            <Text textAlign="center" width="100%" color="#696969">
              Nenhum artigo submetido :(
            </Text>
          )}
        </Flex>

        <Divider mt="3rem" />

        <Text
          width="100%"
          textAlign="center"
          margin="1rem 0 3rem 0"
          fontSize="1.5rem"
          fontWeight="bold"
        >
          Eventos criados
        </Text>

        <Flex justify="flex-start" wrap="wrap" w="100%" mb="0.3125rem">
          {events.length > 0 ? (
            events.map((event) => (
              <Flex
                justify="flex-start"
                wrap="wrap"
                w="100%"
                mb="0.3125rem"
                key={event.id}
              >
                <Flex
                  flex={1}
                  direction="column"
                  mr={{ base: "0", sm: "1rem" }}
                  minW="13.75rem"
                >
                  <Input
                    name="name"
                    label="Nome"
                    _focusVisible={{ borderColor: "#FFD000" }}
                    defaultValue={event.name}
                    readOnly
                    disabled
                  />
                </Flex>

                <Flex
                  flex={1}
                  direction="column"
                  mr={{ base: "0", sm: "1rem" }}
                  minW="13.75rem"
                >
                  <Input
                    name="description"
                    label="Descrição"
                    defaultValue={formattStringToDots(event.description, 30)}
                    _focusVisible={{ borderColor: "#FFD000" }}
                    readOnly
                    disabled
                  />
                </Flex>

                <Flex
                  flex={0.5}
                  direction="column"
                  mr={{ base: "0", sm: "1rem" }}
                  minW="13.75rem"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Button
                    style={{ background: "#FFD000", color: "#000" }}
                    title="Ver detalhes"
                    onClick={() => router.replace(`event/${event.id}`)}
                  >
                    Ver detalhes
                  </Button>
                </Flex>
              </Flex>
            ))
          ) : (
            <Text textAlign="center" width="100%" color="#696969">
              Nenhum evento criado :(
            </Text>
          )}
        </Flex>
      </Flex>
    </LayoutSigned>
  );
};

export default authRoute(Profile);
