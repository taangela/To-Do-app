const express = require('express');
const socket = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors())

const tasks = [];

const server = app.listen(process.env.PORT || 8000, () => {
  console.log('Server is running...');
});

app.use((req, res) => {
  res.status(404).send({ message: 'Not found...' });
});

const io = socket(server);

io.on('connection', socket => {
  console.log('New client! Its id – ' + socket.id);
  socket.emit('updateData', tasks);

  socket.on('addTask', newTask => {
    if (!tasks.find(task => task.id == newTask.id)) {
      tasks.push(newTask);
      socket.broadcast.emit('addTask', newTask);
    }
  });
  socket.on('removeTask', (task) => {
    const index = tasks.findIndex(taskToRemove => taskToRemove.id == task.id);
    if (index > -1) {
      tasks.splice(index, 1);
      socket.broadcast.emit('removeTask', task);
    }
  });
});