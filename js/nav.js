export function getnav(current) {
    let navs = [
        { name: "首页", url: "/", "sronly": false },
        { name: "补光灯", url: "/htmls/light.html", "sronly": false },
    ]
    // 将name为current的sronly设置为true
    navs.forEach(item => {
        if (item.name == current) {
            item.sronly = true
        }
    })
    return navs
}