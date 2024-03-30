// note: importing in a way that'll make a web version work without bundling, etc.
import { decodeString, textToString } from "./node_modules/@jevko-org/jevko.js/decode.js";

//                   JDAML -- Jevko DAta Markup Language

export const parseJdaml = (str, forgiving = false) => {
  const extract = forgiving? extractDataCreative: extractData
  return extract(applyAttrs(parseNodes(seedFromString(str))))
}
export const parseJdamlMarkup = (str) => {
  return applyAttrs(parseNodes(seedFromString(str)))
}

export const seedFromString = (str) => {
  let current = {subs: [], text: ''}
  const parents = [current]
  return decodeString(str, {
    prefix: (text) => {
      const tree = {subs: [], text: ''}
      current.subs.push({text: textToString(text), tree})
      parents.push(current)
      current = tree
    },
    suffix: (text) => {
      current.text = textToString(text)
      current = parents.pop()
    },
    end: () => {
      return current
    }
  })
}
// note: resolveTag takes parsed nodes and should return a [text_node]
//       that text node will be used as a tag name for a /[fancy]/ tag
export const parseNodes = (tree, resolveTag = (s) => s) => {
  const {subs, text} = tree
  const nsubs = []

  for (let i = 0; i < subs.length; ++i) {
    const {text, tree} = subs[i]
    const [txt, tag] = extractTag(text)
    if (txt !== '') nsubs.push(txt)
    if (tag.length > 0) {
      // ignore commented out
      // console.log("TAG", tag)
      if (tag.length > 1 && tag.slice(1).startsWith(';')) continue
      // substitute tag
      // todo: ?impl in highlighter?
      else if (tag.length === 2 && tag[1] === '/') {
        //                 /[key]/[value]
        const {substag, substree, subsi} = extractSubstag(subs, i, resolveTag)
        nsubs.push({tag: tag[0] + substag, subs: parseNodes(substree, resolveTag)})
        i = subsi
        continue
      }
    }
    nsubs.push({tag, subs: parseNodes(tree, resolveTag)})
  }

  if (text !== '') nsubs.push(text)
  return nsubs
}
const extractSubstag = (subs, i, resolveTag) => {
  // we are at the sub that contains ./[...]
  // if (i >= subs.length) throw Error('oops')
  let substag
  {
    // key
    // note: ignore text
    const {text: _, tree} = subs[i]
    {
      const doc = resolveTag(parseNodes(tree, resolveTag))
      if (doc.length === 0) substag = ''
      else {
        if (doc.length !== 1) throw Error('oops')
        const node0 = doc[0]
        if (typeof node0 !== 'string') throw Error('oops')
        substag = node0
      }
    }
  }
  i += 1
  // for now expect move to the next sub we expect to be /[value]
  if (i >= subs.length) throw Error('oops')
  let substree
  {
    // value
    const {text, tree} = subs[i]
    if (text !== '/') throw Error('oops')
    substree = tree
  }
  return {substag, substree, subsi: i}
}

// todo: also extract attr delimiter
export const elementDelimiter = "\\"

const extractTag = (text) => {
  let i = text.length - 1
  for (; i >= 0; --i) {
    const c = text[i]
    if ('\r\n\t '.includes(c)) {
      return [text, '']
    }
    else if (c === '.' || c === elementDelimiter) {
      const tag = text.slice(i)
      // note: treating .[] as a text dot followed by an anon element
      // todo: decide if that is final; may also error in this case and require .'[]
      //       then the restriction can be relaxed in the next version if need be
      // if (tag === '.') throw Error('oops')
      if (tag === '.') return [text, '']
      // todo: validate tag
      return [text.slice(0, i), tag]
    }
  }
  return [text, '']
}

// todo: finish and use this:
// validates whether tag is well-formed
const validateTag = (tag) => {
  const c1 = tag[0]
  if (".'".includes(c1) === false) throw Error('oops')
  if (tag.length === 1) return tag
  const c2 = tag[1]
  if (/[a-zA-Z$_;]/.test(c2) === false) throw Error('oops')
  if (tag.length === 2) return tag
  const last = tag.at(-1)
  // note: could allow a space (or even > 1 space) at the end which would not be counted as part of the tag -- could do that in the next version as well
  if (/[a-zA-Z$_]/.test(last) === false) throw Error('oops')
  let lastwassspace = false
  for (let i = 1; i < tag.length - 1; ++i) {
    const c = tag[i]
    if (c === ' ') {
      if (lastwassspace) throw Error('oops')
      lastwassspace = true
    }
    else if (/[a-zA-Z$_]/.test(c) === false) throw Error('oops')
    else {
      lastwassspace = false
    }
  }
  return tag
}

