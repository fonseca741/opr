import { Input, InputError } from "@/components/input";
import { LayoutSigned } from "@/components/layout";
import authRoute from "@/utils/auth";
import {
  Box,
  Button,
  Flex,
  Text,
  Textarea,
  useBoolean,
} from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { UserProps } from "common/types/user";
import { useAuth } from "context";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import Select from "react-select";
import { toast } from "react-toastify";
import fetchData from "utils/fetch";
import * as yup from "yup";
import { EventProps } from "../[id]";

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

const formatOptions = (array: UserProps[]) => {
  return array.map((user) => ({
    value: user.id.toString(),
    label: `${user.name} - ${user.email}`,
  }));
};

const EditEvent = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useBoolean(false);
  const [reviewers, setReviewers] = useState<SelectProps[]>([]);
  const [users, setUsers] = useState<SelectProps[]>([]);
  const [selectedReviewers, setSelectedReviewers] = useState<SelectProps[]>();
  const [selectedChairs, setSelectedChairs] = useState<SelectProps[]>();
  const [event, setEvent] = useState<EventProps>();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<Inputs>({
    mode: "onSubmit",
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    (async () => {
      if (router.query.id) {
        try {
          const apiResponse: EventProps = await fetchData(
            "GET",
            `event/${router.query.id}`
          );
          const reviewersResponse = await fetchData(
            "GET",
            "user/role/reviewer"
          );
          const usersResponse = await fetchData("GET", "user");
          const formattedResponse = formatOptions(reviewersResponse);
          const formattedResponseUsers = formatOptions(usersResponse);
          setReviewers(formattedResponse);
          setUsers(formattedResponseUsers);
          setEvent(apiResponse);
          const reviewers = apiResponse.eventReviewers.map((er) => er.reviewer);
          const chairs = apiResponse.eventChairs.map((ed: any) => ed.chair);
          setSelectedReviewers(formatOptions(reviewers));
          setSelectedChairs(formatOptions(chairs));

          setValue("name", apiResponse.name);
          setValue("initial_date", apiResponse.startDate.split("T")[0]);
          setValue("final_date", apiResponse.endDate.split("T")[0]);
          setValue("description", apiResponse.description);
          setValue("questions", apiResponse.creatorInfos);
        } catch (error) {
          console.log(error);
          toast.error(
            "Ocorreu um erro ao carregar os dados do evento, tente novamente!",
            {
              autoClose: 5000,
            }
          );
        } finally {
          setIsLoading.off();
        }
      }
    })();
  }, [router.query.id]);

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      const formattedReviewers = selectedReviewers!.flat(Infinity);
      const formattedChairs = selectedChairs!.flat(Infinity);

      if (formattedReviewers.length === 0) {
        toast.error("Selecione ao menos um revisor!", {
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
      await fetchData("PUT", "event", {
        id: event?.id,
        name: data.name,
        description: data.description,
        startDate: data.initial_date,
        endDate: data.final_date,
        reviewers: formattedReviewers.map((reviewer) => reviewer.value),
        chairs: formattedChairs.map((chair) => chair.value),
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
                _focusVisible={{ borderColor: "primary.100" }}
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
                _focusVisible={{ borderColor: "primary.100" }}
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
                _focusVisible={{ borderColor: "primary.100" }}
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
              _focusVisible={{ borderColor: "primary.100" }}
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

            {selectedReviewers && (
              <Select
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
                defaultValue={selectedReviewers}
                isMulti
                onChange={(value) => {
                  setSelectedReviewers(value as SelectProps[]);
                }}
                options={reviewers}
                placeholder="Selecione os revisores"
                noOptionsMessage={() => "Nenhum revisor cadastrado"}
              />
            )}

            {!selectedReviewers || selectedReviewers.length === 0 ? (
              <InputError>Selecione ao menos 1 revisor</InputError>
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
              Chairs do evento
            </Text>

            {selectedChairs && (
              <Select
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
                defaultValue={selectedChairs}
                isMulti
                onChange={(value) => {
                  setSelectedChairs(value as SelectProps[]);
                }}
                options={users}
                placeholder="Selecione os chairs"
              />
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
            title="Salvar"
          >
            Salvar evento
          </Button>
        </Flex>
      </Flex>
    </LayoutSigned>
  );
};

export default authRoute(EditEvent);
