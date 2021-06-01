const Notification = ({ message, error }) => {
  return <div className={error ? 'error' : 'succeed'}>{message}</div>
}

export default Notification
