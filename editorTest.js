import {jsonToSchema} from 'https://cdn.jsdelivr.net/gh/jevko/schemainfer.js@0.1.0/mod.js'
import {jevkoToPrettyString, jv} from 'https://cdn.jsdelivr.net/gh/jevko/jevkoutils.js@0.1.4/mod.js'
import {jsonToJevko} from 'https://cdn.jsdelivr.net/gh/jevko/jsonjevko.js@0.1.0/mod.js'
import {parseJevko} from 'https://cdn.jsdelivr.net/gh/jevko/parsejevko.js@0.1.3/mod.js'
import {toElemsById} from './toElems.js'

document.body.onload = () => {
  const jevkoEditorElement = document.createElement('div')
  const jsonEditorElement = document.createElement('div')

  const editorStyle = `width: 50%;
  margin: auto;`

  jevkoEditorElement.append(document.createTextNode('Jevko'))
  jevkoEditorElement.style = editorStyle
  jsonEditorElement.append(document.createTextNode('JSON'))
  jsonEditorElement.style = editorStyle

  const [elems, elemsById] = toElemsById(parseJevko(jv`
  style [
    .cm-editor {
      height: 30rem;
    }
  ]
  div [
    style=[${editorStyle}]
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
    
    pre [id=[jevkoResult] style=[max-height: 30rem; overflow: auto]]
  ]
  div [
    style=[${editorStyle}]
    button [
      id=[convert]
      [convert]
    ]
  ]
  div [
    style=[display: flex; width: 100%; overflow: auto]
    div [|]
    div [id=[jsonEditor] style=[flex: 1; min-width: 30%] [JSON]]
    div [|]
    div [style=[flex: 1; min-width: 30%][Schema]
      pre [id=[jsonSchema]]
    ]
    div [|]
    div [id=[jevkoEditor] style=[flex: 1; min-width: 30%] [Jevko]]
    div [|]
  ]
  `))

  const fetchUrl = async () => fetch(document.getElementById("url").value).then(async (res) => {
    const json = await res.json()
    console.log(json)
    return json
  })
  
  
  elemsById.submit.onclick = () => {
    fetchUrl().then(json => {
      elemsById.jevkoResult.textContent = jevkoToPrettyString(jsonToJevko(json))
    })
  }

  document.body.append(...elems)
  
  const jevkoEditor = editorBundle.makeJevkoEditor(elemsById.jevkoEditor)
  const jsonEditor = editorBundle.makeJsonEditor(elemsById.jsonEditor)
  jsonEditor.dispatch({changes: {from: 0, insert: '{"a": 1}'}})
  elemsById.convert.onclick = () => {
    const jsonStr = jsonEditor.state.doc.sliceString(0)
    // document.body.append(document.createTextNode(jsonStr))
    const json = JSON.parse(jsonStr)
    const jevko = jsonToJevko(json)
    const schema = jsonToSchema(json)
    const jevkoStr = jevkoToPrettyString(jevko)
    const text = JSON.stringify(schema, null, 2)

    elemsById.jsonSchema.textContent = text
  
    jevkoEditor.dispatch({changes: {from: 0, insert: jevkoStr}})
  }
}