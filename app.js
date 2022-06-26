/*
    - I use traditional for loop syntax for performance reasons
    - The are some foreachs for readability
    - I used to use "For OF" but I found out that those are the slowest for loops
*/


const carCanvas = document.getElementById("carCanvas")
carCanvas.width = 200

const networkCanvas = document.getElementById("networkCanvas")
networkCanvas.width = 300

const carCtx = carCanvas.getContext("2d")
const networkCtx = networkCanvas.getContext("2d")

const road = new Road(carCanvas.width/2, carCanvas.width*.9)
const N = 1000
const cars = generateCars(N)
let bestCar = cars[0]
if (localStorage.getItem("bestBrain")) {
    for (let i in cars) {
        const bestBrain = JSON.parse(localStorage.getItem("bestBrain"))
        cars[i].brain=bestBrain
        if (i!=0) {
            NeuralNetwork.mutate(cars[i].brain,.3)
        }
    }
}
const traffic = [
    new Car(road.getLaneCenter(1),-100,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(0),-300,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(2),-300,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(1),-500,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(0),-500,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(2),-700,30,50,"DUMMY",2),
]

animate()

function save() {
    localStorage.setItem("bestBrain", JSON.stringify(bestCar.brain))
}

function discard() {
    localStorage.removeItem("bestBrain")
}

function generateCars(N) {
    const cars = []
    for(let i=1;i<=N;i++) {
        cars.push(new Car(road.getLaneCenter(1),100,30,50,"AI"))
    }
    return cars
}

function animate() {
    traffic.forEach(tr => tr.update(road.borders, []))
    cars.forEach(car => car.update(road.borders, traffic))

    //Fit function: performance heavy
    maxY = cars.filter(
        c=>c.y==Math.min(
            ...cars.map(c=>c.y)
        )
    )
    bestCar = maxY.find(c => c.x ==Math.max(...maxY.map(c=>c.x)))

    carCanvas.height = window.innerHeight
    networkCanvas.height = window.innerHeight
    carCtx.save()
    carCtx.translate(0, -bestCar.y+carCanvas.height*.5)
    road.draw(carCtx)
    traffic.forEach(tr => tr.draw(carCtx,"orange"))
    carCtx.globalAlpha=0.2
    cars.forEach(car => car.draw(carCtx, "blue"))
    carCtx.globalAlpha=1
    bestCar.draw(carCtx,"blue",true)
    carCtx.restore()
    // Visualizer.drawNetwork(networkCtx,bestCar.brain)
    requestAnimationFrame(animate)
}