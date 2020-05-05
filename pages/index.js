import { useRedirect } from './_app/hooks'

// Unfortunately, our real homepage is missing
const Home = () => {
  useRedirect('data-providers')
  return null
}

export default Home
