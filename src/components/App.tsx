import React, { useState, useEffect } from 'react';
import axios, { AxiosResponse } from 'axios';
import './App.css';
import { Card } from './';

interface IPokemon {
  name: string;
}

function App() {
  const [pokemonList, setPokemonList] = useState<IPokemon[]>([]);
  const apiUrl: string = 'https://pokeapi.co/api/v2/pokemon';

  useEffect(() => {
    loadPokemon(50);
  }, []);
  
 
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
      }
      setPokemonList(results);
      console.log(results);
    

    } catch (err) {
      console.error(err)
    }
  }
  return (
    <div className="App">
      <header className="App-header">
        <h1>Poke Roster 💛💙💚💜</h1>
        {pokemonList.map((p: IPokemon, i: number) => (
          <li>hi</li>
          // <Card
          //   name={p.name}
          //  key={i}
          // />
        ))}
      </header>
    </div>
  );
}

export default App;
