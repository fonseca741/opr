import Head from "next/head";
import { LayoutSigned } from "@/components/layout";
import {
  Flex,
  useBoolean,
  Text,
  Textarea,
  Divider,
  Button,
} from "@chakra-ui/react";
import { Input } from "@/components/input";
import authRoute from "@/utils/auth";
import { useAuth } from "context";
import fetchData from "utils/fetch";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { formattStringToDots } from "@/utils/formatt";
import { toast } from "react-toastify";
import {
  UserProps,
  ArticleProps as GlobalArticleProps,
  EventProps as GlobalEventProps,
  EventReviewerProps as GlobalEventReviewerProps,
  EventArticleProps as GlobalEventArticleProps,
} from "common/types";

type EventReviewerPros = GlobalEventReviewerProps & {
  reviewer: UserProps;
};

type ArticleProps = GlobalEventArticleProps & {
  article: GlobalArticleProps;
};

type EventProps = GlobalEventProps & {
  creator: UserProps;
  eventReviewers: EventReviewerPros[];
  eventArticles: ArticleProps[];
};

const LoadEventById = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useBoolean(true);
  const [event, setEvent] = useState<EventProps>();

  useEffect(() => {
    (async () => {
      if (router.query.id) {
        try {
          const apiResponse = await fetchData(
            "GET",
            `event/${router.query.id}`
          );
          setEvent(apiResponse);
        } catch (error) {
          toast.error("Ocorreu um erro ao buscar o evento, tente novamente!", {
            autoClose: 5000,
          });
        } finally {
          setIsLoading.off();
        }
      }
    })();
  }, [router.query.id, setIsLoading]);

  return (
    <LayoutSigned>
      <Head>
        <title>Evento</title>
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
        <Flex as="form" width="80%" padding="1rem" direction="column">
          <Flex align="flex-start" direction="column">
            <Text
              width="100%"
              textAlign="center"
              margin="1rem 0 3rem 0"
              fontSize="1.5rem"
              fontWeight="bold"
            >
              Dados do evento
            </Text>

            <Flex justify="flex-start" wrap="wrap" w="100%" mb="0.3125rem">
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
                  defaultValue={event?.name}
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
                  name="initial_date"
                  label="Data inicial"
                  defaultValue={
                    event?.startDate &&
                    new Date(event.startDate)
                      .toLocaleDateString("pt-BR")
                      .toString()
                  }
                  _focusVisible={{ borderColor: "#FFD000" }}
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
                  name="final_date"
                  label="Data final"
                  defaultValue={
                    event?.endDate &&
                    new Date(event.endDate)
                      .toLocaleDateString("pt-BR")
                      .toString()
                  }
                  _focusVisible={{ borderColor: "#FFD000" }}
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
                <Text
                  fontSize="sm"
                  mb="2px"
                  alignItems="start"
                  color="neutral.500"
                >
                  Descrição do evento
                </Text>
                <Textarea
                  resize="none"
                  _focusVisible={{ borderColor: "#FFD000" }}
                  defaultValue={event?.description}
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
                <Text
                  fontSize="sm"
                  mb="2px"
                  alignItems="start"
                  color="neutral.500"
                >
                  Observações para revisores
                </Text>
                <Textarea
                  resize="none"
                  _focusVisible={{ borderColor: "#FFD000" }}
                  defaultValue={event?.creatorInfos}
                  readOnly
                  disabled
                />
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
              Revisores do evento
            </Text>

            <Flex justify="flex-start" wrap="wrap" w="100%" mb="0.3125rem">
              {event?.eventReviewers?.length ? (
                event?.eventReviewers?.map((reviewer) => (
                  <Flex
                    justify="flex-start"
                    wrap="wrap"
                    w="100%"
                    mb="0.3125rem"
                    key={reviewer.id}
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
                        defaultValue={reviewer.reviewer.name}
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
                        name="email"
                        label="E-mail"
                        defaultValue={reviewer.reviewer.email}
                        _focusVisible={{ borderColor: "#FFD000" }}
                        readOnly
                        disabled
                      />
                    </Flex>
                  </Flex>
                ))
              ) : (
                <Text textAlign="center" width="100%" color="#696969">
                  Nenhum revisor selecionado :(
                </Text>
              )}
            </Flex>

            <Divider mt="1rem" />

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
              {event?.eventArticles?.length ? (
                event?.eventArticles?.map((article) => (
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
                        defaultValue={article.article.name}
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
                        defaultValue={formattStringToDots(
                          article.article.description,
                          30
                        )}
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
                        onClick={() =>
                          router.replace(`/article/${article.article.id}`)
                        }
                      >
                        Ver detalhes
                      </Button>
                    </Flex>

                    {event?.eventReviewers?.find(
                      (eventReviewers) => eventReviewers.reviewer.id === user.id
                    ) && (
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
                          title="Revisar artigo"
                          onClick={() => {
                            const currentReviewerId =
                              event?.eventReviewers?.find(
                                (eventReviewers) =>
                                  eventReviewers.reviewer.id === user.id
                              );

                            router.replace(
                              `/review/${article.article.id}-${currentReviewerId?.reviewer.id}`
                            );
                          }}
                        >
                          Revisar artigo
                        </Button>
                      </Flex>
                    )}
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
              Criador do evento
            </Text>

            <Flex justify="flex-start" wrap="wrap" w="100%" mb="0.3125rem">
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
                  defaultValue={event?.creator?.name}
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
                  name="email"
                  label="E-mail"
                  defaultValue={event?.creator?.email}
                  _focusVisible={{ borderColor: "#FFD000" }}
                  readOnly
                  disabled
                />
              </Flex>
            </Flex>
          </Flex>
        </Flex>
      )}
    </LayoutSigned>
  );
};

export default authRoute(LoadEventById);
