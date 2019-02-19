import React from 'react';
import styled from '@emotion/styled';
import { Dialog } from '@reach/dialog';

const Button = styled('button')`
  position: absolute;
  top: 0;
  right: 0;
  font-weight: 400;
  color: black;
  font-size: 0.75em;
  border: 1px solid transparent;
  background-color: transparent;
  margin: 5px;
  cursor: pointer;
  padding: 2px;
  width: 1.75em;
`;

export default function TodoItem({ isOpen, onClose }) {
  return (
    <Dialog isOpen={isOpen}>
      <Button onClick={onClose}>✕</Button>
      <header>
        <h1>Todos React Application</h1>
      </header>
      <p>
        Demo for the{' '}
        <a href="https://egghead.io">State and Effects in Function Components with React Hooks</a>{' '}
        course on <a href="https://egghead.io">Egghead.io</a>
      </p>
      <p>
        Written by <a href="https://egghead.io">Elijah Manor</a> (<a href="https://egghead.io">@elijahmanor</a>)
      </p>
    </Dialog>
  );
}
