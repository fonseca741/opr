import { LayoutSigned } from "@/components/layout";
import authRoute from "@/utils/auth";
import { Flex, Text, useBoolean } from "@chakra-ui/react";
import {
  ArticleProps,
  EventArticleProps as GlobalEventArticleProps,
} from "common/types";
import { useAuth } from "context";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import fetchData from "utils/fetch";

type EventReviewsProps = GlobalEventArticleProps & {
  id: number;
  createdAt: string;
  updatedAt: string;
  article: ArticleProps;
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
        toast.error("Ocorreu um erro ao buscar a revisão, tente novamente!", {
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
        <title>Revisão</title>
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
        <Flex></Flex>
      )}
    </LayoutSigned>
  );
};

export default authRoute(Reviews);
