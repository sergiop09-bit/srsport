// Todas las llamadas al backend pasan por aquí
const URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'
export const getToken = () => localStorage.getItem('token') || ''
export const setToken = t => (t ? localStorage.setItem('token', t) : localStorage.removeItem('token'))

export async function api(ruta, { method = 'GET', body } = {}) {
  const res = await fetch(`${URL}/api/${ruta}`, {
    method,
    headers: { 'Content-Type': 'application/json', ...(getToken() && { Authorization: `Bearer ${getToken()}` }) },
    body: body && JSON.stringify(body),
  })
  if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || 'Error')
  return res.json()
}
