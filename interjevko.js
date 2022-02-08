import {makeJevkoEditor, makeJsonEditor} from './editor.bundle.js'
import {jsonToSchema} from 'https://cdn.jsdelivr.net/gh/jevko/schemainfer.js@0.1.0/mod.js'
import {jevkoToPrettyString, jv} from 'https://cdn.jsdelivr.net/gh/jevko/jevkoutils.js@0.1.4/mod.js'
import {jsonToJevko} from 'https://cdn.jsdelivr.net/gh/jevko/jsonjevko.js@0.1.0/mod.js'
import {parseJevko} from 'https://cdn.jsdelivr.net/gh/jevko/parsejevko.js@0.1.3/mod.js'
import {toElemsById} from './toElems.js'

document.body.onload = () => {
  const containerStyle = `width: 50%;
  margin: auto;`

  const editorStyle = `flex: 1; min-width: 30%`

  const [elems, elemsById] = toElemsById(parseJevko(jv`
  style [
    .cm-editor {
      height: 30rem;
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
  ]
  div [
    style=[display: flex; width: 100%; overflow: auto]
    div [|]
    div [id=[jsonEditor] style=[${editorStyle}] [JSON]]
    div [|]
    div [style=[${editorStyle}][Schema]
      pre [id=[jsonSchema]]
    ]
    div [|]
    div [id=[jevkoEditor] style=[${editorStyle}] [Jevko]]
    div [|]
  ]
  `))

  const fetchUrl = async () => fetch(elemsById.url.value).then(async (res) => {
    const jsonStr = await res.text()
    return jsonStr
  })
  
  
  elemsById.submit.onclick = () => {
    fetchUrl().then(jsonStr => {
      // maybe prettify jsonStr by JSON.parse + JSON.stringify?
      jsonEditor.dispatch({changes: {from: 0, to: jsonEditor.state.doc.length, insert: jsonStr}})
    })
  }

  document.body.append(...elems)
  
  const jevkoEditor = makeJevkoEditor(elemsById.jevkoEditor)
  const jsonEditor = makeJsonEditor(elemsById.jsonEditor)
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