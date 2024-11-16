import { createApp, ref } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js'


const linksDev = [
  { name: 'Bootstrap', href: 'https://v4.bootcss.com/' },
  { name: 'Vue', href: 'https://cn.vuejs.org/' },
  { name: 'Axios', href: 'https://www.axios-http.cn/'},
  { name: 'ElementPlus', href: 'https://element-plus.org/zh-CN/'}
]
const linksIdea = [
  { name: 'awwwards', href: 'https://www.awwwards.com/'},
  { name: 'GitHub', href: 'https://github.com/'},
]
const linksMyweb = [
  { name: 'ConstWeb', href: 'https://cons8.github.io/' },
]

const links = [linksDev, linksIdea, linksMyweb]
createApp({
    data(){
        return {
            links
        }
    }
}).mount('#app')