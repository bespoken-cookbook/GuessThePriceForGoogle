const PRODUCT_LIST = [
    {
        name: "Amazon Echo Dot",
        price: 50,
        description: "A hands free, voice controlled voice that uses the Alexa voice assistant to play music, control smart home devices, makes calls, read the news, set timers, check the weather and much more.",
        image: "https://images-na.ssl-images-amazon.com/images/I/61RcYX5Ac4L._SL1000_.jpg"
    },
    {
        name: "Fitbit Charge 2 HR",
        price: 149,
        description: "A wristband worn health tracker and heart rate monitor, Fitbit Charge 2 HR helps you maximize your workout, better track calorie burn, get a snapshot of your cardio fitness and track  your sleep.",
        image: "https://images-na.ssl-images-amazon.com/images/I/51NC9OeIr7L._SL1080_.jpg"
    },
    {
        name: "Hill’s Science Diet Large Breed Dog Food 35 pound bag",
        price: 48,
        description: "Hill’s Science Diet 35 pound bag is for adult dogs weighing more than 55 pounds. It is a premium dry dog food that provides natural sources of glucosamine and chondroitin to support joint health and mobility. It also has both high quality protein and omega-6 fatty acids.",
        image: "https://images-na.ssl-images-amazon.com/images/I/71uZW8r20rL._SX522_.jpg"
    },
    {
        name: "DC Comics Pez Dispensers, 12-pack",
        price: 20,
        description: "Pez candy is a favorite among children because of the colorful dispensers. This 12-pack of dispensers includes DC comic characters including Batman, Flash, Green Lantern, Wonder Woman and Superman. It comes with two candy refill packs per dispenser.",
        image: "https://images-na.ssl-images-amazon.com/images/I/A1qxNKjnNcL._SX522_.jpg"
    },
    {
        name: "Glade Air Freshener",
        price: 1,
        description: "One clean linen scented air freshener with adjustable fragrance level from Glade.",
        image: "https://images-na.ssl-images-amazon.com/images/I/81N4FfZJrKL._SL1500_.jpg"
    },
    {
        name: "6-pack of half liter Smart Water",
        price: 5,
        description: "Pack of six half liter, vapor-distilled bottled water from Smart Water. ",
        image: "https://images-na.ssl-images-amazon.com/images/I/91SDeib1OLL._SL1500_.jpg"
    },
    {
        name: "2017 Toyota Tundra Pickup Truck",
        price: 33530,
        description: "This base model 2017 Toyota Tundra gets 18 miles per gallon on the highway has automatic transmission, 381 horsepower, is rear-wheel drive and seats 6 passenger.",
        image: "https://images-na.ssl-images-amazon.com/images/I/71rEtEspItL._UY560_.jpg"
    },
    {
        name: "Ugg Women’s Classic Short 2 Winter Boot",
        price: 160,
        description: "These sheep skin and suede boots have rubber soles, are pretreated to repel moisture and stains and are fully lined with fur. They also carry the famous Ugg brand name.",
        image: "https://images-na.ssl-images-amazon.com/images/I/912aO1fBnUL._UY695_.jpg"
    },
    {
        name: "Marmot 4 Person Limestone Model Tent",
        price: 300,
        description: "Spacious enough to sleep the whole family comfortably, the waterproof fly and floor keep the rain and water out and the zone construction creates a roomier sleeping area.",
        image: "https://images-na.ssl-images-amazon.com/images/I/61rRmlINmyL._SL1500_.jpg"
    },
    {
        name: "Pottery Barn Basic Slip Cover Sofa 82 inches",
        price: 1899,
        description: "The Pottery Barn collection is crafted with the same quality and care as American furniture going back hundreds of years. Choose polyester blend or down-blend cushions and a full 82 inches to seat four comfortably. ",
        image: "https://www.potterybarn.com/pbimgs/rk/images/dp/wcm/201732/0047/img20c.jpg"
    }
];

const getProductList = function() {
    return PRODUCT_LIST;
};

const getProduct = function () {

    // For testing purposes, set the product to guess to Fitbit if the UNIT_TEST environment variable is set
    if (process.env.UNIT_TEST) {
        return getProductList()[1]
    }
    else {
        const productList = getProductList();
        const randIndex = Math.floor(Math.random() * productList.length);
        return productList[randIndex];
    }

};

module.exports = {
    getProduct: getProduct,
};
