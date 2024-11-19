import { createApp, ref } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js'
import { getnav } from '/js/nav.js'

const navs = getnav('链接')

const linksDev = [
  { name: 'Bootstrap', href: 'https://v4.bootcss.com/' },
  { name: 'Vue', href: 'https://cn.vuejs.org/' },
  { name: 'Axios', href: 'https://www.axios-http.cn/'},
  { name: 'ElementPlus', href: 'https://element-plus.org/zh-CN/'},
  { name: 'Maven Repository', href: 'https://mvnrepository.com/'},
]
const linksIdea = [
  { name: 'awwwards', href: 'https://www.awwwards.com/'},
  { name: 'GitHub', href: 'https://github.com/'},
  { name: 'heroku', href: 'https://www.heroku.com/'},
]
const linksMyweb = [
  { name: 'ConstWeb', href: 'https://cons8.github.io/' },
  { name: '廖雪峰的官方网站', href: 'https://liaoxuefeng.com/' },
  
]

const links = [linksDev, linksIdea, linksMyweb]
createApp({
    data(){
        return {
            links,
            navs
        }
    }
}).mount('#links')