import axios from 'axios'
import React, {useEffect, useState} from 'react'

export const HomePage: React.FC = ()=> {
    const [seenIndexes, setSeenIndexes] = useState<{[key: string]: number}[]>([])
    const [values, setValues] = useState<{[key: string]: string}>({})
    const [index, setIndex] = useState('')

    useEffect(()=> {
        fetchValues();
        fetchIndexes();
    }, []);

    const fetchValues = async () => {
        const values: {[key: string]: string} = await axios.get('/api/values/current')
        setValues(values)
    }

    const fetchIndexes = async () => {
        const indexes: {data: {[key: string]: number}[] }= await axios.get('/api/values/all')
        setSeenIndexes(indexes.data)
    }

    const handleSubmit = async (evt: React.SyntheticEvent) => {
        evt.preventDefault()
        await axios.post('/api/values', {index})
        setIndex('')
    }

    const renderSeenIndexes = () => seenIndexes.map(({number}) => number).join(', ')
    const renderValues = () => {
        const entries = [];
        for (let key in values) {
            entries.push(
                <div key={key}>
                    For index {key} I calculated {values[key]}
                </div>
            )
        }
        return entries
    } 

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label>Enter your index:</label>
                <input 
                    value={index}
                    onChange={evt => evt.target.value}
                 />
                <button>Submit</button>
            </form>
            <h3>Indexes I have seen:</h3>
            {renderSeenIndexes()}
            <h3>Calculated Values</h3>
            {renderValues()}
        </div>
    )
}

export default HomePage
