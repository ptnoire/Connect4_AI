import { RESET_BUTTON, TITLE } from "../config";
import { View } from "./view";

export class NavView extends View {
    _button = RESET_BUTTON;
    _title = TITLE;

    addResetHandler(handler: Function) {
        this._button?.addEventListener('click', function(e) {
            if (e.target instanceof HTMLElement) {
                e.preventDefault();
                handler();
            }
        })
    }

    titleChange(input: string) {
        if (this._title !== null) 
        this._title.textContent = input;
        this._title?.classList.add('winScreen');
    }
    titleReset() {
        if (this._title !== null) 
        this._title.textContent = `CONNECT4 : GREG'S WORLD`;
        this._title?.classList.remove('winScreen');
    }
}



export default new NavView();