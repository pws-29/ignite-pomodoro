import { HandPalm, Play } from "phosphor-react";
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as zod from 'zod' // nao possui export default
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import { differenceInSeconds } from 'date-fns'

import {
  HomeContainer,
  FormContainer,
  CountdownContainer,
  StartCountButton,
  Separator,
  TaskInput,
  MinutesAmoutInput,
  StopCountButton
} from "./styles"


// validando um objeto
const newCycleFormValidationSchema = zod.object({
  task: zod.string().min(1, 'Informe a tarefa'),
  minutesAmount: zod
    .number()
    .min(1, 'O ciclo precisa ser de no mínimo 5 minutos.')
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
        <FormContainer>
          <label htmlFor="task">Vou trabalhar em</label>
          <TaskInput
            id="task"
            placeholder="Dê um nome para o seu projeto"
            list="task-suggestions"
            {...register('task')}
          />
          <datalist id="task-suggestions">
            <option value="Projeto 1"></option>
            <option value="Projeto 2"></option>
            <option value="Projeto 3"></option>
          </datalist>

          <label htmlFor="minutesAmout">durante</label>
          <MinutesAmoutInput
            id="minutesAmount"
            type="number"
            placeholder="00"
            step={5}
            min={1}
            max={60}
            {...register('minutesAmount', { valueAsNumber: true })}
          />
          <span>minutos.</span>
        </FormContainer>

        <CountdownContainer>
          <span>{minutes[0]}</span>
          <span>{minutes[1]}</span>
          <Separator>:</Separator>
          <span>{seconds[0]}</span>
          <span>{seconds[1]}</span>
        </CountdownContainer>

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

