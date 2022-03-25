/* lipu.js - The main application */

import m from "mithril";
import { fromUnixTime, format, formatDistance } from "date-fns/fp";
import { r, about_text, hostname, links } from "./consts";
import NavBar from "./navbar";

const get = (url) => m.request({ method: "GET", url: url });
let START_FETCH_LIMIT = 0, FETCH_LIMIT = 30;

function About() {
	return {
		view: () => m("main", [
			NavBar(),
			m("hr"),
			m("div", {class: "about"}, m.trust(about_text))
		])
	}
}

function Main(link) {
	let ids = [], submissions = [], page = 1;

	function inline_seperator() {
		return m("span", " | ")
	}

	function next_page() {
		submissions = [];
		page++;
		START_FETCH_LIMIT += FETCH_LIMIT;
		fetch_ids();
		fetch_submissions();
	}

	function prev_page() {
		submissions = [];
		page--;
		START_FETCH_LIMIT -= FETCH_LIMIT;
		fetch_ids();
		fetch_submissions();
	}

	// Copilot saves my day :D
	function fetch_ids() { // Avoid conflict with fetch()
		get(link).then(data => data.slice(START_FETCH_LIMIT, START_FETCH_LIMIT + FETCH_LIMIT).forEach(id => ids.push(id)))
	}
	fetch_ids();

	function fetch_submission(id) {
		get(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)
			.then(data => {
				data.id = id;
				submissions.push(data);
			})
	}

	// Finally, a working solution!!!
	function fetch_submissions() {
		while (ids.length !== 0) {
			fetch_submission(ids[0]);
			ids.shift();
		}
		console.log(submissions);
	}

	function render_submission(submission) {
		let user_url = `https://news.ycombinator.com/user?id=${submission.by}`,
			comments_url = `https://news.ycombinator.com/item?id=${submission.id}`,
			submission_time = fromUnixTime(submission.time);

		return m("div", {class: "submission"}, [
			m("a", {href: (!(submission.url) ? comments_url : submission.url), target: "_blank", class: "s-link"},
				m("span", {style: "font-size: 1.25em"}, submission.title),
				m("span", {style: "font-size: 0.8em"}, submission.url ? ` (${hostname(submission.url)})` : "")
			),
			m("br"),
			m("span", {class: "s-info"}, [
				m("span", `${submission.score} points by `),
				m("a", {href: user_url, class: "s-link", target: "_blank"}, submission.by),
				inline_seperator(),
				m("a", {href: comments_url, class: "s-link", target: "_blank"}, `${submission.descendants} comments`),
				inline_seperator(),
				m("span", `At ${format("p", submission_time)} (${formatDistance(submission_time, new Date(), { suffix: true })})`),
			]),
		])
	}

	function render_submissions() {
		return m("div", {class: "submissions"}, submissions.map(render_submission));
	}

	return {
		view: () => {
			fetch_submissions();
			return m("main", [
				NavBar(),
				m("hr"),
				m("strong", `Page ${page}`),
				render_submissions(),
				m("button", {onclick: prev_page, disabled: page === 1}, "Previous"),
				m("button", {onclick: next_page}, "Next"),
			]);
		}
	}
}

m.route(r, "/", {
	"/": Main(links.Top),
	"/new": Main(links.New),
	"/ask": Main(links.Ask),
	"/show": Main(links.Show),
	"/about": About
});
