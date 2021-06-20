import { Component, Input, EventEmitter, Output, forwardRef } from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";

@Component({
    selector: "app-number-spinner",
    templateUrl: "./number-spinner.component.html",
    styleUrls: [
        "./number-spinner.component.scss"
    ],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => NumberSpinnerComponent),
            multi: true
        }
    ]
})
export class NumberSpinnerComponent implements ControlValueAccessor {
    @Input() value = 0;
    @Input() step = 1;
    @Input() min: number;
    @Input() max: number;
    @Input() direction: "horizontal" | "vertical" = "horizontal";
    @Input() tag = "";

    @Output() change: EventEmitter<{value: number, tag: string}> = new EventEmitter();

    disabled: boolean;

    propagateChange: any = () => { };
    onTouched: () => void;

    constructor() { }

    writeValue(value: number): void {
        this.value = value || 0;
    }

    registerOnChange(fn: any): void {
        this.propagateChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    setDisabledState?(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }

    inc(): void {
        this.value += this.step;
        this._onChange();
    }

    dec(): void {
        this.value -= this.step;

        this._onChange();
    }

    private _onChange(): void {
        this.propagateChange(this.value);

        const v = {
            value: this.value,
            tag: this.tag
        };

        this.change.emit(v);
    }
}
