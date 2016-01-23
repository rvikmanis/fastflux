import {Observable} from '../src'

describe("Observable", () => {
  describe("#constructor", () => {

    describe("Called without arguments", () => {
      let x = new Observable

      it('creates a stateless source observable', () => {
        expect(x.isStateful()).toBe(false)
        // `x` not having a source means that `x` itself is a source
        expect(x.hasSource()).toBe(false)
        expect(x instanceof Observable).toBe(true)
      })

    })

  })
})
