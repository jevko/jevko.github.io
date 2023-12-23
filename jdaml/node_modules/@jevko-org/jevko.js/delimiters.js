export const defaultOpener = '['
export const defaultCloser = ']'
export const defaultEscaper = '`'
export const defaultFencer = "'"
// todo: perhaps change to / or sth
export const defaultTagger = "/"

export const defaultDelimiters = {
  opener: defaultOpener,
  closer: defaultCloser,
  escaper: defaultEscaper,
  fencer: defaultFencer,
  tagger: defaultTagger,
}

// todo: require each delimiter to be exactly one code unit
export const normalizeDelimiters = (delims) => {
  const {
    opener = defaultOpener, 
    closer = defaultCloser, 
    escaper = defaultEscaper, 
    fencer = defaultFencer,
    tagger = defaultTagger,
  } = delims ?? {}
  const delimiters = [opener, closer, escaper, fencer, tagger]
  const delimiterSetSize = new Set(delimiters).size
  if (delimiterSetSize !== delimiters.length) {
    throw Error(`Delimiters must be unique! ${delimiters.length - delimiterSetSize} of them are identical:\n${delimiters.join('\n')}`)
  }

  return {
    opener,
    closer,
    escaper,
    fencer,
    tagger,
    _normalized: true,
  }
}