const parseTag = (tree) => {
  const {subs, text} = tree
  if (subs.length > 0) throw Error('subs.length > 0')
  return text
}

export const applyAttrs = (subs, parent = {_tag: ''}) => {
  const nsubs = []
  for (const sub of subs) {
    if (typeof sub === 'string') {
      nsubs.push(sub)
      continue
    }
    const {tag, subs} = sub

    if (tag.startsWith('.')) {
      let t2 = tag.slice(1)
      if (t2.startsWith('_')) t2 = '_' + t2
      if (Object.hasOwn(parent, t2)) {
        throw Error(`Duplicate attribute [${t2}]!`)
      }
      parent[t2] = applyAttrs(subs)
    }
    else {
      const nsub = applyAttrs(subs)
      nsub._tag = tag.slice(1)
      nsubs.push(nsub)
    }
  }
  parent._subs = nsubs
  return parent
}
const parsers = {
  true: ({_subs, _tag, ...rest}) => {
    if (_subs.length !== 0 || Object.entries(rest).length !== 0) throw Error('oops')
    return true
  },
  false: ({_subs, _tag, ...rest}) => {
    if (_subs.length !== 0 || Object.entries(rest).length !== 0) throw Error('oops')
    return false
  },
  nil: ({_subs, _tag, ...rest}) => {
    if (_subs.length !== 0 || Object.entries(rest).length !== 0) throw Error('oops')
    return null
  },
  Infinity: ({_subs, _tag, ...rest}) => {
    if (_subs.length !== 0 || Object.entries(rest).length !== 0) throw Error('oops')
    return Infinity
  },
  NaN: ({_subs, _tag, ...rest}) => {
    if (_subs.length !== 0 || Object.entries(rest).length !== 0) throw Error('oops')
    return NaN
  },
  doctest: ({_subs, _tag, ...rest}) => {
    const data = extractData({_subs, _tag: '', ...rest})
    const out = eval(data.code).toString()
    if (out !== data.expect) {
      data.status = 'FAILED'
      data.actual = out
      // console.error(out)
      // throw Error('oops')
    }
    else {
      data.status = 'PASSED'
    }
    // console.log(parent)
    return data
  },
  // todo:
  '=': ({_subs, _tag, ...rest}) => {
    if (_subs.length !== 1 || Object.entries(rest).length !== 0) throw Error('oops')
    const sub = _subs[0]
    if (typeof sub !== 'string') throw Error('oops')
    if (sub === '-Infinity') return -Infinity
    if (sub === 'Infinity') return Infinity
    if (sub === 'NaN') return NaN
    const parsed = JSON.parse(sub)
    if (typeof parsed === 'number') return parsed
    throw Error('oops')
  },
  // todo:
  num: ({_subs, _tag, ...rest}) => {
    if (_subs.length !== 1 || Object.entries(rest).length !== 0) throw Error('oops')
    const sub = _subs[0]
    if (typeof sub !== 'string') throw Error('oops')
    if (sub === '-Infinity') return -Infinity
    if (sub === 'Infinity') return Infinity
    if (sub === 'NaN') return NaN
    const parsed = JSON.parse(sub)
    if (typeof parsed === 'number') return parsed
    throw Error('oops')
  },
  bool: ({_subs, _tag, ...rest}) => {
    if (_subs.length !== 1 || Object.entries(rest).length !== 0) {
      throw Error('oops')
    }
    const sub = _subs[0]
    if (typeof sub !== 'string') throw Error('oops')
    if (sub === 'true') return true
    if (sub === 'false') return false
    throw Error('oops')
  },
  u64: ({_subs, _tag, ...rest}) => {
    if (_subs.length !== 1 || Object.entries(rest).length !== 0) throw Error('oops')
    const sub = _subs[0]
    if (typeof sub !== 'string') throw Error('oops')
    // todo: error check, etc.
    // actually should use a standard number parser
    return Number(sub)
  },
  // todo: number types
  u16: ({_subs, _tag, ...rest}) => {
    if (_subs.length !== 1 || Object.entries(rest).length !== 0) throw Error('oops')
    const sub = _subs[0]
    if (typeof sub !== 'string') throw Error('oops')
    // todo: error check, etc.
    // actually should use a standard number parser
    return Number(sub)
  },
  // todo: number types
  u8: ({_subs, _tag, ...rest}) => {
    if (_subs.length !== 1 || Object.entries(rest).length !== 0) throw Error('oops')
    const sub = _subs[0]
    if (typeof sub !== 'string') throw Error('oops')
    // todo: error check, etc.
    // actually should use a standard number parser
    return Number(sub)
  },
  seq: ({_subs, _tag, ...rest}) => {
    if (Object.entries(rest).length !== 0) throw Error('oops')
    // console.log('>>', _subs)
    if (_subs.length === 1) {
      const sub = _subs[0]
      if (typeof sub === 'string') return [sub]
    }
    return convertArray(_subs)
  },
  json: ({_subs, _tag, ...rest}) => {
    if (_subs.length !== 1 || Object.entries(rest).length !== 0) {
      throw Error('oops')
    }
    const sub = _subs[0]
    if (typeof sub !== 'string') throw Error('oops')
    return JSON.parse(sub)
  },
}
const defaultParser = (parent) => {
  // throw Error('oops')
  return parent
}
export const extractData = (parent) => {
  const {_tag, _subs, ...rest} = parent

  // tagged type
  if (_tag !== '') {
    const parser = parsers[_tag] ?? defaultParser
    // todo: blow up here/delegate to user-defined handler
    return parser(parent)
  }

  // console.log(parent, rest)

  const entries = Object.entries(rest)

  if (entries.length === 0) {
    if (_subs.length === 1) {
      const sub = _subs[0]
      if (typeof sub === 'string') return sub
    }

    const items = convertArray(_subs)
    // if (_subs.length === 1) {
    if (items.length === 1) {
      // console.log("BBBBB", _subs)
      // const sub = _subs[0]
      // string
      // if (typeof sub === 'string') return sub
      // if (sub._tag === '') return [extractData(sub)]
      // other type: todo
      // return extractData(sub)
      return items[0]
    }
    else {
      // console.log("AAAAAA", _subs)
      // array
      return items
      // return convertArray(_subs)
    }
  }

  // object

  // disallow nonattr _subs in objects
  if (_subs.filter(s => typeof s !== 'string').length > 0) {
    console.error('oops', _subs)
    throw Error('oops')
  }

  const ret = {}

  for (let [key, value] of entries) {
    if (key.startsWith('__')) key = key.slice(1)
    ret[key] = extractData(value)
  }
  return ret
}
const convertArray = (subs) => {
  const ret = []
  for (const sub of subs) {
    if (typeof sub === 'string') continue
    ret.push(extractData(sub))
  }
  return ret
}
// a version which puts extra subs in objects in _subs, processed
export const extractDataCreative = (parent) => {
  const {_tag, _subs, ...rest} = parent

  // tagged type
  if (_tag !== '') {
    const parser = parsers[_tag] ?? defaultParser
    // todo: blow up here/delegate to user-defined handler
    return parser(parent)
  }

  const entries = Object.entries(rest)

  if (entries.length === 0) {
    if (_subs.length === 1) {
      const sub = _subs[0]
      if (typeof sub === 'string') return sub
    }

    const items = convertArrayCreative(_subs)
    if (items.length === 1) {
      return items[0]
    }
    else {
      // array
      return items
    }
  }

  // object
  const ret = {}
  for (let [key, value] of entries) {
    // if (key.startsWith('__')) key = key.slice(1)
    ret[key] = extractDataCreative(value)
  }
  if (_subs.filter(s => typeof s !== 'string').length > 0) ret._subs = convertArrayCreative(_subs)
  return ret
}
const convertArrayCreative = (subs) => {
  const ret = []
  for (const sub of subs) {
    if (typeof sub === 'string') continue
    ret.push(extractDataCreative(sub))
  }
  return ret
}

