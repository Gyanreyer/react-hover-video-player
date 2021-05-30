(window.webpackJsonp=window.webpackJsonp||[]).push([[8],{364:function(e,t,r){"use strict";r.r(t);var o=r(44),a=Object(o.a)({},(function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("ContentSlotsDistributor",{attrs:{"slot-key":e.$parent.slotKey}},[r("h1",{attrs:{id:"contributing"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#contributing"}},[e._v("#")]),e._v(" Contributing")]),e._v(" "),r("h2",{attrs:{id:"developing-locally"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#developing-locally"}},[e._v("#")]),e._v(" Developing locally")]),e._v(" "),r("ul",[r("li",[r("code",[e._v("npm install")])]),e._v(" "),r("li",[r("code",[e._v("npm run dev")]),e._v(" "),r("ul",[r("li",[e._v("This will serve the contents of "),r("code",[e._v("dev/DevPlayground.tsx")]),e._v(" at "),r("a",{attrs:{href:"http://localhost:3000",target:"_blank",rel:"noopener noreferrer"}},[e._v("http://localhost:3000"),r("OutboundLink")],1),e._v(" with hot reloading.\n"),r("ul",[r("li",[e._v("You may edit the "),r("code",[e._v("DevPlayground.tsx")]),e._v(" file however you like to test your changes, but please refrain from committing any changes to this file.")])])])])])]),e._v(" "),r("h2",{attrs:{id:"documentation"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#documentation"}},[e._v("#")]),e._v(" Documentation")]),e._v(" "),r("p",[e._v("Please add documentation for your changes! If adding a prop, make sure to add it to the README file accordingly.")]),e._v(" "),r("p",[e._v("The documentation site at "),r("a",{attrs:{href:"https://react-hover-video-player.dev",target:"_blank",rel:"noopener noreferrer"}},[e._v("https://react-hover-video-player.dev"),r("OutboundLink")],1),e._v(" uses the "),r("a",{attrs:{href:"https://vuepress.vuejs.org/",target:"_blank",rel:"noopener noreferrer"}},[e._v("VuePress"),r("OutboundLink")],1),e._v(" library to automatically construct a page based on the README file's contents.")]),e._v(" "),r("p",[e._v("To preview the documentation site locally, run "),r("code",[e._v("npm run docs:dev")]),e._v(" to serve it at "),r("a",{attrs:{href:"http://localhost:8080",target:"_blank",rel:"noopener noreferrer"}},[e._v("http://localhost:8080"),r("OutboundLink")],1),e._v(".")]),e._v(" "),r("h2",{attrs:{id:"tests"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#tests"}},[e._v("#")]),e._v(" Tests")]),e._v(" "),r("h3",{attrs:{id:"running-tests"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#running-tests"}},[e._v("#")]),e._v(" Running tests")]),e._v(" "),r("p",[e._v("Tests are written using "),r("a",{attrs:{href:"https://github.com/facebook/jest",target:"_blank",rel:"noopener noreferrer"}},[e._v("jest"),r("OutboundLink")],1),e._v(" and "),r("a",{attrs:{href:"https://github.com/testing-library/react-testing-library",target:"_blank",rel:"noopener noreferrer"}},[e._v("react-testing-library"),r("OutboundLink")],1),e._v(".")]),e._v(" "),r("ul",[r("li",[r("p",[r("code",[e._v("npm run test")]),e._v(" will run all tests once.")])]),e._v(" "),r("li",[r("p",[r("code",[e._v("npm run test:watch")]),e._v(" will continually re-run tests as you make changes.")])]),e._v(" "),r("li",[r("p",[r("code",[e._v("npm run test:release")]),e._v(" will perform a webpack build ("),r("code",[e._v("npm run build")]),e._v(") and then run all tests on the resulting release-ready version of the component for smoke testing purposes. Note that this is much slower and does not perform coverage testing, so you will almost always want to stick with "),r("code",[e._v("npm run test")]),e._v(".")])]),e._v(" "),r("li",[r("p",[r("code",[e._v("npm run test:debug")]),e._v(" will run the tests in a Node process that an external debugger can connect to (ie, "),r("a",{attrs:{href:"chrome://inspect"}},[e._v("chrome://inspect")]),e._v(") so that you can use breakpoints and step through the code as needed. See Jest's "),r("a",{attrs:{href:"https://jestjs.io/docs/troubleshooting",target:"_blank",rel:"noopener noreferrer"}},[e._v("troubleshooting docs"),r("OutboundLink")],1),e._v(" for more details.")])])]),e._v(" "),r("p",[r("strong",[e._v("100% code coverage for tests is required")]),e._v(". If you make a change, you must add a test accordingly.")]),e._v(" "),r("h4",{attrs:{id:"utils-for-writing-tests"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#utils-for-writing-tests"}},[e._v("#")]),e._v(" Utils for writing tests")]),e._v(" "),r("p",[e._v("There are some handy utils available to help make writing tests easier:")]),e._v(" "),r("h5",{attrs:{id:"renderhovervideoplayer"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#renderhovervideoplayer"}},[e._v("#")]),e._v(" renderHoverVideoPlayer")]),e._v(" "),r("p",[r("code",[e._v("renderHoverVideoPlayer")]),e._v(" takes a configuration and renders a "),r("code",[e._v("HoverVideoPlayer")]),e._v(" component for testing. This also injects mocked behavior into the rendered video element so we can emulate how a real video element loads and plays as closely as possible in our tests.")]),e._v(" "),r("p",[r("em",[e._v("Arguments")]),e._v(":")]),e._v(" "),r("ul",[r("li",[r("code",[e._v("props")]),e._v(" (Object): Accepts an object representing all props to pass to the component for the test")]),e._v(" "),r("li",[r("code",[e._v("videoConfig")]),e._v(" (Object): Accepts an object for customizing what behavior should be simulated for the video element. Valid properties for this object are:\n"),r("ul",[r("li",[r("code",[e._v("shouldPlaybackFail")]),e._v(" (Boolean): Whether we should simulate an error occuring while attempting to play the video. This is false by default.")])])])]),e._v(" "),r("p",[r("em",[e._v("Returns")]),e._v(":")]),e._v(" "),r("p",[e._v("An object with the following properties:")]),e._v(" "),r("ul",[r("li",[r("code",[e._v("rerenderWithProps")]),e._v(" (Function): Takes an object for new props to re-render the component with.")]),e._v(" "),r("li",[r("code",[e._v("videoElement")]),e._v(" (HTMLVideoElement): The video element rendered by the HoverVideoPlayer component.")]),e._v(" "),r("li",[r("code",[e._v("playerContainer")]),e._v(" (HTMLDivElement): The container div element rendered by the HoverVideoPlayerComponent.")]),e._v(" "),r("li",[r("code",[e._v("pausedOverlayWrapper")]),e._v(" (HTMLDivElement): The wrapper div element around the contents provided to the "),r("code",[e._v("pausedOverlay")]),e._v(" prop. This should be null if no "),r("code",[e._v("pausedOverlay")]),e._v(" was provided.")]),e._v(" "),r("li",[r("code",[e._v("loadingOverlayWrapper")]),e._v(" (HTMLDivElement): The wrapper div element around the contents provided to the "),r("code",[e._v("loadingOverlay")]),e._v(" prop. This should be null if no "),r("code",[e._v("loadingOverlay")]),e._v(" was provided.")]),e._v(" "),r("li",[r("a",{attrs:{href:"https://testing-library.com/docs/react-testing-library/api#render-result",target:"_blank",rel:"noopener noreferrer"}},[e._v("All properties returned by react-testing-library's render function"),r("OutboundLink")],1)])]),e._v(" "),r("h5",{attrs:{id:"advancevideotime"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#advancevideotime"}},[e._v("#")]),e._v(" advanceVideoTime")]),e._v(" "),r("p",[e._v("Syntactic sugar for "),r("code",[e._v("act(() => jest.advanceTimersByTime(time));")]),e._v(".")]),e._v(" "),r("p",[r("code",[e._v("advanceVideoTime")]),e._v(" takes a number of milliseconds to advance Jest's "),r("a",{attrs:{href:"https://jestjs.io/docs/jest-object#mock-timers",target:"_blank",rel:"noopener noreferrer"}},[e._v("mock timers"),r("OutboundLink")],1),e._v(" by, and uses "),r("code",[e._v("act()")]),e._v(" to ensure any resulting updates to the React component's state will be handled safely.")]),e._v(" "),r("p",[r("em",[e._v("Arguments")]),e._v(":")]),e._v(" "),r("ul",[r("li",[r("code",[e._v("time")]),e._v(" (Number): Number of milliseconds to advance timers by.")])]),e._v(" "),r("h2",{attrs:{id:"builds"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#builds"}},[e._v("#")]),e._v(" Builds")]),e._v(" "),r("p",[e._v("This project uses automated builds with "),r("a",{attrs:{href:"https://travis-ci.com/",target:"_blank",rel:"noopener noreferrer"}},[e._v("Travis CI"),r("OutboundLink")],1),e._v(". When a change is merged into the main branch, Travis will run all unit tests and if they pass, it will build and deploy a new version of the "),r("code",[e._v("react-hover-video-player")]),e._v(" package to npm using "),r("a",{attrs:{href:"https://semantic-release.gitbook.io/semantic-release/",target:"_blank",rel:"noopener noreferrer"}},[e._v("semantic-release"),r("OutboundLink")],1),e._v(".")]),e._v(" "),r("p",[e._v("If you wish to do a production build locally for testing purposes:")]),e._v(" "),r("ul",[r("li",[r("code",[e._v("npm run build")]),e._v(" will build the component and demo page for production.")])]),e._v(" "),r("h2",{attrs:{id:"commits"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#commits"}},[e._v("#")]),e._v(" Commits")]),e._v(" "),r("p",[e._v("In order to work best with semantic-release, commit messages must follow the "),r("a",{attrs:{href:"https://github.com/angular/angular.js/blob/master/DEVELOPERS.md#-git-commit-guidelines",target:"_blank",rel:"noopener noreferrer"}},[e._v("Angular commit guidelines"),r("OutboundLink")],1),e._v(":")]),e._v(" "),r("div",{staticClass:"language-text extra-class"},[r("pre",{pre:!0,attrs:{class:"language-text"}},[r("code",[e._v("<type>(<scope>): <subject>\n<BLANK LINE>\n<body>\n<BLANK LINE>\n<footer>\n")])])]),r("p",[e._v("This formatting is enforced using "),r("a",{attrs:{href:"https://github.com/typicode/husky",target:"_blank",rel:"noopener noreferrer"}},[e._v("Husky"),r("OutboundLink")],1),e._v(" and "),r("a",{attrs:{href:"https://github.com/conventional-changelog/commitlint",target:"_blank",rel:"noopener noreferrer"}},[e._v("Commitlint"),r("OutboundLink")],1),e._v(".")]),e._v(" "),r("p",[e._v("To make things easy, you can write your commit messages using "),r("a",{attrs:{href:"https://github.com/commitizen/cz-cli",target:"_blank",rel:"noopener noreferrer"}},[e._v("Commitizen"),r("OutboundLink")],1),e._v(", a CLI tool which will provide an interactive experience for walking you through writing your commit message. All you have to do is stage your changes and run "),r("code",[e._v("npm run commit")]),e._v(" and it'll guide you from there.")])])}),[],!1,null,null,null);t.default=a.exports}}]);