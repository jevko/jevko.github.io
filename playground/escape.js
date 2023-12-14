import {defaultOpener, defaultCloser, defaultEscaper} from './delimiters.js'

export const escape = (str, {
  opener = defaultOpener,
  closer = defaultCloser,
  escaper = defaultEscaper,
} = {}) => {
  let ret = ''
  for (const c of str) {
    if (c === opener || c === closer || c === escaper) ret += escaper
    ret += c
  }
  return ret
}