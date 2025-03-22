import { createApp, ref } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js'
import { getnav } from '/js/nav.js';

const navs = getnav("首页")

const book01 = document.querySelector("#books").children[0]

createApp({
    data(){
        return {
            navs
        }
    },
    methods : {
        test(){
            alert("试试就试试");
        }
    }
}).mount("#app")
