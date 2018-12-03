import * as _ from '@/util'

describe('util', () => {
  it('#cloneDeep()', () => {
    const source = {
      nested: {
        prop: 'original value'
      },
      prop: 2,
      boolean: true,
      date: new Date('2018-12-03')
    }
    const clone = _.cloneDeep(source)
    source.nested.prop = 'modified'
    source.nested.anotherprop = 'new prop'
    source.anotherprop = 'new prop'
    source.prop = 3
    source.boolean = false
    source.null = null
    source.date = new Date('2018-12-04')

    expect(clone.nested).not.toBe(source.nested)
    expect(clone.nested.prop).toEqual('original value')
    expect(clone.nested.anotherprop).toBeUndefined()
    expect(clone.anotherprop).toBeUndefined()
    expect(clone.prop).toEqual(2)
    expect(clone.boolean).toEqual(true)
    expect(clone.null).toBeUndefined()
    expect(clone.date).toEqual(new Date('2018-12-03'))
  })

  it('#cloneDeep() array', () => {
    const source = [
      {
        id: 1,
        name: 'first'
      },
      {
        id: 2,
        name: 'second'
      }
    ]
    const clone = _.cloneDeep(source)
    source[0].name = 'modified'
    source[1].name = 'also modified'
    expect(clone[0].name).toEqual('first')
    expect(clone[1].name).toEqual('second')
  })
})
