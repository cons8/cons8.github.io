import { createApp, ref } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js'
import { getnav } from '/js/nav.js'

const navs = getnav("关于")

createApp({
    data(){
        return {
            navs
        }
    }
}
).mount('#app')
