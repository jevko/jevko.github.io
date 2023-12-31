import { serializeJdaml } from "./serializejdaml.js"

// ??todo: maybe handle comment nodes and other types of nodes

// todo: _isattr, _name, _node should be extracted and configurable
//       perhaps even root could encode the configuration, e.g.
//       <jdaml _isattr_alias="_i" _name_alias="_n" _node_alias="_">...</jdaml>

export const xmlstrToJdaml = (xmlstr) => {
  const doc = new DOMParser().parseFromString(xmlstr, "application/xml").documentElement
  if (doc.hasAttribute('_jdaml') && doc.getAttribute('_jdaml') === 'true') {
    doc.removeAttribute('_jdaml')
  }
  // else: refuse to convert in strict mode?
  const ast = xmlToJdamlAst(doc)
  // todo: maybe insert format at the beginning?
  ast.unshift({tag: '.:format', subs: ['xml']}, '\n')
  return serializeJdaml(ast)
}

export const htmlstrToJdaml = (htmlstr) => {
  const doc = new DOMParser().parseFromString(htmlstr, "text/html").documentElement
  if (doc.hasAttribute('_jdaml') && doc.getAttribute('_jdaml') === 'true') {
    doc.removeAttribute('_jdaml')
  }
  // else: refuse to convert in strict mode?
  const ast = htmlToJdamlAst(doc)
  // todo: maybe insert format at the beginning?
  ast.unshift({tag: '.:format', subs: ['html']}, '\n')
  return serializeJdaml(ast)
}


const htmlToJdamlAst = (doc) => {
  const subs = []
  for (const attr of doc.attributes) {
    if (attr.name === '_isattr') continue
    subs.push({tag: `.${attr.name}`, subs: [attr.value]})
  }
  for (const node of doc.childNodes) {
    const t = node.nodeType
    if (t === Node.TEXT_NODE) {
      subs.push(node.textContent)
    }
    else if (t === Node.ELEMENT_NODE) {
      let name
      if (node.hasAttribute('_name')) {
        name = node.getAttribute('_name')
      }
      else {
        name = node.nodeName.toLowerCase()
      }

      if (node.hasAttribute('_isattr')) {
        subs.push({tag: `.${name}`, subs: htmlToJdamlAst(node)})
      }
      else {
        if (node.nodeName === '_node' && node.hasAttribute('_name') === false) {
          subs.push({tag: ``, subs: htmlToJdamlAst(node)})
        }
        else {
          subs.push({tag: `'${name}`, subs: htmlToJdamlAst(node)})
        }
      }
    }
    else throw Error('oops')
  }
  
  return subs
}

const xmlToJdamlAst = (doc) => {
  const subs = []
  for (const attr of doc.attributes) {
    if (attr.name === '_isattr') continue
    subs.push({tag: `.${attr.name}`, subs: [attr.value]})
  }
  for (const node of doc.childNodes) {
    const t = node.nodeType
    if (t === Node.TEXT_NODE) {
      subs.push(node.textContent)
    }
    else if (t === Node.ELEMENT_NODE) {
      let name
      if (node.hasAttribute('_name')) {
        name = node.getAttribute('_name')
      }
      else {
        name = node.nodeName
      }

      if (node.hasAttribute('_isattr')) {
        subs.push({tag: `.${name}`, subs: xmlToJdamlAst(node)})
      }
      else {
        if (node.nodeName === '_node' && node.hasAttribute('_name') === false) {
          subs.push({tag: ``, subs: xmlToJdamlAst(node)})
        }
        else {
          subs.push({tag: `'${name}`, subs: xmlToJdamlAst(node)})
        }
      }
    }
    else throw Error('oops')
  }
  
  return subs
}
