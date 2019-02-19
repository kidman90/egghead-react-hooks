import React, { useState, useEffect, useRef } from 'react';
import styled from '@emotion/styled';
import NewTodo from './NewTodo';
import TodoItem from './TodoItem';
// import uniqueId from 'lodash.uniqueid';
import About from './About';

// const dontDoThis = () => {
//   const [nope, setNope] = useState('');
// };

const Container = styled('div')`
  margin: 3em auto 0 auto;
  width: 75%;
  min-width: 300px;
  display: flex;
  flex-direction: column;
  input[type="text"] {
    border-radius: ${props =>
    props.todos.length ? '0.25em 0.25em 0 0' : '0.25em'};
  }
`;

const List = styled('ul')`
  list-style: none;
  border: 2px solid rgba(255, 255, 255, 0.5);
  border-top: none;
  margin: 0;
  padding-left: 0;
`;

// const todos = ['one', 'two', 'three'];
export default function TodoList() {
  const [newTodo, updateNewTodo] = useState('');
  const todoId = useRef(0);
  const initialTodos = () => JSON.parse(window.localStorage.getItem('todos') || '[]');
  const [todos, updateTodos] = useState(initialTodos);
  useEffect(() => {
    window.localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);
  useEffect(() => {
    const inCompleteTodos = todos.reduce(
      (memo, todo) => (!todo.completed ? memo + 1 : memo),
      0
    );
    document.title = inCompleteTodos ? `Todos (${inCompleteTodos})` : 'Todos';
  });
  let [showAbout, setShowAbout] = useState(false);
  useEffect(() => {
    const handleKey = ({ key }) => {
      setShowAbout(show =>
        key === '?' ? true : key === 'Escape' ? false : show
      );
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, []);
  // if (new Date().getDay() === 1) {
  //   const [special, setSpecial] = useState(false);
  // }
  const handleNewSubmit = e => {
    e.preventDefault();
    todoId.current += 1
    updateTodos(prevTodos => [
      ...prevTodos,
      {
        id: todoId.current,
        text: newTodo,
        completed: false
      }
    ]);
    updateNewTodo('');
  };
  const handleNewChange = e => updateNewTodo(e.target.value);
  const handleDelete = id => {
    updateTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
  };
  const handleCompletedToggle = id => {
    updateTodos(prevTodos =>
      prevTodos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  return (
    <Container todos={todos}>
      <NewTodo
        onSubmit={handleNewSubmit}
        value={newTodo}
        onChange={handleNewChange}
      />
      {/* <ul>
        {todos.map(item => {
          const [count, setCount] = useState(0);
          return (
            <li onClick={() => setCount(count + 1)}>
              {item}: {count}
            </li>
          );
        })}
      </ul> */}
      {!!todos.length && (
        <List>
          {todos.map(todo => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onChange={handleCompletedToggle}
              onDelete={handleDelete}
            />
          ))}
        </List>
      )}
      <About isOpen={showAbout} onClose={() => setShowAbout(false)} />
    </Container>
  );
}
