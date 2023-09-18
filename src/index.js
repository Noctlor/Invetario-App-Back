const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const errorHandler = require('./middleware/error')

const app = express();
const port = 3000;


const http = require('http');
const socketIo = require('socket.io');

const server = http.createServer(app);
const io = socketIo(server);


io.on('connection', (socket) => {
  console.log('Un cliente se ha conectado');
  
  // Maneja eventos de WebSocket aquí
  socket.on('mensaje', (data) => {
    console.log('Mensaje recibido desde el cliente:', data);
    // Puedes emitir mensajes de vuelta al cliente si es necesario
    socket.emit('respuesta', 'Mensaje recibido por el servidor');
  });

  socket.on('disconnect', () => {
    console.log('Un cliente se ha desconectado');
  });
});
// Conexión a la base de datos MongoDB
mongoose.connect('mongodb://0.0.0.0:27017/Proinsur', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Error connecting to MongoDB', err));


// Middlewares
app.use(errorHandler);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Rutas
const usersRoutes = require('./routes/users');
const productsRoutes = require('./routes/products');

app.use('/users', usersRoutes);
app.use('/products', productsRoutes);

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
