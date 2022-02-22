# Compactness comparison

We will try to roughly compare Interjevko to other data interchange formats in terms of compactness.

## TL;DR: 

According to the below simple comparison:

* Interjevko is the most compact of the compared schemaful human-readable data-interchange formats (XML vs EDN vs Interjevko).

* Schemaless Interjevko is the most compact of the compared schemaless human-readable data-interchange formats (JSON vs S-expressions vs Schemaless Interjevko).

## The comparsion

We'll start with the following compact pretty-printed XML based on [a JSON sample from Wikipedia](https://en.wikipedia.org/wiki/JSON#Syntax):

```xml
<person
  first-name="John"
  last-name="Smith"
  is-alive="true"
  age="27"
>
  <address
    street-address="21 2nd Street"
    city="New York"
    state="NY"
    postal-code="10021-3100"
  />
  <phone-numbers>
    <phone-number
      type="home"
      number="212 555-1234"
    />
    <phone-number
      type="office"
      number="646 555-4567"
    />
  </phone-numbers>
  <children />
  <spouse />
</person>
```

That's 412 characters.

It can be compacted to this:

```xml
<o first-name="John" last-name="Smith" is-alive="true" age="27"><address street-address="21 2nd Street" city="New York" state="NY" postal-code="10021-3100"/><phone-numbers><o type="home" number="212 555-1234"/><o type="office" number="646 555-4567"/></phone-numbers><children/><spouse/></o>
```

That's 290 characters.

Comparable JSON:

```json
{"first name":"John","last name":"Smith","is alive":true,"age":27,"address":{"street address":"21 2nd Street","city":"New York","state":"NY","postal code":"10021-3100"},"phone numbers":[{"type":"home","number":"212 555-1234"},{"type":"office","number":"646 555-4567"}],"children":[],"spouse":null}
```

That's 297 characters. It's larger than the XML! The comparison is not exactly fair though, as JSON is schemaless and processing it is easier because of its simplicity (particularly there is no attribute-element dichotomy). In practice XML is usually less compact than JSON in the wild. But this comparison is trying to focus on maximum compactness, disregarding other features.

An even more compact representation than both of the above is Clojuresque S-expressions (aka [EDN](https://github.com/edn-format/edn)):

```clj
{:first-name "John":last-name"Smith":is-alive true :age 27 :address{:street-address "21 2nd Street":city"New York":state"NY":postal-code"10021-3100"}:phone-numbers[{:type "office":number"212 555-1234"}{:type "home":number"646 555-4567"}]:children[]:spouse nil}
```

That's 260 characters. We can reduce that further by mostly dropping schemalessness and Clojure conventions in favor of more basic S-expressions:

```clj
(first-name "John"last-name"Smith"is-alive true age 27 address(street-address "21 2nd Street"city"New York"state"NY"postal-code"10021-3100")phone-numbers((type "office"number"212 555-1234")(type "home"number"646 555-4567"))children()spouse())
```

242 characters. It's a custom S-expression-based format that couldn't be unabiguously converted to the JSON without a schema. Could we get more compact?

Let's try Interjevko:

```
first name[John]last name[Smith]is alive[true]age[27]address[street address[21 2nd Street]city[New York]state[NY]postal code[10021-3100]]phone numbers[[type[home]number[212 555-1234]][type[office]number[646 555-4567]]]children[]spouse[]
```

236 characters. This needs a schema though.

How about a schemaless version?

```
:first name['John]last name['Smith]is alive[true]age[27]address[:street address['21 2nd Street]city['New York]state['NY]postal code['10021-3100]]phone numbers[*[:type['home]number['212 555-1234]][:type['office]number['646 555-4567]]]children[*]spouse[]
```

252 characters. 

## In summary

```
Schemaless:

XML: n/a
JSON: 297 (100 %)
EDN: 260 (87.5 %)
Jevko: 252 (84.8 %)

Schemaful:

XML: 290 (100 %)
JSON: n/a
S-exp: 242 (83.4 %)
Jevko: 236 (81.4 %)
```
