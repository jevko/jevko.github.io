export const defaultOpener = '['
export const defaultCloser = ']'
export const defaultEscaper = '`'
export const defaultQuoter = "'"

export const defaultDelimiters = {
  opener: defaultOpener,
  closer: defaultCloser,
  escaper: defaultEscaper,
  quoter: defaultQuoter,
}

export const normalizeDelimiters = (delims) => {
  const {
    opener = defaultOpener, 
    closer = defaultCloser, 
    escaper = defaultEscaper, 
    quoter = defaultQuoter,
  } = delims ?? {}
  const delimiters = [opener, closer, escaper, quoter]
  const delimiterSetSize = new Set(delimiters).size
  if (delimiterSetSize !== delimiters.length) {
    throw Error(`Delimiters must be unique! ${delimiters.length - delimiterSetSize} of them are identical:\n${delimiters.join('\n')}`)
  }

  return {
    opener,
    closer,
    escaper,
    quoter,
  }
}