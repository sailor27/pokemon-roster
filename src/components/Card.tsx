import React from 'react';

interface CardProps {
  name: string;
}

export function Card({name}: CardProps) {
  return (
    <li>
      {name}
    </li>
  )
}