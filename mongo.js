const mongoose = require('mongoose')

if (process.argv.length < 3)
{
    console.log('Please provide the password as an argument: node mongo.js <password>')
    process.exit(1)
}

const password = process.argv[2]

const url = 
    `mongodb+srv://fullstack:${password}@phonebook.a3opn.mongodb.net/phonebook?retryWrites=true&w=majority`

mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
     useCreateIndex: true
})

const phoneSchema = new mongoose.Schema({
    name: String,
    number: String,
    date: Date
  })

const Phone = mongoose.model('Phone', phoneSchema)

if(process.argv.length == 3)
{
    Phone.find({}).then(result => {
        console.log('phonebook:')
        result.forEach(phone => {
          console.log(`${phone.name} ${phone.number}`)
        })
        mongoose.connection.close()
    })
}
else if(process.argv.length == 5)
{
    const name = process.argv[3]
    const number = process.argv[4]

    const phone = new Phone({
        name: name,
        number: number,
        date: new Date(),
    })
    
    phone.save().then(result => {
        console.log('phone saved!')
        mongoose.connection.close()
    })
}