import { Input, InputError } from "@/components/input";
import { LayoutSigned } from "@/components/layout";
import authRoute from "@/utils/auth";
import fetchData from "@/utils/fetch";
import {
  Box,
  Button,
  Flex,
  Text,
  Textarea,
  useBoolean,
} from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { EventProps } from "common/types/event";
import { useAuth } from "context";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { SubmitHandler, useForm } from "react-hook-form";
import Select from "react-select";
import { toast } from "react-toastify";
import * as yup from "yup";

const schema = yup.object().shape({
  name: yup.string().required("Nome é obrigatório"),
  description: yup.string().required("Descrição é obrigatório"),
});

type Inputs = {
  name: string;
  description: string;
};

type SelectProps = {
  value: string;
  label: string;
};

const CreateArticle = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    mode: "onSubmit",
    resolver: yupResolver(schema),
  });
  const { user } = useAuth();
  const router = useRouter();
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    accept: "application/pdf",
  });
  const [isLoading, setIsLoading] = useBoolean(false);
  const [acceptedFilesManager, setAcceptedFilesManager] = useState<File[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<SelectProps>();
  const [events, setEvents] = useState<SelectProps[]>([]);

  useEffect(() => {
    const { id: eventId } = router.query;
    (async () => {
      try {
        const apiResponse = await fetchData("GET", "event");
        const formattedResponse = apiResponse
          .filter(
            (event: EventProps) =>
              event.endDate >= new Date().toISOString().split("T")[0]
          )
          .map((event: EventProps) => ({
            value: event.id,
            label: `${event.name} - [${event.startDate.split("T")[0]} | ${
              event.endDate.split("T")[0]
            }]`,
          }));
        setEvents(formattedResponse);

        if (eventId) {
          setSelectedEvent(
            formattedResponse.filter((event: any) => event.value == eventId)[0]
          );
        }
      } catch (error) {
        toast.error("Ocorreu um erro ao buscar os eventos, tente novamente!", {
          autoClose: 5000,
        });
      }
    })();
  }, [router.query]);

  useEffect(() => {
    setAcceptedFilesManager(acceptedFiles);
  }, [acceptedFiles, acceptedFiles.length]);

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      if (!acceptedFilesManager[0]) {
        toast.error("O arquivo é obrigatório!", {
          autoClose: 5000,
        });
        return;
      }

      if (!selectedEvent) {
        toast.error("O evento é obrigatório!", {
          autoClose: 5000,
        });
        return;
      }

      setIsLoading.on();

      let reader = new FileReader();
      reader.readAsDataURL(acceptedFilesManager[0]);

      reader.onload = async () => {
        const fileResult = reader.result as string;

        await fetchData("POST", "article", {
          creator: user.id,
          name: data.name,
          description: data.description,
          file: fileResult.replace("data:application/pdf;base64,", ""),
          event: selectedEvent.value,
        });

        toast.success("Artefato submetido com sucesso!", {
          autoClose: 5000,
        });
        setIsLoading.off();
        router.replace("/articles");
      };
    } catch {
      setIsLoading.off();
      toast.error("Ocorreu ao submeter o artefato, tente novamente!", {
        autoClose: 5000,
      });
    }
  };

  return (
    <LayoutSigned>
      <Head>
        <title>Submeter artefato</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>

      <Flex
        as="form"
        width={{ base: "100%", md: "80%" }}
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
                label="Nome*"
                placeholder="Digite o título do artefato"
                _focusVisible={{ borderColor: "primary.100" }}
                error={errors.name?.message}
                {...register("name")}
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
                Descrição do artefato*
              </Text>
              <Textarea
                resize="none"
                placeholder="Digite a descrição do artefato"
                _focusVisible={{ borderColor: "primary.100" }}
                {...register("description")}
              />
              {errors.description?.message ? (
                <InputError>{errors.description?.message}</InputError>
              ) : (
                <Box h="1.625rem" />
              )}
            </Flex>
          </Flex>
        </Flex>

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
              ? "Arraste e solte o artefato em PDF aqui, ou clique para selecioná-lo"
              : `Arquivo "${acceptedFilesManager[0].name}" selecionado com sucesso :)`}
          </Text>
        </Flex>

        <Flex justify="flex-start" wrap="wrap" w="100%" mb="0.3125rem">
          <Flex
            flex={1}
            direction="column"
            mr={{ base: "0", sm: "1rem" }}
            minW="13.75rem"
          >
            <Text fontSize="sm" mb="2px" alignItems="start" color="neutral.500">
              Evento*
            </Text>

            <Select
              key={selectedEvent ? selectedEvent.value : "no-event"}
              theme={(theme) => ({
                ...theme,
                borderRadius: 0,
                colors: {
                  ...theme.colors,
                  text: "orangered",
                  primary25: "primary.100",
                  primary: "black",
                },
              })}
              defaultValue={selectedEvent}
              onChange={(value) => {
                setSelectedEvent(value as SelectProps);
              }}
              options={events}
              placeholder="Selecione um evento"
              noOptionsMessage={() => "Nenhum evento cadastrado"}
            />

            {!selectedEvent ? (
              <InputError>Selecione um evento</InputError>
            ) : (
              <Box h="1.625rem" />
            )}
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
            title="Criar artigo"
          >
            Submeter
          </Button>
        </Flex>
      </Flex>
    </LayoutSigned>
  );
};

export default authRoute(CreateArticle);
