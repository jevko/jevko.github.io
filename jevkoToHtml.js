export const jevkoToHtml = (jevko, schema) => {
  const {type} = schema
  if (type === 'string') return toString(jevko, schema)
  if (type === 'float64' || type === 'number') return toFloat64(jevko, schema)
  if (type === 'boolean') return toBoolean(jevko, schema)
  if (type === 'null') return toNull(jevko, schema)
  if (type === 'array') return toArray(jevko, schema)
  if (type === 'tuple') return toTuple(jevko, schema)
  if (type === 'object') return toObject(jevko, schema)
  if (type === 'first match') return toFirstMatch(jevko, schema)
  throw Error(`Unknown schema type ${type}`)
}

const toString = (jevko, schema) => {
  const {subjevkos, suffix} = jevko
  if (subjevkos.length > 0) throw Error('nonempty subjevkos in string')
  return `<span class="string">${suffix}</span>`
}

const toFloat64 = (jevko, schema) => {
  const {subjevkos, suffix} = jevko
  if (subjevkos.length > 0) throw Error('nonempty subjevkos in string')
  const trimmed = suffix.trim()
  if (trimmed === 'NaN') return `<span class="float64">NaN</span>`
  const num = Number.parseFloat(trimmed)
  if (Number.isNaN(num)) throw Error(`Not a number (${trimmed})`)
  return `<span class="float64">${num}</span>`
}

const toBoolean = (jevko, schema) => {
  const {subjevkos, suffix} = jevko
  if (subjevkos.length > 0) throw Error('nonempty subjevkos in string')
  if (suffix === 'true') return `<span class="boolean">true</span>`
  if (suffix === 'false') return `<span class="boolean">false</span>`
  throw Error('not a boolean')
}

const toNull = (jevko, schema) => {
  const {subjevkos, suffix} = jevko
  if (subjevkos.length > 0) throw Error('nonempty subjevkos in string')
  if (suffix === 'null' || suffix === '') return `<span class="null">null</span>`
  throw Error(`not a null (${suffix})`)
}

const toArray = (jevko, schema) => {
  const {subjevkos, suffix} = jevko
  if (suffix.trim() !== '') throw Error('suffix !== ""')
  let ret = ''
  const {itemSchema} = schema
  for (const {prefix, jevko} of subjevkos) {
    if (prefix.trim() !== '') throw Error('nonempty prefix')
    ret += `${prefix}[<span class="item">${jevkoToHtml(jevko, itemSchema)}</span>]`
  }
  return `<span class="array">${ret}${suffix}</span>`
}

const toTuple = (jevko, schema) => {
  const {subjevkos, suffix} = jevko
  if (suffix.trim() !== '') throw Error('suffix !== ""')
  let ret = ''
  const {itemSchemas, isSealed} = schema
  if (itemSchemas.length > subjevkos.length) throw Error('bad tuple')
  if (isSealed && itemSchemas.length !== subjevkos.length) throw Error('also bad tuple')
  for (let i = 0; i < itemSchemas.length; ++i) {
    const {prefix, jevko} = subjevkos[i]
    if (prefix.trim() !== '') throw Error('nonempty prefix')
    ret += `${prefix}[<span class="item">${jevkoToHtml(jevko, itemSchemas[i])}</span>]`
  }
  return `<span class="tuple">${ret}${suffix}</span>`
}

const toObject = (jevko, schema) => {
  const {subjevkos, suffix} = jevko
  if (suffix.trim() !== '') throw Error('suffix !== ""')
  const keyJevkos = Object.create(null)
  let ret = ''
  const {optional = [], isSealed = true, props} = schema
  const keys = Object.keys(props)
  for (const {prefix, jevko} of subjevkos) {
    const [pre, key, post] = trim3(prefix)
    if (key.startsWith('-')) {
      ret += `<span class="ignored">${prefix}[${jevkoToString(jevko)}]</span>`
      continue
    }
    // todo: key starts with | -- use trim()
    if (key === '') throw Error('empty key')
    if (key in keyJevkos) throw Error('duplicate key')
    if (isSealed && keys.includes(key) === false) throw Error(`unknown key (${key}) ${post}`)
    ret += `<span class="item">${pre}<span class="key">${key}</span>${post}[<span class="value">${jevkoToHtml(jevko, props[key])}</span>]</span>`
  }
  return `<span class="object">${ret}${suffix}</span>`
}
const toFirstMatch = (jevko, schema) => {
  const {alternatives} = schema

  for (const alt of alternatives) {
    try {
      const x = jevkoToHtml(jevko, alt)
      return x
    } catch (e) {
      continue
    }
  }
  throw Error('union: invalid jevko')
}

const trim3 = (prefix) => {
  let i = 0, j = 0
  for (; i < prefix.length; ++i) {
    if (isWhitespace(prefix[i]) === false) break
  }
  for (j = prefix.length - 1; j > i; --j) {
    if (isWhitespace(prefix[j]) === false) break
  }
  ++j
  return [prefix.slice(0, i), prefix.slice(i, j), prefix.slice(j)]
}

const isWhitespace = (c) => {
  return ' \n\r\t'.includes(c)
}

const jevkoToString = (jevko) => {
  const {subjevkos, suffix} = jevko

  let ret = ''
  for (const {prefix, jevko} of subjevkos) {
    ret += `${prefix}[${jevkoToString(jevko)}]`
  }
  return ret + suffix
}