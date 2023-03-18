import Head from "next/head";
import { toast } from "react-toastify";
import { LayoutSigned } from "@/components/layout";
import fetchData from "utils/fetch";
import { useCallback, useEffect, useState } from "react";
import { Box, Checkbox, Flex, Text, useBoolean } from "@chakra-ui/react";
import authRoute from "@/utils/auth";
import { UserProps } from "common/types/user";
import { useAuth } from "context";
import { AiOutlineMail, AiOutlineClockCircle } from "react-icons/ai";
import { GrStatusUnknown } from "react-icons/gr";

const User = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<UserProps[]>([]);
  const [loading, setLoading] = useBoolean(true);

  useEffect(() => {
    (async () => {
      try {
        const apiResponse = await fetchData("GET", "user");
        const users = apiResponse.filter(
          (currentUser: UserProps) => currentUser.id !== user.id
        );

        setUsers(users);
      } catch (error) {
        toast.error("Ocorreu um erro ao buscar os usuários, tente novamente!", {
          autoClose: 5000,
        });
      } finally {
        setLoading.off();
      }
    })();
  }, [setLoading, user.id]);

  const changeStatus = useCallback(
    async (id: number, isActive: boolean) => {
      try {
        await fetchData("PUT", `user/${id}`, {
          isActive: !isActive,
        });

        const formattedUsers = users.map((user) => {
          if (user.id === id) {
            return {
              ...user,
              isActive: !isActive,
            };
          }
          return user;
        });

        setUsers(formattedUsers);
      } catch {
        toast.error(
          "Ocorreu um erro ao atualizar o usuário, tente novamente!",
          {
            autoClose: 5000,
          }
        );
      }
    },
    [users]
  );

  const translateRole = useCallback((role: string) => {
    switch (role) {
      case "admin":
        return "Administrador";
      case "author":
        return "Autor";
      case "publisher":
        return "Editor";
      default:
        return "Revisor";
    }
  }, []);

  return (
    <LayoutSigned>
      <Head>
        <title>Usuários</title>
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
        <Flex
          minWidth="600px"
          alignItems="center"
          justifyContent="center"
          wrap={{ base: "wrap" }}
        >
          {users.length >= 1 ? (
            users.map((user) => (
              <Box
                key={user.id}
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
                    {user.name.split(" ")[0].toUpperCase()} /{" "}
                    {user.role.toUpperCase()}
                  </Text>
                </Flex>

                <Flex display="flex" alignItems="center">
                  <Text
                    fontSize="20px"
                    fontWeight="bold"
                    marginTop="10px"
                    marginRight="15px"
                    title="E-mail"
                  >
                    <AiOutlineMail />
                  </Text>

                  <Text fontWeight="bold" marginTop="10px">
                    {user.email}
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
                    {user.updatedAt.split("T")[0]}
                  </Text>
                </Flex>

                <Flex display="flex" alignItems="center">
                  <Text
                    fontSize="20px"
                    fontWeight="bold"
                    marginTop="10px"
                    marginRight="15px"
                    title="Status atual"
                  >
                    <GrStatusUnknown />
                  </Text>

                  <Text fontWeight="bold" marginTop="10px">
                    {user.isActive ? "ATIVO" : "INATIVO"}
                  </Text>
                </Flex>

                <Flex display="flex" alignItems="center">
                  <Checkbox
                    marginRight="15px"
                    marginTop="10px"
                    colorScheme="yellow"
                    isChecked={user.isActive}
                    onChange={() => changeStatus(user.id, user.isActive)}
                  />

                  <Text fontWeight="bold" marginTop="10px">
                    {user.isActive ? "DESATIVAR USUÁRIO" : "ATIVAR USUÁRIO"}
                  </Text>
                </Flex>
              </Box>
            ))
          ) : (
            <Text marginTop="20px" color="#696969">
              Nenhum usuário cadastrado :(
            </Text>
          )}
        </Flex>
      )}
    </LayoutSigned>
  );
};

export default authRoute(User);
