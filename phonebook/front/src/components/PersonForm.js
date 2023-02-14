const PersonForm = (props) => {

  return (
    <form onSubmit={props.submit}>
      <div>name: <input value={props.name} onChange={props.changeName} /></div>
      <div>number: <input value={props.number} onChange={props.changePhone} /></div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

export default PersonForm
