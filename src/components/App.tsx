import React, { useState, useEffect, MouseEvent, ChangeEvent } from 'react';
import { Card } from './';
import axios, { AxiosResponse } from 'axios';
import styled from 'styled-components';
import './App.css';

const StyledUl = styled.ul`
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  justify-content: center;
  padding: 0;
  max-width: 650px;
`;
const StyledFieldSet = styled.fieldset`
  display: flex;
  flex-flow: column nowrap;
  border: none;
`;
export interface IAbility {
  ability: {
    name: string;
    url: string;
  };
  is_hidden: boolean;
  slot: number;
}
export interface IPokemon {
  name: string;
  id: number;
  url: string;
  height: number;
  abilities: IAbility[];
  sprites: {
    front_default: string;
    front_shiny?: string;
  }
}

function App() {
  const [pokemonList, setPokemonList] = useState<IPokemon[]>([]);
  const [filteredList, setFilteredList] = useState<IPokemon[]>([]);
  const [heightInput, setHeightInput] = useState<number | string>('');
  const [abilityInput, setAbilityInput] = useState<string>('');
  const [query, setQuery] = useState<string>('');

  const apiUrl: string = 'https://pokeapi.co/api/v2/pokemon';

  useEffect(() => {
    loadPokemon(50);
  }, []);

  useEffect(() => {
    if (heightInput) {
      const filteredList: IPokemon[] = pokemonList.filter((p) => p.height === +heightInput);
      setFilteredList(filteredList);
    } else {
      setFilteredList(pokemonList);
    }
  }, [heightInput, pokemonList]);

  useEffect(() => {
    const newList: IPokemon[] = Array.from(pokemonList);
    if (!!query && newList.length) setFilteredList(filterByAbility(query, newList));
  }, [query]);

  
  async function loadPokemon (length: number): Promise<void> {
    try {
      let responseData: AxiosResponse = await axios.get(apiUrl);
      let total: number = responseData.data.results.length;
      let results: IPokemon[] = [...responseData.data.results];
      let nextUrl = responseData.data.next;

      while (total <= length) {
        responseData = await axios.get(nextUrl);
        results = [...results, ...responseData.data.results];
        nextUrl = responseData.data.next;
        total = results.length;
      }

      results = results.slice(0, length);

      const urls: string[] = results.map((p: IPokemon) => p.url);
      const promises: Promise<AxiosResponse>[] = urls.map((url: string) => axios.get(url));

      const newResponseData: AxiosResponse[] = await Promise.all(promises);
      const completePokemon: IPokemon[] = newResponseData.map((r: AxiosResponse) => r.data);
      setFilteredList(completePokemon);    
      setPokemonList(completePokemon);    

    } catch (err) {
      console.error(err)
    }
  }

  function filterByAbility(query: string, list: IPokemon[]) {
    const formattedQueryString: string = query.trim().replace(' ', '-');
    return filteredList
      .filter((p: IPokemon) => p.abilities
        .some(a => a.ability.name === formattedQueryString));
  };

  function handleSearchClick(e: MouseEvent<HTMLButtonElement>) {
    setQuery(abilityInput);
    setAbilityInput('');
  }

  function handleAbilityInput(e: ChangeEvent<HTMLInputElement>) {
    setAbilityInput(e.target.value);
  }

  function handleHeightInput(e: ChangeEvent<HTMLInputElement>) {
    setHeightInput(e.target.value)
  }

  function handleClear(e: MouseEvent<HTMLButtonElement>) {
    setQuery('');
    setAbilityInput('');
    setHeightInput('');
    setFilteredList(pokemonList);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Poke Roster 💛💚💜</h1>
        <h4>Find pokemon by height and ability</h4>
          <StyledFieldSet>
            <label>height</label>
            <input
              onChange={handleHeightInput}
              type='number'
              alt='height-input'
              value={heightInput}
            />
          </StyledFieldSet>
          <StyledFieldSet>
            <label>ability</label>
            <input
              onChange={handleAbilityInput}
              type='string'
              alt='ability-input'
              value={abilityInput}
            />
            </StyledFieldSet>
          <StyledFieldSet>
            <button
              onClick={handleSearchClick}
              aria-label='query-ability'
            >
              search
            </button>
            <button
              onClick={handleClear}
              aria-label='clear-filters'
            >
              clear
            </button>
          </StyledFieldSet>
      </header>
      <p>displaying {filteredList.length} pokemon</p>
      <StyledUl>
        {filteredList.map((p: IPokemon, i: number) => (
          <Card
            key={i}
            pokemon={p}
            index={i}
          />
        ))}
      </StyledUl>
    </div>
  );
}

export default App;
