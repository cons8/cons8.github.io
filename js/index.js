import { createApp, ref } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js'

createApp({
    data(){
        return {
           works : [{ 
                name : "时序",
                desc : "高效时间管理",
                bg : "red"
            },
            {   name : "补光灯",
                desc : "照亮你的美"
            }],
            navs: [
                {name : "首页", url : "/","sronly":true},
                {name : "补光灯", url : "./htmls/light.html","sronly":false},
                {name : "链接", url : "/htmls/links.html","sronly":false},
             ]
        }
    },
    methods : {
        test(){
            alert("试试就试试");
        }
    }
}).mount("#app")
