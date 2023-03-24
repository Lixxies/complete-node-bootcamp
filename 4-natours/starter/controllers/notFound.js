export default function notFound(obj) {
    return {
        status: 'fail',
        message: `There is no ${obj} with this ID`
    }
}
