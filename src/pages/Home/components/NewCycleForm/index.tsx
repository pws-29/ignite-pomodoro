import {
  FormContainer,
  MinutesAmoutInput,
  TaskInput
} from "./styles"

export function NewCycleForm() {
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
      min={5}
      max={60}
      {...register('minutesAmount', { valueAsNumber: true })}
    />
    <span>minutos.</span>
  </FormContainer>
}