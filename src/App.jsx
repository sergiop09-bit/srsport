import { HashRouter, Routes, Route, NavLink, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { api, getToken, setToken } from './api'

const DEPORTES = ['Fútbol', 'Baloncesto', 'Voleibol']
const ICONO = { Fútbol: '⚽', Baloncesto: '🏀', Voleibol: '🏐' }

// Pide una lista a la API (Express + MongoDB)
function useColeccion(ruta) {
  const [filas, setFilas] = useState([])
  const [cargando, setCargando] = useState(true)
  const cargar = () =>
    api(ruta)
      .then(setFilas)
      .catch(() => setFilas([]))
      .finally(() => setCargando(false))
  useEffect(() => { cargar() }, [])
  return [filas, cargar, cargando]
}

function Nav() {
  const [abierto, setAbierto] = useState(false)
  const links = [['/', 'Inicio'], ['/partidos', 'Partidos'], ['/rutinas', 'Rutinas IA'], ['/contacto', 'Contacto'], ['/admin', 'Admin']]
  return (
    <header className="nav">
      <NavLink to="/" className="logo">SR<span>sport</span></NavLink>
      <button className="menu-btn" aria-label="Abrir menú" aria-expanded={abierto} onClick={() => setAbierto(!abierto)}>☰</button>
      <nav className={abierto ? 'abierto' : ''}>
        {links.map(([to, t]) => <NavLink key={to} to={to} onClick={() => setAbierto(false)}>{t}</NavLink>)}
      </nav>
    </header>
  )
}

function Inicio() {
  return (
    <>
      <section className="hero"><div>
        <h1>Juega con gente que juega como tú</h1>
        <p>Encuentra partidos de fútbol, baloncesto y voleibol cerca de ti, completa tu equipo y entrena con rutinas hechas a tu medida.</p>
        <Link to="/partidos" className="btn">Ver partidos</Link>
      </div></section>
      <main>
        <h2>Elige tu deporte</h2>
        <div className="grid">
          {DEPORTES.map(d => (
            <div className="card" key={d} data-aos="fade-up"><div className="big">{ICONO[d]}</div><h3>{d}</h3>
              <p className="suave">Partidos abiertos y jugadores buscando equipo.</p></div>
          ))}
        </div>
        <h2>Cómo funciona</h2>
        <div className="grid">
          <div className="card" data-aos="fade-up"><h3>1. Busca</h3><p className="suave">Filtra los partidos por deporte y mira lugar, fecha y cupos.</p></div>
          <div className="card" data-aos="fade-up" data-aos-delay="150"><h3>2. Únete</h3><p className="suave">Escríbenos y te reservamos un cupo en el partido.</p></div>
          <div className="card" data-aos="fade-up" data-aos-delay="300"><h3>3. Entrena</h3><p className="suave">Genera una rutina según tu deporte, nivel y objetivo.</p></div>
        </div>

        <h2>Por qué SRsport</h2>
        <div className="grid">
          <div className="card" data-aos="fade-up">
            <h3>Comunidad real</h3>
            <p className="suave">Conoce personas de tu ciudad que comparten tu pasión por el deporte.</p>
          </div>
          <div className="card" data-aos="fade-up" data-aos-delay="150">
            <h3>Equipos completos</h3>
            <p className="suave">Evita partidos cancelados por falta de jugadores.</p>
          </div>
          <div className="card" data-aos="fade-up" data-aos-delay="300">
            <h3>Entrena mejor</h3>
            <p className="suave">Rutinas según tu deporte, tu nivel y tu objetivo.</p>
          </div>
        </div>

        <div className="card" data-aos="zoom-in" style={{ marginTop: 32, textAlign: 'center' }}>
          <h3>¿Listo para jugar?</h3>
          <p className="suave">Escríbenos y te ayudamos a encontrar tu próximo partido.</p>
          <Link to="/contacto" className="btn">Contáctanos</Link>
        </div>
      </main>
    </>
  )
}

function Partidos() {
  const [partidos, , cargando] = useColeccion('partidos')
  const [filtro, setFiltro] = useState('Todos')
  const lista = filtro === 'Todos' ? partidos : partidos.filter(p => p.deporte === filtro)
  return (
    <main>
      <h2>Partidos abiertos</h2>
      <div className="tabs">
        {['Todos', ...DEPORTES].map(d => (
          <button key={d} className={filtro === d ? 'on' : ''} onClick={() => setFiltro(d)}>{d}</button>
        ))}
      </div>
      {cargando && <p className="suave">Cargando partidos... la primera vez puede tardar unos segundos.</p>}
{!cargando && lista.length === 0 && <p className="suave">Todavía no hay partidos de este deporte. Vuelve pronto o propón uno desde Contacto.</p>}
      <div className="grid">
        {lista.map(p => (
          <div className="card" key={p.id} data-aos="zoom-in">
            <div className="big">{ICONO[p.deporte]}</div>
            <h3>{p.titulo}</h3>
            <p className="suave">{p.lugar} · {p.fecha}</p>
            <p className="cupo">Faltan {p.cupos} jugadores</p>
            <Link to="/contacto" className="btn sm">Unirme</Link>
          </div>
        ))}
      </div>
    </main>
  )
}

function Contacto() {
  const [f, setF] = useState({ nombre: '', email: '', asunto: 'Unirme a un partido', mensaje: '' })
  const [estado, setEstado] = useState('')
  const cambiar = e => setF({ ...f, [e.target.name]: e.target.value })
  const enviar = async e => {
    e.preventDefault()
    try {
      await api('mensajes', { method: 'POST', body: f })
      setEstado('ok'); setF({ nombre: '', email: '', asunto: f.asunto, mensaje: '' })
    } catch { setEstado('error') }
  }
  return (
    <main>
      <h2>Contacto</h2>
      <form onSubmit={enviar}>
        <label>Nombre<input name="nombre" value={f.nombre} onChange={cambiar} required /></label>
        <label>Correo<input name="email" type="email" value={f.email} onChange={cambiar} required /></label>
        <label>Asunto
          <select name="asunto" value={f.asunto} onChange={cambiar}>
            <option>Unirme a un partido</option><option>Proponer una cancha</option><option>Otro</option>
          </select></label>
        <label>Mensaje<textarea name="mensaje" rows="4" value={f.mensaje} onChange={cambiar} required /></label>
        <button className="btn">Enviar mensaje</button>
        {estado === 'ok' && <p className="okmsg">Mensaje enviado. Te responderemos pronto.</p>}
        {estado === 'error' && <p className="err">No se pudo enviar. Revisa tu conexión e inténtalo de nuevo.</p>}
      </form>
    </main>
  )
}

// IA aplicada (versión 1): generador de rutinas con reglas propias.
// Más adelante se puede reemplazar por una llamada a un modelo de IA.
const EJERCICIOS = {
  Fútbol: ['Conducción con conos', 'Pases en parejas', 'Sprints de 20 m', 'Tiros a puerta'],
  Baloncesto: ['Dribling con ambas manos', 'Tiros libres', 'Saltos al cajón', 'Defensa lateral'],
  Voleibol: ['Saques', 'Recepción en pareja', 'Saltos de bloqueo', 'Remates'],
}
const OBJETIVOS = {
  Resistencia: 'Trote suave de 15 min + 3 series de 8 min a ritmo constante',
  Fuerza: '4 series de 8 repeticiones de sentadillas, zancadas y planchas',
  Técnica: '20 min repitiendo el gesto técnico con calma y precisión',
}
const SERIES = { Principiante: 2, Intermedio: 3, Avanzado: 4 }

function generarRutina({ deporte, nivel, objetivo, dias }) {
  const ej = EJERCICIOS[deporte]
  const s = SERIES[nivel]
  return Array.from({ length: dias }, (_, i) =>
    `Día ${i + 1}\n• Calentamiento: 10 min de movilidad\n• ${ej[i % ej.length]}: ${s} series de 10 repeticiones\n• ${ej[(i + 1) % ej.length]}: ${s} series de 10 repeticiones\n• Enfoque (${objetivo}): ${OBJETIVOS[objetivo]}\n• Estiramiento: 5 min`
  ).join('\n\n')
}

function Rutinas() {
  const [f, setF] = useState({ deporte: 'Fútbol', nivel: 'Principiante', objetivo: 'Resistencia', dias: 3 })
  const [plan, setPlan] = useState('')
    const [copiado, setCopiado] = useState(false)
  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(plan)
      setCopiado(true)
      setTimeout(() => setCopiado(false), 2000)
    } catch {
      alert('No se pudo copiar. Selecciona el texto y cópialo manualmente.')
    }
  }

  const cambiar = e => setF({ ...f, [e.target.name]: e.target.name === 'dias' ? +e.target.value : e.target.value })
  return (
    <main>
      <h2>Generador de rutinas</h2>
      <p className="suave">Cuéntanos tu deporte y tu nivel, y armamos tu plan semanal.</p>
      <form onSubmit={e => { e.preventDefault(); setPlan(generarRutina(f)) }}>
        <label>Deporte<select name="deporte" value={f.deporte} onChange={cambiar}>{DEPORTES.map(d => <option key={d}>{d}</option>)}</select></label>
        <label>Nivel<select name="nivel" value={f.nivel} onChange={cambiar}>{Object.keys(SERIES).map(n => <option key={n}>{n}</option>)}</select></label>
        <label>Objetivo<select name="objetivo" value={f.objetivo} onChange={cambiar}>{Object.keys(OBJETIVOS).map(o => <option key={o}>{o}</option>)}</select></label>
        <label>Días por semana<select name="dias" value={f.dias} onChange={cambiar}>{[2, 3, 4, 5].map(n => <option key={n}>{n}</option>)}</select></label>
        <button className="btn">Crear mi rutina</button>
      </form>
      {plan && (
        <div className="card" style={{ marginTop: 24 }}>
          <pre>{plan}</pre>
          <button className="btn sec sm" onClick={copiar}>
            {copiado ? '¡Copiada!' : 'Copiar rutina'}
          </button>
        </div>
      )}
    </main>
  )
}

