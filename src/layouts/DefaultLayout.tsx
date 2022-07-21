import { Outlet } from "react-router-dom";
import styled from "styled-components";
import { Header } from "../components/Header";

export function DefaultLayout() {
  return (
    <LayoutContainer>
      <Header />
      <Outlet />
    </LayoutContainer>
  );
};

export const LayoutContainer = styled.div`
  max-width: 74rem;
  height: calc(100vh - 10rem);
  margin: 5rem auto;
  padding: 2.5rem;

  background-color: ${props => props.theme["gray-800"]};
  border-radius: 8px;

  display: flex;
  flex-direction: column;
`