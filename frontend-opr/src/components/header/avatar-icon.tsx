import React, { memo } from "react";
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuOptionGroup,
  MenuDivider,
  Tooltip,
  Flex,
  Center,
  Link,
  Avatar,
} from "@chakra-ui/react";
import LinkNext from "next/link";
import { ChevronDown } from "assets/icons";
import { useAuth } from "context";

const AvatarIcon = () => {
  const { user, logout } = useAuth();

  return (
    <Menu z-index="100" autoSelect={false}>
      <Tooltip label="Perfil">
        <MenuButton>
          <Flex direction="row">
            <Center>
              <Avatar
                name={user?.name}
                bg="#000"
                color="#FFD000"
                border="0.125rem solid #000"
                width="2.35rem"
                height="2.35rem"
              />
              <Flex direction="column" marginLeft=".8rem" color="#000">
                <ChevronDown />
              </Flex>
            </Center>
          </Flex>
        </MenuButton>
      </Tooltip>

      <MenuList zIndex={100} boxShadow="md" borderStyle="none" mt="0.7rem">
        <MenuOptionGroup color="#696969" title="Opções">
          <Link as={LinkNext} href="/profile">
            <MenuItem _hover={{ background: "#fff" }} color="#696969">
              Acessar perfil
            </MenuItem>
          </Link>
        </MenuOptionGroup>

        <MenuDivider borderColor="gray.200" />

        <Link as={LinkNext} href="/">
          <MenuItem _hover={{ background: "#fff" }} color="#696969">
            Acessar menu
          </MenuItem>
        </Link>

        <MenuDivider borderColor="gray.200" />

        <MenuItem
          color="#696969"
          _hover={{ background: "#fff" }}
          onClick={logout}
        >
          Sair
        </MenuItem>
      </MenuList>
    </Menu>
  );
};

export default memo(AvatarIcon);
