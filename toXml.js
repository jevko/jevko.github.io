export const toXml = (ast) => {
  const {subjevkos, suffix} = ast
  
  let ret = ''
  for (const {prefix, jevko} of subjevkos) {
    const [pre, tag, post] = trim(prefix)
    if (tag === '') ret += toXml(jevko)
    else ret += `${pre}<${tag}>${toXml(jevko)}</${tag}>`
  }
  return ret + suffix
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