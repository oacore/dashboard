import membershipData from './membership.yml'

export default {
  ...membershipData,
  plans: {
    ...membershipData.plans,
    cards: Object.values(membershipData.plans.cards),
  },
}
