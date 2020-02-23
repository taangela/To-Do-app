import React from 'react';
import io from 'socket.io-client';
import uuidv4 from 'uuid';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tasks: [],
      taskName: {}
    };

    this.submitForm = this.submitForm.bind(this);
    this.changeValue = this.changeValue.bind(this);
  }

  componentDidMount() {
    this.socket = io('http://localhost:8000');

    this.socket.on('addTask', newTask => {
      this.addTask(newTask);
    });
    this.socket.on('removeTask', (task) => {
      this.removeTask(task);
    });
    this.socket.on('updateData', tasks => {
      this.updateData(tasks);
    });
  }

  updateData(tasks) {
    this.setState({ tasks: tasks });
  }

  submitForm(event) {
    const { taskName } = this.state;
    event.preventDefault();
    this.addTask(taskName);
    this.socket.emit('addTask', taskName);
  }

  addTask(newTask) {
    const { tasks } = this.state;
    if (!tasks.find(task => task.id === newTask.id)) {
      tasks.push(newTask);
      this.setState(tasks);
    }
  }

  removeTask(task) {
    const { tasks } = this.state;

    const index = tasks.findIndex(taskToRemove => taskToRemove.id === task.id);
    if (index > -1) {
      this.setState(tasks.splice(index, 1));
      this.socket.emit('removeTask', task);
    }
  }

  changeValue(event) {
    this.setState({
      taskName: {
        name: event.target.value,
        id: uuidv4()
      }
    });
  }

  render() {
    const { tasks, taskName } = this.state;
    return (
      <div className='App'>
        <header>
          <h1>ToDoList.app</h1>
        </header>

        <section className='tasks-section' id='tasks-section'>
          <h2>Tasks</h2>

          <ul className='tasks-section__list' id='tasks-list'>
            {tasks.map(task => (
              <li key={task.name} className='task'>
                {task.name}
                {''}
                <button
                  onClick={ignoredEvent => this.removeTask(task)}
                  className='btn btn--red'
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>

          <form id='add-task-form' onSubmit={this.submitForm}>
            <input
              className='text-input'
              autoComplete='off'
              type='text'
              placeholder='Type your description'
              id='task-name'
              value={taskName.name}
              onChange={this.changeValue}
            />
            <button className='btn' type='submit'>
              Add
            </button>
          </form>
        </section>
      </div>
    );
  }
}

export default App;