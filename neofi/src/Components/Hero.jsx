import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Checkbox,
  Stack,
  Link,
  InputRightElement,
  Button,
  Heading,
  Avatar,
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
  Center,
  Spinner,
} from "@chakra-ui/react";
import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
// DEbouncing
function debounce(func, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}
export default function SimpleCard() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [value, setValue] = useState(151629.0);
  const [token, setToken] = useState("ETHUSD");
  const [coins, setCoins] = useState(0.0);
  const [rs, setRs] = useState(0.0);
  const [usdPairs, setUsdPairs] = useState([]);
  const [data, setData] = useState([]);
  const [symbol, setSymbol] = useState("ETHUSD");
  const [load, setLoad] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const FetchDataPrice = async (symbol, pricesWithSymbol) => {
    try {
      setLoad(true);
      const priceResponse = await axios.get(
        `https://api.binance.com/api/v3/ticker/price?symbol=${symbol}`
      );
      const prices = priceResponse.data;
      // console.log(prices);
      // setData((pre) => prices);
      pricesWithSymbol.push(prices);
    } catch (error) {}
  };
  const fetchPairs = async () => {
    try {
      setLoad(true);
      const response = await axios.get(
        "https://api.binance.com/api/v3/exchangeInfo"
      );
      const exchangeInfoData = response.data;
      const pairs = exchangeInfoData.symbols;
      let i = 0;
      const usdP23airs = pairs.filter(
        (pair) => pair.quoteAsset === "USDT" && i < 21 && i++ // Limit to 20 tokens
      );

      const symbolList = usdP23airs;
      // console.log(symbolList);
      let pricesWithSymbol = [];
      symbolList.forEach((el) => FetchDataPrice(el.symbol, pricesWithSymbol));
      // setUsdPairs(pairsWithPrices);
      // console.log(pricesWithSymbol);
      setLoad(false);
      setData(pricesWithSymbol);
    } catch (error) {
      console.error("Error fetching pairs:", error);
    }
  };

  const handelDataOnClick = (el) => {
    setToken(el.symbol);
    setSymbol(el.symbol);
    setValue(+el.price * 80);
    onClose();
  };
  const debouncedSetSearchTerm = debounce(setSearchTerm, 500);

  function handleInputChange(event) {
    debouncedSetSearchTerm(event.target.value.trim().toLowerCase());
    const regex = new RegExp(searchTerm, "g");
    const newFilteredData = data.filter((obj) =>
      regex.test(obj.symbol.toLowerCase())
    );
    setData(newFilteredData);
  }
  useEffect(() => {
    setCoins(rs / value);
    fetchPairs();
  }, [rs]);
  // console.log(usdPairs);
  console.log(data);

  return (
    <Flex
      minH={"100vh"}
      align={"center"}
      justify={"center"}
      bg={useColorModeValue("gray.50", "gray.800")}
    >
      <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6} w="40%">
        <Center mb="-75px">
          <Avatar
            border={"2px solid white"}
            size="xl"
            name={`${symbol[0]} ${symbol[1]}`}
          />
        </Center>
        <Box
          rounded={"lg"}
          bg={useColorModeValue("white", "gray.700")}
          boxShadow={"lg"}
          p={8}
          pt="70px"
        >
          <Flex justifyContent={"space-between"}>
            <Text fontSize={"12px"}>Current Value</Text>
            <Text color="#627eea" fontSize={"24px"}>
              {" "}
              ₹ {value}
            </Text>
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
                onClick={() => alert("Thanks for Buying")}
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
          <ModalBody mt="30px">
            <Input
              placeholder="Search Token"
              type="text"
              onChange={handleInputChange}
            />
            {load ? (
              <Spinner />
            ) : (
              data.map((el) => (
                <Flex
                  mt="5px"
                  alignItems={"center"}
                  _hover={{
                    bg: "blue.700",
                  }}
                  borderRadius="8px"
                  onClick={() => handelDataOnClick(el)}
                >
                  <Avatar size="sm" name={`${el.symbol[0]} ${el.symbol[1]}`} />
                  <Text ml="10px">{el.symbol}</Text>
                </Flex>
              ))
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Flex>
  );
}
