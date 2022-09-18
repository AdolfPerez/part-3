const Persons = ({show, deleteOne}) => <>{show.map(person => <div key={person.name}>{ person.name } { person.number }<button onClick={() => deleteOne(person)}>delete</button></div>)}</>

export default Persons