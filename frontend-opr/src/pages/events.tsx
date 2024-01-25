import { LayoutSigned } from "@/components/layout";
import authRoute from "@/utils/auth";
import { Box, Button, Flex, Text, useBoolean } from "@chakra-ui/react";
import { EventProps } from "common/types/event";
import { useAuth } from "context";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { AiOutlineClockCircle } from "react-icons/ai";
import { FiUser } from "react-icons/fi";
import { GrDocumentText, GrUserAdmin } from "react-icons/gr";
import { MdOutlineEventAvailable, MdOutlineEventBusy } from "react-icons/md";
import { toast } from "react-toastify";
import fetchData from "utils/fetch";
import { formattStringToDots } from "../utils";

const Event = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [events, setEvents] = useState<EventProps[]>([]);
  const [loading, setLoading] = useBoolean(true);

  useEffect(() => {
    (async () => {
      try {
        const apiResponse = await fetchData("GET", "event");
        setEvents(apiResponse);
      } catch (error) {
        toast.error("Ocorreu um erro ao buscar os eventos, tente novamente!", {
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
        <title>Eventos</title>
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
        <Flex flexDirection="column" align="center">
          {["admin", "publisher"].includes(user.role) && (
            <Button
              style={{
                color: "#000",
                marginBottom: "1rem",
                marginTop: "1rem",
              }}
              bgColor="primary.100"
              _hover={{ backgroundColor: "primary.200" }}
              title="Criar evento"
              onClick={() => router.replace("create-event")}
            >
              Criar evento
            </Button>
          )}
          <Flex
            alignItems="center"
            justifyContent="center"
            wrap={{ base: "wrap" }}
          >
            {events.length >= 1 ? (
              events.map((event) => (
                <Box
                  key={event.id}
                  width={{ base: "300px", md: "400px" }}
                  color="#000"
                  margin="1.5rem"
                  height={{ base: "auto", md: "min-content" }}
                  borderRadius="4px"
                  padding="1rem"
                  _hover={{ border: "1px solid #FFD000" }}
                  boxShadow="0px 0px 10px rgba(0, 0, 0, 0.2)"
                  cursor="pointer"
                  onClick={() => router.push(`event/${event.id}`)}
                  fontSize="14px"
                >
                  <Flex justifyContent="space-between">
                    <Flex
                      width="300px"
                      padding={2}
                      height="60px"
                      backgroundColor="primary.100"
                      marginTop={{ base: "-16px", md: "-25px" }}
                      marginLeft={{ base: "-16px", md: "-35px" }}
                      borderRadius="4px"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Text
                        fontWeight="bold"
                        color="#000"
                        fontSize="13"
                        marginRight="10px"
                      >
                        {formattStringToDots(event.name.toUpperCase(), 105)}
                      </Text>
                    </Flex>

                    <Text
                      display={
                        new Date(event!.endDate) < new Date() ? "flex" : "none"
                      }
                      color="red"
                      fontSize="25px"
                      fontWeight="bold"
                      title="Evento encerrado"
                    >
                      <MdOutlineEventBusy />
                    </Text>
                  </Flex>

                  <Flex my="5px">
                    <Text
                      fontSize="15px"
                      fontWeight="bold"
                      marginTop="2px"
                      marginRight="2px"
                      title="Descrição"
                    >
                      <GrDocumentText />
                    </Text>
                    <Text fontWeight="bold" mr="5px">
                      Descrição:
                    </Text>

                    <Text>{formattStringToDots(event.description, 80)}</Text>
                  </Flex>

                  <Flex my="5px">
                    <Text
                      fontSize="20px"
                      fontWeight="bold"
                      marginTop="2px"
                      marginRight="2px"
                      title="Descrição"
                    >
                      <FiUser />
                    </Text>
                    <Text fontWeight="bold" mr="5px">
                      Editor(a):
                    </Text>

                    <Text>{event.creator.name}</Text>
                  </Flex>

                  <Flex my="5px">
                    <Text
                      fontSize="18px"
                      fontWeight="bold"
                      marginX="2px"
                      marginRight="2px"
                      title="Descrição"
                    >
                      <GrUserAdmin />
                    </Text>
                    <Text fontWeight="bold" mr="5px">
                      Chairs:
                    </Text>

                    <Text>
                      {event.eventChairs
                        .map((ec: any) => ec.chair.name)
                        .join(", ")}
                    </Text>
                  </Flex>

                  <Flex my="5px">
                    <Text
                      fontSize="20px"
                      fontWeight="bold"
                      marginTop="2px"
                      marginRight="2px"
                      title="Data de inicio"
                    >
                      <MdOutlineEventAvailable />
                    </Text>
                    <Text fontWeight="bold" mr="5px">
                      Data de inicio:
                    </Text>

                    <Text>{event.startDate.split("T")[0]}</Text>
                  </Flex>

                  <Flex
                    my="5px"
                    color={
                      new Date(event!.endDate) < new Date() ? "red" : "black"
                    }
                  >
                    <Text
                      fontSize="20px"
                      fontWeight="bold"
                      marginTop="2px"
                      marginRight="2px"
                      title="Data de encerramento"
                    >
                      <MdOutlineEventBusy />
                    </Text>
                    <Text fontWeight="bold" mr="5px">
                      Data de encerramento:
                    </Text>

                    <Text>{event.endDate.split("T")[0]}</Text>
                  </Flex>

                  <Flex my="5px">
                    <Text
                      fontSize="20px"
                      fontWeight="bold"
                      marginTop="2px"
                      marginRight="2px"
                      title="Atualizado em"
                    >
                      <AiOutlineClockCircle />
                    </Text>
                    <Text fontWeight="bold" mr="5px">
                      Atualizado em:
                    </Text>

                    <Text>{event.updatedAt.split("T")[0]}</Text>
                  </Flex>
                </Box>
              ))
            ) : (
              <Text marginTop="20px" color="#696969">
                Nenhum evento cadastrado :(
              </Text>
            )}
          </Flex>
        </Flex>
      )}
    </LayoutSigned>
  );
};

export default authRoute(Event);
