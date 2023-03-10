import { RESET_BUTTON } from "../config";
import { View } from "./view";



export class NavView extends View {
    _button = RESET_BUTTON;

    addResetHandler(handler: Function) {
        this._button?.addEventListener('click', function(e) {
            if (e.target instanceof HTMLElement) {
                e.preventDefault();
                handler();
            }
        })
    }
    }

export default new NavView();