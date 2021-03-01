import axios from 'axios';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { darcula } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { useState, useEffect } from 'react';
import utils from "./api/_utils/utils"

export default function SearchForm() {
  const [value, setValue] = useState('');
  const [responseString, setResponseString] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [apis, setApis] = useState([]);
  const [searchTypes, setSearchTypes] = useState([]);
  const [returnProps, setReturnProps] = useState([]);

  useEffect(() => {
    setError(null);
    setResponseString('');
    setLoading(false);
    setApis([]);
    setSearchTypes([]);
    setReturnProps([]);
  }, []);

  const search = async () => {

    if (!value) {
      setError('Digite um termo válido para a pesquisa');
      return;
    }
    else if (!apis || apis && apis.length === 0) {
      setError('Selecione uma API para busca');
      return;
    }
    else if (!searchTypes || searchTypes && apis.searchTypes === 0) {
      setError('Selecione um tipo de pesquisa');
      return;
    }
    else if (!returnProps || returnProps && returnProps.length === 0) {
      setError('Selecione uma propriedade de retorno');
      return;
    }
    else if (!returnProps || returnProps && returnProps.length === 0) {
      setError('Selecione uma propriedade de retorno');
      return;
    }

    try {
      setLoading(true);

      const params = {
        searchValue: value,
        apis: apis,
        searchTypes: searchTypes,
        returnProps: returnProps
      };

      console.log(params);

      let apisSearchString = "";

      apis.forEach((api, index) => {
        apisSearchString += `apis=${api}`;

        if (index < apis.length - 1) {
          apisSearchString += "&";
        }
      });

      let searchTypesString = "";

      searchTypes.forEach((searchType, index) => {
        searchTypesString += `searchTypes=${searchType}`;

        if (index < searchTypes.length - 1) {
          searchTypesString += "&";
        }
      });

      let returnPropsString = "";

      returnProps.forEach((returnProp, index) => {
        returnPropsString += `returnProps=${returnProp}`;

        if (index < returnProps.length - 1) {
          returnPropsString += "&";
        }
      });

      const response = await 
        axios.get(`/api/search?searchValue=${value}&${apisSearchString}&${searchTypesString}&${returnPropsString}`);

      setResponseString(JSON.stringify(response.data, null, 2));
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
      <div>
        <input
          placeholder={'Nome do pesquisador ou projeto de pesquisa/extensão'}
          value={value}
          onChange={(event) => {
            setValue(event.target.value);
          }} />
      </div>
      <div>
        <p>Pesquisar por:</p>
      </div>
      <div>
        <label>
          <input
            name="isGoing"
            type="checkbox"
            checked={searchTypes.includes(utils.SEARCH_TYPE.PESSOA)}
            onChange={() => {
              if (!searchTypes.includes(utils.SEARCH_TYPE.PESSOA)) {
                setSearchTypes([...searchTypes, utils.SEARCH_TYPE.PESSOA])
              }
              else {
                setSearchTypes(searchTypes.filter(s =>
                  s !== utils.SEARCH_TYPE.PESSOA));
              }
            }} />
          Pessoa
        </label>
        <label>
          <input
            name="isGoing"
            type="checkbox"
            checked={searchTypes.includes(utils.SEARCH_TYPE.PROJETO_PESQUISA_EXTENSAO)}
            onChange={() => {
              if (!searchTypes.includes(utils.SEARCH_TYPE.PROJETO_PESQUISA_EXTENSAO)) {
                setSearchTypes([...searchTypes, utils.SEARCH_TYPE.PROJETO_PESQUISA_EXTENSAO])
              }
              else {
                setSearchTypes(searchTypes.filter(s =>
                  s !== utils.SEARCH_TYPE.PROJETO_PESQUISA_EXTENSAO));
              }
            }} />
          Projeto de pesquisa/extensão
        </label>
      </div>
      <div>
        <p>Pesquisar em/na: </p>
      </div>
      <div>
        <label>
          <input
            name="isGoing"
            type="checkbox"
            checked={apis.includes(utils.APIS.ESCAVADOR)}
            onChange={() => {
              if (!apis.includes(utils.APIS.ESCAVADOR)) {
                setApis([...apis, utils.APIS.ESCAVADOR])
              }
              else {
                setApis(apis.filter(a => a !== utils.APIS.ESCAVADOR));
              }
            }}
          />
          Escavador
        </label>
        <label>
          <input
            name="isGoing"
            type="checkbox"
            checked={apis.includes(utils.APIS.CROSSREF)}
            onChange={() => {
              if (!apis.includes(utils.APIS.CROSSREF)) {
                setApis([...apis, utils.APIS.CROSSREF])
              }
              else {
                setApis(apis.filter(a => a !== utils.APIS.CROSSREF));
              }
            }}
          />
          Crossref
        </label>
        <label>
          <input
            name="isGoing"
            type="checkbox"
            checked={apis.includes(utils.APIS.ORCID)}
            onChange={() => {
              if (!apis.includes(utils.APIS.ORCID)) {
                setApis([...apis, utils.APIS.ORCID])
              }
              else {
                setApis(apis.filter(a => a !== utils.APIS.ORCID));
              }
            }}
          />
          Orcid
        </label>
      </div>
      <div><p>Propriedades de retorno:</p></div>
      <div>
        <label>
          <input
            name="isGoing"
            type="checkbox"
            checked={returnProps.includes(utils.RETURN_PROPS.INSTITUICAO)}
            onChange={() => {
              if (!returnProps.includes(utils.RETURN_PROPS.INSTITUICAO)) {
                setReturnProps([...returnProps, utils.RETURN_PROPS.INSTITUICAO])
              }
              else {
                setReturnProps(returnProps.filter(a =>
                  a !== utils.RETURN_PROPS.INSTITUICAO));
              }
            }} />
          Instituição
        </label>
        <label>
          <input
            name="isGoing"
            type="checkbox"
            checked={returnProps.includes(utils.RETURN_PROPS.AUTORES)}
            onChange={() => {
              if (!returnProps.includes(utils.RETURN_PROPS.AUTORES)) {
                setReturnProps([...returnProps, utils.RETURN_PROPS.AUTORES])
              }
              else {
                setReturnProps(returnProps.filter(a =>
                  a !== utils.RETURN_PROPS.AUTORES));
              }
            }} />
          Autores
        </label>
        <label>
          <input
            name="isGoing"
            type="checkbox"
            checked={returnProps.includes(utils.RETURN_PROPS.DATA_PUBLICACAO)}
            onChange={() => {
              if (!returnProps.includes(utils.RETURN_PROPS.DATA_PUBLICACAO)) {
                setReturnProps([...returnProps, utils.RETURN_PROPS.DATA_PUBLICACAO])
              }
              else {
                setReturnProps(returnProps.filter(a =>
                  a !== utils.RETURN_PROPS.DATA_PUBLICACAO));
              }
            }} />
          Data de publicação
        </label>
        <label>
          <input
            name="isGoing"
            type="checkbox"
            checked={returnProps.includes(utils.RETURN_PROPS.LINK_PESQUISA)}
            onChange={() => {
              if (!returnProps.includes(utils.RETURN_PROPS.LINK_PESQUISA)) {
                setReturnProps([...returnProps, utils.RETURN_PROPS.LINK_PESQUISA])
              }
              else {
                setReturnProps(returnProps.filter(a =>
                  a !== utils.RETURN_PROPS.LINK_PESQUISA));
              }
            }} />
          Link para a pesquisa
        </label>
        <label>
          <input
            name="isGoing"
            type="checkbox"
            checked={returnProps.includes(utils.RETURN_PROPS.PUBLISHER)}
            onChange={() => {
              if (!returnProps.includes(utils.RETURN_PROPS.PUBLISHER)) {
                setReturnProps([...returnProps, utils.RETURN_PROPS.PUBLISHER])
              }
              else {
                setReturnProps(returnProps.filter(a =>
                  a !== utils.RETURN_PROPS.PUBLISHER));
              }
            }} />
          Publisher
        </label>
        <label>
          <input
            name="isGoing"
            type="checkbox"
            checked={returnProps.includes(utils.RETURN_PROPS.REFERENCIAS)}
            onChange={() => {
              if (!returnProps.includes(utils.RETURN_PROPS.REFERENCIAS)) {
                setReturnProps([...returnProps, utils.RETURN_PROPS.REFERENCIAS])
              }
              else {
                setReturnProps(returnProps.filter(a =>
                  a !== utils.RETURN_PROPS.REFERENCIAS));
              }
            }} />
          Referências
        </label>
      </div>
      <div>
        <button onClick={search}>
          Pesquisar
        </button>
      </div>

      {/* <div>
        <button onClick={() =>
          search(utils.APIS.CROSSREF)}>
          Pesquisar no Escavador
        </button>
        <button onClick={() =>
          search(utils.APIS.CROSSREF)}>
          Pesquisar no Crossref
        </button>
        <button onClick={() =>
          search(utils.APIS.CROSSREF)}>
          Pesquisar no Orcid
        </button>
      </div> */}

      <div>
        {
          loading ?
            "Carregando..." :
            error ?
              <div><p style={{ color: "#ff0000" }}>{error}</p></div> :
              responseString ?
                <SyntaxHighlighter language="json" style={darcula}>
                  {responseString}
                </SyntaxHighlighter> : <></>
        }
      </div>
    </>
  );
}


