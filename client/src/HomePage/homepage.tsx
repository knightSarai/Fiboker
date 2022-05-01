import axios from 'axios'
import React, {useEffect, useState} from 'react'

type FebIndexes = {'number': number}[];
type FebValues = {[key: number]: string};

export const HomePage: React.FC = ()=> {
    const [seenIndexes, setSeenIndexes] = useState<FebIndexes>([])
    const [values, setValues] = useState<FebValues>({})
    const [index, setIndex] = useState('')

    useEffect(()=> {
        fetchCachedValues();
        fetchIndexes();
    }, [])


    const fetchCachedValues = async () => {
        const {data} = await axios.get<FebValues>('/api/values/current/')
        setValues(data)
    }

    const fetchIndexes = async () => {
        const {data} = await axios.get<FebIndexes>('/api/values/all/')
        setSeenIndexes(data)
    }

    const handleSubmit = async (evt: React.SyntheticEvent) => {
        evt.preventDefault()
        await axios.post('/api/values/', {index})
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
                    onChange={evt => setIndex(evt.target.value)}
                 />
                <button>Submit</button>
            </form>
            <h3>Indexes I have entered:</h3>
            {renderSeenIndexes()}
            <h3>Cached Calculated Values</h3>
            {renderValues()}
        </div>
    )
}

export default HomePage
