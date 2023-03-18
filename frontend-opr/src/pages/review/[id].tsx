import Head from "next/head";
import { LayoutSigned } from "@/components/layout";
import {
  Flex,
  useBoolean,
  Text,
  Textarea,
  Divider,
  Button,
  Box,
} from "@chakra-ui/react";
import { Input, InputError } from "@/components/input";
import authRoute from "@/utils/auth";
import fetchData from "utils/fetch";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { base64toBlob } from "@/utils/base-64";
import { useDropzone } from "react-dropzone";
import { useForm } from "react-hook-form";
import {
  EventProps,
  UserProps,
  ArticleProps as GlobalArticleProps,
  ArticleReviewerProps as GlobalArticleReviewerProps,
} from "common/types";

type ArticleReviewerProps = GlobalArticleReviewerProps & {
  reviewer: UserProps;
  articleReview: GlobalArticleProps[];
};

type ArticleProps = GlobalArticleProps & {
  creator: UserProps;
  event: EventProps;
  articleReviewer: ArticleReviewerProps[];
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
          toast.error("Ocorreu um erro ao buscar o artigo, tente novamente!", {
            autoClose: 5000,
          });
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
      toast.error("É necessário enviar o artigo revisado!", {
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
          comments: data.comments || "",
          file: fileResult.replace("data:application/pdf;base64,", ""),
          articleId: Number(id.split("-")[0]),
          reviewerId: Number(id.split("-")[1]),
          originalFile: article?.file,
        });

        toast.success("Revisão submetida com sucesso!", {
          autoClose: 5000,
        });

        router.push("/review");
      };
    } catch {
      toast.error(
        "Ocorreu um erro ao enviar o artigo revisado, tente novamente!",
        {
          autoClose: 5000,
        }
      );
    }
  };

  return (
    <LayoutSigned>
      <Head>
        <title>Artigo</title>
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
          width="80%"
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
              Dados do artigo
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
                  _focusVisible={{ borderColor: "#FFD000" }}
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
                  name="name"
                  label="Autor do artigo"
                  _focusVisible={{ borderColor: "#FFD000" }}
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
                  Descrição do artigo
                </Text>
                <Textarea
                  resize="none"
                  _focusVisible={{ borderColor: "#FFD000" }}
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
                  style={{ background: "#FFD000", color: "#000" }}
                  title="Visualizar artigo"
                  onClick={handlePrintPdf}
                >
                  Visualizar artigo
                </Button>
              </Flex>

              <Flex
                flex={1}
                direction="column"
                mr={{ base: "0", sm: "1rem" }}
                minW="13.75rem"
              >
                <Button
                  style={{ background: "#FFD000", color: "#000" }}
                  title="Baixar artigo"
                  onClick={handleDonwloadPdf}
                >
                  Baixar artigo
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
                  _focusVisible={{ borderColor: "#FFD000" }}
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
                  Comentários sobre o artigo
                </Text>
                <Textarea
                  resize="none"
                  placeholder="Digite comentários pontuais sobre o artigo"
                  _focusVisible={{ borderColor: "#FFD000" }}
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
                Artigo com demarcações
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
                    ? "Arraste e solte o artigo em PDF aqui, ou clique para selecioná-lo"
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
                style={{ background: "#FFD000", color: "#000" }}
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
