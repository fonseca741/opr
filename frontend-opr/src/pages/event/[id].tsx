import { Input } from "@/components/input";
import { LayoutSigned } from "@/components/layout";
import authRoute from "@/utils/auth";
import { formattStringToDots } from "@/utils/formatt";
import { EditIcon } from "@chakra-ui/icons";
import {
  Button,
  Divider,
  Flex,
  Text,
  Textarea,
  useBoolean,
} from "@chakra-ui/react";
import {
  ArticleProps as GlobalArticleProps,
  EventArticleProps as GlobalEventArticleProps,
  EventProps as GlobalEventProps,
  EventReviewerProps as GlobalEventReviewerProps,
  UserProps,
} from "common/types";
import { useAuth } from "context";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import fetchData from "utils/fetch";

type EventReviewerProps = GlobalEventReviewerProps & {
  reviewer: UserProps;
};

type EventChairProps = GlobalEventReviewerProps & {
  chair: UserProps;
};

type ArticleProps = GlobalEventArticleProps & {
  article: GlobalArticleProps;
};

export type EventProps = GlobalEventProps & {
  creator: UserProps;
  eventReviewers: EventReviewerProps[];
  eventChairs: EventChairProps[];
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

  const canEdit = () => {
    const eventChairsId = event?.eventChairs.map(
      (eventChair: any) => eventChair.chair.id
    );

    const allowedIds = [eventChairsId, event?.creator.id].flat(Infinity);

    return allowedIds.includes(user.id) || user.role === "admin";
  };

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
        <Flex as="form" direction="column" w="full">
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
                  _focusVisible={{ borderColor: "primary.100" }}
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
                  _focusVisible={{ borderColor: "primary.100" }}
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
                  _focusVisible={{ borderColor: "primary.100" }}
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
                  _focusVisible={{ borderColor: "primary.100" }}
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
                  _focusVisible={{ borderColor: "primary.100" }}
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
                        _focusVisible={{ borderColor: "primary.100" }}
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
                        _focusVisible={{ borderColor: "primary.100" }}
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
              margin="1rem 0 1rem 0"
              fontSize="1.5rem"
              fontWeight="bold"
            >
              Artefatos submetidos
            </Text>

            <Button
              mb="3rem"
              variant="primary"
              alignSelf="center"
              isDisabled={
                !["admin", "author"].includes(user.role) ||
                new Date(event!.endDate) < new Date()
              }
              onClick={() =>
                router.push({ pathname: `/create-article/${router.query.id}` })
              }
            >
              Submeter artefato
            </Button>

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
                        _focusVisible={{ borderColor: "primary.100" }}
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
                        _focusVisible={{ borderColor: "primary.100" }}
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
                        variant="primary"
                        title="Ver detalhes"
                        mb="10px"
                        onClick={() =>
                          router.push(`/article/${article.article.id}`)
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
                          variant="primary"
                          mb="10px"
                          title="Revisar artigo"
                          onClick={() => {
                            const currentReviewerId =
                              event?.eventReviewers?.find(
                                (eventReviewers) =>
                                  eventReviewers.reviewer.id === user.id
                              );

                            router.push(
                              `/review/${article.article.id}-${currentReviewerId?.reviewer.id}`
                            );
                          }}
                        >
                          Revisar artefato
                        </Button>
                      </Flex>
                    )}
                  </Flex>
                ))
              ) : (
                <Text textAlign="center" width="100%" color="#696969">
                  Nenhum artefato submetido :(
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
                  _focusVisible={{ borderColor: "primary.100" }}
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
                  _focusVisible={{ borderColor: "primary.100" }}
                  readOnly
                  disabled
                />
              </Flex>
            </Flex>

            <Text
              width="100%"
              textAlign="center"
              margin="1rem 0 3rem 0"
              fontSize="1.5rem"
              fontWeight="bold"
            >
              Chairs do evento
            </Text>

            <Flex justify="flex-start" wrap="wrap" w="100%" mb="0.3125rem">
              {event?.eventChairs?.length ? (
                event?.eventChairs?.map((eventChair: any) => (
                  <Flex
                    justify="flex-start"
                    wrap="wrap"
                    w="100%"
                    mb="0.3125rem"
                    key={eventChair.id}
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
                        _focusVisible={{ borderColor: "primary.100" }}
                        defaultValue={eventChair.chair.name}
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
                        defaultValue={eventChair.chair.email}
                        _focusVisible={{ borderColor: "primary.100" }}
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

            <Button
              leftIcon={<EditIcon />}
              variant="primary"
              alignSelf="center"
              isDisabled={!canEdit()}
              onClick={() => router.push(`/event/edit/${event?.id}`)}
            >
              Editar evento
            </Button>
          </Flex>
        </Flex>
      )}
    </LayoutSigned>
  );
};

export default authRoute(LoadEventById);
