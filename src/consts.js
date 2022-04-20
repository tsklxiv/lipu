/* consts.js - Constants */
import { marked } from 'marked'

const r = document.body
const hostname = (url) => new URL(url).hostname
const aboutText = marked(`
# Lipu

Lipu (means *document, text* in [Toki Pona](https://tokipona.org/)) is an alternative interface to Hacker News.

Features:
- Simple and clean
- Load the submissions as the page loads
- **Responsive** - Works on any device, of any screen size

# Tech
Lipu uses these following libraries and programs to work properly:
- [Mithril](https://mithril.js.org) - Cool hyperscript web framework
- [date-fns](https://date-fns.org) - Date manipulation library (for formatting the time of submissions)
- [Marked](https://marked.js.org) - Rendering this text
- [ESbuild](https://esbuild.github.io) - Bundling and building
- [Yarn](https://yarnpkg.com) - Package manager

# Other things
- [Water.css](https://watercss.kognise.dev/) - Light theme (Classless CSS)
- [Lato](https://fonts.google.com/specimen/Lato) - Font used

An open source project by [@HoangTuan110](https://github.com/HoangTuan110). Made in Vietnam.

[Repo](https://github.com/HoangTuan110/lipu)
`)
const header = 'A simple and clean unofficial alternative Hacker News interface'
const links = {
  Top: 'https://hacker-news.firebaseio.com/v0/topstories.json',
  New: 'https://hacker-news.firebaseio.com/v0/newstories.json',
  Ask: 'https://hacker-news.firebaseio.com/v0/askstories.json',
  Show: 'https://hacker-news.firebaseio.com/v0/showstories.json'
}

export { r, hostname, aboutText, header, links }
