import { Play } from "phosphor-react";

import {
  HomeContainer,
  FormContainer,
  CountdownContainer,
  StartCountButton,
  Separator,
  TaskInput,
  MinutesAmoutInput
} from "./styles"

export function Home() {
  return (
    <HomeContainer>
      <form action="">
        <FormContainer>
          <label htmlFor="task">Vou trabalhar em</label>
          <TaskInput
            id="task"
            placeholder="Dê um nome para o seu projeto"
          />

          <label htmlFor="minutesAmout">durante</label>
          <MinutesAmoutInput
            id="minutesAmount"
            type="number"
            placeholder="00"
          />
          <span>minutos.</span>
        </FormContainer>

        <CountdownContainer>
          <span>0</span>
          <span>0</span>
          <Separator>:</Separator>
          <span>0</span>
          <span>0</span>
        </CountdownContainer>

        <StartCountButton type="submit">
          <Play size={24} />
          Começar
        </StartCountButton>
      </form>
    </HomeContainer>
  );
};