// todo:
// export const stringifyJdaml = (subs) => {


export const parseElemsForHighlight = (tree) => {
  const {subs, text: fulltext} = tree
  const nsubs = []
  for (const {text: fulltext, tree} of subs) {

    const {text: txt, tag} = extractTagForHighlight(fulltext)
    if (iszerolength(txt) === false) nsubs.push(txt)
    if (iscommentedout(tag)) {
      nsubs.push({comment: true, tag, tree})
      continue
    }
    nsubs.push({tag, subs: parseElemsForHighlight(tree)})
  }
  if (iszerolength(fulltext) === false) nsubs.push(fulltext)
  return nsubs
}
const iscommentedout = (tag) => {
  const length = slicelength(tag)
  if (length < 2) return false
  const {source, from} = tag
  return source[from.index + 1] === ';'  
}
const slicelength = (slice) => {
  return slice.til.index - slice.from.index
}
const iszerolength = (text) => {
  const {from, til} = text
  return from.index === til.index
}
// todo: bring up to speed with latest changes
//       particularly \t and ' ' now can't be in tag names
const extractTagForHighlight = (text) => {
  if (text.digraphs === undefined) {
    console.error('>>>', text)
    throw Error('fenced text only allowed in suffix position')
  }
  
  const {from, thru, til, source, digraphs} = text
  const state = {...thru}
  for (; state.index >= from.index; moveback(state)) {
    const c = source[state.index]
    
    if (c === '\n' || c === '\r') {
      // todo: dedupe empty tag creation
      const prev = location(til)
      moveback(prev)
      return {text, tag: {from: til, thru: prev, til, source}}
    }
    else if (c === '.' || c === elementDelimiter) {
      // todo: perhaps return also thru
      const loc = location(state)
      const prev = location(state)
      moveback(prev)

      const tag = {from: loc, thru, til, source}
      // todo: validateTag(tag) to check that it has no digraphs
      // // todo: opener, closer, escaper
      // if (c === '`' || c === '[' || c === ']') {
      // }
      // else 
      return {
        text: {from, thru: prev, til: loc, digraphs, source},
        tag,
      }
    }
  }
  // note: for now thru < from & til = from signifies 0-length slice
  // todo: maybe a better design
  const prev = location(til)
  moveback(prev)
  return {text, tag: {from: til, thru: prev, til, source}}
}
// todo
const location = (state) => {
  return {...state}
}
const moveback = (state) => {
  // todo: line, col
  state.index -= 1
}
const moveback_expensive = (str, state) => {
  state.index -= 1
  const c = str[state.index]
  
  if (c === '\n') {
    state.linefeedread = true
    // go back to previous line or str start, to measure this line's length
    state.column = measurelinebackwards(str, state)
    state.line -= 1
  }
  else if (c === '\r') {
    if (state.linefeedread) {
      state.linefeedread = false
      state.column -= 1
    }
    else {
      // go back to previous line or str start, to measure this line's length
      state.column = measurelinebackwards(str, state)
      state.line -= 1
    }
  }
  else {
    state.column -= 1
  }
}
// todo:
const measurelinebackwards = (str, state) => {
  const tstate = location(state)
  const endindex = tstate.index

  // if we hit the beginning
  if (tstate.index === 0) {
    // line has only the newline in it (1 column)
    return 1
  }
  // move back
  tstate.index -= 1
  if (state.linefeedread) {
    // if line ends with CR LF, skip the CR
    if (str[tstate.index] === '\r') {
      tstate.index -= 1
    }
  }

  while (true) {
    const c = str[state.index]
    // if we reached the previous line, here is our answer
    if (c === '\r' || c === '\n') {
      return endindex - tstate.index
    }
    // if we hit the beginning, the answer is + 1
    // as the line contains at least the newline character that ends it
    if (tstate.index === 0) {
      return endindex - tstate.index + 1
    }
    // move back
    tstate.index -= 1
  }
}
export const highlightSubs = (subs, level = 0) => {
  let ret = '<span class="subs">'
  for (const sub of subs) {
    // note duck typing to check if sub is a slice
    // todo:
    if (sub.from !== undefined) {
      ret += highlightTextSlice(sub)
    }
    else if (sub.comment) {
      // todo:
      const {tag, subs} = sub
      const {source, from, til} = tag
      if (subs.length === 0) {
        ret += `<span class="comment">${source.slice(from.index, til.index)}[]</span>`
      }
      else {
        const last = subs.at(-1)
        // todo: recursively find last sub that has a til (a text slice) and use that + the depth of recursion to highlight [[[[]]]]
        // something like ${highlightCommentSubs(subs)}

        // todo:
        ret += `<span class="comment">${source.slice(from.index, til.index)}[TODO]</span>`
      }
    }
    else {
      const {tag, subs} = sub
      // console.log("SUB", sub)

      // console.log('ttt', tag, sub)
      const t = highlightTagSlice(tag)

      if (tagSliceStartsWithDot(tag)) {
        ret += `<span class="attr level-${level % 3}">${t}<span class="bracket">[</span>${highlightSubs(subs, level + 1)}<span class="bracket">]</span></span>`
      }
      else {
        ret += `<span class="elem level-${level % 3}">${t}<span class="bracket">[</span>${highlightSubs(subs, level + 1)}<span class="bracket">]</span></span>`
      }
    }
  }
  return ret + '</span>'
}
const tagSliceStartsWithDot = (tag) => {
  if (iszerolength(tag)) return false
  const {from, til, source} = tag
  return source[from.index] === '.'
}
const highlightTagSlice = (slice) => {
  if (iszerolength(slice)) return ''

  const {source, from, til} = slice

  const fromi = from.index

  // todo: simplify 1-length tags (can remove span.content)
  return `<span class="tag">${source[fromi]}<span class="content">${source.slice(fromi + 1, til.index)}</span></span>`
}
const highlightTextSlice = (slice) => {
  let ret = `<span class="text">`
  
  const {digraphs, source} = slice
  if (digraphs === undefined) {
    // fenced
    const {from, til, content} = slice
    const contentfromi = content.from.index
    const contenttili = content.til.index
    ret += `<span class="fence">${source.slice(from.index, contentfromi)}</span>${
      source.slice(contentfromi, contenttili)
    }<span class="fence">${source.slice(contenttili, til.index)}</span>`
  }
  else {
    const {from, til} = slice
    let i = from.index
    for (const di of digraphs) {
      const difrom = di.from.index
      ret += source.slice(i, difrom)
      i = di.thru.index + 1
      ret += `<span class="digraph">${source.slice(difrom, i)}</span>`
    }
    ret += source.slice(i, til.index)
  }

  return ret + `</span>`
}

