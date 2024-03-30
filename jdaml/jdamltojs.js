import { applyAttrs, elementDelimiter, extractData } from "./jdaml.js"
import { resolveentities } from "./jdamlentities.js"

// todo: instead of $elx figuring out the type of props, create a $wrx which will translate values into {subs, ...props} -- because right now it won't work with "functional components"
// todo: figure out if this listener business is necessary
// todo: name === "" could alternatively create a document fragment instead of a span
const runtime = `
function $Listener([type, fn, opts]) {
  const obj = {type, fn, opts}
  return Object.assign(this, obj)
}
const $elx = (name) => (props) => {
  if (name === "") name = "span"
  const el = document.createElement(name)
  const {subs, listeners, ...rest} = props

  Object.assign(el, rest)

  if (Array.isArray(listeners)) for (const l of listeners) {
    el.addEventListener(l[0], l[1], l[2])
  }

  // todo: what about subs that are not strings or elements?
  //       likely prohibit/stringify/filter out
  for (const sub of subs) {
    if (typeof sub === 'string') el.append(sub)
    // filter out false, null, undefined
    // the way JSX/React seems to
    // todo: should more be filtered out like this?
    else if (sub === false || sub === null || sub === undefined) continue
    else if (sub instanceof $Listener) {
      el.addEventListener(sub.type, sub.fn, sub.opts)
    }
    else {
      el.append(sub)
    }
  }
  return el
}
const $wrx = (props) => {
  if (typeof props === "string") {
    return {subs: [props]}
  }
  else if (Array.isArray(props)) {
    return {subs: props}
  }
  else if (props === null) {
    return {subs: [props]}
  }
  // this is messed up:
  // todo: switch to the new system of plainprops
  //       -- it will be consistent between build/deco-time JS and script-JS
  else if (typeof props === 'object') {
    if (typeof props.tag !== 'string' && Array.isArray(props.subs)) return props
    return {subs: [props]}
  }
  else return {subs: [props]}
}
const $at = (name, ...subs) => ({tag: \`.\${name}\`, subs})
`

export const jdamltojs = (subs) => {
  const code = compile(subs)
  // note: this ({tag: \`\\${elementDelimiter}\${name}\`, subs}) business is quite tricky -- so watch out!
  const ret = `(()=>{
  const $el = (name, ...subs) => ({tag: \`\\${elementDelimiter}\${name}\`, subs})
  const $at = (name, ...subs) => ({tag: \`.\${name}\`, subs})
  const $wr = (ret) => {
    if (Array.isArray(ret)) return ret
    if (ret === null) throw Error('oops')
    if (typeof ret === 'object') return [ret]
    return [ret + '']
  }
  const subs = ${code}
  //subs.unshift({tag: '\\\\script', subs: [{tag: '.type', subs: ['module']}, ${JSON.stringify(runtime)}]})
  return subs
})()
  `

  console.log('beval', ret)
  console.log('evaled', eval?.(ret))
  return ret
}

// this produces code for build time
const compile = (subs) => {
  let code = '(() => {const ret = [];\n'
  for (const sub of subs) {
    if (typeof sub === 'string') {
      code += `ret.push(${JSON.stringify(sub)});\n`
      continue
    }
    const {tag, subs} = sub

    const name = tag.slice(1)

    if (tag.startsWith('.')) {
      code += `ret.push($at(${JSON.stringify(name)}, ...${compile(subs)}));\n`
      // note: could even make the metadata available in \script tags (prepend `const $meta = ...` to runtime)
      if (name === '$meta') {
        code += `const $meta = ${JSON.stringify(extractData(applyAttrs(resolveentities(subs))))};\n`
      }
    }
    else {
      if (name === '=') {
        code += `ret.push(...$wr(${elaboratejs(subs)}));\n`
      }
      else if (name === '-') {
        code += `${elaboratejs(subs)};\n`
      }
      else if (name === '@-') {
        // don't touch decorator-time code
        code += `ret.push($el(${JSON.stringify(name)}, ...${JSON.stringify(subs)}));\n`
      }
      else if (name === 'script') {
        // todo: support attribs, such as .type[module] -- also in syntax highlighting
        let i = 0
        for (; i < subs.length; ++i) {
          const sub = subs[i]
          if (typeof sub === 'string') {
            // for now, to allow indenting the attrs
            if (sub.trim() === '') continue
            else break
          }
          else {
            const {tag, subs} = sub
            if (tag.startsWith(".") === false) break
          }
        }
        const attrs = subs.slice(0, i)
        const rest = subs.slice(i)
        const compiledattrs = compile(attrs)
        code += `ret.push($el("script", ...${compiledattrs}, ${JSON.stringify(runtime + compileScript(rest))}));\n`
      }
      else {
        const compiled = compile(subs)
        if (isnamevalidhack(name)) code += `ret.push((typeof ${name} === 'function'? ${name}: (subs) => $el(${JSON.stringify(name)}, ...subs))(${compiled}));\n`
        else code += `ret.push($el(${JSON.stringify(name)}, ...${compiled}));\n`
      }
    }
  }
  return code + `return ret;})()`
}

