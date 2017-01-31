import { NgModule, enableProdMode  } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { BannerComponent } from "./banner.component";
import { BannerDirective } from "./banner.directive";

enableProdMode();

@NgModule({
    imports: [BrowserModule],
    declarations: [
        BannerComponent,
        BannerDirective
    ],
    bootstrap: [BannerComponent]
})

export class BannerModule {

}
