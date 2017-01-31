import { Directive, ElementRef, HostListener, Input, Renderer } from "@angular/core";
declare var $:any;

@Directive({
    selector: "[banner]"
})

export class BannerDirective {
    constructor(private el: ElementRef, private renderer: Renderer) {
        console.info($(el.nativeElement));
    }

    @Input("banner") banner: string;

    @Input() set setValue(value: string) {

    }

}