// this produces code for runtime
const compileScript = (subs) => {
  let code = ``
  for (const sub of subs) {
    if (typeof sub === 'string') {
      code += sub
      continue
    }
    const {tag, subs} = sub

    const name = tag.slice(1)

    if (tag.startsWith('.')) {
      // just compile to JS .xyz[...]
      code += `.${name}[${compileScript(subs)}]`
    }
    else if (tag === '') {
      // compile to JS array [...]
      code += `[${compileScript(subs)}]`
    }
    else {
      // todo: more elaborate, error handling
      // todo: basically call jdamltodom here at runtime
      // const resolved = resolveentities(eval?.(jdamltojs(subs)), decodeHtmlEntity)
      // dumbconvert(resolved, createElement(${JSON.stringify(name)}))

      // todo: could support Znatchke as well -- OR NOT

      // todo: maybe also allow such "components" at build time
      if (isnamevalidhack(name)) code += `(typeof ${name} === 'function'? ${name}: $elx(${JSON.stringify(name)}))($wrx(${compileSubsForScript(subs)}))`
      else code += `$elx(${JSON.stringify(name)})($wrx(${compileSubsForScript(subs)}))`
    }
  }
  return code
}

const compileSubsForScript = (subs) => {
  let subsstr = ''
  let propsstr = ''
  const propnames = new Set()
  for (const sub of subs) {
    if (typeof sub === 'string') {
      subsstr += `${JSON.stringify(sub)},\n`
    }
    else {
      const {tag, subs} = sub
      const name = tag.slice(1)
      if (tag.startsWith(".")) {
        if (propnames.has(name)) throw Error('duplicate')
        propnames.add(name)
        propsstr += `[${JSON.stringify(name)}]: ${compilePropForScript(subs)},\n`
      }
      else if (name === '=') {
        // todo: perhaps there is a better way
        // todo: anyway we'll be switching to a new format
        subsstr += `...(() => {const val = ${compileScript(subs)}; if (Array.isArray(val)) return val; else return [val]; })(),\n`
        // subsstr += `${compileScript(subs)},\n`
      }
      else if (name.startsWith('-on')) {
        const compiled = compilePropForScript(subs)
        console.log('>>>csx', name)
        subsstr += `new $Listener([${JSON.stringify(name.slice(3))}, ${compiled}]),\n`
      }
      else if (name === 'subs') {
        throw Error('prohibited for now')
      }
      else {
        const compiled = compileSubsForScript(subs)
        // todo: most likely should just fail on invalid names, as HTML tag names are not more lenient than JS identifiers
        if (isnamevalidhack(name)) subsstr += `(typeof ${name} === 'function'? ${name}: $elx(${JSON.stringify(name)}))($wrx(${compiled})),\n`
        else subsstr += `$elx(${JSON.stringify(name)})($wrx(${compiled})),\n`
      }
    }
  }
  // ?todo: perhaps return {props: {${propsstr}}, subs: [${subsstr}]} and handle that
  //        this would allow subs to be a prop
  return `{${propsstr}subs: [${subsstr}]}`
}

// todo: unhack
// checks if name qualifies for typeof (is a valid JS id)
const isnamevalidhack = (name) => {
  try { eval?.(`const ${name} = 0`); return true } catch (e) { return false }
}

const compilePropForScript = (subs) => {
  let ret = ''
  let done = false
  let prevtext = []
  for (const sub of subs) {
    if (typeof sub === 'string') {
      prevtext.push(sub)
      // if (sub.trim() !== '') throw Error('for now we will prohibit sub.trim() !== ""')
      continue
    }
    else if (done) {
      throw Error('prohibited for now')
    }
    else {
      const {tag, subs} = sub
      const name = tag.slice(1)
      if (tag.startsWith(".")) {
        throw Error('for now we will prohibit tag.startsWith(".")')
      }
      else if (name === '=') {
        ret += compileScript(subs)
        done = true
      }
      else {
        throw Error('for now we will prohibit else')
      }
    }
  }
  if (prevtext.length > 0) {
    // noninterpolated prop as in .prop[something]
    ret += JSON.stringify(prevtext.join(''))
  }
  return ret
}

const elaboratejs = (subs) => {
  let ret = ''
  for (const sub of subs) {
    if (typeof sub === 'string') {
      ret += sub
      continue
    }
    const {tag, subs} = sub
    const name = tag.slice(1)
    if (tag === '') {
      ret += `[${elaboratejs(subs)}]`
    }
    else if (tag.startsWith('.')) {
      // todo: figure this out
      if (ret.at(-1) === '\\') ret = ret.slice(0, -1)
      // todo: compile to JS property access if ret.at(-1) or rather if ret ends with a valid JS token that can occur before a .
      ret += `$at(${JSON.stringify(name)}, ...${compile(subs)})`
      // for now 
      // throw Error('oops')
    }
    else {
      if (name === "'") {
        // ?todo: could support interpolation by using sth else than trytostr
        ret += JSON.stringify(trytostr(subs))
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
