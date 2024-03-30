import { applyAttrs, extractData, extractDataCreative, extractDataCreative2, parseNodes, seedFromString } from "./jdaml.js"
import { resolveentities } from "./jdamlentities.js"
import { resolveZnatchke, znatchkesecondpass } from "./jdamlznatchke.js"
import { decodeHtmlEntity, dumbconvert } from "./jdamltodom.js"
import { dumbconvert as xmldumbconvert } from "./jdamltoxmldom.js"
import { jdamltojs } from "./jdamltojs.js"
import { compiledecorators } from "./jdamldecorators.js"
import { transferattrs } from "./jdamlattrs.js"
import { transformequals } from "./transformequals.js"

// todo: conversion in the opposite direction
export const parseJdaml3 = async (str) => {
  // todo: either spec that we don't support all HTML entities in fancy tag names
  // or parseNodes differently for HTML/XML/Znatchke, i.e.
  // with something like (subs) => resolveentities(subs, decodeHtmlEntity)
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
    return {format, data: dumbconvert(resolveentities(subs, decodeHtmlEntity))}
  }
  else if (format === 'xml') {
    // todo: dedicated xml converter
    return {format, data: xmldumbconvert(resolveentities(subs, decodeHtmlEntity))}
  }
  else if (format === 'znatchke') {
    // note: hacky
    const secondpassdata = []
    const prepped = transferattrs(resolveentities(subs, decodeHtmlEntity))
    const resolved = resolveZnatchke(
      prepped, 
      secondpassdata,
    )
    if (secondpassdata.length > 0) await znatchkesecondpass(resolved, secondpassdata)
    return {format: 'html', data: dumbconvert(resolved)}
  }
  else if (format === 'jshtml') {
    // todo: transfer attrs
    return {format: 'html', data: dumbconvert(eval?.(jdamltojs(
      // entities are resolved before jdamltojs
      resolveentities(subs, decodeHtmlEntity)
    )))}
  }
  else if (format === 'znadoc') {
    const secondpassdata = []
    const prepped = transferattrs(transformequals(resolveentities(subs, decodeHtmlEntity)))
    console.log(prepped)
    const resolved = resolveZnatchke(
      // entities are resolved before jdamltojs
      eval?.(jdamltojs(
        prepped
      )), 
      secondpassdata,
    )
    if (secondpassdata.length > 0) await znatchkesecondpass(resolved, secondpassdata)
    // todo: also compiledecorators in jshtml
    const data = dumbconvert(compiledecorators(resolved))
    return {format: 'html', data}
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