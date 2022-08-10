import { HandPalm, Play } from "phosphor-react";
import { createContext, useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import { differenceInSeconds } from 'date-fns'

import {
  HomeContainer,
  StartCountButton,
  StopCountButton
} from "./styles"

import { NewCycleForm } from "./components/NewCycleForm";
import { Countdown } from "./components/Countdown";




interface Cycle {
  id: string;
  task: string;
  minutesAmount: number;
  startDate: Date;
  interruptedDate?: Date;
  finishedDate?: Date;
}

interface CyclesContextType {
  activeCycle: Cycle | undefined;
  activeCycleId: string | null;
  markCurrentCycleAsFinished: () => void;
}

export const CyclesContext = createContext({} as CyclesContextType);

export function Home() {
  /**
   * Register(): Ao invocar a função e passar o nome do input, receberemos os métodos JS para trabalhar com input;
   * Spread operator transforma cada um dos métodos do retorno em uma propriedade para o input;
   * 
   * handleSubmit(): recebe os dados do formulário quando a validação for bem sucedida;
   * Aceita resolver, que que permite o uso de bibliotecas externas para validação de dados; 
   * 
   * watch(): assiste input específico e retorna seu valor. ütil para renderizar input value e determinar o que rendezrizar por condição;
   * 
   * zod: biblioteca de validação
   */

  const [cycles, setCycles] = useState<Cycle[]>([]);
  const [activeCycleId, setActiveCycleId] = useState<string | null>(null);

  const activeCycle = cycles.find(cycle => cycle.id === activeCycleId);

  // Não passar o setCycles para o contexto, devido sua tipagem
  function markCurrentCycleAsFinished() {
    setCycles(prevState =>
      prevState.map(cycle => {
        if (cycle.id === activeCycleId) {
          return { ...cycle, finishedDate: new Date() }
        } else {
          return cycle;
        }
      }),
    )
  }

  // function handleCreateNewCycle(data: NewCycleFormData) {
  //   const id = uuidv4();

  //   const newCycle: Cycle = {
  //     id,
  //     task: data.task,
  //     minutesAmount: data.minutesAmount,
  //     startDate: new Date(),
  //   }

  //   setCycles(prevState => [...prevState, newCycle]);
  //   setActiveCycleId(id);
  //   // Resetar os segundos que passaram para 0. Novo ciclo iniciar correto
  //   setAmountSecondsPassed(0);

  //   reset();
  // }

  function handleInterruptCycle() {
    // TODO: entender fluxo 
    setCycles(prevState =>
      prevState.map(cycle => {
        if (cycle.id === activeCycleId) {
          return { ...cycle, interruptedDate: new Date() }
        } else {
          return cycle;
        }
      }),
    )
    setActiveCycleId(null);
  }


  // Transforma o input task em um campo controlado. Renderiza sempre que alterado
  // const task = watch('task');
  // const isSubmitDisabled = !task;

  return (
    <HomeContainer>
      <form /*onSubmit={handleSubmit(handleCreateNewCycle)}*/ action="">

        <CyclesContext.Provider value={{ activeCycle, activeCycleId, markCurrentCycleAsFinished }}>
          {/* <NewCycleForm /> */}
          <Countdown />
        </CyclesContext.Provider>

        {activeCycle ? (
          <StopCountButton onClick={handleInterruptCycle} type="button">
            <HandPalm size={24} />
            Interromper
          </StopCountButton>
        ) : (
          <StartCountButton /*disabled={isSubmitDisabled}*/ type="submit">
            <Play size={24} />
            Começar
          </StartCountButton>
        )}
      </form>
    </HomeContainer>
  );
};

