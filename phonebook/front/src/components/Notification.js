const Notification = ({ message, classMsg }) => {
  if (message === null) {
    return null
  }

  return (
    <div className={classMsg}>{message}</div>
    //{classMsg ? 'success' : 'error'}
  )
}
export default Notification
