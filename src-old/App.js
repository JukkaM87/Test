import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Note from './components/Note'
const mqtt = require('mqtt');

const App = ( props ) => {
	const [notes, setNotes] = useState([])
	const [newNote, setNewNote] = useState('a new note...') 	
	const [showAll, setShowAll] = useState(true)

	const mq = mqtt.connect('ws://broker.hivemq.com:8000/mqtt',{})
	
	let i=0

	mq.on('connect', function(){
		console.log('Connected')
		setInterval(function(){pub_index()},25000)
	})

	function pub_index(){
		mq.publish('opiframe3/request/ID3', i.toString())
		i +=1
		console.log(i)
	}

	mq.subscribe('opiframe3/data/ID3')

	mq.on('message', function(topic, message) {
		console.log(message.toString('utf8'))
		const obj = JSON.parse(message)
		console.log(obj)
	})

	const hook = () => {
		console.log('effect')
		axios
			.get('http://localhost:3001/notes')
			.then(response => {
				console.log('promise fulfilled')
				setNotes(response.data)
			})
	}

	useEffect(hook, [])  

	const notesToShow = showAll
		? notes
		: notes.filter(note => note.important === true)

	const rows = () => notesToShow.map(note =>
		<Note key={note.id}	note={note} />
	)

	notesToShow.map(note =>
		<Note key={note.id} note={note}	/>
	)
 
	const addNote = (event) => {
		event.preventDefault()
		const noteObject = {
			content: newNote,
			date: new Date().toISOString(),
			important: Math.random() > 0.5,
//			id: notes.length + 1,
		}
		axios
			.post('http://localhost:3001/notes', noteObject)
			.then(response => {
			console.log(response.data)
			setNotes(notes.concat(response.data))
			setNewNote('')
		})
	}
	
	const handleNoteChange = (event) => {
		console.log(event.target.value)
		setNewNote(event.target.value)
	}
  
	return (
		<div>
			<h1>Notes</h1>
			<iframe width="480" height="320" src="https://charts.mongodb.com/charts-project-0-vzqsx/embed/charts?id=e64cbc8d-c2dc-4025-ab7a-427577fe5b1b&tenant=284d1025-42ab-4bf9-91f5-2cd242cc2ab8"></iframe>
			<div>
			<button onClick={() => setShowAll(!showAll)}>
			show {showAll ? 'important' : 'all' }
			</button>
			</div>
			<ul>
			{rows()}
			</ul>
			<form onSubmit={addNote}>
			<input value={newNote} onChange={handleNoteChange} />
			<button type="submit">save</button>
			</form> 
		</div>
	)
}

export default App