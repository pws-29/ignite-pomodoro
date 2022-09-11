import { createContext, useState, useReducer, useEffect } from "react";
import { Cycle, cyclesReducer } from '../reducers/cycles/reducer'
import { v4 as uuidv4 } from 'uuid';
import { addNewCycleAction, interruptCurrentCycleAction, markCurrentCycleAsFinishedAction } from "../reducers/cycles/actions";
import { differenceInSeconds } from "date-fns";

interface CreateCycleData {
  task: string;
  minutesAmount: number;
}

interface CyclesContextType {
  cycles: Cycle[];
  activeCycle: Cycle | undefined;
  activeCycleId: string | null;
  amountSecondsPassed: number;
  markCurrentCycleAsFinished: () => void;
  setSecondsPassed: (seconds: number) => void;
  createNewCycle: (data: CreateCycleData) => void;
  interruptCurrentCycle: () => void;
}

export const CyclesContext = createContext({} as CyclesContextType);

interface CyclesContextProviderProps {
  children: React.ReactNode;
}

// Valor dos ciclos e valor do ciclo ativo são controlados por um único reducer. Informações correlacionadas.
// TODO: https://app.rocketseat.com.br/h/forum/react-js/fc909211-8a4c-4edf-9a0b-d8f0100c2fac
export function CyclesContextProvider({ children }: CyclesContextProviderProps) {
  const [cyclesState, dispatch] = useReducer(cyclesReducer, {
    cycles: [],
    activeCycleId: null,
  }, () => {
    const storedStateAsJson = localStorage.getItem('@ignite-timer:cycles-state-1.0.0');

    if (storedStateAsJson) {
      return JSON.parse(storedStateAsJson);
    }

    return {
      cycles: [],
      activeCycleId: null,
    }
  },
  )

  const { cycles, activeCycleId } = cyclesState;
  const activeCycle = cycles.find(cycle => cycle.id === activeCycleId);

  const [amountSecondsPassed, setAmountSecondsPassed] = useState(() => {
    if (activeCycle) {
      return differenceInSeconds(new Date(), new Date(activeCycle.startDate))
    }

    return 0
  });

  useEffect(() => {
    const stateJSON = JSON.stringify(cyclesState);

    localStorage.setItem('@ignite-timer:cycles-state-1.0.0', stateJSON);
  }, [cyclesState])

  // Não passar o setCycles para o contexto, devido sua tipagem
  function setSecondsPassed(seconds: number) {
    setAmountSecondsPassed(seconds);
  }

  function markCurrentCycleAsFinished() {
    dispatch(markCurrentCycleAsFinishedAction())

    // setCycles(prevState =>
    //   prevState.map(cycle => {
    //     if (cycle.id === activeCycleId) {
    //       return { ...cycle, finishedDate: new Date() }
    //     } else {
    //       return cycle;
    //     }
    //   }),
    // )
  }


  function createNewCycle(data: CreateCycleData) {
    const id = uuidv4();

    const newCycle: Cycle = {
      id,
      task: data.task,
      minutesAmount: data.minutesAmount,
      startDate: new Date(),
    }

    dispatch(addNewCycleAction(newCycle));

    // setCycles(prevState => [...prevState, newCycle])
    // setActiveCycleId(id);
    // Resetar os segundos que passaram para 0. Novo ciclo iniciar correto
    setAmountSecondsPassed(0);
  }

  function interruptCurrentCycle() {
    dispatch(interruptCurrentCycleAction())

    // TODO: entender fluxo 
    // setCycles(prevState =>
    //   prevState.map(cycle => {
    //     if (cycle.id === activeCycleId) {
    //       return { ...cycle, interruptedDate: new Date() }
    //     } else {
    //       return cycle;
    //     }
    //   }),
    // )
    // setActiveCycleId(null);
  }


  return (
    <CyclesContext.Provider
      value={{
        cycles,
        activeCycle,
        activeCycleId,
        markCurrentCycleAsFinished,
        amountSecondsPassed,
        setSecondsPassed,
        createNewCycle,
        interruptCurrentCycle,
      }}
    >
      {children}
    </CyclesContext.Provider>
  )
}
