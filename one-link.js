/*
Features:
- Highlight a link when is active
- Display a page when is active, hide when inactive
- Change the URL accordingly when clicked

Structure:
- Use full paths in the links and pages or just the last part and build a structure?
    - The best approach I think it would be using full urls for pages of the type /products/:product/parts/:part. Use something like the Router.check for this and have an object like this data = {product: 'car', part: 23}
    - The way a link is set as active and a page displayed is the following. First a url that they point to (see point below, only for links) and then a rule for links and pages:
        - 
- How to pass information from the URL?
    - /url: this url is absolute and replaces the route from the root
    - url: this url is relative and is appended to the last part.
    - ../url: goes one level up
- How to handle reloads
- How to handle default url
- The only things changing the url should be user actions: back, forward (on pop state), refresh (initial constructor) and links (one-link)
- Trigger an event with the name of the path, this way only the path to be set to light listens to it as opposed to just every page in the whole app that needs to listen to path change and check whether it is them. (this does not work for urls with variables, such as product id). We could maintain the index idea that we had. We know each portion of the url in which index falls(/home/card1: home = index 1, card1 = index 2) and trigger an event with the index name.  Only routes at that level will listen. We could also use the variable approach just avoiding variables.
    - E.g: Url = about, index = 2. It will be a match if the 'about' is in the second position. /home/about
    - E.g: url = /home/info, exact = false. It will be a match if the route starts with the url. /home/about/product
    - E.g: url = /producs/:productID/part/:partID, exact = false. data = {productID: xx, partID: yy}

- Every action has a reaction, based on the same principle when we click something in our app, is becuase we know where we want it to go. This means, the routing system could be thought out in a way that events only target the view that we know that should be diplayed. (the complicated part is when user plays with url or reloads.). Maybe we could build a dictionary of url-s and centralize the routing. I think centralizing is propably the best but not in line with what this simple components want to achieve, where they should work just throwing them in. (like the db structure is also best centralized but it can be build as we go, in our components).

Nueva idea para evitar añadir un listener a nivel de window en absolutamente todos los elementos: en el constructor se pone la regla para active que se actualiza en el primer reload. En la interacción con la app se utiliza push api y el id del elemento que se desea mostrar. one-link use get element by ID para hacer show de ese elemento.
*/

import {OneClass, html} from '@alexmtur/one-class';

export class OneLink extends OneClass {
    static get properties() {return {
            href: String, //href property for the anchor            
            active: Boolean, //Becomes active when the current url matches the href property            
            exact: Boolean, //If true, the url has to be exactly equal to href, otherwise it checks they begin the same               
        };
    }
    constructor() {
        super();
    }
    _firstRendered() {
        if(this.href) {
            this.isActive();
            window.addEventListener('pathChange',  (e) => { 
                this.isActive();
            }, false);
            this.addEventListener('click', async (e) => {
                e.preventDefault(); 
                window.history.pushState(null, null, this.href); //data, title, url
                window.dispatchEvent(new CustomEvent('pathChange', { detail: this.href }));
            });
        }
    }
    _render() {return html`
        <style>
            .anchor {
                color: rgba(255,255,255,.5);
                text-decoration: inherit;
                /*.ease(.3s);*/
            }
            .anchor[active] {
                /*color: green;*/
                /*background: pink !important;*/
                /*opacity: 1;*/
                color:white;
            }
            a:hover, .anchor:hover {
                color: rgba(255,255,255,.8);
            }
            a:active {
                color: white;
            }
        </style>
        <app-location route="{{route}}"></app-location>
        <a class="anchor" href="[[href]]" active$="[[active]]">
            <slot></slot>
        </a>`
    }
    

    //Executed when the url changes
    isActive() {
        let path = decodeURI(location.pathname + location.search);
        if(!path) return;
        if(!this.exact) {
            path = path.substring(0, this.href.length);
        }
        //Check if the current url matches the href property
        if(this.href === path) {
            if(this.active) return;
            else this.active = true;
        }
        else {
            if(this.active) this.active = false;
            else return;
        }
    }
}
customElements.define('one-class', OneClass);