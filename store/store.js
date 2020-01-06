import User from './user'

const store = {
  dataProvider: null,
  activity: null,
  user: new User(),
  repository: {
    id: 1,
    name: 'Open Research Online',
  },
  plugins: null,
}

export default store
