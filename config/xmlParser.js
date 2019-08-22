const he = require('he')
const parser = require('fast-xml-parser')

const options = {
  attributeNamePrefix : "@_",
  attrNodeName: "attr", //default is 'false'
  textNodeName : "#text",
  ignoreAttributes : true,
  ignoreNameSpace : false,
  allowBooleanAttributes : false,
  parseNodeValue : true,
  parseAttributeValue : false,
  trimValues: true,
  cdataTagName: "__cdata", //default is 'false'
  cdataPositionChar: "\\c",
  localeRange: "", //To support non english character in tag/attribute values.
  parseTrueNumberOnly: false,
  attrValueProcessor: a => he.decode(a, {isAttributeValue: true}),//default is a=>a
  tagValueProcessor : a => he.decode(a) //default is a=>a
}

const xmlToJson = (xml) => {
  if (parser.validate(xml) === true) {
    return parser.parse(xml, options);
  }

  throw new Error('Unable to parse XML, structure is invalid')
}

module.exports = { xmlToJson }