import fs from 'fs'

import notFound from "./notFound.js"

const tours = JSON.parse(fs.readFileSync('./dev-data/data/tours-simple.json'))
const notFoundObject = "tour"

export function getAllTours(req, res) {
    res.status(200).json({
        status: 'success',
        results: tours.length,
        requestedAt: req.requestTime,
        data: {
            tours
        }
    })
}

export function getTour(req, res) {
    const tour = tours[req.params.id]

    if (!tour) {
        res.status(404).json(notFound(notFoundObject))
    } else {
        res.status(200).json({
            status: 'success',
            data: {
                tour
            }
        })
    }
}

export function postTour(req, res) {
    const newId = tours.length
    const newTour = Object.assign({ id: newId }, req.body)
    tours.push(newTour)

    fs.writeFile('./dev-data/data/tours-simple.json', JSON.stringify(tours), err => {
        res.status(201).json({
            status: 'success',
            data: {
                tour: newTour
            }
        })
    })
}

export function patchTour(req, res) {
    const tour = tours[req.params.id]

    if (!tour) {
        res.status(404).json(notFound(notFoundObject))
    } else {
        res.status(200).json({
            status: 'success',
            data: {
                tour: 'Updated tour'
            }
        })
    }
}

export function deleteTour(req, res) {
    const tour = tours[req.params.id]

    if (!tour) {
        res.status(404).json(notFound(notFoundObject))
    } else {
        res.status(204).json({
            status: 'success',
            data: null
        })
    }
}
