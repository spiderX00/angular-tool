$(function() {

    "use strict";

    const endpoint = "https://letsdonation.com/?index.php&option=com_jsocialcommerce&task=";

    const LOGIN_URLS = [
        new RegExp("https://letsdonation.com/login"),
        new RegExp("https://letsdonation.com/index.php?option=com_users&view=login")
    ];

    const DEFAULT_PARAMS = {
        userName: "Anonimo",
        userId: 1
    };

    const STATUS_ERRNO = 500;

    let href = location.href;

    des_init();

    function checkUserLogin() {
        let today = new Date().toISOString().slice(0, 10);
        let ck = descrypt("checkUserLogin" + today, "letsdonationapi");
        let task = "api.checkUserLogin";
        let url = endpoint + task + "&ck=" + ck;
        $.get(url, (data) => {
                console.info("checkUserLogin::success", data);
                let parse = JSON.parse(data);
                let params = {
                    userName: parse.name,
                    userId: parse.userid,
                };
                console.info(JSON.stringify(params));
                self.port.emit("getEmail", params);
            })
            .fail((error) => {
                console.error("checkUserLogin::fail", error.status, error.statusText);
                if (error.status == STATUS_ERRNO)
                    self.port.emit("getEmail", DEFAULT_PARAMS);
            })
    }

    function checkUserAuth(args) {
        let today = new Date().toISOString().slice(0, 10);
        let ck = descrypt("checkUserAuth" + today, "letsdonationapi");
        let task = "api.checkUserAuth";
        let url = endpoint + task + "&usermail=" + args.usermail + "&pass=" + args.pass + "&ck=" + ck;
        $.get(url, (data) => {
                let parse = JSON.parse(data);
                let params = {
                    userName: parse.name,
                    userId: parse.userid,
                }
                self.port.emit("getEmail", params);
                $("#login-form").submit();
            })
            .fail((error) => {
                console.error("checkUserAuth::fail", error);
                $("#login-form").submit();
            })
    }

    $(document).ready((e) => {
        if (LOGIN_URLS[0].test(href) || LOGIN_URLS[1].test(href)) {
            console.info("Login page");
            $("#login-form button").click(function(event) {
                event.preventDefault();
                let username = $("#modlgn-username").val();
                let password = $("#modlgn-passwd").val();
                let args = {
                    usermail: username,
                    pass: password,
                };
                checkUserAuth(args);
            })
        } else {
            checkUserLogin();
        }
    });

});
