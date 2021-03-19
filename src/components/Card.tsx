import React from 'react';
import { IPokemon } from './';
// import styled from 'styled-components';


// const StyledLi = styled.li
interface CardProps {
  pokemon: IPokemon
  index: number;
}

export function Card({pokemon: {name, height}, index}: CardProps) {
  return (
    <li
      key={index}>
      {name}
      <span>{height}</span>
    </li>
  )
};
