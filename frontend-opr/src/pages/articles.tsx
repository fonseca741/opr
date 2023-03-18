import Head from "next/head";
import { LayoutSigned } from "@/components/layout";
import fetchData from "utils/fetch";
import { useEffect, useState } from "react";
import { Box, Button, Flex, Text, useBoolean } from "@chakra-ui/react";
import { formattStringToDots } from "../utils";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { useAuth } from "context";
import authRoute from "@/utils/auth";
import {
  UserProps,
  EventProps,
  ArticleProps as GlobalArticleProps,
} from "common/types";
import { AiOutlineClockCircle } from "react-icons/ai";
import { GrDocumentText } from "react-icons/gr";
import { FiUser } from "react-icons/fi";
import { BsCalendar3Event } from "react-icons/bs";

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
                background: "#FFD000",
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
                  cursor="pointer"
                  backgroundColor="#fff"
                  _hover={{ border: "2px solid #FFD000" }}
                >
                  <Flex
                    width="300px"
                    height="60px"
                    backgroundColor="#FFD000"
                    marginTop="-25px"
                    marginLeft="-35px"
                    borderRadius="4px"
                    cursor="pointer"
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
                      style={{ background: "#FFD000", color: "#000" }}
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
