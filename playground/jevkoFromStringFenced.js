import { normalizeDelimiters } from "./delimiters.js"

// a version which does multistrings similarly to djevko
// but in the most minimal way that does not know anything about whitespace
// however it can easily be extended to support space and other djevko/djedat features
export const jevkoFromString = (str, delimiters) => {
  const {opener, closer, escaper, quoter} = normalizeDelimiters(delimiters)

  const parents = []
  let parent = {subjevkos: []}, buffer = '', h = 0, mode = 'normal'
  let line = 1, column = 1
  let fence = '', t = 0

  const open = (prefix, i) => {
    const jevko = {subjevkos: []}
    const subjevko ={
      prefix,
      jevko,
    }
    parent.subjevkos.push(subjevko)
    buffer = ''
    h = i + 1
    parents.push(parent)
    parent = jevko
    return subjevko
  }

  const close = (suffix, i) => {
    parent.suffix = suffix
    buffer = ''
    h = i + 1
    if (parents.length < 1) throw SyntaxError(`Unexpected closer (${closer}) at ${line}:${column}!`)
    parent = parents.pop()
  }

  // note: checks fence from index 1, assuming fence[0] is always escaper
  const parseFence = (i) => {
    // note: prepending escaper for symmetry
    // note: doubling escapers for symmetry
    const fence = escaper + 
      (buffer + str.slice(h, i))
        .replaceAll(escaper, escaper + escaper)

    for (let i = 1; i < fence.length; ++i) {
      const c = fence[i]
      if (c !== escaper) {
        throw SyntaxError(
          `Fenced text must start with ${escaper}${quoter} or ${escaper}${escaper}${escaper}${quoter} or ${escaper}${escaper}${escaper}${escaper}${escaper}${quoter} or... The number of ${escaper} before ${quoter} must be ODD! Instead found: ${fence.slice(1)}${escaper}${quoter}`
        )
      }
    }

    return fence
  }

  // note: iterating thru code units rather than code points
  // this is effectively correct as long as each delimiter fits within one code unit
  // todo: perhaps enforce?
  for (let i = 0; i < str.length; ++i) {
    const c = str[i]

    if (mode === 'escaped') {
      if (c === escaper || c === opener || c === closer) mode = 'normal'
      else if (c === quoter) {
        fence = parseFence(i)
        mode = 'fenced'
        h = i + 1
        t = i + 1
      } else throw SyntaxError(`Invalid digraph (${escaper}${c}) at ${line}:${column}!`)
    } else if (mode === 'fenced') {
      if (c === quoter) {
        t = i + 1
      } else if (c === opener) {
        const found = str.slice(t, i)
        if (found === fence) {
          const sub = open(str.slice(h, t - 1), i)
          // note: save fence + fence info in subjevko
          sub.fence = fence
          mode = 'normal'
        } // else t = i + 1
      } else if (c === closer) {
        const found = str.slice(t, i)
        if (found === fence) {
          // note: save fence + fence info in jevko
          parent.fence = fence
          close(str.slice(h, t - 1), i)
          mode = 'normal'
        } // else t = i + 1
      }
    } else /*if (mode === 'normal')*/ if (c === escaper) {
      buffer += str.slice(h, i)
      h = i + 1
      mode = 'escaped'
    } else if (c === opener) {
      open(buffer + str.slice(h, i), i)
    } else if (c === closer) {
      close(buffer + str.slice(h, i), i)
    }

    if (c === '\n') {
      ++line
      column = 1
    } else {
      ++column
    }
  }
  // todo: better error msgs
  if (mode === 'escaped') throw SyntaxError(`Unexpected end after escaper (${escaper})!`)
  else if (mode === 'fenced') {
    const found = str.slice(t)
    if (found === fence) {
      parent.suffix = str.slice(h, t - 1)
      parent.fence = fence
    } else {
      throw SyntaxError(`Unexpected end before fenced text closed!\nExpected: ${fence}\nFound: ${found}`)
    }
  }
  else /*if (mode === 'normal')*/ {
    parent.suffix = buffer + str.slice(h)
  }
  if (parents.length > 0) throw SyntaxError(`Unexpected end: missing ${parents.length} closer(s) (${closer})!`)
  parent.opener = opener
  parent.closer = closer
  parent.escaper = escaper
  parent.quoter = quoter
  return parent
}
