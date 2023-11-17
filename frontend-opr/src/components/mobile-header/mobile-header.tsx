import { HamburgerIcon } from "@chakra-ui/icons";
import { Flex, IconButton, Link } from "@chakra-ui/react";
import { AvatarIcon } from "components/header";
import { useAuth } from "context";
import { default as LinkNext } from "next/link";
import { useRouter } from "next/router";
import { memo, useCallback, useState } from "react";

const MobileHeader = () => {
  const { pathname } = useRouter();
  const { user } = useAuth();
  const [toggleMenu, setToggleMenu] = useState(false);

  const handleToggleMenu = useCallback(() => {
    setToggleMenu(!toggleMenu);
  }, [toggleMenu]);

  return (
    <>
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

        <IconButton
          onClick={handleToggleMenu}
          aria-label="open-menu"
          colorScheme="primary"
          icon={<HamburgerIcon color="black" boxSize={10} />}
        />
      </Flex>
      {toggleMenu && (
        <>
          <IconButton
            onClick={handleToggleMenu}
            aria-label="open-menu"
            colorScheme="primary"
            icon={<HamburgerIcon color="black" boxSize={10} />}
            zIndex={999}
            position="absolute"
            right="30px"
            top="20px"
          />
          <Flex
            position="fixed"
            top={0}
            left={0}
            width="100%"
            height="100%"
            backgroundColor="rgba(255, 255, 255, 0.95)"
            zIndex={998}
            direction="column"
            justify="center"
            align="center"
          >
            {["admin", "reviewer"].includes(user.role) && (
              <Link
                as={LinkNext}
                href="/review"
                fontWeight="700"
                color={
                  pathname.includes("review") ? "primary.100" : "neutral.500"
                }
                fontSize="2rem"
                cursor="pointer"
                title="REVISÕES"
                textDecoration={
                  pathname.includes("review") ? "underline" : "none"
                }
                marginBottom="30px"
              >
                REVISÕES
              </Link>
            )}

            <Link
              as={LinkNext}
              href="/events"
              fontWeight="700"
              color={pathname.includes("event") ? "primary.100" : "neutral.500"}
              fontSize="2rem"
              cursor="pointer"
              title="EVENTOS"
              textDecoration={pathname.includes("event") ? "underline" : "none"}
              marginBottom="30px"
            >
              EVENTOS
            </Link>

            <Link
              as={LinkNext}
              href="/articles"
              fontWeight="700"
              color={
                pathname.includes("article") ? "primary.100" : "neutral.500"
              }
              fontSize="2rem"
              cursor="pointer"
              title="ARTIGOS"
              textDecoration={
                pathname.includes("article") ? "underline" : "none"
              }
              marginBottom="30px"
            >
              ARTIGOS
            </Link>

            {["admin"].includes(user.role) && (
              <Link
                as={LinkNext}
                href="/users"
                fontWeight="700"
                color={
                  pathname.includes("user") ? "primary.100" : "neutral.500"
                }
                // color="primary.100"
                fontSize="2rem"
                cursor="pointer"
                title="USUÁRIOS"
                textDecoration={
                  pathname.includes("user") ? "underline" : "none"
                }
                marginBottom="30px"
              >
                USUÁRIOS
              </Link>
            )}
          </Flex>
        </>
      )}
    </>
  );
};

export default memo(MobileHeader);
