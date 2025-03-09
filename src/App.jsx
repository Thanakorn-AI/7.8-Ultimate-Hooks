// ultimate-hooks/src/App.jsx
import { useState, useEffect } from 'react'
import axios from 'axios'

const useField = (type) => {
  const [value, setValue] = useState('')
  const onChange = (event) => {
    setValue(event.target.value)
  }
  const reset = () => setValue('');

  return {
    inputProps: { type, value, onChange }, // For <input>
    reset                                  // For clearing
  }
}

const useResource = (baseUrl) => {
  const [resources, setResources] = useState([])

  // Fetch all resources on mount
  useEffect(() => {
    axios
      .get(baseUrl)
      .then((response) => {
        setResources(response.data); // Set the initial list
      })
      .catch((error) => {
        console.error('Error fetching resources:', error);
        setResources([]); // Empty array if fetch fails
      });
  }, [baseUrl]); // Re-run if baseUrl changes

  // Create a new resource
  const create = (resource) => {
    axios
      .post(baseUrl, resource)
      .then((response) => {
        setResources([...resources, response.data]); // Add new item to list
      })
      .catch((error) => {
        console.error('Error creating resource:', error);
      });
  };

  const service = {
    create
  }

  return [
    resources, service
  ]
}

const App = () => {
  const content = useField('text')
  const name = useField('text')
  const number = useField('text')

  const [notes, noteService] = useResource('http://localhost:3005/notes')
  const [persons, personService] = useResource('http://localhost:3005/persons')

  const handleNoteSubmit = (event) => {
    event.preventDefault()
    noteService.create({ content: content.inputProps.value })
    content.reset(); 
  }
 
  const handlePersonSubmit = (event) => {
    event.preventDefault()
    personService.create({ name: name.inputProps.value, number: number.inputProps.value });
    name.reset();   
    number.reset(); 
  }

  return (
    <div>
      <h2>notes</h2>
      <form onSubmit={handleNoteSubmit}>
        <input {...content.inputProps} />
        <button>create</button>
      </form>
      {notes.map(n => <p key={n.id}>{n.content}</p>)}

      <h2>persons</h2>
      <form onSubmit={handlePersonSubmit}>
        name <input {...name.inputProps} /> <br/>
        number <input {...number.inputProps} />
        <button>create</button>
      </form>
      {persons.map(n => <p key={n.id}>{n.name} {n.number}</p>)}
    </div>
  )
}

export default App