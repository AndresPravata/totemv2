import { socketConnection } from "@/lib/utils";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

const numCards = 3;

const initialState: Record<string, string> = {};
for (let i = 1; i <= numCards; i++) {
  initialState[`card${i}`] = 'absent';
}

const stateContext = createContext(initialState);

type ProviderProps = {
  children: ReactNode;
};

export const StateProvider = ({ children }: ProviderProps) => {
  const [cardState, setCardState] = useState(initialState);

  useEffect(() => {
    for (let i = 1; i <= numCards; i++) {
      const handler = (estado: string) => {
        setCardState((prevState) => ({
          ...prevState,
          [`card${i}`]: estado,
        }));
      };
      socketConnection.on(`cardState${i}`, handler);
    }
  }, []);

  return (
    <stateContext.Provider value={cardState}>
      {children}
    </stateContext.Provider>
  );
};

export const useStateProvider = () => {
  return useContext(stateContext);
};
