# API de Escavação 

Projeto Final da Matéria Computação e Sociedade.

O Objetivo do projeto é fornecer uma API com endpoint único, que permite acesso à dados sobre projetos de pesquisa, Projetos de Extensão, etc, de pesquisadores e alunos da UFRJ, acessando diversas APIs e realizando uma junção dos resultados.

# APIs Utilizadas

- Escavador
- CrossRef
- Orcid
- Google Schoolar
- Microsoft Academic Knowledge
- Web Of Science

# Funcionamento Geral

O Usuário pode realizar uma busca através do nome do pesquisador, então o sistema vai fazer uma busca em cada uma das APIs, filtrar resultados pertencentes à pessoas relacionadas à UFRJ, e então fazer uma junção dos resultados para exibir os Dados.


# Dados Disponíveis

Para cada pessoa pesquisada, a aplicação pode retornar os seguintes dados:

- Formação academica/profissional
- Artigos publicados
- Resumo disponível no currículo Lattes
- Lista dos **projetos de pesquisa** contendo:
  - Data de Início do Projeto 
  - Data de Fim do Projeto
  - Descrição
- Lista dos **projetos de extensão** contendo:
  - Data de início do projeto 
  - Data de fim do projeto
  - Descrição

# O que cada API traz de valor:
### Escavador
  - Essa API tem sua busca feita primordialmente pelo nome da pessoa e tem a capacidade de retornar dados baseados no currículo lattes do pesquisado, i.e., resumo curricular, projetos de pesquisa, formação acadêmica/profissional e outros.
### CrossRef
  - Essa API faz busca por artigos publicados, a pesquisa é feita pelo nome da pessoa ou pelo nome do artigo em si. Ele traz a possibilidade de encontrar contribuintes dos artigos, juntamente com um link para tal.
### Orcid
### Google Schoolar
### Microsoft Academic Knowledge
### Web Of Science
