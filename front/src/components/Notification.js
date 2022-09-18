const Notification = ({ message, color }) => message ? <div className="msg" style={{ color: color }}>{message}</div> : null

export default Notification