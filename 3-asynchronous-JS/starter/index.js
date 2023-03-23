import fs from 'fs';
import superagent from 'superagent';

const readFilePromise = (file) => {
    return new Promise((resolve, reject) => {
        fs.readFile(file, (err, data) => {
            if (err) {
                reject('I could not find that file 😢 ');
            }

            resolve(data)
        })
    })
}

const writeFilePromise = (file, data) => {
    return new Promise((resolve, reject) => {
        fs.writeFile(file, data, err => {
            if (err) {
                reject('I could not find that file 😢 ');
            }

            resolve()
        })
    })
}

const getRandomDogImage = (breed) => {
    return superagent.get(`https://dog.ceo/api/breed/${breed}/images/random`)
}

const getDogPic = async () => {
    try {
        const breed = await readFilePromise('./dog.txt')

        const img1 = getRandomDogImage(breed)
        const img2 = getRandomDogImage(breed)
        const img3 = getRandomDogImage(breed)

        const all = await Promise.all([img1, img2, img3])
        const images = all.map(el => el.body.message)

        console.log(images)

        await writeFilePromise('dog-image.txt', images.join('\n'))
    } catch (err) {
        console.log(err)
        throw(err)
    }

    return 'READY 🐶'
}

(async () => {
    try {
        console.log('1: Will get dog pics!')
        const result = await getDogPic()
        console.log(result)
        console.log('2: Done getting dog pics!')
    } catch (err) {
        console.log("ERROR 💥")
    }
})()
