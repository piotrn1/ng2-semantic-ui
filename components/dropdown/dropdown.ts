import {Directive, Input, HostBinding, EventEmitter, Output, AfterContentInit, ContentChild, Renderer2, ElementRef, HostListener, QueryList, ContentChildren, forwardRef} from '@angular/core';
import {SuiTransition, Transition} from '../transition/transition';
import {TransitionController} from '../transition/transition-controller';
import {DropdownService, DropdownAutoCloseType} from './dropdown.service';
import {SuiDropdownMenu} from './dropdown-menu';
import {PositioningService, PositioningPlacement} from '../util/positioning.service';
import {KeyCode, HandledMouseEvent, HandledKeyboardEvent} from '../util/util';

@Directive({
    selector: '[suiDropdown]'
})
export class SuiDropdown implements AfterContentInit {
    public service:DropdownService;

    @ContentChild(SuiDropdownMenu)
    private _menu:SuiDropdownMenu;

    @ContentChildren(SuiDropdown, { descendants: true })
    private _children:QueryList<SuiDropdown>;

    public get children() {
        // @ContentChildren includes the current element by default.
        return this._children.filter(c => c !== this);
    }

    @Output()
    public get isOpenChange() {
        return this.service.isOpenChange;
    }

    @HostBinding('class.active')
    public get isActive() {
        // This is to ensure nested dropdowns don't get made bold.
        return this.service.isOpen && !this.service.isNested;
    }

    @Input()
    public get isOpen() {
        return this.service.isOpen;
    }

    public set isOpen(value:boolean) {
        // If we are opening the dropdown, we want to always open its parents.
        this.service.setOpenState(value, !!value);
    }

    @HostBinding('class.disabled')
    @Input()
    public get isDisabled() {
        return this.service.isDisabled;
    }

    public set isDisabled(value:boolean) {
        this.service.setDisabledState(value);
    }

    @HostBinding('attr.tabindex')
    public get tabIndex() {
        return (this.isDisabled || this.service.isNested) ? null : 0;
    }

    @Input()
    public get autoClose() {
        return this.service.autoCloseMode;
    }

    public set autoClose(value:DropdownAutoCloseType) {
        this.service.autoCloseMode = value;
    }

    constructor(private _element:ElementRef) {
        this.service = new DropdownService();
    }

    public ngAfterContentInit() {
        if (!this._menu) {
            throw new Error("You must set [suiDropdownMenu] on the menu element.");
        }
        this._menu.service = this.service;

        this.childrenUpdated();
        this._children.changes
            .subscribe(() => this.childrenUpdated());
    }

    private childrenUpdated() {
        // Reregister child dropdowns each time the menu content changes.
        this.children
            .map(c => c.service)
            .forEach(s => this.service.registerChild(s))
    }

    @HostListener("click", ['$event'])
    public onClick(e:HandledMouseEvent) {
        if (!e.eventHandled) {
            e.eventHandled = true;

            this.service.toggleOpenState();
        }
    }

    @HostListener("keypress", ['$event'])
    public onKeypress(e:HandledKeyboardEvent) {
        // Block the keyboard event from being fired on parent dropdowns.
        if (!e.eventHandled) {

            if (e.keyCode == KeyCode.Enter) {
                e.eventHandled = true;

                this.service.setOpenState(true);
            }
        }
    }

    @HostListener("document:click", ["$event"])
    public onDocumentClick(e:MouseEvent) {
        if (!this._element.nativeElement.contains(e.target)) {
            if (this.service.autoCloseMode == DropdownAutoCloseType.ItemClick || this.service.autoCloseMode == DropdownAutoCloseType.OutsideClick) {
                // No need to reflect in parent since they are also bound to document.
                this.service.setOpenState(false);
            }
        }
    }
}