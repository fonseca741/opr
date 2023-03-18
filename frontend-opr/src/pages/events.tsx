import Head from "next/head";
import { LayoutSigned } from "@/components/layout";
import fetchData from "utils/fetch";
import { useEffect, useState } from "react";
import { Box, Button, Flex, Text, useBoolean } from "@chakra-ui/react";
import { formattStringToDots } from "../utils";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { useAuth } from "context";
import authRoute from "@/utils/auth";
import { EventProps } from "common/types/event";
import { AiOutlineClockCircle } from "react-icons/ai";
import { GrDocumentText } from "react-icons/gr";
import { MdOutlineEventAvailable, MdOutlineEventBusy } from "react-icons/md";

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
        <Flex flexDirection="column" align="center" justify="center">
          {["admin", "publisher"].includes(user.role) && (
            <Button
              style={{
                background: "#FFD000",
                color: "#000",
                marginBottom: "1rem",
                marginTop: "1rem",
              }}
              title="Criar evento"
              onClick={() => router.replace("create-event")}
            >
              Criar evento
            </Button>
          )}
          <Flex
            minWidth="600px"
            alignItems="center"
            justifyContent="center"
            wrap={{ base: "wrap" }}
          >
            {events.length >= 1 ? (
              events.map((event) => (
                <Box
                  key={event.id}
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
                      {formattStringToDots(event.name.toUpperCase(), 22)}
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
                      {formattStringToDots(event.description, 30)}
                    </Text>
                  </Flex>

                  <Flex display="flex" alignItems="center">
                    <Text
                      fontSize="20px"
                      fontWeight="bold"
                      marginTop="10px"
                      marginRight="15px"
                      title="Data de inicio"
                    >
                      <MdOutlineEventAvailable />
                    </Text>

                    <Text fontWeight="bold" marginTop="10px">
                      {event.startDate.split("T")[0]}
                    </Text>
                  </Flex>

                  <Flex display="flex" alignItems="center">
                    <Text
                      fontSize="20px"
                      fontWeight="bold"
                      marginTop="10px"
                      marginRight="15px"
                      title="Data de encerramento"
                    >
                      <MdOutlineEventBusy />
                    </Text>

                    <Text fontWeight="bold" marginTop="10px">
                      {event.endDate.split("T")[0]}
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
                      {event.updatedAt.split("T")[0]}
                    </Text>
                  </Flex>

                  <Flex justifyContent="end" marginTop="-40px">
                    <Button
                      style={{ background: "#FFD000", color: "#000" }}
                      title="Ver detalhes"
                      onClick={() => router.replace(`event/${event.id}`)}
                    >
                      Ver detalhes
                    </Button>
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
