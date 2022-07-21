import { Scroll, Timer } from "phosphor-react"
import { NavLink } from "react-router-dom"
import styled from "styled-components"

import logoIgnite from "../assets/logo-ignite.svg"

export function Header() {
  return (
    <HeaderContainer>
      <img src={logoIgnite} alt="" />
      <nav>
        <NavLink to="/" title="Timer">
          <Timer size={24} />
        </NavLink>
        <NavLink to="/history" title="Histórico">
          <Scroll size={24} />
        </NavLink>
      </nav>
    </HeaderContainer>
  )
};

export const HeaderContainer = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  

    nav {
      display: flex;
      gap: 0.5rem;

      a {
        width: 3rem;
        height: 3rem;

        display: flex;
        justify-content: center;
        align-items: center;

        color: ${props => props.theme["gray-100"]};

        // estilização previa para hover. Ícone centralizado e sem mexer no hover
        border-top: 3px solid transparent;
        border-bottom: 3px solid transparent;

          &:hover {
            border-bottom: 3px solid ${props => props.theme["green-500"]};
          }
          &.active {
            // Navlink coloca uma classe "active" quando a rota da match.
           color: ${props => props.theme["green-500"]};
          }
        }
      } 
    `