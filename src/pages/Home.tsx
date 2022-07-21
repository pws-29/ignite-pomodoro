import { Play } from "phosphor-react";
import styled from "styled-components";

export function Home() {
  return (
    <HomeContainer>
      <form action="">
        <FormContainer>
          <label htmlFor="task">Vou trabalhar em</label>
          <input id="task" />
          <label htmlFor="minutesAmout">durante</label>
          <input id="minutesAmount" type="number" />
          <span>minutos.</span>
        </FormContainer>

        <CountdownContainer>
          <span>0</span>
          <span>0</span>
          <Separator>:</Separator>
          <span>0</span>
          <span>0</span>
        </CountdownContainer>

        <button type="submit">
          <Play size={24} />
          Começar
        </button>
      </form>
    </HomeContainer>
  );
};

export const HomeContainer = styled.main`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;

    form {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 3.5rem;
    }
`

export const FormContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  color: ${props => props.theme["gray-100"]};
  font-size: 1.125rem;
  font-weight: bold;
  flex-wrap: wrap;
`

export const CountdownContainer = styled.div`
  font-family: 'Roboto Mono', monospace;
  font-size: 10rem;
  line-height: 8rem;
  color: ${props => props.theme["gray-100"]};

  display: flex;
  gap: 1rem;

    span {
      background: ${props => props.theme["gray-700"]};
      padding: 2rem 1rem;
      border-radius: 8px;
    }
`

export const Separator = styled.div`
  padding: 2rem 0;
  color: ${props => props.theme["green-500"]};

  width: 4rem;
  overflow: hidden;

  display: flex;
  justify-content: center;
` 