export const seedFromStringForHighlight = (str) => {
  let current = {subs: [], text: undefined}
  const parents = [current]
  return decodeString(str, {
    prefix: (text) => {
      const tree = {subs: [], text: undefined}
      current.subs.push({text, tree})
      parents.push(current)
      current = tree
    },
    suffix: (text) => {
      current.text = text
      current = parents.pop()
    },
    end: () => {
      return current
    }
  })
}

export const highlightJdaml = (str) => {
  return highlightSubs(parseElemsForHighlight(seedFromStringForHighlight(str)))
}




export const parseJdaml2 = (str) => {
  const extract = extractDataCreative2
  return extract(applyAttrs(parseNodes(seedFromString(str))))
}
export const extractDataCreative2 = (parent) => {
  const {_tag, _subs, ...rest} = parent

  // tagged type
  if (_tag !== '') {
    const parser = parsers[_tag] ?? defaultParser
    // todo: blow up here/delegate to user-defined handler
    return parser(parent)
  }

  const entries = Object.entries(rest)

  if (entries.length === 0) {
    if (_subs.length === 1) {
      const sub = _subs[0]
      if (typeof sub === 'string') return sub
    }

    // array
    return convertArrayCreative2(_subs)
  }

  if (entries.length === 1) {
    const [key, v] = entries[0]
    const val = extractDataCreative2(v)
    // todo: check/handle nonempty _subs, etc.
    if (key === '=') {
      if (val === 'true') return true
      if (val === 'false') return false
      if (val === 'nil') return null
      if (val === 'seq') return []
      console.log('>>>', val)
      const num_ = Number(val)
      if (Number.isNaN(num_)) throw Error('todo')
      return num_
    }
    else if (key === ':') {
      if (val === 'number') {
        if (_subs.length === 1) {
          const sub = _subs[0]
          if (typeof sub === 'string') return Number(sub)
          else throw Error('oops')
        }
        else throw Error('oops')
      }
      else {
        throw Error('todo')
      }
    }
  }

  // object
  const ret = {}
  for (let [key, value] of entries) {
    // if (key.startsWith('__')) key = key.slice(1)
    ret[key] = extractDataCreative2(value)
  }
  if (_subs.filter(s => typeof s !== 'string').length > 0) ret._subs = convertArrayCreative2(_subs)
  return ret
}
const convertArrayCreative2 = (subs) => {
  const ret = []
  for (const sub of subs) {
    if (typeof sub === 'string') continue
    ret.push(extractDataCreative2(sub))
  }
  return ret
}
