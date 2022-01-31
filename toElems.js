export const toElems = (ast) => {
  const {subjevkos, suffix} = ast
  
  let ret = []
  for (const {prefix, jevko} of subjevkos) {
    const [pre, tag, post] = trim(prefix)
    if (pre.length > 0) ret.push(document.createTextNode(pre))
    if (tag === '') ret.push(...toElems(jevko))
    else if (tag.endsWith('=')) ret.push([tag.slice(0, -1), jevko])
    else {
      const elem = document.createElement(tag)

      const elems = toElems(jevko)

      for (const e of elems) {
        if (Array.isArray(e)) {
          const [tag, jevko] = e
          if (jevko.subjevkos.length > 0) throw Error('attrib must be suffix-only')
          elem.setAttribute(tag, jevko.suffix)
        } else {
          elem.append(e)
        }
      }
    
      ret.push(elem)
    }
  }
  ret.push(document.createTextNode(suffix))
  return ret
}
const trim = (prefix) => {
  let i = 0, j = 0
  for (; i < prefix.length; ++i) {
    if (isWhitespace(prefix[i]) === false) break
  }
  for (j = i; j < prefix.length; ++j) {
    if (isWhitespace(prefix[j])) break
  }
  return [prefix.slice(0, i), prefix.slice(i, j), prefix.slice(j)]
}

const isWhitespace = (c) => {
  return ' \n\r\t'.includes(c)
}