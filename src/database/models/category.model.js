const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CategorySchema = new Schema({
    title: {
        type: String,
        required: [true, 'Title is required.']
    },
    product: [{
        type: Schema.Types.ObjectId,
        ref: 'product',
        required: false
    }],
    imagePath: {
        type: String,
        default: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAATSSURBVHhe7d1ZyG1zGMfxFzkiRUeGkwiRITKFlAwRIVPIyZVMceWCkCHzlOFCSFyRKCJELihKxoQSiSjDlTkZItP3V95arX577/9a67/fvU7P863P5Vm78+zznneN/7W0DnU83sA/+LfQx7gAGyCr2K1wAy/1HFYhq9CFcEPu6gFkA9sE38ENuKu/sSeyAZ0EN9y+rkU2oEvgBtvX48gGdAvcYPvSL/dsQDfDDbav/EIGdhbcYPu6F9mAdOzwDNxwu3of2yKr0GrsNMAaZFmWZTF7DD8M8Amyir0Nt+dU6i/kKfiKfQU36C62QVah9fEn3JC72B9ZhbaGG3BXuuKYVWhfuAF3dS6yCh0LN+CurkFWobPhBtzV/cgqdBXcgLt6GlmF7oEbcFc6lskq9BTcgLvSsUxWobfgBtyVjmXWQzawL+AG3IeOabKB/QE33D50TJMNaEu4wfalY5psQHvBDbYvHdNkA7oJbrB9vYC86bpnN8ANdSgdIOaX0rEb4YZZS34pHar1+MEsjyCPS2Z0InS51Q1wHvSTmE1oV/wMN7h50eNxJyBrpQdzPoAb2rzprpQdkTW6C25YK+UV5O+T/zsAK/l7Y5LzED79q3wXbkArTf916abu0J0MN5xFuR5h00/HO3CDWZQfsTlCdgjcUBbtIoTsTriBLNrLCNnncANZNO3x6TpMqLaHG8ZYnIJQHQ03iLG4HKE6A24QY3E7QnUm3CDGItwXojOsbhBjoSU9QlXrjvZ5Cfc7pNZBoU7ZP4sH8STeRI0TlRcjVHvDDaLEb7gNu8CluxN1tP0t3J8vEe52IT2A6QYxiw4mS1eF2wqvwW1nFl1KDtWGcIOY5nvsjC5thvfgtjfNQQjXddBqo6WORJ90rd5tbxr9dGVZlmXj7TBcVuA41EgrObjtt61FyC6F28Npq3WQpi/Wbb/tCYSsdIHLQ1Ejrbfott92N0JWek2k5tW7kqP3KxGyfeAG0vQLaqY7FN3nNIV9yqrkMu6XqJmeC3Gf0xT25mvd/+QG0vQhavYw3Oc0HYOQbQw3kCadTq+ZVrZ2n9OkSwNhcwNpehE1K1ncP/Sz7LMe0Km9eP4VcJ/TtAfC9hPcUJa9hJqV/ITsjrDp6p8byjItPFOz++A+p0mLFYTNDaTpI9RMT966z2nKL2SK2mtclbz64kCEbCO4gTTpv7SavQr3OU1hd3tLV/qp+RKWWTsREnbFIN2w4AbS1vdaersd4LbfFvZ6yH5wA2nTsUONdGuP237b+QiZ7s3SX36Ww1Ej7T257beF3svKsixbR9LbCvRu2lJ99360dIfb3iThng1ZTo8PuL2cSXQ5t+tLWXSs8xnc9iYJuwL263ADmUbvVtf9XCXpcQVdcXTbmUbrBIfsU7iBzKIX1T8EfTF6HVI7Pa6gG6ZnnUmeJuQiNL/CDaOLb6C3HjwPPQtS4+VhshtCpRXk3CDG4giEqvQ81qKcjlDVXkK8tnMQqoPhBjEWWjs4VNpDcoMYi3DPqeslj24QY3E1QnUq3CDGItzpk7EvPqPV7kKly7JuEGOhR9tCtSl+hxvGGIS8FWjRy4tPood6QqbTJ33XIpmXr7EdwqZnRO7AkDOzNWhJp0exBhnpp0V3DJ4GnUdaSUdhC4ygpaX/AOxY9xELtQsMAAAAAElFTkSuQmCC',
        required: false
    }
}, { versionKey: false });

const Category = mongoose.model('Category', CategorySchema);

module.exports = Category;