import { Flex, Link } from "@chakra-ui/react";
import { AvatarIcon } from "components/header";
import { useAuth } from "context";
import LinkNext from "next/link";
import { useRouter } from "next/router";
import { memo } from "react";

const Header = () => {
  const { pathname } = useRouter();
  const { user } = useAuth();

  return (
    <Flex
      zIndex="100"
      padding="1.2rem 2rem"
      justifyContent="space-between"
      marginStart="0rem"
      background="primary.100"
    >
      <Flex width="20rem" alignItems="center" justifyContent="flex-start">
        <AvatarIcon />
      </Flex>

      <Flex align="center" justifyContent="flex-end">
        {["admin", "reviewer"].includes(user.role) && (
          <Link
            as={LinkNext}
            href="/review"
            fontWeight="700"
            color="#000"
            fontSize="1.5rem"
            marginLeft="1.5rem"
            cursor="pointer"
            title="REVISÕES"
            textDecoration={pathname.includes("review") ? "underline" : "none"}
          >
            REVISÕES
          </Link>
        )}

        <Link
          as={LinkNext}
          href="/events"
          fontWeight="700"
          color="#000"
          fontSize="1.5rem"
          marginLeft="1.5rem"
          cursor="pointer"
          title="EVENTOS"
          textDecoration={pathname.includes("event") ? "underline" : "none"}
        >
          EVENTOS
        </Link>

        <Link
          as={LinkNext}
          href="/articles"
          fontWeight="700"
          color="#000"
          fontSize="1.5rem"
          marginLeft="1.5rem"
          cursor="pointer"
          title="ARTIGOS"
          textDecoration={pathname.includes("article") ? "underline" : "none"}
        >
          ARTIGOS
        </Link>

        {["admin"].includes(user.role) && (
          <Link
            as={LinkNext}
            href="/users"
            fontWeight="700"
            color="#000"
            fontSize="1.5rem"
            marginLeft="1.5rem"
            cursor="pointer"
            title="USUÁRIOS"
            textDecoration={pathname.includes("user") ? "underline" : "none"}
          >
            USUÁRIOS
          </Link>
        )}
      </Flex>
    </Flex>
  );
};

export default memo(Header);
