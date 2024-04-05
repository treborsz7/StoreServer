const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()

const mongoose = require('mongoose')
require('dotenv').config()

const url = process.env.MONGODB_URI

console.log('connecting to', url)


// `mongodb+srv://webUser:${password}@gunstore.yvqjcpo.mongodb.net/?retryWrites=true&w=majority`;
const connect = () => {


    mongoose.connect(url)

        .then(result => {
            console.log('connected to MongoDB')
        })
        .catch((error) => {
            console.log('error connecting to MongoDB:', error.message)
        })
}


connect();
//const SectionsDBA = require('./models/Sections')

const PORT = process.env.PORT

const sectionSchema = new mongoose.Schema({

    description: String,
    position: Number,
    enabled: Boolean,
    tipe: String,
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'products'
    }],

})

const productSchema = new mongoose.Schema({
    description: String,
    image: String,
    enabled: Boolean,
    tipe: String,
    price: Number,
    sections: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'sections'
    }],
})


const SectionsDBA = mongoose.model('sections', sectionSchema)
const ProductsBA = mongoose.model('products', productSchema)

app.use(cors())
app.use(express.json())
const requestLogger = (request, response, next) => {

    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next()
}

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}
app.use(requestLogger)



app.get('/api/sections', (request, response) => {


    Sections = [];
    // populate('products')
    SectionsDBA.find({}).then(result => {

        console.log("result:", result)
        result.forEach(section => {
            //console.log(section)
            //// console.log("section:", section)
            Sections.push(section)
        })

        response.json(Sections)
        //console.log("product & sections result:", Sections)
        //mongoose.connection.close()
    }).catch((error) => {
        console.log('error connecting to MongoDB:', error.message)
    })


})

app.get('/api/sections/products', (request, response) => {

    console.log("/api/sections/products")
    Sections = [];
    // populate('products')
    SectionsDBA.find({}).then(result => {

        //Sections = result;

        result.forEach(async (section) => {
            let produc = []

            section.products = await ProductsBA.find({ sections: section._id }).exec();

            console.log(section)

            Sections.push(section)
        })

        response.json(Sections)

        //mongoose.connection.close()
    }).catch((error) => {
        console.log('error connecting to MongoDB:', error.message)
    })

})

app.get('/api/sections/:id', (request, response) => {
    const id = request.params.id
    const section = Sections.find(section => section.id == id)

    if (section) {
        response.json(section)
        response.status(200).end()
    } else {
        response.status(404).end()
    }
})

app.delete('/api/sections/:id', (request, response) => {


    SectionsDBA.findByIdAndDelete(request.params.id)
        .then(result => {
            response.status(204).end()
            // mongoose.connection.close()
        })
        .catch(error => next(error))

})

app.post('/api/sections', (request, response) => {


    const body = request.body
    console.log(body)
    if (!body) {
        console.log("no body")
        return response.status(400).json({
            error: 'content missing'
        })
    }


    const section = new SectionsDBA({
        description: body.description,
        position: 0,
        enabled: body.enabled,
        tipe: "items",
        products: []
    })

    section.save().then(result => {
        console.log('section saved!')

        // mongoose.connection.close()
        //response.json(result)
        console.log(section)
        response.status(200).end()
        //mongoose.connection.close()
    }).catch((error) => {
        console.log('error connecting to MongoDB:', error.message)
    })



})

const generateId = () => {
    const maxId = Sections.length > 0
        ? Math.max(...Sections.map(n => n.id))
        : 0
    return maxId + 1
}

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})


app.post('/api/products', (request, response) => {


    const body = request.body
    console.log(body)
    if (!body) {
        console.log("no body")
        return response.status(400).json({
            error: 'content missing'
        })
    }


    const product = new ProductsBA({
        description: body.description,
        image: "",
        price: body.price,
        enabled: body.enabled,
        tipe: "items",
        sections: body.sections,
    })

    product.save().then(result => {

        response.status(200).end()

        //mongoose.connection.close()
    }).catch((error) => {
        console.log('error connecting to MongoDB:', error.message)
    })



})


app.put('/api/products/:id', (request, response) => {

    console.log("update", request.params.id)
    const body = request.body
    console.log(body)
    if (!body) {
        console.log("no body")
        return response.status(400).json({
            error: 'content missing'
        })
    }

    const product = {
        description: body.description,
        image: "",
        enabled: body.enabled,
        tipe: "items",
        sections: body.sections,
    }

    console.log("new prod", product)
    ProductsBA.findByIdAndUpdate(request.params.id, product, { new: true })
        .then(result => {


            console.log("prod", result)
            response.json(result)
            response.status(200).end()
            // mongoose.connection.close()
        })
        .catch(error => next(error))

})

app.get('/api/products', (request, response) => {



    // .populate('sections')
    ProductsBA.find({}).populate('sections').then(result => {
        //console.log("result:", result)
        response.json(result);

    }).catch((error) => {
        console.log('error connecting to MongoDB:', error.message)
    })


})



app.delete('/api/products/:id', (request, response) => {

    console.log("delete", request.params.id)


    ProductsBA.findByIdAndDelete(request.params.id)
        .then(result => {
            // ProductsBA.find({}).populate('sections').then(result => {
            //     console.log("result:", result)
            //     result.forEach(note => {
            //         console.log(note)
            //         console.log("note:", note)
            //         Sections.push(note)
            //     })

            //     response.json(Sections).end()
            response.status(200).end()
            // mongoose.connection.close()
        })
        .catch((error) => {
            console.log('error connecting to MongoDB:', error.message)
        })

})
//})


app.post('/api/files/', (request, response) => {


    console.log(request)
    return response.status(200).send(request.file)

})