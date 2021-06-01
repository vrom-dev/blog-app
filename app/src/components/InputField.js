export default function InputField ({ id, type, value, handleChange }) {
  return (
    <div>
      <label htmlFor={id}>{id}:</label>
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        onChange={handleChange}
      />
    </div>
  )
}
