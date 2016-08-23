/* test presets start */
var ComD = Vue.extend({
  name: 'ComD',
  template: '<div></div>'
})

var ComC = Vue.extend({
  name: 'ComC',
  template: '<com-d></com-d>',
  components: { ComD: ComD }
})

var ComB = Vue.extend({
  name: 'ComB',
  template: '<com-c></com-c>',
  components: { ComC: ComC }
})

var ComA = Vue.extend({
  name: 'ComA',
  template: '<com-b></com-b><com-c></com-c><com-b></com-b><com-d></com-d>',
  components: { ComB: ComB, ComC: ComC, ComD: ComD }
})

var root = new Vue({
  el: '#app',
  components: { ComA: ComA, ComB: ComB }
})
/* test presets end */

var assert = chai.assert

suite('Descendant selector test', function () {
  test('should return empty array when name is unknown', function () {
    var result = root.$querySelectorAll('com-e')
    assert.isArray(result)
    assert.strictEqual(result.length, 0)
  })

  test('should return 3 ComB when using "com-b"', function () {
    var result = root.$querySelectorAll('com-b')
    assert.isArray(result)
    assert.strictEqual(result.length, 3)
    result.forEach(function (component) {
      assert.strictEqual(component.constructor.name, 'ComB')
    })
  })

  test('should return 5 ComD when using "com-d"', function () {
    var result = root.$querySelectorAll('com-d')
    assert.isArray(result)
    assert.strictEqual(result.length, 5)
    result.forEach(function (component) {
      assert.strictEqual(component.constructor.name, 'ComD')
    })
  })

  test('should return 4 ComD when using "com-a com-d"', function () {
    var result = root.$querySelectorAll('com-a com-d')
    assert.isArray(result)
    assert.strictEqual(result.length, 4)
    result.forEach(function (component) {
      assert.strictEqual(component.constructor.name, 'ComD')
    })
  })
})

suite('Children selector test', function () {
  test('should return empty array when using "com-b > com-d"', function () {
    var result = root.$querySelectorAll('com-b > com-d')
    assert.isArray(result)
    assert.strictEqual(result.length, 0)
  })

  test('should return 1 ComD when using "com-a > com-d"', function () {
    var result = root.$querySelectorAll('com-a > com-d')
    assert.isArray(result)
    assert.strictEqual(result.length, 1)
    assert.strictEqual(result[0].constructor.name, 'ComD')
    assert.strictEqual(result[0].$parent.constructor.name, 'ComA')
  })

  test('should return 4 ComD when using "com-c > com-d"', function () {
    var result = root.$querySelectorAll('com-c > com-d')
    assert.isArray(result)
    assert.strictEqual(result.length, 4)
    result.forEach(function (component) {
      assert.strictEqual(component.constructor.name, 'ComD')
      assert.strictEqual(component.$parent.constructor.name, 'ComC')
    })
  })
})

suite('Next sibling selector test', function () {
  test('should return empty array when using "com-b + com-a"', function () {
    var result = root.$querySelectorAll('com-b + com-a')
    assert.isArray(result)
    assert.strictEqual(result.length, 0)
  })

  test('should return 1 ComC when using "com-b + com-c"', function () {
    var result = root.$querySelectorAll('com-b + com-c')
    assert.isArray(result)
    assert.strictEqual(result.length, 1)
    assert.strictEqual(result[0].constructor.name, 'ComC')
  })
})

suite('Invalid selector test', function () {
  test('should throw exception when using "+ com-a"', function () {
    assert.throws(function () {
      root.$querySelectorAll('+ com-a')
    })
  })

  test('should throw exception when using "> com-a"', function () {
    assert.throws(function () {
      root.$querySelectorAll('> com-a')
    })
  })

  test('should throw exception when using "com-a +"', function () {
    assert.throws(function () {
      root.$querySelectorAll('com-a +')
    })
  })

  test('should throw exception when using "com-a >"', function () {
    assert.throws(function () {
      root.$querySelectorAll('com-a >')
    })
  })

  test('should throw exception when using "com-a >> com-b"', function () {
    assert.throws(function () {
      root.$querySelectorAll('com-a >> com-b')
    })
  })
})
