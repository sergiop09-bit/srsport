import 'dotenv/config'
import express from 'express'
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import cors from 'cors'

const { MONGO_URI, JWT_SECRET, FRONT_URL, ADMIN_EMAIL, ADMIN_PASS, PORT = 4000 } = process.env

// ---------- Modelos (la forma de los datos en MongoDB) ----------
const opts = { timestamps: true, toJSON: { transform: (_, r) => { r.id = r._id; delete r._id; delete r.__v } } }
const Partido = mongoose.model('Partido', new mongoose.Schema({
  titulo: { type: String, required: true, trim: true },
  deporte: { type: String, enum: ['Fútbol', 'Baloncesto', 'Voleibol'], required: true },
  lugar: { type: String, required: true },
  fecha: { type: String, required: true },
  cupos: { type: Number, min: 1, required: true },
}, opts))
const Mensaje = mongoose.model('Mensaje', new mongoose.Schema({
  nombre: { type: String, required: true, trim: true, maxlength: 60 },
  email: { type: String, required: true, trim: true },
  asunto: String,
  mensaje: { type: String, required: true, minlength: 10, maxlength: 500 },
}, opts))
const Admin = mongoose.model('Admin', new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  hash: { type: String, required: true }, // contraseña cifrada con bcrypt
}))

// ---------- Middleware: solo deja pasar a quien traiga un token válido ----------
const auth = (req, res, next) => {
  try { jwt.verify((req.headers.authorization || '').replace('Bearer ', ''), JWT_SECRET); next() }
  catch { res.status(401).json({ error: 'No autorizado' }) }
}

// ---------- API ----------
const app = express()
app.use(cors({ origin: FRONT_URL || '*' }), express.json())

app.get('/api/partidos', async (_, res) => res.json(await Partido.find().sort({ createdAt: -1 })))
app.post('/api/partidos', auth, async (req, res) => res.status(201).json(await Partido.create(req.body)))
app.delete('/api/partidos/:id', auth, async (req, res) => { await Partido.findByIdAndDelete(req.params.id); res.json({ ok: true }) })
app.put('/api/partidos/:id', auth, async (req, res) => {
  const p = await Partido.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
  if (!p) return res.status(404).json({ error: 'Partido no encontrado' })
  res.json(p)
})

app.post('/api/mensajes', async (req, res) => {
  const { nombre, email, asunto, mensaje } = req.body
  await Mensaje.create({ nombre, email, asunto, mensaje })
  res.status(201).json({ ok: true })
})
app.get('/api/mensajes', auth, async (_, res) => res.json(await Mensaje.find().sort({ createdAt: -1 })))
app.delete('/api/mensajes/:id', auth, async (req, res) => { await Mensaje.findByIdAndDelete(req.params.id); res.json({ ok: true }) })

app.post('/api/login', async (req, res) => {
  const a = await Admin.findOne({ email: req.body.email })
  if (!a || !(await bcrypt.compare(req.body.pass || '', a.hash)))
    return res.status(401).json({ error: 'Credenciales incorrectas' })
  res.json({ token: jwt.sign({ id: a.id }, JWT_SECRET, { expiresIn: '8h' }) })
})

app.use((err, _req, res, _next) => res.status(400).json({ error: err.message }))

// ---------- Arranque ----------
await mongoose.connect(MONGO_URI)
if (ADMIN_EMAIL && ADMIN_PASS && !(await Admin.exists({ email: ADMIN_EMAIL })))
  await Admin.create({ email: ADMIN_EMAIL, hash: await bcrypt.hash(ADMIN_PASS, 10) })
app.listen(PORT, () => console.log(`API lista en http://localhost:${PORT}`))
