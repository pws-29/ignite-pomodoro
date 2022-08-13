import { HandPalm, Play } from "phosphor-react";
import { useContext } from "react";
import * as zod from "zod" // nao possui export default
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  HomeContainer,
  StartCountButton,
  StopCountButton
} from "./styles"

import { NewCycleForm } from "./components/NewCycleForm";
import { Countdown } from "./components/Countdown";
import { CyclesContext } from "../../contexts/CyclesContext";

// validando um objeto
const newCycleFormValidationSchema = zod.object({
  task: zod.string().min(1, 'Informe a tarefa'),
  minutesAmount: zod
    .number()
    .min(5, 'O ciclo precisa ser de no mínimo 5 minutos.')
    .max(60, 'O ciclo precisa ser de no máximo 60 minutos.'),
});

// zod possui função para extrair a tipagem do formulário de dentro do schema de validação. tipagem a partir de referência
type NewCycleFormData = Zod.infer<typeof newCycleFormValidationSchema>

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

  const {
    createNewCycle,
    interruptCurrentCycle,
    activeCycle
  } = useContext(CyclesContext)

  const newCycleForm = useForm<NewCycleFormData>({
    resolver: zodResolver(newCycleFormValidationSchema),
    defaultValues: {
      task: '',
      minutesAmount: 5,
    }
  });

  const { handleSubmit, watch, /*reset*/ } = newCycleForm

  // Transforma o input task em um campo controlado. Renderiza sempre que alterado
  const task = watch('task');
  const isSubmitDisabled = !task;

  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(createNewCycle)} action="">

        <FormProvider {...newCycleForm}>
          <NewCycleForm />
        </FormProvider>
        <Countdown />

        {activeCycle ? (
          <StopCountButton onClick={interruptCurrentCycle} type="button">
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

