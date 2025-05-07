/* eslint-disable max-len */
import React, { useEffect, useState } from 'react';
import 'bulma/css/bulma.css';
import '@fortawesome/fontawesome-free/css/all.css';

import { TodoList } from './components/TodoList';
import { TodoFilter } from './components/TodoFilter';
import { TodoModal } from './components/TodoModal';
import { Loader } from './components/Loader';

import { Todo } from './types/Todo';
import { getTodos } from './api';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [todosFromServer, setTodosFromServer] = useState<Todo[]>([]);

  const [active, setActive] = useState('all');
  const [searchSelect, setSearchSelect] = useState<Todo[]>([]);
  const [loader, setLoader] = useState(false);
  const [modalClose, setModalClose] = useState(false);

  const doSearch = (content: string) => {
    if (active === 'all') {
      if (content === '') {
        setTodos(todosFromServer);

        return;
      }

      setTodos(todosFromServer.filter(item => item.title.includes(content)));
    } else {
      setTodos(searchSelect.filter(item => item.title.includes(content)));
    }
  };

  const doSearchSelect = (content: string) => {
    switch (content) {
      case 'all':
        setTodos(todosFromServer);
        setActive('all');

        break;

      case 'active':
        const doFilterActiv = todosFromServer.filter(item => !item.completed);

        setActive('active');
        setTodos(doFilterActiv);
        setSearchSelect(doFilterActiv);
        break;

      case 'completed':
        const doFilterCompleted = todosFromServer.filter(
          item => item.completed,
        );

        setActive('completed');
        setTodos(doFilterCompleted);
        setSearchSelect(doFilterCompleted);
        break;
    }
  };

  useEffect(() => {
    setLoader(true);

    getTodos()
      .then(response => {
        setTodos(response);
        setTodosFromServer(response);
      })
      .finally(() => setLoader(false));
  }, []);

  return (
    <>
      <div className="section">
        <div className="container">
          <div className="box">
            <h1 className="title">Todos:</h1>

            <div className="block">
              <TodoFilter doSearch={doSearch} doSearchSelect={doSearchSelect} />
            </div>

            <div className="block">
              {loader ? (
                <Loader />
              ) : (
                <TodoList todosArray={todos} setModalClose={setModalClose} />
              )}
            </div>
          </div>
        </div>
      </div>

      {modalClose && (
        <TodoModal loader={loader} setModalClose={setModalClose} />
      )}
    </>
  );
};
