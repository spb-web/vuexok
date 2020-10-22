/**
 * Mocking client-server processing
 */
export type ProductData = {
  id: number,
  title: string,
  price: number,
  inventory: number,
}

const _products:ProductData[] = [
  {"id": 1, "title": "iPad 4 Mini", "price": 500.01, "inventory": 2},
  {"id": 2, "title": "H&M T-Shirt White", "price": 10.99, "inventory": 10},
  {"id": 3, "title": "Charli XCX - Sucker CD", "price": 19.99, "inventory": 5}
]

export default {
  getProducts (cb:(p:any) => void) {
    setTimeout(() => cb(_products), 500)
  },

  buyProducts (products:ProductData[], cb:() => void, errorCb:() => void) {
    setTimeout(() => {
      // simulate random checkout failure.
      (Math.random() > 0.5 || navigator.webdriver)
        ? cb()
        : errorCb()
    }, 100)
  }
}
