const express = require('express')
const router = express()
const { createWebAPIRequestProxy } = require('../util/util')

// router.get('/', (req, res) => {
//   const rid = req.query.id
//   const cookie = req.get('Cookie') ? req.get('Cookie') : ''
//   const data = {
//     offset: req.query.offset || 0,
//     rid: rid,
//     limit: req.query.limit || 20,
//     csrf_token: ''
//   }
//   createWebAPIRequest(
//     'music.163.com',
//     `/weapi/v1/resource/comments/R_SO_4_${rid}/?csrf_token=`,
//     'POST',
//     data,
//     cookie,
//     music_req => {
//       res.send(music_req)
//     },
//     err => res.status(502).send('fetch error')
//   )
// })
function randomProxyHost() {
  const proxyList = [
    '111.13.109.27',                                                                                                                                                                                                                                                                                                                                                                                                                    
    '107.21.56.41'                                                                                                                                       
  ]
  const num = Math.floor(Math.random() * proxyList.length)
  console.log(proxyList[num])
  return proxyList[num]
}

router.get('/', (req, res) => {
  const rid = req.query.id
  const cookie = req.get('Cookie') ? req.get('Cookie') : ''
  const data = {
    offset: req.query.offset || 0,
    rid: rid,
    limit: req.query.limit || 20,
    csrf_token: ''
  }
  createWebAPIRequestProxy(
    randomProxyHost(),
    `http://music.163.com/weapi/v1/resource/comments/R_SO_4_${rid}/?csrf_token=`,
    'POST',
    data,
    cookie,
    music_req => {
      res.send(music_req)
    },
    err => res.status(502).send('fetch error')
  )
})
module.exports = router
