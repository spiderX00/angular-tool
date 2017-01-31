import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";
import { BannerModule } from "./banner.module";

document.addEventListener("DOMContentLoaded", function(event) {
    platformBrowserDynamic().bootstrapModule(BannerModule);
});
