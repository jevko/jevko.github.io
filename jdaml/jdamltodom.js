import { parseElems, seedFromString } from "./jdaml.js"

export const jdamltodom = (str) => {
  return (dumbconvert(parseElems(seedFromString(str))))
}

// todo: stripping space from before attrs should be configurable
// maybe in creative mode they should only be stripped if attr is not complex 
export const dumbconvert = (subs, parent = document.createElement('jdaml')) => {
  const prevtext = []
  for (const sub of subs) {
    if (typeof sub === 'string') {
      prevtext.push(sub)
      continue
    }
    const {tag, subs} = sub

    if (tag.startsWith('.')) {
      let t2 = tag.slice(1)
      if (t2.startsWith('_')) t2 = '_' + t2
      // if (parent.hasAttribute(t2)) throw Error('dupe')
      if (hasAttribute(parent, t2)) {
        console.error(t2)
        throw Error('dupe')
      }
      // parent.setAttribute(t2, dumbtostr(subs))
      setAttribute(parent, t2, subs, prevtext)
    }
    else {
      if (prevtext.length > 0) parent.append(prevtext.pop())
      let name = tag.slice(1)
      // todo: anonymous nodes
      if (name === '') name = '_'
      else if (name.startsWith('_')) name = '_' + name
      // todo: handle invalid names in creative mode here
      const nsub = dumbconvert(subs, createElement(name))
      parent.append(nsub)
    }
  }
  if (prevtext.length > 0) parent.append(prevtext.pop())
  return parent
}
const dumbtostr = (subs) => {
  if (subs.length === 0) return ''
  if (subs.length > 1) throw Error('oops')
  const sub = subs[0]
  if (typeof sub !== 'string') throw Error('oops')
  return sub
}
const trytostr = (subs) => {
  if (subs.length === 0) return ''
  if (subs.length > 1) throw Error('catch me if you can')
  const sub = subs[0]
  if (typeof sub !== 'string') throw Error('catch me if you can')
  return sub
}

const createElement = (name) => {
  try {
    return document.createElement(name)
  } catch (e) {
    if (e instanceof DOMException && e.name === 'InvalidCharacterError') {
      const el = document.createElement('_')
      el.setAttribute('_name', name)
      return el
    }
    else {
      throw e
    }
  }
}
const hasAttribute = (parent, name) => {
  if (parent.hasAttribute(name)) return true
  for (const c of parent.children) {
    if (c.hasAttribute('_isattr') && c.getAttribute('_name') === name) {
      return true
    }
  }
  return false
}

// todo: should be possible to configure always using element-like attributes
const setAttribute = (parent, name, value, prevtext) => {
  try {
    const maybestr = trytostr(value)
    parent.setAttribute(name, maybestr)
    if (prevtext.length > 0) {
      const text = prevtext.pop()
      console.log('>', name, `[${text.trim()}]`)
      if (text.trim() !== '') parent.append(text)
    }
  } catch (e) {
    if (
      (e instanceof DOMException && e.name === 'InvalidCharacterError') 
      || (e instanceof Error && e.message === 'catch me if you can')
    ) { 
      if (prevtext.length > 0) parent.append(prevtext.pop())
      // either name or value is bad
      // for now we treat both cases the same
      const attrel = document.createElement('_')
      attrel.setAttribute('_isattr', 'true')
      attrel.setAttribute('_name', name)
  
      // note: dumbconvert appends the value subs to attrel
      // todo: solve possible conflicts with _isAttr and _name
      // -- attrs that start with _ should have _ prepended in creative mode
      // I guess dumbconvert already does that
      parent.append(dumbconvert(value, attrel))
    }
    else {
      throw e
    }
  }
}
