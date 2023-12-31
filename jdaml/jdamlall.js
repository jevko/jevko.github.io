import { applyAttrs, extractData, extractDataCreative, extractDataCreative2, parseNodes, seedFromString } from "./jdaml.js"
import { resolveentities } from "./jdamlentities.js"
import { resolveZnatchke } from "./jdamlznatchke.js"
import { dumbconvert } from "./jdamltodom.js"
import { dumbconvert as xmldumbconvert } from "./jdamltoxmldom.js"

// todo: conversion in the opposite direction
export const parseJdaml3 = (str) => {
  const nodes = parseNodes(seedFromString(str), resolveentities)

  const {attrs, subs} = extractTopAttrs(nodes)

  console.log('>>>attrs', attrs)

  const [format] = attrs.format ?? ['json']

  if (format === 'json') {
    return {format, data: extractData(applyAttrs(resolveentities(subs)))}
  }
  else if (format === 'json2') {
    return {format: 'json', data: extractDataCreative(applyAttrs(resolveentities(subs)))}
  }
  else if (format === 'json3') {
    return {format: 'json', data: extractDataCreative2(applyAttrs(resolveentities(subs)))}
  }
  else if (format === 'doctest') {
    return {format: 'json', data: extractDataCreative2(applyAttrs(resolveentities(subs)))}
  }
  else if (format === 'html') {
    return {format, data: dumbconvert(resolveentities(subs))}
  }
  else if (format === 'xml') {
    // todo: dedicated xml converter
    return {format, data: xmldumbconvert(resolveentities(subs))}
  }
  else if (format === 'znatchke') {
    // note: we need to resolve entities after znatchke, because znatchke may generate entities with its [&syntax]
    // todo: perhaps also resolve znatchke in /[fancy]/ tag names?
    //       would need something like:
    //       const nodes = parseNodes(seedFromString(str), s => resolveentities(resolveznatchke(s)))
    return {format: 'html', data: dumbconvert(resolveentities(resolveZnatchke(subs)))}
  }

  console.log(format === 'znatchke', format, 'znatchke')
  throw Error(`unknown format: [${format}]`)
}

// note: could require that top attrs come at the beginning
//       so, error if any found later
const extractTopAttrs = (subs) => {
  const attrs = {}
  const nsubs = []
  for (const sub of subs) {
    if (typeof sub === 'string') {
      nsubs.push(sub)
      continue
    }
    const {tag, subs} = sub

    if (tag.startsWith('.:')) {
      let t2 = tag.slice(2)
      if (Object.hasOwn(attrs, t2)) {
        throw Error(`Duplicate top attribute [${t2}]!`)
      }
      attrs[t2] = subs
    }
    else {
      nsubs.push(sub)
    }
  }
  return {attrs, subs: nsubs}
}