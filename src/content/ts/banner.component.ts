import { Component, ViewChild, } from "@angular/core";
import template from "./templates/auth.banner";

@Component({
    selector: "banner-frame",
    template: template,
    styleUrls: [
        "src/css/style.css"
    ]
})

export class BannerComponent {

    private Auth: boolean = true;
    private LoginLetsDonationUrl: string = "/login";

    constructor() { }

    returnMessage() {

    }
};
