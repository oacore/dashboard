import { useEffect } from 'react'
import { autorun, observable } from 'mobx'
import { useObserver } from 'mobx-react-lite'

import { requestPremium as letter } from 'texts/letters'

const globalContext = observable({
  user: {},
  organisation: {},
})

const userInput = observable({
  update(patch) {
    Object.assign(this, patch)
  },
})

const emailContext = observable({
  toEmail: 'enterp\u0072is\u0065\u0040cor\u0065\u002e\u0061\u0063\u002euk',

  // These 4 are mirrored from the global store
  // with and React's effect and MobX's autorun in useSync()
  organisationId: '',
  organisationName: '',

  get fromName() {
    return userInput.name ?? globalContext.user?.name
  },

  get fromEmail() {
    return userInput.email ?? globalContext.user?.email
  },

  get context() {
    return {
      userName: this.fromName,
      userEmail: this.fromEmail,
      organisationName: globalContext.organisation.name,
      organisationId: globalContext.organisation.id,
    }
  },

  get subject() {
    return userInput.subject ?? letter.subject.render(this.context)
  },

  get body() {
    return userInput.body ?? letter.body.render(this.context)
  },

  get mailtoUrl() {
    const email = this.toEmail
    const subject = encodeURIComponent(this.subject)
    const body = encodeURIComponent(this.body)

    return `m\u0061il\u0074\u006f\u003a${email}?subject=${subject}&body=${body}`
  },

  update(...args) {
    userInput.update(...args)
  },
})

const useSync = (store) => {
  useEffect(
    () =>
      autorun(() => {
        // Observing on root `user` and `organisation`` objects is intentional.
        // It should prevent potential data overriding.
        //
        // However, it does not cover the case when the user changes the name
        // and then makes the request. Although, if the user edited the form
        // and then changed own name, it would not be confusing because
        // it should be expected.
        globalContext.user = store.user
        globalContext.organisation = store.organisation
      }),
    [store]
  )

  useEffect(() =>
    autorun(() => {
      emailContext.actionUrl = store.contactUrl
      emailContext.send = store.sendContactRequest.bind(store)
    })
  )
}

const useFormAction = () =>
  useObserver(() => [emailContext.actionUrl, emailContext.send])

const useFormContext = () =>
  useObserver(() => ({
    subject: emailContext.subject,
    body: emailContext.body,
    fromName: emailContext.fromName,
    fromEmail: emailContext.fromEmail,
    product: 'DASHBOARD',
  }))

const useNoteContext = () =>
  useObserver(() => ({
    email: emailContext.toEmail,
    mailtoUrl: emailContext.mailtoUrl,
  }))

export default emailContext
export { useFormAction, useFormContext, useNoteContext, useSync }
