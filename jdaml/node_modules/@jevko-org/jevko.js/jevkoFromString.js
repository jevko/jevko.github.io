import { decodeString, textToString } from "./decode.js"

// todo: return this from makeDecoders
// could also impl a backward-compatible version that generates decoders on each call (yuck!)
export const jevkoFromString = (str) => {
  let current = {subjevkos: [], suffix: ''}
  const parents = [current]
  const parent = decodeString(str, {
    prefix: (text) => {
      const {fencelength} = text
      const jevko = {subjevkos: [], suffix: ''}
      current.subjevkos.push({
        prefix: textToString(text), 
        jevko,
        ...(fencelength === undefined? {}: {fencelength})
      })
      parents.push(current)
      current = jevko
    },
    suffix: (text) => {
      const {fencelength} = text
      current.suffix = textToString(text)
      if (fencelength !== undefined) {
        current.fencelength = fencelength
      }
      current = parents.pop()
    },
    end: () => {
      return current
    }
  })
  // parent.opener = opener
  // parent.closer = closer
  // parent.escaper = escaper
  // parent.fencer = fencer
  return parent
}