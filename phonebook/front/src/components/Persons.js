import Person from './Person'

const Persons = (props) => {

  return(
    <ul>
      {
        props.list.map(person => <Person key={person.name} person={person} handleDelete={props.handleDelete} />)
      }
    </ul>
  )
}

export default Persons;