function Admin() {
  const [user, setUser] = useState(!!getToken())
  const [cred, setCred] = useState({ email: '', pass: '' })
  const [error, setError] = useState('')
  const [partidos, recargarP] = useColeccion('partidos')
  const [mensajes, recargarM] = useColeccion('mensajes')
  const [p, setP] = useState({ titulo: '', deporte: 'Fútbol', lugar: '', fecha: '', cupos: 1 })

  const entrar = async e => {
    e.preventDefault(); setError('')
    try {
      const r = await api('login', { method: 'POST', body: { email: cred.email, pass: cred.pass } })
      setToken(r.token); setUser(true); recargarP(); recargarM()
    } catch { setError('Correo o contraseña incorrectos.') }
  }
  const crear = async e => {
    e.preventDefault()
    await api('partidos', { method: 'POST', body: { ...p, cupos: +p.cupos } })
    setP({ titulo: '', deporte: 'Fútbol', lugar: '', fecha: '', cupos: 1 }); recargarP()
  }
  const borrar = async (col, id, recargar) => { await api(`${col}/${id}`, { method: 'DELETE' }); recargar() }

  if (!user) return (
    <main>
      <h2>Acceso administrador</h2>
      <form onSubmit={entrar}>
        <label>Correo<input type="email" value={cred.email} onChange={e => setCred({ ...cred, email: e.target.value })} required /></label>
        <label>Contraseña<input type="password" value={cred.pass} onChange={e => setCred({ ...cred, pass: e.target.value })} required /></label>
        <button className="btn">Entrar</button>
        {error && <p className="err">{error}</p>}
      </form>
    </main>
  )
  return (
    <main>
      <div className="row"><h2>Panel de gestión</h2><button className="btn sec sm" onClick={() => { setToken(''); setUser(false) }}>Cerrar sesión</button></div>
      <h3>Nuevo partido</h3>
      <form onSubmit={crear}>
        <label>Título<input value={p.titulo} onChange={e => setP({ ...p, titulo: e.target.value })} required /></label>
        <label>Deporte<select value={p.deporte} onChange={e => setP({ ...p, deporte: e.target.value })}>{DEPORTES.map(d => <option key={d}>{d}</option>)}</select></label>
        <label>Lugar<input value={p.lugar} onChange={e => setP({ ...p, lugar: e.target.value })} required /></label>
        <label>Fecha y hora<input value={p.fecha} onChange={e => setP({ ...p, fecha: e.target.value })} placeholder="Sáb 15 nov, 4:00 pm" required /></label>
        <label>Jugadores que faltan<input type="number" min="1" value={p.cupos} onChange={e => setP({ ...p, cupos: e.target.value })} required /></label>
        <button className="btn">Publicar partido</button>
      </form>
      <h3>Partidos publicados</h3>
      {partidos.map(x => (
        <div className="card row" key={x.id} style={{ marginBottom: 10 }}>
          <span>{ICONO[x.deporte]} {x.titulo} · {x.fecha}</span>
          <button className="btn sm" onClick={() => borrar('partidos', x.id, recargarP)}>Eliminar</button>
        </div>
      ))}
      <h3>Mensajes recibidos</h3>
      {mensajes.length === 0 && <p className="suave">Aún no hay mensajes.</p>}
      {mensajes.map(m => (
        <div className="card" key={m.id} style={{ marginBottom: 10 }}>
          <div className="row"><strong>{m.nombre} · {m.asunto}</strong>
            <button className="btn sm" onClick={() => borrar('mensajes', m.id, recargarM)}>Eliminar</button></div>
          <p className="suave">{m.email}</p><p>{m.mensaje}</p>
        </div>
      ))}
    </main>
  )
}
function Footer() {
  return (
    <footer className="footer">
      <p><strong>SRsport</strong> · Comunidad deportiva de fútbol, baloncesto y voleibol</p>
      <p className="suave">Proyecto final · Jóvenes creaTivos · {new Date().getFullYear()}</p>
    </footer>
  )
}
export default function App() {
  return (
    <HashRouter>
      <Nav />
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/partidos" element={<Partidos />} />
        <Route path="/rutinas" element={<Rutinas />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
      <Footer />
    </HashRouter>
  )
}
