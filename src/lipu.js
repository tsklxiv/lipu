/* lipu.js - The main application */

import m from 'mithril'
import { fromUnixTime, format, formatDistance } from 'date-fns/fp'
import { r, aboutText, hostname, links } from './consts'
import NavBar from './navbar'

const get = (url) => m.request({ method: 'GET', url: url })
let START_FETCH_LIMIT = 0; const FETCH_LIMIT = 30

function About () {
  return {
    view: () => m('main', [
      NavBar(),
      m('hr'),
      m('div', { class: 'about' }, m.trust(aboutText))
    ])
  }
}

function Main (link) {
  const ids = []
  const fetchThings = () => {
    fetchIDs()
    fetchSubmissions()
  }
  let submissions = []
  let page = 1

  function inlineSeperator () {
    return m('span', ' | ')
  }

  /*
   * I would be really happy if I could go to the next page and
   * the previous page with a single function. But for some reason, it
   * just doesn't work. For now, this is what works for me.
  */
  function nextPage () {
    submissions = []
    page++
    START_FETCH_LIMIT += FETCH_LIMIT
    fetchThings()
  }

  function prevPage () {
    submissions = []
    page--
    START_FETCH_LIMIT -= FETCH_LIMIT
    fetchThings()
  }

  // Copilot saves my day :D
  function fetchIDs () { // Avoid conflict with fetch()
    get(link).then(data => data.slice(START_FETCH_LIMIT, START_FETCH_LIMIT + FETCH_LIMIT).forEach(id => ids.push(id)))
  }
  fetchIDs()

  function fetchSubmission (id) {
    get(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)
      .then(data => {
        data.id = id
        submissions.push(data)
      })
  }

  // Finally, a working (and cool) solution!!!
  function fetchSubmissions () {
    while (ids.length !== 0) {
      fetchSubmission(ids[0])
      ids.shift()
    }
    // console.log(submissions)
  }

  function renderSubmission (submission) {
    const userURL = `https://news.ycombinator.com/user?id=${submission.by}`
    const commentsURL = `https://news.ycombinator.com/item?id=${submission.id}`
    const submissionTime = fromUnixTime(submission.time)
    const formattedTime = format('p', submissionTime)
    const timeDistance = formatDistance(submissionTime, new Date(), { suffix: true })

    return m('div', { class: 'submission' }, [
      m('a', { href: (!(submission.url) ? commentsURL : submission.url), target: '_blank', class: 's-link' },
        m('span', { style: 'font-size: 1.25em' }, submission.title),
        m('span', { style: 'font-size: 0.8em' }, submission.url ? ` (${hostname(submission.url)})` : '')
      ),
      m('br'),
      m('span', { class: 's-info' }, [
        m('span', `${submission.score} points by `),
        m('a', { href: userURL, class: 's-link', target: '_blank' }, submission.by),
        inlineSeperator(),
        m('a', { href: commentsURL, class: 's-link', target: '_blank' }, !(submission.type === 'job') ? `${submission.descendants} comments` : 'link'),
        inlineSeperator(),
        m('span', `At ${formattedTime} (${timeDistance})`)
      ])
    ])
  }

  function renderSubmissions () {
    return m('div', { class: 'submissions' }, submissions.map(renderSubmission))
  }

  return {
    view: () => {
      fetchSubmissions()
      return m('main', [
        NavBar(),
        m('hr'),
        m('strong', `Page ${page}`),
        renderSubmissions(),
        m('button', { onclick: prevPage, disabled: page === 1 }, 'Previous'),
        m('button', { onclick: nextPage }, 'Next')
      ])
    }
  }
}

m.route(r, '/', {
  '/': Main(links.Top),
  '/new': Main(links.New),
  '/ask': Main(links.Ask),
  '/show': Main(links.Show),
  '/about': About
})
