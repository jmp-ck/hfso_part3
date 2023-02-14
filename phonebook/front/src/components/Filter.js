const Filter = (props) => {

  return(
    <div>filter shown with : <input value={props.filter} onChange={props.change} /></div>
  )
}
export default Filter
