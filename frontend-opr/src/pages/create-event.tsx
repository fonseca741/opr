import Head from "next/head";
import { LayoutSigned } from "@/components/layout";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import * as yup from "yup";
import {
  Flex,
  Button,
  useBoolean,
  Text,
  Textarea,
  Box,
} from "@chakra-ui/react";
import { Input, InputError } from "@/components/input";
import authRoute from "@/utils/auth";
import { useAuth } from "context";
import fetchData from "utils/fetch";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/router";
import Select from "react-select";
import { useEffect, useState } from "react";
import { UserProps } from "common/types/user";

const schema = yup.object().shape({
  name: yup.string().required("Nome é obrigatório"),
  initial_date: yup.string().required("Data inicial é obrigatório"),
  final_date: yup.string().required("Data final é obrigatório"),
  description: yup.string().required("Descrição é obrigatório"),
});

type Inputs = {
  name: string;
  initial_date: string;
  final_date: string;
  description: string;
  questions: string;
};

type SelectProps = {
  value: string;
  label: string;
};

const CreateEvent = () => {
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
  const [isLoading, setIsLoading] = useBoolean(false);
  const [reviewers, setReviewers] = useState<SelectProps[]>([]);
  const [selectedReviewers, setSelectedReviewers] = useState<SelectProps[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const apiResponse = await fetchData("GET", "user/role/reviewer");
        const formattedResponse = apiResponse.map((reviewer: UserProps) => ({
          value: reviewer.id,
          label: `${reviewer.name} - ${reviewer.email}`,
        }));
        setReviewers(formattedResponse);
      } catch (error) {
        toast.error(
          "Ocorreu um erro ao buscar os revisores, tente novamente!",
          {
            autoClose: 5000,
          }
        );
      }
    })();
  }, []);

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      const formattedReviewers = selectedReviewers.flat(Infinity);

      if (formattedReviewers.length === 0) {
        toast.error("Selecione ao menos um revisor!", {
          autoClose: 5000,
        });
        return;
      }

      if (
        data.initial_date <
        new Date()
          .toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" })
          .split("T")[0]
      ) {
        toast.error("Data inicial não pode ser menor que a data atual!", {
          autoClose: 5000,
        });
        return;
      }

      if (data.final_date < data.initial_date) {
        toast.error("Data final não pode ser menor que a data inicial!", {
          autoClose: 5000,
        });
        return;
      }

      setIsLoading.on();
      await fetchData("POST", "event", {
        creator: user.id,
        name: data.name,
        description: data.description,
        startDate: data.initial_date,
        endDate: data.final_date,
        reviewers: formattedReviewers.map((reviewer) => reviewer.value),
        creatorInfos: data.questions,
      });
      toast.success("Evento criado com sucesso!", {
        autoClose: 5000,
      });
      router.replace("/events");
    } catch {
      toast.error("Ocorreu ao criar um evento, tente novamente!", {
        autoClose: 5000,
      });
    } finally {
      setIsLoading.off();
    }
  };

  return (
    <LayoutSigned>
      <Head>
        <title>Criar evento</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>

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
            Dados do evento
          </Text>

          <Flex justify="flex-start" wrap="wrap" w="100%" mb="0.3125rem">
            <Flex
              flex={1}
              direction="column"
              mr={{ base: "0", sm: "1rem" }}
              minW="13.75rem"
            >
              <Input
                label="Nome"
                placeholder="Digite o nome do evento"
                _focusVisible={{ borderColor: "#FFD000" }}
                error={errors.name?.message}
                {...register("name")}
              />
            </Flex>

            <Flex
              flex={1}
              direction="column"
              mr={{ base: "0", sm: "1rem" }}
              minW="13.75rem"
            >
              <Input
                type="date"
                label="Data inicial"
                _focusVisible={{ borderColor: "#FFD000" }}
                error={errors.initial_date?.message}
                {...register("initial_date")}
              />
            </Flex>

            <Flex
              flex={1}
              direction="column"
              mr={{ base: "0", sm: "1rem" }}
              minW="13.75rem"
            >
              <Input
                type="date"
                label="Data final"
                _focusVisible={{ borderColor: "#FFD000" }}
                error={errors.final_date?.message}
                {...register("final_date")}
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
                Descrição do evento
              </Text>
              <Textarea
                resize="none"
                placeholder="Digite a descrição do evento"
                _focusVisible={{ borderColor: "#FFD000" }}
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

        <Flex justify="flex-start" wrap="wrap" w="100%" mb="0.3125rem">
          <Flex
            flex={1}
            direction="column"
            mr={{ base: "0", sm: "1rem" }}
            minW="13.75rem"
          >
            <Text fontSize="sm" mb="2px" alignItems="start" color="neutral.500">
              Observações para revisores
            </Text>
            <Textarea
              resize="none"
              placeholder="Digite perguntas padrões ou observações para os revisores do evento"
              _focusVisible={{ borderColor: "#FFD000" }}
              {...register("questions")}
            />
            {errors.questions?.message ? (
              <InputError>{errors.questions?.message}</InputError>
            ) : (
              <Box h="1.625rem" />
            )}
          </Flex>
        </Flex>

        <Flex justify="flex-start" wrap="wrap" w="100%" mb="0.3125rem">
          <Flex
            flex={1}
            direction="column"
            mr={{ base: "0", sm: "1rem" }}
            minW="13.75rem"
          >
            <Text fontSize="sm" mb="2px" alignItems="start" color="neutral.500">
              Revisores do evento
            </Text>

            <Select
              theme={(theme) => ({
                ...theme,
                borderRadius: 0,
                colors: {
                  ...theme.colors,
                  text: "orangered",
                  primary25: "#FFD000",
                  primary: "black",
                },
              })}
              defaultValue={selectedReviewers}
              isMulti
              onChange={(value) => {
                setSelectedReviewers(value as SelectProps[]);
              }}
              options={reviewers}
              placeholder="Selecione os revisores"
              noOptionsMessage={() => "Nenhum revisor cadastrado"}
            />

            {selectedReviewers.length === 0 ? (
              <InputError>Selecione ao menos 1 revisor</InputError>
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
            style={{ background: "#FFD000", color: "#000" }}
            title="Criar evento"
          >
            Criar evento
          </Button>
        </Flex>
      </Flex>
    </LayoutSigned>
  );
};

export default authRoute(CreateEvent);
