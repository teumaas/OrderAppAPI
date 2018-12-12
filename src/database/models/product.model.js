const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name is required.']
    },
    brand: {
        type: String,
        required: [true, 'Brand is required.']
    },
    description: {
        type: String,
        required: [true, 'Description is required.']
    },
    imagePath: {
        type: String,
        default: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAO0SURBVHhe7d1bqI1bFMDx7Z4S7dwiuYcHyoMil46QQkmhzvGiJFKSKCFKyKXUSbk9KSLlQcpdeaF4OZ14keLt1Cm5lXIJG//xsGu2GptVtOaYY8x//V71jTmzzvKd+X2rrVar1Wq1ghqN2/iEbwZ14CH+gPt64Qm0hbDmHUbBdXOgDW/VNrhuM9KB3+O1IW+RXt8FuO4M0oHXwFKTkV6ffLy67j7SgWfBUn3wBZ3XJ188esJtz5FuSDus9RTpNY6By/ojHfQlLHYd6XUugMumIh30X1jsFNLrXA+XLUc66CVYbDvS6zwMlzV+5f0bFvsT6XW6/ep7COmg+zHWoBVIr/MOXHYa6aCleAyX3YA2sHUv4LJ/oA1cgt5w1//Qhi3BCLjrM7RhSzANrmr8V3pp5sNVw6ANWoqlcNV4aIOWYhVcNQXaoKVwdz+r9A3ZAFfVDTFW3RBj1Q0x1kRog5bC3beskdAGLYW7DRkIbdBSLIaruuMrtGFLMB3uegVt2BJMgLvk/7xpw5ZgANx1E9qw1r2ByxrPO5VCnhVx2Q5oA1t3GS6T7/LawNYdhctmQhvYui1w2XBoA1u3DG6Tbyza0JbJfTi33YM2tFXyyF0PuO0ktMGtsvrIxG9rI7TBrToL18nD+NrgVrl/LHowtMGtcnfbXes/aMNbJAf83Ce3IrThrZHD4SHaDW0BrLmKEC2BtgDW7EWISjl47fqWSWMlPLwjJ2XCJJ/P2iJY4fa5wq6Sz2dtIay4hVDJ57O2EFYcRKisn2RciXBZPqc1DuG6C20xcvsAOWkZLqvHgh4hZJugLUhu7l982VULoS1IbnsQMqsP8Vh7U2rLkgPM2oLktghhk1Md2qLkJO+GDFvjK1ktGIKwPYC2KLnIG4u6IWzW7vqGu8vb2DloC5PLM4TuOLSFyUVeQxi6A9AWJhe3r4Rttsa3SOdm9W3bLcva/azzCJ281EVbmFzkS0bo1kJbmFxOIHTWHgQNvyF/QVuYXI4gdNaOlYY7bdKYtQ3Zh9DNhbYwuci/i0I3G9rC5BJ+QwZBDqV1Rf6jfwzpbwt2RX6fZDW0P6dZk1BrItkUbRM6ydEd18+TW2sdtI3oFP6WRyvri5+dcpQfqXT/U9utSD6zL/6A3H1t9qld+aXna9D+nGaFempKq37LMlbdEGPVDTFW3RBj1Q0xlrX3MG5F6NrxEdri5DAP4dsFbXFa7QpqJPegdiLX35QOyC9Zu3y/+6/UDzOwoIXmYChqtVqtViu8trbv2l0bIEZGc4IAAAAASUVORK5CYII=',
        required: false
    },
    alcoholPercentage: {
        type: Number,
        required: false
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'category',
        required: false
    },
    price: {
        type: Number,
        required: [true, 'Price is required.']
    }
}, { versionKey: false });

const Product = mongoose.model('Product', ProductSchema);

module.exports = Product;