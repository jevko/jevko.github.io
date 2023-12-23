import { normalizeDelimiters, defaultDelimiters } from "./delimiters.js"

// todo: tests for all this
// todo: maybe a makeEncdec
export const makeEncoders = (delims, ...rest) => {
  const delimiters = normalizeDelimiters(delims)
  return _makeEncoders(delimiters, ...rest)
}

// assumes delimiters are normalized
export const _makeEncoders = (delimiters, fencelengthlimit = 15) => {
  const {fencer, escaper, opener, closer} = delimiters

  const escape = (str) => {
    let ret = ''
    let j = 0
    for (let i = 0; i < str.length; ++i) {
      const c = str[i]
      if (c === opener || c === closer || c === escaper) {
        ret += str.slice(j, i) + escaper
        j = i
      }
    }
    return ret + str.slice(j)
  }
  
  /**
   * Assumes delimiters are normalized
   * Trusts that fencelength is correct
   */
  const fence = (str, fencelength) => {
    if (fencelength % 2 === 0 || fencelength > fencelengthlimit) throw SyntaxError(`Expected fencelength to be odd and <= ${fencelengthlimit} but got ${fencelength}!`)
    return _fence(str, fencelength)
  }
  const _fence = (str, fencelength) => {
    const fence = Array.from({length: fencelength}).fill(escaper).join('')

    return `${fence}${fencer}${str}${fencer}${fence}`
  }

  const needsEscaping = (str) => {
    for (let i = 0; i < str.length; ++i) {
      const c = str[i]
      if (c === opener || c === closer || c === escaper) {
        return true
      }
    }
    return false
  }

  // does at most 2 passes over the str
  // ?todo: could be "optimized" (would have to benchmark) to check if needsEscaping while going thru the string instead of doing a sepatate pass
  const smartEscape = (str, couldbelast = true) => {
    if (needsEscaping(str) === false) return str
    let conflictfencestartindex = -1
    let maxfenlen = 0
    for (let i = 0; i < str.length; ++i) {
      const c = str[i]
      if (conflictfencestartindex === -1) {
        if (c === fencer) {
          conflictfencestartindex = i + 1
        }
      }
      else if (c !== escaper) {
        if (c === opener || c === closer) {
          const currfenlen = i - conflictfencestartindex
          if (currfenlen > maxfenlen) maxfenlen = currfenlen
        }
        conflictfencestartindex = -1
      }
    }
    if (couldbelast && conflictfencestartindex !== -1) {
      // the string ends in '`````
      const currfenlen = str.length - conflictfencestartindex
      if (currfenlen > maxfenlen) maxfenlen = currfenlen
    }
    // fencelength must be ODD
    if (maxfenlen % 2 === 1) maxfenlen += 1
    const fencelength = maxfenlen + 1
    if (fencelength >= fencelengthlimit) return escape(str)
    return _fence(str, fencelength)
  }

  return {escape, fence, smartEscape}
}

export const {escape, fence, smartEscape} = _makeEncoders(defaultDelimiters)