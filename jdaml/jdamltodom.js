import { parseNodes, seedFromString } from "./jdaml.js"
import { resolveentities } from "./jdamlentities.js"

export const jdamltodom = (str) => {
  return dumbconvert(resolveentities(parseNodes(seedFromString(str))))
}

// note: HTML tags can't start with _
const anonName = 'jdaml'

// todo: could support adjustable root in HTML and XML via .:root[custom]

// todo: could support .:before[<!doctype html>] and .:after[</xml>]

const createDocument = () => {
  const doc = new DOMParser().parseFromString("<html _jdaml=\"true\"></html>", "text/html").documentElement
  doc.replaceChildren()
  return doc
}

// todo: stripping space from before attrs should be configurable
// maybe in creative mode they should only be stripped if attr is not complex
export const dumbconvert = (subs, parent = createDocument()) => {
  let prevtext = []
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
        console.error(getAttribute(parent, t2), sub)
        throw Error(`Duplicate attribute [${t2}]!`)
      }
      // parent.setAttribute(t2, dumbtostr(subs))
      // todo: fix the prevtext.pop() bug in the toxml converter too
      setAttribute(parent, t2, subs, prevtext.join(''))
      prevtext = []
    }
    else {
      if (prevtext.length > 0) {
        parent.append(prevtext.join(''))
        prevtext = []
      }
      let name = tag.slice(1)
      // todo: anonymous nodes
      if (name === '') name = anonName
      else if (name.startsWith('_')) name = '_' + name

      // verbatim HTML:
      // todo: maybe rename to html=
      if (name === '=html') {
        const str = trytostr(subs)
        parent.insertAdjacentHTML('beforeend', str)
      }
      else {
        // todo: handle invalid names in creative mode here
        const nsub = dumbconvert(subs, createElement(name, parent))
        parent.append(nsub)
      }
    }
  }
  if (prevtext.length > 0) {
    parent.append(prevtext.join(''))
    prevtext = []
  }
  return parent
}
const trytostr = (subs) => {
  if (subs.some(s => typeof s !== 'string')) throw Error('catch me if you can')
  return subs.join('')
}
// todo: unhack parent.ownerDocument
export const createElement = (name, parent) => {
  try {
    // if (name === 'head') return parent.ownerDocument.head
    // if (name === 'body') return parent.ownerDocument.body
    return parent.ownerDocument.createElement(name)
  } catch (e) {
    if (e instanceof DOMException && e.name === 'InvalidCharacterError') {
      const el = parent.ownerDocument.createElement(anonName)
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
// for debugging purposes
const getAttribute = (parent, name) => {
  if (parent.hasAttribute(name)) return parent.getAttribute(name)
  for (const c of parent.children) {
    if (c.hasAttribute('_isattr') && c.getAttribute('_name') === name) {
      return c
    }
  }
  return undefined
}

// todo: should be possible to configure always using element-like attributes
// todo: should be possible to configure not setting _isattr="true"
// todo: an alternative JDAML output format with both of these configured
const setAttribute = (parent, name, value, prevtextstr) => {
  try {
    if (prevtextstr.length > 0) {
      // filter out blank text nodes that precede JDAML attributes
      console.log('>', name, `[${prevtextstr.trim()}]`)
      if (prevtextstr.trim() !== '') parent.append(prevtextstr)
    }

    const maybestr = trytostr(value)
    parent.setAttribute(name, maybestr)
  } catch (e) {
    if (e instanceof DOMException && e.name === 'InvalidCharacterError') { 
      if (prevtextstr.length > 0) parent.append(prevtextstr)
      // name is bad
      const attrel = parent.ownerDocument.createElement(anonName)
      attrel.setAttribute('_name', name)
      attrel.setAttribute('_isattr', 'true')
  
      // note: dumbconvert appends the value subs to attrel
      // todo: solve possible conflicts with _isattr and _name
      // -- attrs that start with _ should have _ prepended in creative mode
      // I guess dumbconvert already does that
      parent.append(dumbconvert(value, attrel))
    }
    else if (e instanceof Error && e.message === 'catch me if you can') {
      if (prevtextstr.length > 0) parent.append(prevtextstr)
      // name is ok, but value is bad
      const attrel = parent.ownerDocument.createElement(name)
      attrel.setAttribute('_isattr', 'true')
  
      parent.append(dumbconvert(value, attrel))
    }
    else {
      throw e
    }
  }
}

export const decodeHtmlEntity = (() => {
  var tarea = document.createElement("textarea");
  // todo: perhaps error if entity doesn't conform to the regexp:
  // /[#A-Za-z0-9]+/
  // or:
  // /#x[a-fA-F0-9]+|#[0-9]+|[a-zA-Z0-9]+/
  return (entity) => {
    tarea.innerHTML = '&' + entity + ';';
    return tarea.value;
  }
})()