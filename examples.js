export const schemaPatches = {
  'John Smith': {
    // props: {
      children: {
        type: 'array',
        itemSchema: {type: 'empty'}
      },
      spouse: {
        type: 'null'
      }
    // }
  }
}

export const examples = {

'': '',

// document: 
// `document [
//   title [The Jevko Syntax: Standard Grammar]
//   section [
//     title [Copyright Notice]
//     paragraph [Copyright © 2022 Darius J Chuck. All rights reserved.]
//   ]
//   section [
//     title [Introduction and scope]
//     paragraph [Jevko is a versatile minimal syntax for encoding tree-structured information.]
//     paragraph [It can be used to define simple and portable formats and languages in a variety of domains, such as data interchange, configuration, or text markup.]
//   ]
// ]`,

'The Dog':
`Name [Dog]
Temporal range [At least 14,200 years ago – present]
Conservation status [Domesticated]
Scientific classification [
  Kingdom [Animalia]
  Phylum [Chordata]
  Class [Mammalia]
  Order [Carnivora]
  Family [Canidae]
  Genus [Canis]
  Species [C. familiaris]
]
Binomial name [
  [Canis familiaris]
  [Linnaeus, 1758]
]
Synonyms [
  [C. aegyptius Linnaeus, 1758]
  [C. alco C. E. H. Smith, 1839]
  [C. americanus Gmelin, 1792]
  [C. anglicus Gmelin, 1792]
  [C. antarcticus Gmelin, 1792]
]`,

// identifier:
// `id[
//   worker[32]
//   provider[
//     group[5]
//     SomeProvider
//   ]
//   123
// ]`,

'John Smith':
`first name [John]
last name [Smith]
is alive [true]
age [27]
address [
  street address [21 2nd Street]
  city [New York]
  state [NY]
  postal code [10021-3100]
]
phone numbers [
  [
    type [home]
    number [212 555-1234]
  ]
  [
    type [office]
    number [646 555-4567]
  ]
]
children []
spouse []`,

rivers:
`Rivers [
  [
    Name [Robinson River]
    Location [
      Country [Australia]
    ]
    Physical characteristics [
      Source [
        elevation [152 metres (499 ft)]
      ]
      Mouth [
        location [Stokes Bay]
        elevation [sea level]
      ]
      Length [107 kilometres (66 mi)]
      Basin size [3,329 square kilometres (1,285 sq mi)]
    ]
  ]
  [
    Name [Wooramel]
    Location [
      Country [Australia]
      State [Western Australia]
      Region [Gascoyne]
    ]
    Physical characteristics [
      Source [
        Name [McLeod Pyramid]
        coordinates [25°47′12″S 116°40′23″E]
        elevation [357 m (1,171 ft)]
      ]
      Mouth	[
        Name [Shark Bay]
        location [near Herald Loop]
        coordinates [25°52′59″S 114°13′57″E]
        elevation [0 m (0 ft)]
      ]
      Length [363 km (226 mi)]
      Basin size [40,500 km2 (15,600 sq mi)]
      Discharge [
        location [mouth]
      ]
    ]
  ]
]`,

tree:
`Prefix 1 [Suffix 1] 
Prefix 2 [
  Prefix 2.1 [Suffix 2.1] 
  Prefix 2.2 [Suffix 2.2]
]
Prefix 3 [Suffix 3]`,

vscode:
`editor.quickSuggestions [
  other [true]
  comments [false]
  strings [false]
]
terminal.integrated.wordSeparators [ ()\`[\`]{}',"\`\`─‘’]
terminal.integrated.scrollback [1000]
remote.extensionKind [
  pub.name [[ui]]
]
git.checkoutType [[local] [remote] [tags]]
git.defaultCloneDirectory [null]`,

'Sumerian':
`Name [Sumerian]
Native name [[𒅴𒂠][Emegir]]
Native to [[Sumer][Akkadian Empire]]
Region [Mesopotamia (modern-day Iraq)]
Era [Attested from c. 3000 BC. Effectively extinct from about 2000–1800 BC; used as classical language until about 100 AD.]
Language family [Language isolate]
Writing system [Sumero-Akkadian cuneiform]
language codes [
  ISO 639-2 [sux]
  ISO 639-3 [sux]
  Glottolog [sume1241]
]`,

'Ray Jackson':
`Name [Ray Jackson]
Number [[3][33]]
Position [Running back]
Personal information [
  Born [
    [August 1, 1978 (age 43)]
    [Indianapolis, Indiana]
  ]
  Height [6 ft 1 in (1.85 m)]
  Weight [223 lb (101 kg)]
]
Career information [
  High school [Indianapolis (IN) Lawrence Central]
  College [Cincinnati]
  Undrafted [2002]
]
Career history [
  [Cincinnati Bengals (2003)*]
  [Tennessee Titans (2003–2004)]
  [Berlin Thunder (2004)]
  [Cincinnati Marshals (2006)]
  [Cincinnati Commandos (2010)]
]
Career NFL statistics [
  Kick returns [3]
  Yards [77]
]`,

'Moko the Dolphin':
`Name [Moko]
Species [Bottlenose dolphin]
Born [2006]
Died [July 2010 (aged 4)]
Resting place [
  [Matakana Island, NZ]
  [Bay of Plenty, NZ]
]
Years active [2007–2010]
Known for [Rescue of pygmy sperm whales]`,

'The Horse':
`Name [Horse]

Conservation status [Domesticated]
Scientific classification [
  Kingdom [Animalia]
  Phylum [Chordata]
  Class [Mammalia]
  Order [Perissodactyla]
  Family [Equidae]
  Genus [Equus]
  Species [E. ferus]
  Subspecies [E. f. caballus]
]
Trinomial name [
  [Equus ferus caballus]
  [Linnaeus, 1758]
] 
Synonyms [at least 48 published]`,

// xml:
// `phyloxml[xmlns:xsi=[http://www.w3.org/2001/XMLSchema-instance] xmlns=[http://www.phyloxml.org] xsi:schemaLocation=[http://www.phyloxml.org http://www.phyloxml.org/1.10/phyloxml.xsd]
//   phylogeny[rooted=[true]
//     name[Alcohol dehydrogenases]
//     description[contains examples of commonly used elements]
//     clade[
//       events[
//         speciations[1]
//       ]
//       clade[
//         taxonomy[
//           id[provider=[ncbi]6645]
//           scientific_name[Octopus vulgaris]
//         ]
//         sequence[
//           accession[source=[UniProtKB]P81431]
//           name[Alcohol dehydrogenase class-3]
//         ]
//       ]
//       clade[
//         confidence[type=[bootstrap]100]
//         events[
//           speciations[1]
//         ]
//         clade[
//           taxonomy[
//             id[provider=[ncbi]1423]
//             scientific_name[Bacillus subtilis]
//           ]
//           sequence[
//             accession[source=[UniProtKB]P71017]
//             name[Alcohol dehydrogenase]
//           ]
//         ]
//         clade[
//           taxonomy[
//             id[provider=[ncbi]562]
//             scientific_name[Escherichia coli]
//           ]
//           sequence[
//             accession[source=[UniProtKB]Q46856]
//             name[Alcohol dehydrogenase]
//           ]
//         ]
//       ]
//     ]
//   ]
// ]`
}