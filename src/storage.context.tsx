import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  type Dispatch,
  type ReactNode,
} from "react";
import {
  StorageKeys,
  setStorage,
  DEFAULT_GROUP,
  getMultipleStorage,
} from "./utils";

export interface Storages {
  [StorageKeys.OPEN_API_KEY]: OpenAPIKey;
  [StorageKeys.AUTO_GROUP]: AutoGroup;
  [StorageKeys.GROUP_TYPES]: GroupTypes;
}

export type Action =
  | {
      type: StorageKeys.OPEN_API_KEY;
      payload: string;
    }
  | {
      type: StorageKeys.AUTO_GROUP;
      payload: boolean;
    }
  | {
      type: StorageKeys.GROUP_TYPES;
      payload: string[];
    };

const initialState = {
  [StorageKeys.OPEN_API_KEY]: "",
  [StorageKeys.AUTO_GROUP]: true,
  [StorageKeys.GROUP_TYPES]: DEFAULT_GROUP,
} satisfies Storages;

const StorageContext = createContext<{
  state: Storages;
  dispatch: Dispatch<Action>;
}>({
  state: initialState,
  dispatch: () => null,
});

const reducer = (state: Storages, action: Action) => {
  const { type, payload } = action;
  switch (type) {
    case StorageKeys.OPEN_API_KEY: {
      setStorage(StorageKeys.LEGACY_OPEN_API_KEY, payload);
      setStorage(StorageKeys.OPEN_API_KEY, payload);
      return { ...state, [StorageKeys.OPEN_API_KEY]: payload };
    }
    case StorageKeys.AUTO_GROUP: {
      setStorage(StorageKeys.LEGACY_AUTO_GROUP, payload);
      setStorage(StorageKeys.AUTO_GROUP, payload);
      return { ...state, [StorageKeys.AUTO_GROUP]: payload };
    }
    case StorageKeys.GROUP_TYPES: {
      setStorage(StorageKeys.LEGACY_GROUP_TYPES, payload);
      setStorage(StorageKeys.GROUP_TYPES, payload);
      return { ...state, [StorageKeys.GROUP_TYPES]: payload };
    }
    default:
      return state;
  }
};

const StorageEffect = () => {
  const { dispatch } = useStorage();
  useEffect(() => {
    getMultipleStorage<{
      [StorageKeys.OPEN_API_KEY]: OpenAPIKey;
      [StorageKeys.LEGACY_OPEN_API_KEY]: OpenAPIKey;
      [StorageKeys.AUTO_GROUP]: AutoGroup;
      [StorageKeys.LEGACY_AUTO_GROUP]: AutoGroup;
      [StorageKeys.GROUP_TYPES]: GroupTypes;
      [StorageKeys.LEGACY_GROUP_TYPES]: GroupTypes;
    }>([
      StorageKeys.OPEN_API_KEY,
      StorageKeys.LEGACY_OPEN_API_KEY,
      StorageKeys.AUTO_GROUP,
      StorageKeys.LEGACY_AUTO_GROUP,
      StorageKeys.GROUP_TYPES,
      StorageKeys.LEGACY_GROUP_TYPES,
    ]).then((result) => {
      dispatch({
        type: StorageKeys.OPEN_API_KEY,
        payload:
          result[StorageKeys.OPEN_API_KEY] ??
          result[StorageKeys.LEGACY_OPEN_API_KEY] ??
          initialState[StorageKeys.OPEN_API_KEY],
      });
      dispatch({
        type: StorageKeys.GROUP_TYPES,
        payload:
          result[StorageKeys.GROUP_TYPES] ??
          result[StorageKeys.LEGACY_GROUP_TYPES] ??
          initialState[StorageKeys.GROUP_TYPES],
      });
      dispatch({
        type: StorageKeys.AUTO_GROUP,
        payload:
          result[StorageKeys.AUTO_GROUP] ??
          result[StorageKeys.LEGACY_AUTO_GROUP] ??
          initialState[StorageKeys.AUTO_GROUP],
      });
    });
  }, []);

  return null;
};

export const StorageProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <StorageContext.Provider value={{ state, dispatch }}>
      <StorageEffect />
      {children}
    </StorageContext.Provider>
  );
};

export const useStorage = () => {
  const storage = useContext(StorageContext);
  if (!storage) {
    throw new Error("`useStorage` must be used within a `StorageProvider`");
  }
  return storage;
};
