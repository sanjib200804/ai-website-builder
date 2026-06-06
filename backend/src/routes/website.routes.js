import express from 'express'
import isAuth from '../middlewares/isAuth.js'
import { changes, generateWebsite, getAllWebsites, getWebsiteById, previewWebsite, deployWebsite } from '../controllers/website.controller.js'
const webRouter = express.Router()

webRouter.post('/generate', isAuth, generateWebsite)
webRouter.get('/get-by-id/:id', isAuth, getWebsiteById)
webRouter.get('/get-all', isAuth, getAllWebsites)
webRouter.post('/update/:id', isAuth, changes)
webRouter.get('/preview/:id', previewWebsite)
webRouter.post('/deploy/:id', isAuth, deployWebsite)

export default webRouter
