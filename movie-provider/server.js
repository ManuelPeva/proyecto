// server.js
const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost/movie_provider', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

// Movie Schema
const movieSchema = new mongoose.Schema({
  title: String,
  overview: String,
  release_date: String,
  popularity: Number
});

const Movie = mongoose.model('Movie', movieSchema);

// API endpoint to fetch movies
app.get('/api/movies', async (req, res) => {
  try {
    const response = await axios.get('https://api.themoviedb.org/3/movie/popular', {
      params: {
        api_key: 'c2525d0edb9b982c034d6f755a582ad4'
      }
    });
    const movies = response.data.results;

    // Guardar películas en MongoDB (eliminando duplicados)
    await Movie.deleteMany({});
    await Movie.insertMany(movies);

    res.json({ movies });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to load movies' });
  }
});

// Ruta de bienvenida para manejar solicitudes a la raíz
app.get('/', (req, res) => {
  res.send('Bienvenido al proveedor de películas');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// server.js

// Ruta para el registro de usuarios
app.post('/api/register', async (req, res) => {
  try {
    const { nombre, email, password } = req.body;

    // Verificar si el usuario ya está registrado
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ error: 'El correo electrónico ya está registrado' });
    }

    // Crear un nuevo usuario
    user = new User({ nombre, email, password });
    await user.save();

    res.json({ message: 'Usuario registrado exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
});

// Ruta para el inicio de sesión de usuarios
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Verificar si el usuario existe en la base de datos
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Credenciales inválidas' });
    }

    // Verificar la contraseña
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Credenciales inválidas' });
    }

    // Generar token de autenticación
    const token = generateAuthToken(user._id);

    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
});

// Esquema del modelo de usuario
const userSchema = new mongoose.Schema({
  nombre: String,
  email: {
    type: String,
    unique: true, // El correo electrónico debe ser único en la base de datos
    required: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6 // Longitud mínima de la contraseña
  }
});

// metodo para comparar contraseñas 
userSchema.methods.comparePassword = async function(candidatePassword){
  const user = this;
  return await bcrypt.compare(candidatePassword, user.password);
}

const User = mongoose.model('User', userSchema);

