import { LayoutSigned } from "@/components/layout";
import authRoute from "@/utils/auth";
import { Box, Flex, Text } from "@chakra-ui/react";
import Head from "next/head";

const Home = () => (
  <LayoutSigned>
    <Head>
      <title>Menu</title>
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    </Head>
    <Flex
      style={{
        display: "flex",
        flexDirection: "column",
        width: "70%",
        alignItems: "center",
        color: "#696969",
      }}
    >
      <Box style={{ marginBottom: "1rem", textAlign: "justify" }}>
        Ciência aberta é um movimento que busca tornar a ciência mais acessível
        e transparente. Isso inclui a publicação de pesquisas e dados
        científicos de forma livre e aberta, bem como a colaboração e
        compartilhamento de informações entre pesquisadores. A revisão em pares
        aberta é uma parte importante da ciência aberta, pois permite que outros
        cientistas leiam e avaliem o trabalho antes de ser publicado. Isso ajuda
        a garantir que as descobertas sejam confiáveis e confiáveis. A revisão
        em pares aberta também permite que os erros sejam detectados e
        corrigidos antes que as informações sejam disseminadas. Além disso, a
        revisão em pares aberta pode ajudar a reduzir a pressão para publicar
        resultados falsos ou exagerados, e aumenta a confiança do público na
        ciência. A ciência aberta e revisão em pares aberta também podem ajudar
        a promover a inovação e a colaboração.
      </Box>

      <Box style={{ marginBottom: "1rem", textAlign: "justify" }}>
        A presente plataforma tem como objetivo fomentar a ciência aberta,
        introduzindo um sistema que permite a usuários submeterem artigos, que
        serão avaliados por pares, e que, após aprovados, estarão disponíveis na
        plataforma. Além disso, é possível visualizar eventos e todos os artigos
        submetidos para o respectivo evento, tal qual o criador e os revisores
        presentes no evento. Todas as revisões dos artigos são públicos para
        consulta dos usuários da plataforma, ficando disponível não somente o
        resultado final, mas também cada revisão realizada pelos revisores e
        seus respectivos apontamentos.
      </Box>

      <Text style={{ marginTop: "2rem" }}>
        by Matheus de Andrade Pereira - disponível em{" "}
        <a
          target="_blank"
          href="https://github.com/matheusinfo"
          rel="noreferrer"
        >
          @matheusinfo
        </a>
      </Text>
    </Flex>
  </LayoutSigned>
);

export default authRoute(Home);
