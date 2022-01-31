export const jsonToJevko = (json, indent = '') => {
  let ret = ''
  if (Array.isArray(json)) {
    if (json.length > 0 && indent !== '') ret += '\n'
    for (const v of json) {
      ret += `${indent}[${jsonToJevko(v, indent + '  ')}]\n`
    }
  }
  else if (json === null) ;
  else if (typeof json === 'object') {
    const entries = Object.entries(json)
    if (entries.length > 0 && indent !== '') ret += '\n'
    for (const [k, v] of entries) {
      ret += `${indent}${escape(k)} [${jsonToJevko(v, indent + '  ')}]\n`
    }
  }
  else ret += `${escape(json.toString())}`
  return ret
}

const escape = (str) => {
  let ret = ''
  for (let i = 0; i < str.length; ++i) {
    const c = str[i]
    if ('[]`'.includes(c)) ret += '`'
    ret += c
  }
  return ret
}