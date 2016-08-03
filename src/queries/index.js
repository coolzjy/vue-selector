import CSP from 'css-selector-parser'
import queryDescendant from './queryDescendant.js'
import queryChildren from './queryChildren.js'
import queryNextSibling from './queryNextSibling.js'
import unique from 'array-unique'

var nestQuery = {
  '>': queryChildren,
  '+': queryNextSibling
}
var defaultQuery = queryDescendant

var csp = new CSP.CssSelectorParser()
csp.registerNestingOperators('>', '+');

/**
 * Converts hyphen/underscore/slash delimitered names into
 * camelized classNames.
 *
 * e.g. my-component => MyComponent
 *      some_else    => SomeElse
 *      some/comp    => SomeComp
 *
 * @param {String} str
 * @return {String}
 */
var classifyRE = /(?:^|[-_\/])(\w)/g
function classify (str) {
  return str.replace(classifyRE, toUpper)
}
function toUpper (_, c) {
  return c ? c.toUpperCase() : ''
}

/**
 * Handle css rule object
 *
 * @param {Object} rule
 * @param {Array} components - components selected by upstream rule
 * @return {Array}
 */
function handleRule (rule, components) {
  var tagName = classify(rule.tagName)
  var result = []

  var query = nestQuery[rule.nestingOperator] || defaultQuery

  components.forEach(function (component) {
    result = result.concat(query(component, tagName))
  })

  return result
}

/**
 * Handle css selector object
 *
 * @param {Object} selector
 * @param {Object} component - Vue Component
 * @return {Array}
 */
function handleSelector (selector, component) {
  var result = [component]
  var rule = selector
  while (rule = rule.rule) {
    result = handleRule(rule, result)
  }
  return result
}

export default function query (component, selector) {
  var parseResult = csp.parse(selector)
  var result = []

  if (parseResult.type === 'selectors') {
    parseResult.selectors.forEach(function (selector) {
      result = result.concat(handleSelector(selector, component))
    })
  } else {
    result = handleSelector(parseResult, component)
  }
  return unique(result)
}
