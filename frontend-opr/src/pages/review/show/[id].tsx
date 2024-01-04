import { LayoutSigned } from "@/components/layout";
import authRoute from "@/utils/auth";
import { base64toBlob } from "@/utils/base-64";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  Input,
  Text,
  useBoolean,
} from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAuth } from "context";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import fetchData from "utils/fetch";
import { object, string } from "yup";

type PageInfo = {
  article: {
    name: string;
    author: {
      name: string;
      id: number;
    };
    submitionDate: string;
    file: string;
  };
  review: {
    reviewer: {
      name: string;
      id: number;
    };
    id: number;
    date: string;
    file: string;
  };
  event: {
    chairs: number[];
  };
};

type Discussion = {
  value: string;
  createdAt: string;
  isReviewer: boolean;
};

type Inputs = {
  comment: string;
};

const commentSchema = object({
  comment: string()
    .required("O compo é obrigatório")
    .min(50, "O comentário deve conter no mínimo 50 caracteres."),
});

const LoadReviewById = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useBoolean(true);
  const [pageInfo, setPageInfo] = useState<PageInfo>();
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<Inputs>({
    resolver: yupResolver(commentSchema),
  });

  useEffect(() => {
    (async () => {
      if (router.query.id) {
        try {
          const pageParams = router.query.id as string;
          const articleId = pageParams.split("-")[0];
          const reviewId = pageParams.split("-")[1];

          const apiResponse = await fetchData("GET", `article/${articleId}`);

          let review: any = {};
          let reviewer: any = {};

          apiResponse.articleReviewer.forEach((reviewerIt: any) => {
            let finded = false;
            reviewerIt.articleReview.forEach((reviewIt: any) => {
              if (reviewIt.id == reviewId) {
                review = reviewIt;
                finded = true;
                return;
              }
            });
            if (finded) {
              reviewer = reviewerIt;
              return;
            }
          });

          const pageInfo = {
            article: {
              author: {
                name: apiResponse.creator.name,
                id: apiResponse.creator.id,
              },
              name: apiResponse.name,
              submitionDate: apiResponse.createdAt,
              file: apiResponse.file,
            },
            review: {
              reviewer: {
                name: reviewer.reviewer.name,
                id: reviewer.reviewer.id,
              },
              id: review.id,
              date: reviewer.createdAt,
              file: review.file,
            },
            event: {
              chairs: apiResponse.event.eventChairs.map(
                (eventChair: any) => eventChair.chair_id
              ),
            },
          };

          setDiscussions(review.articleDiscussions);
          setPageInfo(pageInfo);
        } catch (error) {
          toast.error("Ocorreu um erro ao buscar a revisão, tente novamente!", {
            autoClose: 5000,
          });
        } finally {
          setIsLoading.off();
        }
      }
    })();
  }, [router.query.id, setIsLoading]);

  const handleReviewerPdf = (file: string) => {
    const url = base64toBlob(file);
    window.open(URL.createObjectURL(url));
  };

  const onSubmit = async (data: Inputs) => {
    console.log(data);

    try {
      const response = await fetchData("POST", "article-review-discussion", {
        value: data.comment,
        isReviewer: user.role !== "author",
        articleReviewId: pageInfo?.review.id,
      });

      console.log(response);
      setDiscussions([...discussions, response]);
      reset();

      toast.success("Comentário adicionado!", {
        autoClose: 5000,
      });
    } catch {
      toast.error(
        "Ocorreu um erro ao enviar comentário, tente novamente mais tarde.",
        { autoClose: 5000 }
      );
    }
  };

  const canComment = () => {
    return (
      user.id === pageInfo?.review.reviewer.id ||
      user.id === pageInfo?.article.author.id ||
      pageInfo?.event.chairs.includes(user.id)
    );
  };

  return (
    <LayoutSigned>
      <Head>
        <title>Visualizar revisão</title>
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
        <Flex direction="column" w="full">
          <Flex
            justify="space-between"
            align="center"
            direction={{ base: "column", md: "row" }}
          >
            <Flex direction="column">
              <Flex>
                <Text fontWeight="bold" marginRight="5px">
                  Titulo do artigo:
                </Text>
                <Text>{pageInfo?.article.name}</Text>
              </Flex>
              <Flex>
                <Text fontWeight="bold" marginRight="5px">
                  Autor:
                </Text>
                <Text>{pageInfo?.article.author.name}</Text>
              </Flex>
              <Flex>
                <Text fontWeight="bold" marginRight="5px">
                  Data da submissão:
                </Text>
                <Text>{pageInfo?.article.submitionDate.split("T")[0]}</Text>
              </Flex>
              <Flex>
                <Text fontWeight="bold" marginRight="5px">
                  Revisor:
                </Text>
                <Text>{pageInfo?.review.reviewer.name}</Text>
              </Flex>
              <Flex>
                <Text fontWeight="bold" marginRight="5px">
                  Data da revisão:
                </Text>
                <Text>{pageInfo?.review.date.split("T")[0]}</Text>
              </Flex>
            </Flex>

            <Flex direction="column">
              <Button
                variant="primary"
                marginBottom="20px"
                onClick={() => handleReviewerPdf(pageInfo!.article.file)}
                disabled={!pageInfo!.article.file}
              >
                Visualizar artigo
              </Button>
              <Button
                variant="primary"
                onClick={() => handleReviewerPdf(pageInfo!.review.file)}
                disabled={!pageInfo!.review.file}
              >
                Visualizar artigo revisado
              </Button>
            </Flex>
          </Flex>

          <Text marginTop="15px" fontWeight="bold">
            Discussão:
          </Text>
          <Flex
            border="1px solid #eaeaea"
            height="63vh"
            borderRadius={6}
            padding={3}
            direction="column"
            overflow="auto"
          >
            {discussions.map((comment, index) => {
              return (
                <Flex key={index} direction="column" mb="20px">
                  <Flex>
                    <Text fontSize="14px" fontWeight="600" marginX="5px">
                      {comment.isReviewer ? "Revisor:" : "Autor:"}
                    </Text>
                    <Text fontSize="14px" marginRight="60px">
                      {comment.isReviewer
                        ? pageInfo?.review.reviewer.name
                        : pageInfo?.article.author.name}
                    </Text>
                    <Text fontSize="14px" fontWeight="600" marginRight="5px">
                      Data:
                    </Text>
                    <Text fontSize="14px">
                      {`${comment.createdAt.split("T")[0]}, ${comment.createdAt
                        .split("T")[1]
                        .split(":")
                        .slice(0, 2)
                        .join(":")}`}
                    </Text>
                  </Flex>
                  <Box
                    backgroundColor={comment.isReviewer ? "#ffea7f" : "#fff7d4"}
                    borderRadius={6}
                    padding={2}
                  >
                    <Text>{comment.value}</Text>
                  </Box>
                </Flex>
              );
            })}
          </Flex>
          <Flex mt="20px" as="form" onSubmit={handleSubmit(onSubmit)}>
            <FormControl
              isInvalid={typeof errors.comment?.message === "string"}
            >
              <Input
                _focusVisible={{ borderColor: "primary.100" }}
                placeholder="Adicionar comentário"
                {...register("comment")}
                id="comment"
                isDisabled={!canComment()}
              />
              <FormErrorMessage>{errors.comment?.message}</FormErrorMessage>
            </FormControl>
            <Button
              isDisabled={!canComment()}
              type="submit"
              variant="primary"
              ml="10px"
              isLoading={isSubmitting}
            >
              Comentar
            </Button>
          </Flex>
        </Flex>
      )}
    </LayoutSigned>
  );
};

export default authRoute(LoadReviewById);
