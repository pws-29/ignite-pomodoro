import { differenceInSeconds } from "date-fns";
import { useContext, useEffect, useState } from "react";
import { CyclesContext } from "../../../../contexts/CyclesContext";
import { CountdownContainer, Separator } from "./styles"

export function Countdown() {
  const {
    activeCycle,
    activeCycleId,
    markCurrentCycleAsFinished,
    amountSecondsPassed,
    setSecondsPassed
  } = useContext(CyclesContext);

  const [documentIsVisible, setDocumentIsVisible] = useState('');
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
          markCurrentCycleAsFinished();
          // novo cálculo de diferença é igual, não é mais atualizado o que passou, deixando 1s no painel
          setSecondsPassed(totalSeconds)
          clearInterval(interval);
        } else {
          setSecondsPassed(secondsDifference);
        }
      }, 1000)
    }

    return () => {
      clearInterval(interval)
    }
  }, [activeCycle, totalSeconds, activeCycleId, markCurrentCycleAsFinished, setSecondsPassed])

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
    if (activeCycle && documentIsVisible === 'hidden' && !activeCycle.finishedDate) {
      document.title = `Ignite Timer: ${minutes}:${seconds}`;
    } else {
      document.title = "Ignite Timer"
    }
  }, [minutes, seconds, activeCycle, documentIsVisible])

  return (
    <CountdownContainer>
      <span>{minutes[0]}</span>
      <span>{minutes[1]}</span>
      <Separator>:</Separator>
      <span>{seconds[0]}</span>
      <span>{seconds[1]}</span>
    </CountdownContainer>
  )
}