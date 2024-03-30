import { elementDelimiter } from "./jdaml.js"

// this handles the [=expr] shorthand syntax
export const transformequals = (subs_) => {
  const sub0 = subs_[0]
  let subs
  if (typeof sub0 === 'string') {
    if (sub0[0] === '=') {
      const nsubs = [sub0.slice(1), ...subs_.slice(1)]
      return [{tag: elementDelimiter + '=', subs: transformequals(nsubs)}]
    }
    else if (sub0.startsWith('\\=')) {
      // support [\...] to escape the =
      subs = [sub0.slice(1), ...subs_.slice(1)]
    }
    else {
      subs = subs_
    }
  }
  else {
    subs = subs_
  }

  const nsubs = []
  for (const sub of subs) {
    if (typeof sub === 'string') {
      nsubs.push(sub)
    }
    else {
      const {tag, subs} = sub

      const transformed = transformequals(subs, tag)

      if ((tag === elementDelimiter || tag === '') && isdesugared(transformed)) {
        // [=expr] with no tag means splat the result of the expr into subs
        nsubs.push(...transformed)
      }
      else {
        nsubs.push({tag, subs: transformed})
      }
    }
  }

  return nsubs
}

const isdesugared = (subs) => {
  if (subs.length !== 1) return false
  const sub = subs[0]
  if (typeof sub === 'string') return false
  return sub.tag === elementDelimiter + '='
}