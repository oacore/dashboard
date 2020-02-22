import LinkedListNode from './linkedListNode'

export default class LinkedList {
  constructor() {
    this.head = null
  }

  add(data) {
    const node = new LinkedListNode(data)

    // no data loaded yet
    if (this.head === null) this.head = node
    else {
      // find the last node and insert data there
      let current = this.head
      while (current.next !== null) current = current.next
      current.next = node
    }
  }

  get(index) {
    let current = this.head
    let i = 0

    while (current !== null && i < index) {
      current = current.next
      i += 1
    }

    // return the data if `current` isn't null
    return current !== null ? current.data : undefined
  }

  get length() {
    let current = this.head
    let length = 0
    while (current !== null) {
      length += current.data.data.length
      current = current.next
    }
    return length
  }

  get data() {
    let current = this.head
    const data = []
    while (current !== null) {
      data.push(...current.data.data)
      current = current.next
    }
    return data
  }
}
