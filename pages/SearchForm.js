import Head from 'next/head'
import styles from '../styles/Home.module.css'
import axios from 'axios';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { darcula } from 'react-syntax-highlighter/dist/cjs/styles/prism';

import { useState, useEffect } from 'react';

const SEARCH_METHOD = {
  ESCAVADOR: "ESCAVADOR",
  MICROSOFT_ACADEMIC: "MICROSOFT_ACADEMIC",
  CROSSREF: "CROSSREF",
  ORCID: "ORCID"
};

export default function SearchForm() {
  const [value, setValue] = useState('');
  const [responseString, setResponseString] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setError(null);
    setResponseString('');
    setLoading(false);
  }, [])

  const onChange = (event) => {
    setValue(event.target.value);
  };

  const search = async (searchMethod) => {

    if (!value) {
      setError('Digite uma pesquisa válida');
      return;
    }

    try {
      setLoading(true);
      let stringResponse = "";

      switch (searchMethod) {
        case (SEARCH_METHOD.ESCAVADOR):
          const responseEscavador = await axios.get(
            '/api/escavador/search',
            { params: { person: value } });
          stringResponse = JSON.stringify(responseEscavador.data, null, 2);
          break;
        case (SEARCH_METHOD.MICROSOFT_ACADEMIC):
          const responseMicrosoft = await axios.get(
            '/api/microsoftAcedemic/search',
            { params: { person: value } });
          stringResponse = JSON.stringify(responseMicrosoft.data, null, 2);
          break;
        case (SEARCH_METHOD.CROSSREF):
          const responseCrossref = await axios.get(
            '/api/crossref/search',
            { params: { person: value } });
          stringResponse = JSON.stringify(responseCrossref.data, null, 2);
          break;
        case (SEARCH_METHOD.ORCID):
          const responseOrcid = await axios.get(
            '/api/orcid/search',
            { params: { person: value } });
          stringResponse = JSON.stringify(responseOrcid.data, null, 2);
          break;
        default:
          break;
      }

      setResponseString(stringResponse);
      setError(null);
    }
    catch (e) {
      setError("Ocorreu um erro ao realizar a pesquisa:" + e);
    }
    finally {
      setLoading(false);
    }
  }

  return (
    <>
      <input
        placeholder={'Nome do pesquisador/assunto de interesse'}
        value={value}
        onChange={onChange} />
      <div>
        <button onClick={() =>
          search(SEARCH_METHOD.ESCAVADOR)}>
          Pesquisar no Escavador
        </button>
        {/* <button onClick={async () =>
          search(SEARCH_METHOD.MICROSOFT_ACADEMIC)}>
          Pesquisar no Microsoft Academic
        </button> */}
        <button onClick={() =>
          search(SEARCH_METHOD.CROSSREF)}>
          Pesquisar no Crossref
        </button>
        <button onClick={() =>
          search(SEARCH_METHOD.ORCID)}>
          Pesquisar no Orcid
        </button>
        {/* <button onClick={async () => search(SEARCH_METHOD.GOOGLE_SCHOLAR)}>Pesquisar no Google Acadêmico</button> */}
      </div>

      <div>
        {
          loading ?
            "Carregando..." :
            error ?
              <div><p style={{ color: "#ff0000" }}>{error}</p></div> :
              responseString ? 
              <SyntaxHighlighter language="json" style={darcula}>
                {responseString}
              </SyntaxHighlighter>: <></>
        }
      </div>
    </>
  );
}


