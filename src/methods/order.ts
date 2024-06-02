import axios, { AxiosError, AxiosResponse } from "axios";
import { convertToIst } from "./utils";

const ECONIA_PUBLIC_DSS = "https://aptos-mainnet-econia.nodeinfra.com";
const FILL_EVENTS = "fill_events";
const ORDERS = "orders";
const INTEGRATOR =
  "0xd718181a753f5b759518d9b896018dd7eb3d77d80bf90ba77fffaf678f781929";

const getUserAccountInfo = async () => {};

export type OrderDetails = {
  market_id: string;
  order_id: string; // Using bigint for very large integers
  created_at: string; // Dates are represented as strings
  last_updated_at: string;
  integrator: string; // Assuming these are hexadecimal or similar identifiers
  total_filled: string;
  remaining_size: string;
  order_status: "open" | "closed"; // Assuming order_status can be either 'open' or 'closed'
  order_type: "limit" | "market"; // Similarly, assuming it's either 'limit' or 'market'
  user: string;
  direction: "bid" | "ask"; // Assuming direction can be either 'bid' or 'ask'
  price: string;
  custodian_id: string;
  self_matching_behavior: string;
  restriction: string;
  min_base: string | null;
  max_base: string | null;
  min_quote: string | null;
  max_quote: string | null;
  average_execution_price: string;
};

export const getUserOrderInfo = async (
  address: string,
  market: number,
  offset: number,
  limit: number,
  order?: "asc" | "desc"
) => {
  try {
    const response: AxiosResponse = await axios.get(
      `${ECONIA_PUBLIC_DSS}/${ORDERS}`,
      {
        params: {
          offset: offset ? offset : 0,
          limit: limit ? limit : 30,
          order: order === "asc" ? "order_id.asc" : "order_id.desc",
          market_id: `eq.${market}`,
          user: `eq.${address}`,
          integrator: `eq.${INTEGRATOR}`,
          select: `*,average_execution_price`,
        },
        responseType: "text",
      }
    );
    const jsonString = response.data.replace(
      /"order_id":(\d+)/g,
      '"order_id":"$1"'
    );
    const orders = JSON.parse(jsonString);
    const data = orders as OrderDetails[];
    data.forEach((item) => {
      item.created_at = convertToIst(item.created_at);
      item.last_updated_at = convertToIst(item.last_updated_at);
    });
    return data;
  } catch (error) {
    const axiosError = error as AxiosError;
    if (axiosError.code === "ECONNREFUSED")
      throw new Error("Server nreachable [ ECONNREFUSED ]");
    if (axiosError.message) throw new Error(axiosError.message);
    if (axiosError.response) {
      // The request was made, but the server responded with an error status
      throw new Error(axiosError.response.data as string);
    } else {
      // Something else happened while setting up the request
      throw new Error(axiosError.message as string);
    }
  }
};
