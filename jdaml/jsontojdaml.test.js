import { jsonstrToJdaml } from "./jsontojdaml.js"


const jsonstr = `{
  "first name": "[John]",
  "[last name]": "\`Smith\`",
  "]]is alive[[": true,
  "age": 27,
  "address": {
    "street.address": "21 2nd Street",
    "city": "New York",
    "state": "NY",
    "postal'code": "10021-3100"
  },
  "phone-numbers": [
    {
      "type": "home",
      "number": "212 555-1234"
    },
    {
      "type": "office",
      "number": "646 555-4567"
    }
  ],
  "children": [],
  "spouse": null
}`
const jsonstr2 = `{
  "server_config": {
    "port_mapping": [
      "22:22",
      "80:80",
      "443:443"
    ],
    "serve": [
      "/robots.txt",
      "/favicon.ico",
      "*.html",
      "*.png",
      "!.git"
    ],
    "geoblock_regions": [
      "dk",
      "fi",
      "is",
      "no",
      "se"
    ],
    "flush_cache": {
      "on": [
        "push",
        "memory_pressure"
      ],
      "priority": "background"
    },
    "allow_postgres_versions": [
      "9.5.25",
      "9.6.24",
      "10.23",
      "12.13"
    ]
  }
}`
const c = jsonstrToJdaml(jsonstr2)
console.log(c)