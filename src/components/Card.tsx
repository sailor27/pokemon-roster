import React from 'react';
import { IPokemon, IAbility } from './';
import styled from 'styled-components';


const StyledLi = styled.li`
  text-align: start;
  list-style-type: none;
  border: 1px solid;
  padding: 15px;
  margin-bottom: 8px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  width: 90%;
`;

const FlexArea = styled.div`
  display: flex;
  flex-flow: column nowrap;
  justify-content:center;
  p, h3 {
    margin: 0;
  }
`;

const ImageArea = styled.div<{src: string, shiny?: string}>`
  background-image: ${(props) => `url(${props.src})`};
  width: 100px;
  height: 100px;
  &:hover {
    background-image: ${(props) => props.shiny ? `url(${props.shiny})`: `url(${props.src})`};
  }
`;
interface CardProps {
  pokemon: IPokemon
  index: number;
}

export function Card({ pokemon: { name, height, abilities, sprites }, index }: CardProps) {
  return (
    <StyledLi
      key={index}>
      <FlexArea>
       <h3>{name}</h3>
        <p>height: {height} in.</p>
        <ImageArea
          src={sprites.front_default}
          shiny={sprites.front_shiny}
        />
      </FlexArea>
      <FlexArea>
        <ul>
          {abilities
            .map((a: IAbility, i: number) =>
            <li key={i}>
              {a.ability.name.replace('-', ' ')} 
            </li>
          )}
        </ul>
      </FlexArea>
    </StyledLi>
  )
};
