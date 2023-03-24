import fs from 'fs'

import notFound from "./notFound.js"

const users = JSON.parse(fs.readFileSync('./dev-data/data/users.json'))
const notFoundObject = "user"

export function getAllUsers(req, res) {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined'
    })
}

export function postUser(req, res) {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined'
    })
}

export function getUser(req, res) {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined'
    })
}

export function patchUser(req, res) {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined'
    })
}

export function deleteUser(req, res) {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined'
    })
}
