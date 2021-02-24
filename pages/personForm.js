import Head from 'next/head'
import styles from '../styles/Home.module.css'
import axios from 'axios';

import { useState } from 'react';

const SEARCH_METHOD = {
  ESCAVADOR: "ESCAVADOR",
  //GOOGLE_SCHOLAR: "GOOGLE_SCHOLAR",
  MICROSOFT_ACADEMIC: "MICROSOFT_ACADEMIC",
  CROSSREF: "CROSSREF"
};

function syntaxHighlight(json) {
  if (typeof json != 'string') {
       json = JSON.stringify(json, undefined, 2);
  }
  json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
      var cls = 'number';
      if (/^"/.test(match)) {
          if (/:$/.test(match)) {
              cls = 'key';
          } else {
              cls = 'string';
          }
      } else if (/true|false/.test(match)) {
          cls = 'boolean';
      } else if (/null/.test(match)) {
          cls = 'null';
      }
      return '<span class="' + cls + '">' + match + '</span>';
  });
}

export default function PersonForm() {
  const [value, setValue] = useState('');
  const [responseString, setResponseString] = useState('');
  const [loading, setLoading] = useState(false);

  const onChange = (event) => {
    setValue(event.target.value);
  };

  const search = async (searchMethod) => {
    try {
      setLoading(true);
      let stringResponse = "";

      switch (searchMethod) {
        case (SEARCH_METHOD.ESCAVADOR):
          const responseEscavador = await axios.get(
            '/api/escavador/search',
            { params: { person: value } });
          stringResponse = JSON.stringify(responseEscavador.data,null, 2);
          break;
        case (SEARCH_METHOD.MICROSOFT_ACADEMIC):
          const responseMicrosoft = await axios.get(
            '/api/microsoftAcedemic/search',
            { params: { person: value } });
          stringResponse = JSON.stringify(responseMicrosoft.data,null, 2);
          break;
        case (SEARCH_METHOD.CROSSREF):
          const responseCrossref = await axios.get(
            '/api/crossref/search',
            { params: { person: value } });
          stringResponse = JSON.stringify(responseCrossref.data,null, 2);
          break;
        default:
          break;
      }
      setResponseString(stringResponse);
    }
    finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div>Input value: {value}</div>
      <input value={value} onChange={onChange} />
      <div>
        <button onClick={async () =>
          search(SEARCH_METHOD.ESCAVADOR)}>
          Pesquisar no Escavador
        </button>
        {/* <button onClick={async () =>
          search(SEARCH_METHOD.MICROSOFT_ACADEMIC)}>
          Pesquisar no Microsoft Academic
        </button> */}
        <button onClick={async () =>
          search(SEARCH_METHOD.CROSSREF)}>
          Pesquisar no Crossref
        </button>
        {/* <button onClick={async () => search(SEARCH_METHOD.GOOGLE_SCHOLAR)}>Pesquisar no Google Acadêmico</button> */}
      </div>

      <div>
        {
          loading ?
            "Carregando..." :
            <div><pre>{responseString}</pre></div>
        }
      </div>
    </>
  );
}


