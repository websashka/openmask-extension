import { Address } from "@openproduct/web-sdk";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useContext, useMemo } from "react";
import { getNetworkConfig } from "../../../libs/entries/network";
import { DexStocks } from "../../../libs/entries/stock";
import { getCachedDeDustStock } from "../../../libs/service/dexService";
import { QueryType } from "../../../libs/store/browserStore";
import {
  AccountStateContext,
  NetworkContext,
  TonProviderContext,
  WalletContractContext,
  WalletStateContext,
} from "../../context";
import { saveAccountState } from "../api";

export const useSelectWalletMutation = () => {
  const account = useContext(AccountStateContext);
  const network = useContext(NetworkContext);
  const client = useQueryClient();
  return useMutation<void, Error, string>(async (address) => {
    const value = {
      ...account,
      activeWallet: address,
    };
    await saveAccountState(network, client, value);
  });
};

export const useBalance = (address: string) => {
  const network = useContext(NetworkContext);
  const ton = useContext(TonProviderContext);

  return useQuery<string>([network, address, QueryType.balance], async () =>
    ton.getBalance(address)
  );
};

export const useAddress = () => {
  const network = useContext(NetworkContext);
  const wallet = useContext(WalletStateContext);
  const contract = useContext(WalletContractContext);

  return useQuery<Address>(
    [network, wallet.address, wallet.version, QueryType.address],
    () => contract.getAddress()
  );
};

const tonId = "the-open-network";
const currency = "usd";

export const useCoinPrice = (enabled: boolean) => {
  return useQuery<number>(
    [QueryType.price],
    async () => {
      const result = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${tonId}&vs_currencies=${currency}`
      );

      const data = await result.json();
      return data[tonId][currency];
    },
    { enabled }
  );
};

export const useDexStock = (enabled: boolean) => {
  return useQuery<DexStocks>(
    [QueryType.stock],
    async () => {
      const dedust = await getCachedDeDustStock();

      return { dedust };
    },
    { enabled }
  );
};

export const useNetworkConfig = () => {
  const network = useContext(NetworkContext);
  return useMemo(() => {
    return getNetworkConfig(network);
  }, [network]);
};
