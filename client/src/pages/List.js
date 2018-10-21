import React from 'react';

export default function List({ match }) {
  return (
    <div>
      <h1>{match.params.listId}</h1>
    </div>
  );
}