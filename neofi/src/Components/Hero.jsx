import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Checkbox,
  Stack,
  Link,
  Button,
  Heading,
  Text,
  useColorModeValue,
  Select,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from "@chakra-ui/react";
import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";

export default function SimpleCard() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [value, setValue] = useState(20000);
  const [token, setToken] = useState("ETHUSD");
  const [coins, setCoins] = useState(0);
  const [rs, setRs] = useState(0);
  const [usdPairs, setUsdPairs] = useState([]);
  const fetchPairs = async () => {
    try {
      const response = await axios.get(
        "https://api.binance.com/api/v3/exchangeInfo"
      );
      const exchangeInfoData = response.data;
      const pairs = exchangeInfoData.symbols;
let i=0
      const usdP23airs = pairs.filter(
        (pair) => pair.quoteAsset === "USDT" && i < 20 &&i++// Limit to 20 tokens
      );

      const symbolList = usdP23airs.map((pair) => pair.symbol).join(",");
      console.log(symbolList);
      const priceResponse = await axios.get(
        `https://api.binance.com/api/v3/ticker/price?symbol=${symbolList}`
      );
      const prices = priceResponse.data;

      const pairsWithPrices = usdPairs.map((pair) => {
        const price = prices.find((p) => p.symbol === pair.symbol);
        return {
          symbol: pair.symbol,
          price: price.price,
        };
      });

      setUsdPairs(pairsWithPrices);
      //   console.log(usdPairs);
    } catch (error) {
      console.error("Error fetching pairs:", error);
    }
  };
  useEffect(() => {
    setCoins(value * rs);
    fetchPairs();
  }, [rs]);
  console.log(usdPairs);
  return (
    <Flex
      minH={"100vh"}
      align={"center"}
      justify={"center"}
      bg={useColorModeValue("gray.50", "gray.800")}
    >
      <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6} w="40%">
        <Box
          rounded={"lg"}
          bg={useColorModeValue("white", "gray.700")}
          boxShadow={"lg"}
          p={8}
        >
          <Flex justifyContent={"space-between"}>
            <Text>Current Value</Text>
            <Text color="blue">{value}</Text>
          </Flex>
          <Stack spacing={4}>
            <Select placeholder={token} onClick={onOpen}></Select>
            <FormControl id="email">
              <FormLabel>Amount You Want to Invest</FormLabel>
              <Input
                type="number"
                onChange={(e) => setRs(e.target.value)}
                value={rs}
              />
            </FormControl>
            <FormControl id="password">
              <FormLabel>Estimate Numbers of {token} you will get</FormLabel>
              <Input type="number" value={coins} isDisabled />
            </FormControl>
            <Stack spacing={10}>
              <Button
                bg={"blue.400"}
                color={"white"}
                _hover={{
                  bg: "blue.500",
                }}
                style={{
                  background: "linear-gradient(to right, #397cd4, #7041cb)",
                }}
                borderRadius="50px"
              >
                Buy
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Stack>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody>
            <Input />
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button variant="ghost">Secondary Action</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
}
