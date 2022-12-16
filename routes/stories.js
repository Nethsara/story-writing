const express = require('express')
const router = express.Router()
const {ensureAuth} = require('../middleware/auth')

const Story = require('../models/Story')

//@desc Show add page
//@route GET /stories/add
router.get('/add', ensureAuth, (req, res) => {
    res.render('stories/add')
})

//@desc process add page
//@route POST /stories/add
router.post('/', ensureAuth, async (req, res) => {
    try {
        req.body.user = req.user.id
        await Story.create(req.body)
        res.redirect('/')
    } catch (e) {
        console.error(e)
        res.render('error/500')
    }
})


//@desc show all stories
//@route POST /stories
router.get('/', ensureAuth, async (req, res) => {
    try {
        const stories = await Story.find({status: 'public'})
            .populate('user')
            .sort({createdAt: "desc"})
            .lean()

        res.render('stories/index', {
            stories
        })
    } catch (e) {
        console.error(e)
        res.render('error/500')
    }
})

module.exports = router