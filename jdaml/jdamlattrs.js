import { elementDelimiter } from "./jdaml.js"

export const transferattrs = (subs) => {
  const nsubs = []
  let prevattrs = []
  const transfer = () => {
    if (prevattrs.length > 0) {
      // todo: perhaps filter out the empty text nodes?


      if (nsubs.length === 0) {
        nsubs.push(...prevattrs)
      }
      else if (nsubs.length === 1 && typeof nsubs.at(-1) === 'string') {
        // note: special treatment for the first text node to accommodate for znatchke
        // todo: figure out a better design
        //       perhaps a stage after znatchke that transfers attrs to the first text node (if any)
        nsubs.push(...prevattrs)
      }
      else {
        const maybetext = []
        if (typeof prevattrs.at(-1) === 'string') {
          maybetext.push(prevattrs.pop())
        }
        
        const last = nsubs.at(-1)
        if (typeof last === 'string') {
          // if it's a text node, we wrap it in an anon node
          const str = nsubs.pop()
          nsubs.push({tag: elementDelimiter, subs: [str, ...prevattrs]}, ...maybetext)
        }
        else {
          // assuming it's an element
          // ?todo: last.subs.push(elementDelimiter, ...prevattrs)
          last.subs.push(...prevattrs)
          nsubs.push(...maybetext)
        }
      }
      prevattrs = []
    }
  }
  for (const sub of subs) {
    if (typeof sub === 'string') {
      if (sub.trim() === '' || sub.trim() === elementDelimiter) {
        prevattrs.push(sub)
      }
      else {
        transfer()
        nsubs.push(sub)
      }
    }
    else {
      const {tag, subs} = sub
      if (tag.startsWith(".")) {
        const rsubs = transferattrs(subs)
        prevattrs.push({tag, subs: rsubs})
      }
      else {
        transfer()
        const rsubs = transferattrs(subs)
        nsubs.push({tag, subs: rsubs})
      }
    }
  }
  transfer()
  return nsubs
}