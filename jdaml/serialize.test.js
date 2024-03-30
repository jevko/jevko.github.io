import { parseNodes, seedFromString } from './jdaml.js'
import {serializeJdaml} from './serializejdaml.js'

const str = `.:format[json]

';[
  todo: explain what this is
]

last modified 1 April 2001 by John Doe
.owner[
  .name[John Doe]
  .organization[Acme Widgets Inc.]
]
.database[
  use IP if name resolution is not working
  .server[192.0.2.62]
  .port['u64[143]]
  .file[payroll.dat]
  .select_columns[
    [name]
    [address]
    [phone number]
  ]
]`

console.log(serializeJdaml(parseNodes(seedFromString(str))))