import {jsonToSchema} from 'https://cdn.jsdelivr.net/gh/jevko/schemainfer.js@0.1.0/mod.js'
import {jevkoToPrettyString} from 'https://cdn.jsdelivr.net/gh/jevko/jevkoutils.js@0.1.4/mod.js'
import {jsonToJevko} from 'https://cdn.jsdelivr.net/gh/jevko/jsonjevko.js@0.1.0/mod.js'
const jevkoEditor = editorBundle.makeJevkoEditor()
const jsonEditor = editorBundle.makeJsonEditor()
document.getElementById("click").onclick = () => {
  const jsonStr = jsonEditor.state.doc.sliceString(0)
  document.body.append(document.createTextNode(jsonStr))
  const json = JSON.parse(jsonStr)
  const jevko = jsonToJevko(json)
  const schema = jsonToSchema(json)
  const jevkoStr = jevkoToPrettyString(jevko)
  const text = JSON.stringify(schema, null, 2)
  document.body.append(document.createTextNode(text))
  document.body.append(document.createTextNode(jevkoStr))

  jevkoEditor.dispatch({changes: {from: 0, insert: jevkoStr}})
}
// setTimeout(() => {
//   document.body.append(document.createTextNode('hm'))
//   document.body.append(document.createTextNode(jevkoEditor.state.doc.sliceString(0)))
// }, 3000)