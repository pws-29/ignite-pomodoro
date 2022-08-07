import { HandPalm, Play } from "phosphor-react";
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as zod from 'zod' // nao possui export default
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import { differenceInSeconds } from 'date-fns'

import {
  HomeContainer,
  StartCountButton,
  StopCountButton
} from "./styles"

import { NewCycleForm } from "./components/NewCycleForm";
import { Countdown } from "./components/Countdown";


// validando um objeto
const newCycleFormValidationSchema = zod.object({
  task: zod.string().min(1, 'Informe a tarefa'),
  minutesAmount: zod
    .number()
    .min(5, 'O ciclo precisa ser de no mínimo 5 minutos.')
    .max(60, 'O ciclo precisa ser de no máximo 60 minutos.'),
});

// zod possui função para extrair a tipagem do formulário de dentro do schema de validação. tipagem a partir de referência
type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>

interface Cycle {
  id: string;
  task: string;
  minutesAmount: number;
  startDate: Date;
  interruptedDate?: Date;
  finishedDate?: Date;
}

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
  const [amountSecondsPassed, setAmountSecondsPassed] = useState(0);
  const [documentIsVisible, setDocumentIsVisible] = useState('');

  const { register, handleSubmit, watch, reset } = useForm<NewCycleFormData>({
    resolver: zodResolver(newCycleFormValidationSchema),
    defaultValues: {
      task: '',
      minutesAmount: 5,
    }
  });

  const activeCycle = cycles.find(cycle => cycle.id === activeCycleId);

  const totalSeconds = activeCycle ? activeCycle.minutesAmount * 60 : 0;


  // useEffect é executado assim que o ciclo é iniciado;
  // Se não usarmos return, cada vez que o ciclo é executado, um novo intervalo é criado em cima do outro, somando os segundos;
  // O retorno limpa o intervalo ao iniciar outro ciclo;
  useEffect(() => {
    let interval: number;

    if (activeCycle) {
      // setInterval pode não ser preciso, poode ser uma estimativa do tempo.
      interval = setInterval(() => {
        const secondsDifference = differenceInSeconds(
          new Date(),
          activeCycle.startDate
        );

        // ciclo encerrado
        if (secondsDifference >= totalSeconds) {
          setCycles(prevState =>
            prevState.map(cycle => {
              if (cycle.id === activeCycleId) {
                return { ...cycle, finishedDate: new Date() }
              } else {
                return cycle;
              }
            }),
          )

          // novo cálculo de diferença é igual, não é mais atualizado o que passou, deixando 1s no painel
          setAmountSecondsPassed(totalSeconds)

          clearInterval(interval);
        } else {
          setAmountSecondsPassed(secondsDifference);
        }
      }, 1000)
    }

    return () => {
      clearInterval(interval)
    }
  }, [activeCycle, totalSeconds, activeCycleId])

  function handleCreateNewCycle(data: NewCycleFormData) {
    const id = uuidv4();

    const newCycle: Cycle = {
      id,
      task: data.task,
      minutesAmount: data.minutesAmount,
      startDate: new Date(),
    }

    setCycles(prevState => [...prevState, newCycle]);
    setActiveCycleId(id);
    // Resetar os segundos que passaram para 0. Novo ciclo iniciar correto
    setAmountSecondsPassed(0);

    reset();
  }

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

  const currentSeconds = activeCycle ? totalSeconds - amountSecondsPassed : 0;

  const minutesAmount = Math.floor(currentSeconds / 60)
  const secondsAmount = currentSeconds % 60;

  const minutes = String(minutesAmount).padStart(2, '0');
  const seconds = String(secondsAmount).padStart(2, '0');

  document.addEventListener('visibilitychange', () => {
    const visibility = document.visibilityState;
    setDocumentIsVisible(visibility)
  })

  useEffect(() => {
    if (activeCycle && documentIsVisible === 'hidden') {
      document.title = `Ignite Timer: ${minutes}:${seconds}`;
    } else {
      document.title = "Ignite Timer"
    }
  }, [minutes, seconds, activeCycle, documentIsVisible])

  // Transforma o input task em um campo controlado. Renderiza sempre que alterado
  const task = watch('task');
  const isSubmitDisabled = !task;

  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(handleCreateNewCycle)} action="">
        <NewCycleForm />
        <Countdown />

        {activeCycle ? (
          <StopCountButton onClick={handleInterruptCycle} type="button">
            <HandPalm size={24} />
            Interromper
          </StopCountButton>
        ) : (
          <StartCountButton disabled={isSubmitDisabled} type="submit">
            <Play size={24} />
            Começar
          </StartCountButton>
        )}
      </form>
    </HomeContainer>
  );
};

