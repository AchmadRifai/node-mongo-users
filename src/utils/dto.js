const mongo = require('mongodb')

const toModel = dto => {
    const model = { ...dto }
    if (model.id) {
        model._id = new mongo.ObjectId(model.id)
        delete model.id
    }
    return model
}

const toDto = (model) => {
    const dto = { ...model }
    if (dto._id) {
        dto.id = dto._id.toString()
        delete dto._id
    }
    delete dto.password
    return dto
}

module.exports = { toDto, toModel }