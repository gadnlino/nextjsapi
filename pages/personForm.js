import Head from 'next/head'
import styles from '../styles/Home.module.css'
import axios from 'axios';


import { useState } from 'react';

export default function PersonForm() {

        const [value, setValue] = useState('');
        const [response, setResponse] = useState('');

        const onChange = (event) => {
          setValue(event.target.value);
        };

        const search = async ()=>{
           // var res = await fetch(`/api/escavador/search?person=${value}`);

            const res = await axios.get('/api/escavador/search', { params: { person: value } });

            console.log(res.data) //
        }

       
        return (
          <>
            <div>Input value: {value}</div>
            <input value={value} onChange={onChange} />
            <button onClick={search}>Search</button>

            <div value={response}></div>
          </>
        );
}


