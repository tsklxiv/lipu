/* navbar.js - Navigation bar */
import m from 'mithril'
import { header } from './consts'

function NavBar () {
  function part (elem) {
    return m('li.navbar', elem)
  }

  function partRight (elem) {
    return m('li.navbar-right', elem)
  }

  return m('ul.navbar', [
    part(m('a', { href: '#!/' }, 'Top')),
    part(m('a', { href: '#!/new' }, 'New')),
    part(m('a', { href: '#!/ask' }, 'Ask')),
    part(m('a', { href: '#!/show' }, 'Show')),
    part(header),
    partRight(m('a', { href: '#!/about' }, 'About'))
  ])
}

export default NavBar
