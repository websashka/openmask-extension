import browser from "webextension-polyfill";
import { AccountState, defaultAccountState } from "../entries/account";
import {
  AuthConfiguration,
  DefaultAuthPasswordConfig,
  WebAuthn,
} from "../entries/auth";
import { Connections, defaultConnections } from "../entries/connection";
import { networkConfigs } from "../entries/network";
import {
  DisabledProxyConfiguration,
  ProxyConfiguration,
} from "../entries/proxy";
import { checkForError } from "../utils";

export enum QueryType {
  proxy = "proxy",
  auth = "auth",

  price = "price",
  stock = "stock",

  script = "script",
  network = "network",
  connection = "connection",
  tabs = "tabs",

  account = "account",
  balance = "balance",
  address = "address",
  transactions = "transactions",
  raw = "raw",
  jetton = "jetton",
  origin = "origin",

  estimation = "estimation",

  method = "method",
  encryptedPayload = "encrypted_payload",
  publicKey = "public_key"
}

export const getStoreValue = <T>(query: QueryType, defaultValue: T) => {
  return browser.storage.local.get(query).then<T>((result) => {
    const err = checkForError();
    if (err) {
      throw err;
    }
    return result[query] ?? defaultValue;
  });
};

export const setStoreValue = async <T>(query: QueryType, value: T) => {
  await browser.storage.local.set({ [query]: value });
  const err = checkForError();
  if (err) {
    throw err;
  }
  return value;
};

export const getScript = () => {
  return getStoreValue<string | null>(QueryType.script, null);
};

export const getNetwork = () => {
  return getStoreValue(QueryType.network, networkConfigs[0].name);
};

export const getProxyConfiguration = () => {
  return getStoreValue<ProxyConfiguration>(
    QueryType.proxy,
    DisabledProxyConfiguration
  );
};

export const getAuthConfiguration = () => {
  return getStoreValue<AuthConfiguration>(
    QueryType.auth,
    DefaultAuthPasswordConfig
  );
};

// Hack to fix bug with empty connect list
const filterConnection = (connection: Connections): Connections => {
  return Object.entries(connection).reduce((acc, [origin, connection]) => {
    if (Object.keys(connection.connect).length > 0) {
      acc[origin] = connection;
    }
    return acc;
  }, {} as Connections);
};

export const getConnections = async (network?: string) => {
  return filterConnection(
    await getNetworkStoreValue<Connections>(
      QueryType.connection,
      defaultConnections,
      network
    )
  );
};

export const getAccountState = (network?: string) => {
  return getNetworkStoreValue<AccountState>(
    QueryType.account,
    defaultAccountState,
    network
  );
};

export const updateAuthCounter = (value: WebAuthn, newCounter: number) => {
  return setStoreValue(QueryType.auth, { ...value, counter: newCounter });
};

export const setProxyConfiguration = (value: ProxyConfiguration) => {
  return setStoreValue(QueryType.proxy, value);
};

export const setAccountState = (value: AccountState, network?: string) => {
  return setNetworkStoreValue<AccountState>(QueryType.account, value, network);
};

export const setConnections = (value: Connections, network?: string) => {
  return setNetworkStoreValue(
    QueryType.connection,
    filterConnection(value),
    network
  );
};

interface BrowserCache<T> {
  timeout: number;
  data: T;
}

const removeCachedStoreValue = async (query: string) => {
  await browser.storage.local.remove(`catch_${query}`);
  const err = checkForError();
  if (err) {
    throw err;
  }
};

export const getCachedStoreValue = async <T>(
  query: string
): Promise<T | null> => {
  return browser.storage.local
    .get(`catch_${query}`)
    .then<T | null>(async (result) => {
      const err = checkForError();
      if (err) {
        throw err;
      }

      const data: BrowserCache<T> | undefined = result[`catch_${query}`];
      if (!data) return null;
      if (data.timeout < Date.now()) {
        await removeCachedStoreValue(query);
        return null;
      } else {
        return data.data;
      }
    });
};

const tenMin = 10 * 60 * 1000;

export const setCachedStoreValue = async <T>(
  query: string,
  data: T,
  timeout: number = Date.now() + tenMin
) => {
  await browser.storage.local.set({ [`catch_${query}`]: { data, timeout } });
  const err = checkForError();
  if (err) {
    throw err;
  }
};

export const getNetworkStoreValue = async <T>(
  query: QueryType,
  defaultValue: T,
  networkValue?: string
) => {
  const network = networkValue ?? (await getNetwork());
  return browser.storage.local.get(`${network}_${query}`).then<T>((result) => {
    const err = checkForError();
    if (err) {
      throw err;
    }
    return result[`${network}_${query}`] ?? defaultValue;
  });
};

export const setNetworkStoreValue = async <T>(
  query: QueryType,
  value: T,
  networkValue?: string
) => {
  const network = networkValue ?? (await getNetwork());
  await browser.storage.local.set({ [`${network}_${query}`]: value });
  const err = checkForError();
  if (err) {
    throw err;
  }
};

export const batchUpdateStore = async (
  values: Record<string, any>
): Promise<void> => {
  await browser.storage.local.set(values);
  const err = checkForError();
  if (err) {
    throw err;
  }
};
