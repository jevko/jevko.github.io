import { elementDelimiter } from "./jdaml.js";

export const resolvedecorators1 = (subs) => {
  let prevtext = []
  let prevdeco = []
  const nsubs = []
  for (const sub of subs) {
    if (typeof sub === 'string') {
      prevtext.push(sub)
    }
    else {
      const {tag, subs} = sub
      if (tag === elementDelimiter + "@") {
        prevdeco.push(sub)
      }
      else if (tag === elementDelimiter + '@-') {
        // let the next stage deal w/ declarations
        nsubs.push(sub)
      }
      else if (tag.startsWith(elementDelimiter + "@")) {
        prevdeco.push(sub)
      }
      else {
        if (prevtext.length > 0) {
          nsubs.push(prevtext.join(''))
          prevtext = []
        }
        const rsubs = resolvedecorators1(subs)
        if (prevdeco.length > 0) {
          nsubs.push({tag, subs: rsubs, decorators: prevdeco})
          prevdeco = []
        }
        else {
          nsubs.push({tag, subs: rsubs})
        }
      }
    }
  }
  if (prevdeco.length > 0) throw Error(`trailing decorators not allowed`)
  if (prevtext.length > 0) nsubs.push(prevtext.join(''))
  return nsubs
}

export const compiledecorators = (subs) => {
  const code = compile(resolvedecorators1(subs))
  // note: this ({tag: \`\\${elementDelimiter}\${name}\`, subs}) business is quite tricky -- so watch out!
  const ret = `(()=>{
  const $ = (...subs) => node => {
    node.subs.push(...subs)
    return node
  }
  const $el = (name, ...subs) => {
    // if (subs.some(s => typeof s !== 'string' && typeof s !== 'object')) {
    //   console.error(s)
    //   throw Error('oopsiedaisy')
    // }
    return {tag: \`\\${elementDelimiter}\${name}\`, subs}
  }
  const $at = (name, ...subs) => ({tag: \`.\${name}\`, subs})
  const $wr = (fn) => {
    const ret = fn()
    if (Array.isArray(ret)) return ret
    if (ret === null) throw Error('oops')
    if (typeof ret === 'object') return [ret]
    return [ret + '']
  }

  // note: this mutates
  // todo: maybe don't mutate
  // todo: call this something like concatattrs
  const concat = (...subs) => node => {
    for (const sub of subs) {
      if (typeof sub === 'string') {
        node.subs.push(sub)
      }
      else {
        const {tag, subs} = sub
        if (tag.startsWith(".")) {
          const attr = node.subs.find(s => s.tag === tag)

          if (attr === undefined) node.subs.push(sub)
          else attr.subs.push(...subs)
        }
        else {
          node.subs.push(sub)
        }
      }
    }
    return node
  }
  // changes node's tag -- assumes it's an element
  const tag = (t) => (node) => {
    node.tag = ${JSON.stringify(elementDelimiter)} + t
    return node
  }

  const subs = ${code}
  return subs
})()
  `

  console.log('dbeval', ret)
  const evaled = eval?.(ret)
  console.log('devaled', evaled)
  check(evaled)
  

  return evaled
}

const check = (subs, path = [0]) => {
  for (const sub of subs) {
    if (typeof sub !== 'string') {
      if (typeof sub !== 'object' || Array.isArray(sub) || sub === null) {
        console.error('got ya now: ', path, sub)
        throw Error('bad decorator')
      }
      else {
        const {tag, subs} = sub
        if (typeof tag !== 'string') throw Error('bad decorator')
        if (Array.isArray(subs) === false) throw Error('bad decorator')
        check(sub.subs, [...path, 0])
      }
    }
    path[0] += 1
  }
}


const compile = (subs) => {
  let code = '(() => {const ret = [];\n'
  for (const sub of subs) {
    if (typeof sub === 'string') {
      code += `ret.push(${JSON.stringify(sub)});\n`
      continue
    }
    // todo: let the previous stage always return decorators as an array 
    const {tag, subs, decorators = []} = sub

    const name = tag.slice(1)

    if (tag.startsWith('.')) {
      // note: attributes can be decorated just as well as elements
      let cnode = decorate(decorators, `$at(${JSON.stringify(name)}, ...${compile(subs)})`)
      code += `ret.push(${cnode});\n`
    }
    else {
      // if (name === '@=') {
      //   code += `ret.push(...$wr(()=>${elaborate(subs)}));\n`
      // }
      // else 
      if (name === '@-') {
        code += `${elaborate(subs)};\n`
      }
      else if (name === '=') {
        code += `ret.push(...$wr(()=>${elaborate(subs)}));\n`
      }
      else {
        const compiled = compile(subs)
       
        let cnode = decorate(decorators, `$el(${JSON.stringify(name)}, ...${compiled})`)
        code += `ret.push(${cnode});\n`
      }
    }
  }
  return code + `return ret;})()`
}

const decorate = (decorators, expr) => {
  const fnames = []
  for (const deco of decorators) {
    const {tag, subs} = deco
    const name = tag.slice(1)
    if (name === '@') {
      // default decorator
      fnames.push(['$', compile(subs)])
    }
    else {
      const fname = name.slice(1)
      fnames.push([fname, compile(subs)])
    }
  }
  
  let dexpr = expr
  for (const [fname, fargs] of fnames.reverse()) {
    dexpr = `${fname}(...${fargs})(${dexpr})`
  }
  return dexpr
}

const elaborate = (subs) => {
  let prevdeco = []
  let ret = ''
  for (const sub of subs) {
    if (typeof sub === 'string') {
      // compiling \@deco[...] into ((node) => deco(node, ...))
      // compiling \@deco1[...a]\@deco2[...b] into ((node) => deco1(deco2(node, ...b), ...a))
      // etc.
      if (prevdeco.length > 0) {
        let expr = `node`
        for (const deco of prevdeco.reverse()) {
          const {tag, subs} = deco
          let name = tag.slice(2)
          if (name === '') name = '$'
          expr = `${name}(...${compile(subs)})(${expr})`
        }
        ret += `((node) => ${expr})`
        prevdeco = []
      }
      ret += sub
      continue
    }
    const {tag, subs} = sub
    const name = tag.slice(1)
    if (tag === '') {
      ret += `[${elaborate(subs)}]`
    }
    else if (tag.startsWith('.')) {
      if (ret.at(-1) === '\\') ret = ret.slice(0, -1)
      // todo: compile to JS property access if ret.at(-1) or rather if ret ends with a valid JS token that can occur before a .
      ret += `$at(${JSON.stringify(name)}, ...${compile(subs)})`
    }
    else {
      if (name === "'") {
        // ?todo: could support interpolation by using sth else than trytostr
        ret += JSON.stringify(trytostr(subs))
      }
      else if (name.startsWith('@')) {
        prevdeco.push(sub)
      }
      else {
        ret += `$el(${JSON.stringify(name)}, ...${compile(subs)})`
      }
    }
  }
  return ret
}

const trytostr = (subs) => {
  if (subs.length === 0) return ''
  if (subs.length > 1) throw Error('catch me if you can')
  const sub = subs[0]
  if (typeof sub !== 'string') throw Error('catch me if you can')
  return sub
}
