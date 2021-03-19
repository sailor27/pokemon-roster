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
      style={{
        listStyleType: 'none',
        textAlign: 'start',
        border: '1px solid',
        padding: '15px',
        margin: '5px'
      }}
      key={index}>
      {name}
      <span>: {height} in.</span>
    </li>
  )
};
