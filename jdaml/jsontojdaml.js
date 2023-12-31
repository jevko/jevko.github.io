import { serializeJdaml } from "./serializejdaml.js"

export const jsonstrToJdaml = (jsonstr) => {
  const json = JSON.parse(jsonstr)
  const ast = indentAst0(jsonToJdamlAst(json))
  ast.unshift({tag: '.:format', subs: ['json']}, '\n')
  return serializeJdaml(ast)
}

const jsonToJdamlAst = (json) => {
  if (json === null) return [{tag: "'nil", subs: []}]
  if (json === true) return [{tag: "'true", subs: []}]
  if (json === false) return [{tag: "'false", subs: []}]
  if (typeof json === 'string') return [json]
  if (typeof json === 'number') return [{tag: "'num", subs: [json.toString()]}]
  if (Array.isArray(json)) {
    if (json.length === 0) return [{tag: "'seq", subs: []}]
    if (json.length === 1) return [{tag: "'seq", subs: jsonToJdamlAst(json[0])}]
    return json.map(v => ({tag: ``, subs: jsonToJdamlAst(v)}))
  }
  if (typeof json !== 'object') throw Error('oops: very wrong')
  const entries = Object.entries(json)
  return entries.map(([k, v]) => ({tag: `.${k}`, subs: jsonToJdamlAst(v)}))
}

const indentAst0 = (ast, indent = '') => {
  if (ast.length === 0) return ast
  if (ast.length === 1) {
    const node = ast[0]
    if (typeof node === 'string') return ast
    const {tag, subs} = node
    if (tag.startsWith("'")) return ast
  }

  const nsubs = []
  for (const sub of ast) {
    if (typeof sub === 'string') {
      nsubs.push(sub)
    }
    else {
      const {tag, subs} = sub
      nsubs.push(indent)
      nsubs.push({tag, subs: indentAst(subs, indent + '  ', indent)})
      nsubs.push('\n')
    }
  }
  // if (nsubs.at(-1) === '\n') nsubs.pop()

  return nsubs
}

const indentAst = (ast, indent = '', previndent = '') => {
  if (ast.length === 0) return ast
  if (ast.length === 1) {
    const node = ast[0]
    if (typeof node === 'string') return ast
    const {tag, subs} = node
    if (tag.startsWith("'")) return ast
  }

  const nsubs = ['\n']
  for (const sub of ast) {
    if (typeof sub === 'string') {
      nsubs.push(sub)
    }
    else {
      const {tag, subs} = sub
      nsubs.push(indent)
      nsubs.push({tag, subs: indentAst(subs, indent + '  ', indent)})
      nsubs.push('\n')
    }
  }
  nsubs.push(previndent)
  return nsubs
}