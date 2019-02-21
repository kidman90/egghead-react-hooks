import React, { useState, useEffect, useRef, useReducer, useMemo, useContext } from 'react';
import styled from '@emotion/styled';
import NewTodo from './NewTodo';
import TodoItem from './TodoItem';
// import uniqueId from 'lodash.uniqueid';
import About from './About';
import { useTitle as useDocumentTitle } from 'react-use';
import ThemeContext from './ThemeContext';
import styles from './styles';

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
  border: 2px solid ${props => styles[props.theme].list.borderColor};
  border-top: none;
  margin: 0;
  padding-left: 0;
`;

const useTodosWithLocalStorage = (defaultValue) => {
  const todoId = useRef(0);
  const initialValue = () => {
    const valueFromStorage = JSON.parse(
      window.localStorage.getItem('todos') ||
      JSON.stringify(defaultValue)
    );
    todoId.current = valueFromStorage.reduce(
      (memo, todo) => Math.max(memo, todo.id),
      0
    );
    return valueFromStorage;
  };
  const [todos, dispatch] = useReducer((state, action) => {
    switch (action.type) {
      case 'ADD_TODO':
        todoId.current += 1
        return [
          ...state,
          {
            id: todoId.current,
            text: action.text,
            completed: false
          }
        ];
      case 'DELETE_TODO':
        return state.filter(todo => todo.id !== action.id);
      case 'TOGGLE_TODO':
        return state.map(todo =>
          todo.id === action.id ? { ...todo, completed: !todo.completed } : todo
        );
      default:
        return state;
    }
  }, useMemo(initialValue, []));
  useEffect(() => {
    window.localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);
  return [todos, dispatch];
};

// const useLocalStorage = (key, defaultValue, callback) => {
//   const initialValue = () => {
//     const valueFromStorage = JSON.parse(window.localStorage.getItem(key) || JSON.stringify(defaultValue));
//     if (callback) {
//       callback(valueFromStorage);
//     }
//     return valueFromStorage;
//   };
//   const [storage, setStorage] = useState(initialValue);
//   useEffect(() => {
//     window.localStorage.setItem(key, JSON.stringify(storage));
//   }, [storage]);
//   return [storage, setStorage];
// };

// const useDocumentTitle = title => {
//   useEffect(() => {
//     document.title = title;
//   }, [title]);
// };

const useKeyDown = (map, defaultValue) => {
  const [match, setMatch] = useState(defaultValue);
  useEffect(() => {
    const handleKey = ({ key }) => {
      setMatch(prevMatch =>
        Object.keys(map).some(k => k === key)
          ? map[key]
          : prevMatch
      );
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, []);
  return [match, setMatch];
};
// const todos = ['one', 'two', 'three'];
export default function TodoList() {
  const [newTodo, updateNewTodo] = useState('');
  const [todos, dispatch] = useTodosWithLocalStorage();
  const inCompleteTodos = todos.reduce(
    (memo, todo) => (!todo.completed ? memo + 1 : memo),
    0
  );
  const title = inCompleteTodos ? `Todos (${inCompleteTodos})` : 'Todos';
  useDocumentTitle(title);
  let [showAbout, setShowAbout] = useKeyDown({
    '?': true,
    Escape: false
  }, false);
  // if (new Date().getDay() === 1) {
  //   const [special, setSpecial] = useState(false);
  // }
  const handleNewSubmit = e => {
    e.preventDefault();
    dispatch({ type: 'ADD_TODO', text: newTodo });
    updateNewTodo('');
  };
  const handleNewChange = e => updateNewTodo(e.target.value);
  const handleDelete = id => {
    dispatch({ type: 'DELETE_TODO', id });
  };
  const handleCompletedToggle = id => {
    dispatch({ type: 'TOGGLE_TODO', id });
  };
  const theme = useContext(ThemeContext);

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
        <List theme={theme}>
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
