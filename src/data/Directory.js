
export const PEOPLE = [
  { name: 'Aarav Mehta', email: 'aarav.mehta@avaada.com' },
  { name: 'Ananya Rao', email: 'ananya.rao@avaada.com' },
  { name: 'Karan Malhotra', email: 'karan.malhotra@avaada.com' },
  { name: 'Meera Iyer', email: 'meera.iyer@avaada.com' },
  { name: 'Rohan Desai', email: 'rohan.desai@avaada.com' },
  { name: 'Sneha Kulkarni', email: 'sneha.kulkarni@avaada.com' },
]

// TODO: Replace with a call to the Darwin employee directory API.
// Must resolve to [{ name, email }] for a search string.
export async function searchDirectory(query = '') {
  const q = query.trim().toLowerCase()

  await new Promise((resolve) => setTimeout(resolve, 150))

  if (!q) return PEOPLE.slice(0, 8)

  return PEOPLE.filter(
    (person) =>
      person.name.toLowerCase().includes(q) ||
      person.email.toLowerCase().includes(q),
  ).slice(0, 8)
}
