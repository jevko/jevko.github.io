import { normalizeDelimiters } from "./delimiters.js"
import {_makeEncoders as makeBasicEncoders} from './encode.js'

// todo: tests for all this
// todo: maybe a makeEncdec
export const makeEncoders = (delims, fencelengthlimit = 15) => {
  const delimiters = normalizeDelimiters(delims)
  const {opener, closer} = delimiters

  const basicEncoders = makeBasicEncoders(delimiters, fencelengthlimit)

  const {fence, escape} = basicEncoders

  // note: this encodes standard jevko
  // todo: encoder for the AST
  const jevkoToString = (jevko) => {
    const {subjevkos, suffix, fencelength} = jevko
  
    if (fencelength !== undefined) {
      return fence(suffix, fencelength)
    }
  
    let ret = ''
    for (const {prefix, jevko} of subjevkos) {
      ret += `${escape(prefix)}${recur(jevko)}`
    }
    return ret + escape(suffix)
  }
  const recur = (jevko) => {
    const {subjevkos, suffix, fencelength} = jevko
  
    if (fencelength !== undefined) {
      return fence(suffix, fencelength)
    }
  
    let ret = ''
    for (const {prefix, jevko} of subjevkos) {
      ret += `${escape(prefix)}${recur(jevko)}`
    }
    return opener + ret + escape(suffix) + closer
  }

  return {...basicEncoders, jevkoToString}
}

// todo: pehaps fence should not be returned?
export const {jevkoToString, escape, fence, smartEscape} = makeEncoders()