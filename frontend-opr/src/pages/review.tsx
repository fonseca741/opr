import { Input } from "@/components/input";
import { LayoutSigned } from "@/components/layout";
import authRoute from "@/utils/auth";
import { Button, Flex, Text, useBoolean } from "@chakra-ui/react";
import { useAuth } from "context";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import fetchData from "utils/fetch";

type EventReviewsProps = {
  reviewid: number;
  createdat: string;
  name: string;
  articleid: number;
};

const Reviews = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [eventReviews, setEventReviews] = useState<EventReviewsProps[]>([]);
  const [loading, setLoading] = useBoolean(true);

  useEffect(() => {
    (async () => {
      try {
        const apiResponse = await fetchData(
          "GET",
          `article/reviewer/${user.id}`
        );

        setEventReviews(apiResponse);
      } catch (error) {
        toast.error("Ocorreu um erro ao buscar as revisões, tente novamente!", {
          autoClose: 5000,
        });
      } finally {
        setLoading.off();
      }
    })();
  }, [setLoading, user.id]);

  return (
    <LayoutSigned>
      <Head>
        <title>Revisões</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      {loading ? (
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
        <Flex flexDirection="column" align="center" w="full">
          <Text
            width="100%"
            textAlign="center"
            margin="1rem 0 3rem 0"
            fontSize="1.5rem"
            fontWeight="bold"
          >
            Minhas revisões
          </Text>

          <Flex
            flexDir="column"
            justify="flex-start"
            wrap="wrap"
            w="100%"
            mb="0.3125rem"
          >
            {eventReviews.length ? (
              eventReviews
                .sort((first, second) => second.reviewid - first.reviewid)
                .map((article) => (
                  <Flex
                    justify="flex-start"
                    wrap="wrap"
                    w="100%"
                    mb="0.3125rem"
                    key={article.articleid}
                    min-height="8rem"
                  >
                    <Flex
                      flex={0.6}
                      direction="column"
                      mr={{ base: "0", sm: "1rem" }}
                      minW="13.75rem"
                    >
                      <Input
                        name="title"
                        label="Título do artefato"
                        _focusVisible={{ borderColor: "primary.100" }}
                        defaultValue={article.name}
                        readOnly
                        disabled
                      />
                    </Flex>

                    <Flex
                      flex={0.3}
                      direction="column"
                      mr={{ base: "0", sm: "1rem" }}
                      minW="13.75rem"
                    >
                      <Input
                        name="date"
                        label="Data da submissão"
                        _focusVisible={{ borderColor: "primary.100" }}
                        defaultValue={article.createdat.split("T")[0]}
                        readOnly
                        disabled
                      />
                    </Flex>

                    <Flex
                      flex={0.05}
                      direction="column"
                      minW="13.75rem"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Button
                        variant="primary"
                        title="   Visualizar arquivo"
                        onClick={() =>
                          router.push(`/article/${article.articleid}`)
                        }
                        marginBottom="20px"
                      >
                        Acessar artefato
                      </Button>
                    </Flex>

                    <Flex
                      flex={0.05}
                      direction="column"
                      mr={{ base: "0", sm: "1rem" }}
                      minW="13.75rem"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Button
                        variant="primary"
                        title="Revisar artefato"
                        onClick={() =>
                          router.push(
                            `/review/show/${article.articleid}-${article.reviewid}`
                          )
                        }
                        marginBottom="20px"
                      >
                        Acessar revisão
                      </Button>
                    </Flex>
                  </Flex>
                ))
            ) : (
              <Text textAlign="center" width="100%" color="#696969">
                Nenhum processo de revisão :(
              </Text>
            )}
          </Flex>
        </Flex>
      )}
    </LayoutSigned>
  );
};

export default authRoute(Reviews);
