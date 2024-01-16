import { LayoutSigned } from "@/components/layout";
import authRoute from "@/utils/auth";
import { Box, Button, Flex, Text, useBoolean } from "@chakra-ui/react";
import {
  ArticleProps as GlobalArticleProps,
  EventProps,
  UserProps,
} from "common/types";
import { useAuth } from "context";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { AiOutlineClockCircle } from "react-icons/ai";
import { BsCalendar3Event } from "react-icons/bs";
import { FiUser } from "react-icons/fi";
import { GrDocumentText } from "react-icons/gr";
import { toast } from "react-toastify";
import fetchData from "utils/fetch";
import { formattStringToDots } from "../utils";

type ArticleProps = GlobalArticleProps & {
  creator: UserProps;
  event: EventProps;
};

const Article = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [articles, setArticles] = useState<ArticleProps[]>([]);
  const [loading, setLoading] = useBoolean(true);

  useEffect(() => {
    (async () => {
      try {
        const apiResponse = await fetchData("GET", "article");
        setArticles(apiResponse);
      } catch (error) {
        toast.error("Ocorreu um erro ao buscar os artigos, tente novamente!", {
          autoClose: 5000,
        });
      } finally {
        setLoading.off();
      }
    })();
  }, [setLoading]);

  return (
    <LayoutSigned>
      <Head>
        <title>Artigos</title>
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
        <Flex flexDirection="column" align="center">
          {["admin", "author"].includes(user.role) && (
            <Button
              style={{
                color: "#000",
                marginBottom: "1rem",
                marginTop: "1rem",
              }}
              variant="primary"
              title="Criar artigo"
              onClick={() => router.replace("create-article")}
            >
              Submeter artigo
            </Button>
          )}

          <Flex
            alignItems="center"
            justifyContent="center"
            wrap={{ base: "wrap" }}
          >
            {articles.length >= 1 ? (
              articles.map((article) => (
                <Box
                  key={article.id}
                  width={{ base: "300px", md: "400px" }}
                  color="#000"
                  margin="1.5rem"
                  height={{ base: "auto", md: "220px" }}
                  borderRadius="4px"
                  padding="1rem"
                  backgroundColor="#fff"
                  _hover={{ border: "1px solid #FFD000" }}
                  boxShadow="0px 0px 10px rgba(0, 0, 0, 0.2)"
                  cursor="pointer"
                  onClick={() => router.push(`article/${article.id}`)}
                  fontSize="14px"
                >
                  <Flex
                    width="300px"
                    padding={2}
                    height="60px"
                    backgroundColor="primary.100"
                    marginTop={{ base: "-16px", md: "-25px" }}
                    marginLeft={{ base: "-16px", md: "-35px" }}
                    borderRadius="4px"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Text
                      fontWeight="bold"
                      color="#000"
                      fontSize="13"
                      marginRight="10px"
                    >
                      {formattStringToDots(article.name.toUpperCase(), 105)}
                    </Text>
                  </Flex>

                  <Flex display="flex" alignItems="center">
                    <Text
                      fontSize="20px"
                      fontWeight="bold"
                      marginTop="10px"
                      marginRight="15px"
                      title="Descrição"
                    >
                      <GrDocumentText />
                    </Text>

                    <Text fontWeight="bold" marginTop="10px">
                      {formattStringToDots(article.description, 80)}
                    </Text>
                  </Flex>

                  <Flex display="flex" alignItems="center">
                    <Text
                      fontSize="20px"
                      fontWeight="bold"
                      marginTop="10px"
                      marginRight="15px"
                      title="Autor"
                    >
                      <FiUser />
                    </Text>

                    <Text fontWeight="bold" marginTop="10px">
                      {article.creator.name}
                    </Text>
                  </Flex>

                  <Flex display="flex" alignItems="center">
                    <Text
                      fontSize="20px"
                      fontWeight="bold"
                      marginTop="10px"
                      marginRight="15px"
                      title="Atualizado em"
                    >
                      <AiOutlineClockCircle />
                    </Text>

                    <Text fontWeight="bold" marginTop="10px">
                      {article.updatedAt.split("T")[0]}
                    </Text>
                  </Flex>

                  <Flex display="flex" alignItems="center">
                    <Text
                      fontSize="20px"
                      fontWeight="bold"
                      marginTop="10px"
                      marginRight="15px"
                      title="Nome do evento"
                    >
                      <BsCalendar3Event />
                    </Text>

                    <Text fontWeight="bold" marginTop="10px">
                      {formattStringToDots(article.event.name, 80)}
                    </Text>
                  </Flex>
                </Box>
              ))
            ) : (
              <Text marginTop="20px" color="#696969">
                Nenhum artigo cadastrado :(
              </Text>
            )}
          </Flex>
        </Flex>
      )}
    </LayoutSigned>
  );
};

export default authRoute(Article);
