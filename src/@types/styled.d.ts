import styled from "styled-components";
import { defaultTheme } from "../styles/themes/default";


// Guardando valor inferido de forma automática dentro de uma variável
type ThemeType = typeof defaultTheme;


// criando uma definição de tipo para o pacote styled-components
// Sobescrever alguma coisa de dentro das tipagens, e não criar do zero a definição de tipos do pacote (por isso a importaçao de styled)
declare module 'styled-components' {
  export interface DefaultTheme extends ThemeType { }
}