const {
  replaceWpyAttrKV,
  replaceWpyTag
} = require('../')

const testAttrsData = [
  {
    input: {
      name: '@touchmove.stop',
      value: 'getUserInfo({{item.id}})'
    },
    output: {
      name: 'catchtouchmove',
      value: 'getUserInfo',
      payload: '{{item.id}}'
    }
  },
  {
    input: {
      name: '@touchmove.user',
      value: 'getUserInfo'
    },
    output: {
      name: 'bindtouchmove',
      value: 'getUserInfo'
    }
  },
  {
    input: {
      name: '@touchmove',
      value: 'getUserInfo'
    },
    output: {
      name: 'bindtouchmove',
      value: 'getUserInfo'
    }
  },
  {
    input: {
      name: 'bindtouchmove',
      value: 'getUserInfo'
    },
    output: {
      name: 'bindtouchmove',
      value: 'getUserInfo'
    }
  },
  {
    input: {
      name: ':user',
      value: 'currentUser'
    },
    output: {
      name: 'user',
      value: '{{currentUser}}'
    }
  },
  {
    input: {
      name: ':user.sync',
      value: 'currentUser'
    },
    output: {
      name: 'user',
      value: '{{currentUser}}'
    }
  },
  {
    input: {
      name: 'user',
      value: 'currentUser'
    },
    output: {
      name: 'user',
      value: 'currentUser'
    }
  },
  {
    input: {
      name: 'user',
      value: '{{currentUser}}'
    },
    output: {
      name: 'user',
      value: '{{currentUser}}'
    }
  }
]

const testTagsData = [
  {
    input: 'repeat',
    output: 'block'
  }
]


testTagsData.forEach(({ input, output}) => {
  test(`test template.replaceTags.mapping: ${input}`, () => {
    expect(replaceWpyTag(input)).toBe(output)
  })
})

testAttrsData.forEach(({ input, output}) => {
  test(`test template.replaceAttrs.mapping: ${input.name} | ${input.value}`, () => {
    expect(replaceWpyAttrKV(input)).toEqual(output)
  })
})
