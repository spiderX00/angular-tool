const self = require("sdk/self");
const buttons = require("sdk/ui/button/action");
const panel = require("sdk/panel");
const tabs = require("sdk/tabs");
const tabUtils = require("sdk/tabs/utils");
const pageMod = require("sdk/page-mod");
const ss = require("sdk/simple-storage");
const request = require("sdk/request").Request;
const page = require("sdk/page-worker").Page;
const data = self.data;

const LOGIN_URLS = "*.letsdonation.com";
//const INVERSE_REGEXP = new RegExp(/^(?!.*?(lafeltrinelli.it|booking.com|groupon.it|it.venere.com|opodo.it|zooplus.it|1and1.it|ariete.net|shop.foppapedretti.it|facebook.com|kiabi.it|vidaxl.it|about:)).*$/);
const INVERSE_REGEXP = new RegExp();
const DEFAULT_USER_ID = 1;

const CONTENT_SCRIPTS = [];

const CONTENT_SCRIPTS_LOGIN = [];

const CONTENT_SCRIPTS_BACKGROUND = [];

const CONTENT_SCRIPTS_STATIC_BANNER = [
    data.url("./node_modules/jquery/dist/jquery.js"),
    data.url("./node_modules/core-js/client/shim.min.js"),
    data.url("./node_modules/reflect-metadata/Reflect.js"),
    data.url("./node_modules/zone.js/dist/zone.min.js"),
    data.url("./src/lib/DES crypt.js"),
    data.url("./dist/bundle.js"),
];

let workers = {};
let currentWorker = null;

function initStorage() {

    const USER_UNKOWN = "Anonimo";

    let temp = [];

    ss.storage = {};

    for (partner of temp) {
        ss.storage[partner] = false;
    }

    let user = {
        userName: USER_UNKOWN,
        userId: DEFAULT_USER_ID
    };

    ss.storage["email"] = user;
}

function isEmpty(obj) {
    return Object.is(obj, {});
}

function handleClick(e) {
    currentWorker = tabs.activeTab.url;
    if (!isEmpty(workers) && currentWorker) {
        let worker = workers[currentWorker];
        if (worker) {
            if (INVERSE_REGEXP.test(worker.tab.url)) {
                worker.port.emit("openStaticBanner", worker.tab.url);
                console.info("openStaticBanner: " + worker.tab.url);
            } else {
                worker.port.emit("partner", worker.tab.url);
                console.info("openBanner: " + worker.tab.url);
            }
        }
    }
}

initStorage();

tabs.on("activate", function(tab) {
    let url = tab.url;
    if (workers[url]) {
        console.info("ACTIVATE: ", url);
        currentWorker = tab.url;
    }
});

tabs.on("open", function(tab) {
    let url = tab.url;
    if (workers[url]) {
        console.info("OPEN: ", url);
        currentWorker = tab.url;
    }
});

tabs.on("ready", function(tab) {
    if (tab.url) {
        console.info("READY: ", tab.url);
        currentWorker = tab.url;
    }
});

let button = buttons.ActionButton({
    id: "letsDonation-activebutton",
    label: "letsDonation",
    icon: {
        "16": "./src/content/img/icon-32.png"
    },
    onClick: handleClick
});

let backgroundPage = page({
    contentURL: data.url("./src/background/background.html"),
    contentScriptFile: CONTENT_SCRIPTS_BACKGROUND,
    onMessage: function(message) {
        console.info(message);
    }
});

pageMod.PageMod({
    include: INVERSE_REGEXP,
    attachTo: ["existing", "top"],
    contentScriptFile: CONTENT_SCRIPTS_STATIC_BANNER,
    onAttach: function(workerStaticBanner) {
        workers[workerStaticBanner.tab.url] = workerStaticBanner;
    }
});

pageMod.PageMod({
    include: LOGIN_URLS,
    attachTo: ["existing", "top"],
    contentScriptFile: CONTENT_SCRIPTS_LOGIN,
    onAttach: function(workerLogin) {
        workerLogin.port.on("getEmail", function(user) {
            ss.storage["email"] = user;
            for (let worker in workers) {
                workers[worker].port.emit("email", user);
            }
        })
    }
});

pageMod.PageMod({
    include: PARTNERS,
    attachTo: ["existing", "top"],
    contentScriptFile: CONTENT_SCRIPTS,
    onAttach: function(worker) {

        workers[worker.tab.url] = worker;

        worker.port.emit("partner", worker.tab.url);

        worker.port.on("activate", function(host) {
            ss.storage[host] = true;
        });

        worker.port.on("deactivate", function(host) {
            ss.storage[host] = false;
        })

        worker.port.on("isactivate", function(host) {
            let localWorker = worker;
            if (ss.storage[host] != undefined)
                localWorker.port.emit("response", ss.storage[host]);
            else
                localWorker.port.emit("response", null);
        })

        worker.port.on("projects", function(data) {
            let localWorker = worker;
            let user = ss.storage["email"];
            let userId = user.userId;
            backgroundPage.port.emit("requests", userId);
            backgroundPage.port.on("response", function(projects) {
                localWorker.port.emit("workerProjects", projects);
            })
        })

        worker.port.on("saveProject", function(checkboxes) {
            console.info(checkboxes);
            backgroundPage.port.emit("saveProject", checkboxes);
        })

        worker.port.on("userMail", function() {
            let localWorker = worker;
            localWorker.port.emit("email", ss.storage["email"]);
        })

        worker.port.on("favoriteRequest", function() {
            let localWorker = worker;
            let user = ss.storage["email"];
            let userId = user.userId;
            backgroundPage.port.emit("favorite", userId);
            backgroundPage.port.on('favoriteProjects', function(projects) {
                localWorker.port.emit("favoriteResponse", projects);
            })
        })

        worker.port.on("affiliati", function(host) {
            let localWorker = worker;
            backgroundPage.port.emit("getAffiliati", host);
            backgroundPage.port.on("affiliatiResponse", function(results) {
                //console.info(results);
                localWorker.port.emit("sendAffiliati", results);
            })
        })

    }

});
