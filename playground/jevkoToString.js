import { normalizeDelimiters } from "./delimiters.js"
import { escape } from "./escape.js"

export const jevkoToString = (jevko, delims) => {
  const delimiters = normalizeDelimiters(delims)

  const {subjevkos, suffix, tag} = jevko

  if (tag !== undefined) {
    return stringToHeredoc(suffix, tag, delimiters)
  }

  let ret = ''
  for (const {prefix, jevko} of subjevkos) {
    ret += `${escape(prefix, delimiters)}${recur(jevko, delimiters)}`
  }
  return ret + escape(suffix, delimiters)
}

const recur = (jevko, delimiters) => {
  const {subjevkos, suffix, tag} = jevko

  if (tag !== undefined) {
    return stringToHeredoc(suffix, tag, delimiters)
  }

  let ret = ''
  for (const {prefix, jevko} of subjevkos) {
    ret += `${escape(prefix, delimiters)}${recur(jevko, delimiters)}`
  }
  return delimiters.opener + ret + escape(suffix, delimiters) + delimiters.closer
}

/**
 * Assumes delimiters are normalized
 */
export const stringToHeredoc = (str, tag, delimiters) => {
  const {quoter: q} = delimiters
  let id = tag
  let tok = `${q}${tag}${q}`
  let stret = `${str}${tok}`
  const pad = q === '='? '-': '='
  while (stret.indexOf(tok) !== str.length) {
    //?todo: more sophisticated id-generation algo
    id += pad
    tok = `${q}${id}${q}`
    stret = `${str}${tok}`
  }
  return `${delimiters.escaper}${tok}${stret}`
}