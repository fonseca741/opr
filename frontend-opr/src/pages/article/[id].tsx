import { Input } from "@/components/input";
import { LayoutSigned } from "@/components/layout";
import authRoute from "@/utils/auth";
import { base64toBlob } from "@/utils/base-64";
import {
  Button,
  Divider,
  Flex,
  Text,
  Textarea,
  useBoolean,
} from "@chakra-ui/react";
import {
  ArticleReviewProps,
  EventProps,
  ArticleProps as GlobalArticleProps,
  ArticleReviewerProps as GlobalArticleReviewerProps,
  UserProps,
} from "common/types";
import { useAuth } from "context";
import Head from "next/head";
import Router, { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "react-toastify";
import fetchData from "utils/fetch";

type ArticleReviewerProps = GlobalArticleReviewerProps & {
  reviewer: UserProps;
  articleReview: ArticleReviewProps[];
};

type ArticleProps = GlobalArticleProps & {
  creator: UserProps;
  event: EventProps;
  articleReviewer: ArticleReviewerProps[];
};

type FormattedArticleReviewProps = ArticleReviewProps & {
  reviewerName: string;
};

const LoadArticleById = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useBoolean(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [article, setArticle] = useState<ArticleProps>();
  const [articleReviews, setArticleReviews] = useState<
    FormattedArticleReviewProps[]
  >([]);
  const [acceptedFilesManager, setAcceptedFilesManager] = useState<File[]>([]);
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    accept: "application/pdf",
  });

  useEffect(() => {
    setAcceptedFilesManager(acceptedFiles);
  }, [acceptedFiles, acceptedFiles.length]);

  useEffect(() => {
    (async () => {
      if (router.query.id) {
        try {
          const apiResponse = await fetchData(
            "GET",
            `article/${router.query.id}`
          );

          const apiArticleReviews = apiResponse.articleReviewer.map(
            (articleReview: ArticleReviewerProps) => {
              const reviewerName = articleReview.reviewer.name;

              return {
                articleReview: articleReview.articleReview.map((review) => ({
                  reviewerName,
                  articleDiscussions: review.articleDiscussions,
                  file: review.file,
                  createdAt: review.createdAt,
                  id: review.id,
                  originalFile: review.originalFile,
                })),
              };
            }
          );

          const formattedReviews = apiArticleReviews
            .map((review: ArticleReviewerProps) => review.articleReview)
            .flat(Infinity);

          setArticle(apiResponse);
          setArticleReviews(formattedReviews);
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

  const handleReviewerPdf = (file: string) => {
    const url = base64toBlob(file);
    window.open(URL.createObjectURL(url));
  };

  const handleUpdateArticle = async () => {
    try {
      if (!acceptedFilesManager[0]) {
        toast.error("O arquivo é obrigatório para atualização!", {
          autoClose: 5000,
        });
        return;
      }
      setIsUpdating(true);

      let reader = new FileReader();
      reader.readAsDataURL(acceptedFilesManager[0]);

      reader.onload = async () => {
        const fileResult = reader.result as string;

        await fetchData("PUT", `article/${article?.id}`, {
          file: fileResult.replace("data:application/pdf;base64,", ""),
          authorId: user.id,
        });

        toast.success("Artefato atualizado com sucesso!", {
          autoClose: 5000,
        });

        setIsUpdating(false);
        Router.reload();
      };
    } catch {
      setIsUpdating(false);
      toast.error("Ocorreu ao atualizar o artefato, tente novamente!", {
        autoClose: 5000,
      });
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
        <Flex as="form" direction="column" w="full">
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

            {article?.creator?.id === user.id && (
              <>
                <Text
                  fontSize="sm"
                  mb="2px"
                  mt="1rem"
                  alignItems="start"
                  color="neutral.500"
                >
                  Nova submissão de artefato
                </Text>
                <Flex justify="flex-start" wrap="wrap" w="100%" mb="0.3125rem">
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
                    w="100%"
                  >
                    <input {...getInputProps()} />
                    <Text color="neutral.500">
                      {acceptedFilesManager.length === 0
                        ? "Arraste e solte o artefato em PDF aqui, ou clique para selecioná-lo"
                        : `Arquivo "${acceptedFilesManager[0].name}" selecionado com sucesso :)`}
                    </Text>
                  </Flex>
                </Flex>
              </>
            )}

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
                  marginBottom="10px"
                  variant="primary"
                  title="Baixar artigo"
                  onClick={handleDonwloadPdf}
                >
                  Baixar artefato
                </Button>
              </Flex>

              {user.id === article?.creator?.id && (
                <Flex
                  flex={1}
                  direction="column"
                  mr={{ base: "0", sm: "1rem" }}
                  minW="13.75rem"
                >
                  <Button
                    variant="primary"
                    title="Atualizar artigo"
                    onClick={handleUpdateArticle}
                    isLoading={isUpdating}
                  >
                    Atualizar artefato
                  </Button>
                </Flex>
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
              Autor do artefato
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
                  defaultValue={article?.creator?.name}
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
                  defaultValue={article?.creator?.email}
                  _focusVisible={{ borderColor: "primary.100" }}
                  readOnly
                  disabled
                />
              </Flex>
            </Flex>

            <Divider mt="1rem" />

            <Text
              width="100%"
              textAlign="center"
              margin="1rem 0 3rem 0"
              fontSize="1.5rem"
              fontWeight="bold"
            >
              Revisores do artefato
            </Text>

            <Flex justify="flex-start" wrap="wrap" w="100%" mb="0.3125rem">
              {article?.articleReviewer?.length ? (
                article?.articleReviewer.map((reviewer) => (
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
                        name="e-mail"
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
                  Nenhum revisor para o artefato :(
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
              Revisões do artefato
            </Text>

            <Flex justify="flex-start" wrap="wrap" w="100%" mb="0.3125rem">
              {articleReviews.length ? (
                articleReviews
                  .sort((first, second) => second.id - first.id)
                  .map((reviewer) => (
                    <Flex
                      justify="space-between"
                      wrap="wrap"
                      w="100%"
                      mb="0.3125rem"
                      key={reviewer.id}
                      min-height="8rem"
                    >
                      <Flex wrap="wrap" flex={1}>
                        <Flex
                          flex={0.2}
                          wrap="wrap"
                          direction="column"
                          mr={{ base: "0", sm: "1rem" }}
                          minW="13.75rem"
                        >
                          <Input
                            name="name"
                            label="Revisor"
                            _focusVisible={{ borderColor: "primary.100" }}
                            defaultValue={reviewer.reviewerName}
                            readOnly
                            disabled
                          />
                        </Flex>

                        <Flex
                          flex={0.2}
                          wrap="wrap"
                          direction="column"
                          mr={{ base: "0", sm: "1rem" }}
                          minW="13.75rem"
                        >
                          <Input
                            name="date"
                            label="Data da revisão"
                            _focusVisible={{ borderColor: "primary.100" }}
                            defaultValue={reviewer.createdAt.split("T")[0]}
                            readOnly
                            disabled
                          />
                        </Flex>

                        <Flex
                          flex={0.6}
                          direction="column"
                          mr={{ base: "0", sm: "1rem" }}
                          minW="13.75rem"
                        >
                          <Input
                            name="comments"
                            label="Preview da revisão"
                            defaultValue={
                              reviewer?.articleDiscussions[0]?.value
                            }
                            _focusVisible={{ borderColor: "primary.100" }}
                            disabled
                            readOnly
                          />
                        </Flex>
                      </Flex>

                      <Flex wrap="wrap">
                        <Flex
                          flex={0.1}
                          direction="column"
                          mr={{ base: "0", sm: "1rem" }}
                          minW="13.75rem"
                          alignItems="center"
                          justifyContent="center"
                        >
                          <Button
                            variant="primary"
                            title="Visualizar revisão"
                            onClick={() =>
                              router.push(
                                `/review/show/${router.query.id}-${reviewer.id}`
                              )
                            }
                            disabled={!reviewer.file}
                            marginBottom="20px"
                          >
                            Acessar revisão
                          </Button>
                        </Flex>
                      </Flex>
                    </Flex>
                  ))
              ) : (
                <Text textAlign="center" width="100%" color="#696969">
                  Nenhuma revisão recebida :(
                </Text>
              )}
            </Flex>
          </Flex>
        </Flex>
      )}
    </LayoutSigned>
  );
};

export default authRoute(LoadArticleById);
