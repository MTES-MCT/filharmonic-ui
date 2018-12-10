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
  it('#normalize()', () => {
    expect(_.normalize('hello')).toBe('hello')
    expect(_.normalize('élo')).toBe('elo')
    expect(_.normalize('')).toBe('')
    expect(_.normalize(null)).toBe('')
    expect(_.normalize(undefined)).toBe('')
  })
  it('#debounce()', async () => {
    const recorder = []
    const func = _.debounce((a, b) => recorder.push([a, b]), 50)
    func(1, 2)
    func(3, 4)
    func(5, 6)
    await _.sleep(100)
    func(7, 8)
    func(9, 10)
    await _.sleep(100)
    expect(recorder).toEqual([
      [5, 6],
      [9, 10]
    ])
  })
})
