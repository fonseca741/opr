import { Input, InputError } from "@/components/input";
import { LayoutSigned } from "@/components/layout";
import authRoute from "@/utils/auth";
import { base64toBlob } from "@/utils/base-64";
import {
  Box,
  Button,
  Divider,
  Flex,
  Text,
  Textarea,
  useBoolean,
} from "@chakra-ui/react";
import {
  EventProps,
  ArticleProps as GlobalArticleProps,
  ArticleReviewerProps as GlobalArticleReviewerProps,
  UserProps,
} from "common/types";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import fetchData from "utils/fetch";

type ArticleReviewerProps = GlobalArticleReviewerProps & {
  reviewer: UserProps;
  articleReview: GlobalArticleProps[];
};

type ArticleProps = GlobalArticleProps & {
  creator: UserProps;
  event: EventProps;
  // articleReviewer: ArticleReviewerProps[];
};

type Inputs = {
  comments: string;
};

const ReviewArticle = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();
  const router = useRouter();
  const [isLoading, setIsLoading] = useBoolean(true);
  const [article, setArticle] = useState<ArticleProps>();
  const [acceptedFilesManager, setAcceptedFilesManager] = useState<File[]>([]);
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    accept: "application/pdf",
  });

  useEffect(() => {
    (async () => {
      const id = router.query.id as string;
      if (id && id.split("-")[0]) {
        try {
          const apiResponse = await fetchData(
            "GET",
            `article/${id.split("-")[0]}`
          );

          setArticle(apiResponse);
        } catch (error) {
          toast.error(
            "Ocorreu um erro ao buscar o artefato, tente novamente!",
            {
              autoClose: 5000,
            }
          );
        } finally {
          setIsLoading.off();
        }
      }
    })();
  }, [router.query.id, setIsLoading]);

  useEffect(() => {
    setAcceptedFilesManager(acceptedFiles);
  }, [acceptedFiles, acceptedFiles.length]);

  const handlePrintPdf = () => {
    const url = base64toBlob(article?.file as string);
    window.open(URL.createObjectURL(url));
  };

  const handleDonwloadPdf = () => {
    const url = window.URL.createObjectURL(
      base64toBlob(article?.file as string)
    );
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${article?.name}.pdf`);
    document.body.appendChild(link);
    link.click();
  };

  const onSubmit = async (data: Inputs) => {
    if (!acceptedFilesManager.length) {
      toast.error("É necessário enviar o artefato revisado!", {
        autoClose: 5000,
      });

      return;
    }

    const id = router.query.id as string;

    try {
      let reader = new FileReader();
      reader.readAsDataURL(acceptedFilesManager[0]);

      reader.onload = async () => {
        const fileResult = reader.result as string;

        await fetchData("POST", "article-review/review", {
          file: fileResult.replace("data:application/pdf;base64,", ""),
          articleId: Number(id.split("-")[0]),
          reviewerId: Number(id.split("-")[1]),
          originalFile: article?.file,
          discussion: {
            value: data.comments || "",
            isReviewer: true,
          },
        });

        toast.success("Revisão submetida com sucesso!", {
          autoClose: 5000,
        });

        router.push("/review");
      };
    } catch {
      toast.error(
        "Ocorreu um erro ao enviar o artefato revisado, tente novamente!",
        {
          autoClose: 5000,
        }
      );
    }
  };

  return (
    <LayoutSigned>
      <Head>
        <title>Artefato</title>
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
          width="full"
          padding="1rem"
          direction="column"
          onSubmit={handleSubmit(onSubmit)}
        >
          <Flex align="flex-start" direction="column">
            <Text
              width="100%"
              textAlign="center"
              margin="1rem 0 3rem 0"
              fontSize="1.5rem"
              fontWeight="bold"
            >
              Dados do artefato
            </Text>

            <Flex justify="flex-start" wrap="wrap" w="100%" mb="0.3125rem">
              <Flex
                flex={1}
                direction="column"
                mr={{ base: "0", sm: "1rem" }}
                minW="13.75rem"
              >
                <Input
                  name="title"
                  label="Títutlo"
                  _focusVisible={{ borderColor: "primary.100" }}
                  defaultValue={article?.name}
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
                  name="event_name"
                  label="Evento submetido"
                  defaultValue={article?.event?.name}
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
                  name="name"
                  label="Autor do artigo"
                  _focusVisible={{ borderColor: "primary.100" }}
                  defaultValue={article?.creator?.name}
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
                  Descrição do artefato
                </Text>
                <Textarea
                  resize="none"
                  _focusVisible={{ borderColor: "primary.100" }}
                  defaultValue={article?.description}
                  readOnly
                  disabled
                />
              </Flex>
            </Flex>

            <Flex justify="flex-start" wrap="wrap" w="100%" mt="1rem">
              <Flex
                flex={1}
                direction="column"
                mr={{ base: "0", sm: "1rem" }}
                minW="13.75rem"
              >
                <Button
                  marginBottom="10px"
                  variant="primary"
                  title="Visualizar artigo"
                  onClick={handlePrintPdf}
                >
                  Visualizar artefato
                </Button>
              </Flex>

              <Flex
                flex={1}
                direction="column"
                mr={{ base: "0", sm: "1rem" }}
                minW="13.75rem"
              >
                <Button
                  variant="primary"
                  title="Baixar artigo"
                  onClick={handleDonwloadPdf}
                >
                  Baixar artefato
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
              Adicionar revisão
            </Text>

            <Flex justify="flex-start" wrap="wrap" w="100%" mb="1rem">
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
                  defaultValue={
                    article?.event.creatorInfos.length === 0
                      ? "Não há observações para revisores"
                      : article?.event.creatorInfos
                  }
                  readOnly
                  disabled
                />
              </Flex>
            </Flex>

            <Flex
              flexDir="column"
              justify="flex-start"
              wrap="wrap"
              w="100%"
              mb="0.3125rem"
            >
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
                  Comentários sobre o artefato
                </Text>
                <Textarea
                  resize="none"
                  placeholder="Digite comentários pontuais sobre o artefato"
                  _focusVisible={{ borderColor: "primary.100" }}
                  {...register("comments")}
                />
                {errors.comments?.message ? (
                  <InputError>{errors.comments?.message}</InputError>
                ) : (
                  <Box h="1.625rem" />
                )}
              </Flex>

              <Text
                fontSize="sm"
                mb="2px"
                alignItems="start"
                color="neutral.500"
              >
                Artefato com demarcações
              </Text>
              <Flex
                {...getRootProps({ className: "dropzone" })}
                minHeight="5rem"
                borderStyle="dashed"
                _hover={{ cursor: "pointer" }}
                borderWidth="1px"
                borderRadius="lg"
                justify="center"
                align="center"
                mb="1rem"
              >
                <input {...getInputProps()} />
                <Text color="neutral.500">
                  {acceptedFilesManager.length === 0
                    ? "Arraste e solte o PDF aqui, ou clique para selecioná-lo"
                    : `Arquivo "${acceptedFilesManager[0].name}" selecionado com sucesso :)`}
                </Text>
              </Flex>
            </Flex>

            <Flex
              w="100%"
              px="1rem"
              align="center"
              justify="flex-end"
              alignItems="center"
              mt="1rem"
            >
              <Button
                h="3.25rem"
                type="submit"
                disabled={isLoading}
                isLoading={isLoading}
                variant="primary"
                title="Adicionar revisão"
              >
                Adicionar revisão
              </Button>
            </Flex>
          </Flex>
        </Flex>
      )}
    </LayoutSigned>
  );
};

export default authRoute(ReviewArticle);
