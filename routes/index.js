const express = require('express')
const router = express.Router()



const mainPages = [
    {
        paged_id: 'home',
        route: '/',
        view_path: '../views/index',
        menu_name: 'Home',
        title: 'Home'
    },
    {
        page_id: 'about',
        route: '/about',
        view_path: '../views/about',
        menu_name: 'About',
        title: 'About'
    }
]

const footerMenus = [
    {
        paged_id: 'home',
        route: '/',
        menu_name: 'Home',
        title: 'California Kids Pediatrics'
    },
    {
        page_id: 'about',
        route: '/about',
        menu_name: 'About',
        title: 'About'
    }
]

const pages = [...mainPages]
const mainMenus = [ ...mainPages ]

pages.map((page) => {
    if (page.view_path) {
        router.get(page.route, (req, res) => {
            res.render(page.view_path, {
                ...page ,
                mainMenus ,
                footerMenus ,
                activePageId: page.page_id ,
            })
        })
    }
})



module.exports = router