import React, { useState, useEffect } from 'react';
import axios, { AxiosResponse } from 'axios';
import './App.css';
import { Card } from './';

export interface IPokemon {
  name: string;
  id: number;
  url: string;
  height: number;
}

function App() {
  const [pokemonList, setPokemonList] = useState<IPokemon[]>([]);
  const [filteredList, setFilteredList] = useState<IPokemon[]>([]);
  const [heightInput, setHeightInput] = useState<number | string>('');

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
  }, [ heightInput ]);

  
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
      const completePokemon: any = newResponseData.map((r: AxiosResponse) => r.data);
      setFilteredList(completePokemon);    
      setPokemonList(completePokemon);    

    } catch (err) {
      console.error(err)
    }
  }
  return (
    <div className="App">
      <header className="App-header">
        <h1>Poke Roster 💛💙💚💜</h1>
        <fieldset style={{
          display: 'flex',
          flexFlow: 'column nowrap',
          border: 'none'
        }}>
          <label>height</label>
          <input
            onChange={(e: any) => setHeightInput(e.target.value)}
            type='number'
            alt='height-input'
          />
        </fieldset>
        {filteredList.map((p: IPokemon, i: number) => (
          <Card
            key={i}
            pokemon={p}
            index={i}
          />
        ))}
      </header>
    </div>
  );
}

export default App;
