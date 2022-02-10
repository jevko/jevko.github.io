import {makeJevkoEditor, makeJsonEditor} from './editor.bundle.js'
import {jsonToSchema} from 'https://cdn.jsdelivr.net/gh/jevko/schemainfer.js@0.1.0/mod.js'
import {jevkoToPrettyString, jv, jevkoToPrettyJevko} from 'https://cdn.jsdelivr.net/gh/jevko/jevkoutils.js@0.1.6/mod.js'
import {jsonToJevko} from 'https://cdn.jsdelivr.net/gh/jevko/jsonjevko.js@0.1.0/mod.js'
import {parseJevko} from 'https://cdn.jsdelivr.net/gh/jevko/parsejevko.js@0.1.3/mod.js'
import {schemaToJevko} from 'https://cdn.jsdelivr.net/gh/jevko/jevkoschema.js@0.1.1/mod.js'

import {highlightSchemaJevko, highlightSchemaJevko2} from 'https://cdn.jsdelivr.net/gh/jevko/highlightjevko.js@v0.1.3/mod.js'

import {toElemsById, toElems} from './toElems.js'

import {jevkoToHtml} from './jevkoToHtml.js'

document.body.onload = () => {
  const containerStyle = `width: 50%;
  margin: auto;`

  const editorStyle = `flex: 1; min-width: 30%`

  const [elems, elemsById] = toElemsById(parseJevko(jv`
  style [
    .cm-editor {
      height: 30rem;
    }
    .float64 {
      color: #e5c07b;
    }
    .key {
      color: #61afef;
      text-decoration: underline;
      text-decoration-color: #317fbf;
      text-decoration-thickness: 3px;
    }
    .string {
      color: #98c379;
    }
    .boolean {
      color: #d19a66;
    }
    #jsonSchema, #jevko {
      color: #abb2bf;
      background-color: #282c34;
      margin-top: 0;
      padding-top: 2px;
    }
  ]
  div [
    style=[${containerStyle}]
    label [URL] 
    input [
      id=[url]
      type=[text]
      style=[width: 30rem]
      value=[https://hacker-news.firebaseio.com/v0/user/jl.json?print=pretty]
    ]
    br []
    
    button [
      id=[submit]
      [submit]
    ]
  ]
  div [
    style=[${containerStyle}]
    button [
      id=[convert]
      [convert]
    ]
    button [
      id=[toggleSchema]
      [toggle schema]
    ]
  ]
  div [
    style=[display: flex; width: 100%; overflow: auto]
    div [|]
    div [id=[jsonEditor] style=[${editorStyle}] [JSON]]
    div [|]
    div [
      id=[schemaContainer] 
      style=[${editorStyle}] 
      [Schema]
      pre [id=[jsonSchema]]
    ]
    div [|]
    div [ 
      style=[${editorStyle}] 
      [Jevko]
      pre [id=[jevko]]
      div [id=[jevkoEditor] style=[display: none]]
    ]
    div [|]
  ]
  `))

  const fetchUrl = async () => fetch(elemsById.url.value).then(async (res) => {
    const jsonStr = await res.text()
    return jsonStr
  })

  elemsById.toggleSchema.onclick = () => {
    const {style} =  elemsById.schemaContainer
    if (style.display === 'none') style.display = ''
    else style.display = 'none'
  }

  elemsById.jevko.onclick = () => {
    elemsById.jevko.style.display = 'none'
    elemsById.jevkoEditor.style.display = 'block'
    // elemsById.jevkoEditor.focus()
    jevkoEditor.focus()

    jevkoEditor.dispatch({changes: {from: 0, to: jevkoEditor.state.doc.length, insert: elemsById.jevko.textContent}})
  }
  
  const jevkoEditor = makeJevkoEditor(elemsById.jevkoEditor)
  const jsonEditor = makeJsonEditor(elemsById.jsonEditor)

  elemsById.jevkoEditor.addEventListener('focusout', () => {
    // console.log('fout')
    elemsById.jevko.style.display = 'block'
    elemsById.jevkoEditor.style.display = 'none'
  })
  
  
  elemsById.submit.onclick = () => {
    fetchUrl().then(jsonStr => {
      // maybe prettify jsonStr by JSON.parse + JSON.stringify?
      jsonEditor.dispatch({changes: {from: 0, to: jsonEditor.state.doc.length, insert: JSON.stringify(JSON.parse(jsonStr), null, 2)}})
    })
  }

  document.body.append(...elems)
  jsonEditor.dispatch({changes: {from: 0, insert: `{
  "a": 1, 
  "b": "3", 
  "c": true, 
  "d": null, 
  "e": [5, 4], 
  "f": {
    "a": [], 
    "b": {}
  }
}`}})
  elemsById.convert.onclick = () => {
    const jsonStr = jsonEditor.state.doc.sliceString(0)
    // document.body.append(document.createTextNode(jsonStr))
    const json = JSON.parse(jsonStr)
    const jevko = jsonToJevko(json)
    // could also make jsonToSchemaJevko
    const schema = jsonToSchema(json)
    const jevkoStr = jevkoToPrettyString(jevko)
    // const text = JSON.stringify(schema, null, 2)

    const sjevko = highlightSchemaJevko2(jevkoToPrettyJevko(schemaToJevko(schema)))
    // const str = highlightSchemaJevko(parseJevko(jevkoToPrettyString(schemaToJevko(schema))))
    // const sjevko = parseJevko(str)
    console.log(sjevko)
    // elemsById.jsonSchema.textContent = jevkoToPrettyString(schemaToJevko(schema))
    elemsById.jsonSchema.replaceChildren(...toElems(sjevko))

    // elemsById.jevko.textContent = jevkoStr

    elemsById.jevko.innerHTML = jevkoToHtml(jevkoToPrettyJevko(jevko), schema)
  
    jevkoEditor.dispatch({changes: {from: 0, insert: jevkoStr}})
  }
}