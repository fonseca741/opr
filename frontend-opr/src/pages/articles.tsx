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
        <Flex flexDirection="column" align="center" justify="center">
          {["admin", "author"].includes(user.role) && (
            <Button
              style={{
                background: "primary.100",
                color: "#000",
                marginBottom: "1rem",
                marginTop: "1rem",
              }}
              title="Criar artigo"
              onClick={() => router.replace("create-article")}
            >
              Criar artigo
            </Button>
          )}

          <Flex
            minWidth="600px"
            alignItems="center"
            justifyContent="center"
            wrap={{ base: "wrap" }}
          >
            {articles.length >= 1 ? (
              articles.map((article) => (
                <Box
                  key={article.id}
                  width="400px"
                  color="#000"
                  margin="1.5rem"
                  height="200px"
                  borderRadius="4px"
                  padding="1rem"
                  backgroundColor="#fff"
                  _hover={{ border: "2px solid primary.100" }}
                >
                  <Flex
                    width="300px"
                    height="60px"
                    backgroundColor="primary.100"
                    marginTop="-25px"
                    marginLeft="-35px"
                    borderRadius="4px"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Text
                      fontWeight="bold"
                      color="#000"
                      fontSize="15"
                      marginRight="10px"
                    >
                      {formattStringToDots(article.name.toUpperCase(), 22)}
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
                      {formattStringToDots(article.description, 30)}
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
                      {article.event.name}
                    </Text>
                  </Flex>

                  <Flex justifyContent="end" marginTop="-40px">
                    <Button
                      borderRadius="4px"
                      variant="primary"
                      title="Ver detalhes"
                      onClick={() => router.replace(`article/${article.id}`)}
                    >
                      Ver detalhes
                    </Button>
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
