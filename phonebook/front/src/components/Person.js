const Button = (props) => {
  const {label, handleDelete, person} = props
  return (
    <button onClick={() => handleDelete(person.id, person.name)}>{label}</button>
  )
}

const Person = (props) => {
  const {person, handleDelete} = props
  return (
    <li className=''>{person.name} {person.number} <Button handleDelete={handleDelete} person={person} label='delete' /></li>
  )

}

export default Person
