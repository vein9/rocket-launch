const canvas = document.getElementById('canvas1')
const ctx = canvas.getContext('2d')
canvas.width = window.innerWidth
canvas.height = window.innerHeight
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
})
let hue = 0
let sat = 100
let light = 50
let color = 'white'
let waveLength = 4
let initTime = new Date()
let time = 0
let minFireSize = 4
let maxFireSize = 8
let maxSpeed = -20
const mouseInput = {
    x: undefined,
    y: undefined
}

class Fire {
    constructor(x, y, color, minSize, maxSize) {
        this.x = x
        this.y = y
        this.minSize = minSize
        this.maxSize = maxSize

        this.minSpeed = -1.5
        this.maxSpeed = 1.5
        this.size = Math.random() * this.maxSize + this.minSize
        this.speed = {
            x: Math.random() * this.maxSpeed * 2 + this.minSpeed,
            y: Math.random() * this.maxSpeed * 6 + this.minSpeed
        }
        this.color = color
    }

    update() {
        this.x += this.speed.x
        this.y += this.speed.y
        if (this.size > 0.2) this.size -= 0.1
        // this.color = hue
    }

    draw() {
        // ctx.fillStyle = 'hsl(' + this.color + ',100%, 50%)'
        ctx.fillStyle = this.color
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fill()
    }
}


class Rocket {
    constructor(x, y) {
        this.x = x
        this.y = y
        this.width = 100
        this.height = 200
        this.image = new Image()
        this.image.src = 'rocket.png'
        this.speed = 0
        this.leftPoint = { x: this.x + 25, y: this.y + 207 }
        this.middlePoint = { x: this.x + 50, y: this.y + 190 }
        this.rightPoint = { x: this.x + 70, y: this.y + 207 }
        this.burnTime = 2
        this.heatTime = 3
        this.startTime = 1
        // start after 6
    }

    draw() {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height)
    }
    update() {
        this.leftPoint = { x: this.x + 25, y: this.y + 197 }
        this.middlePoint = { x: this.x + 50, y: this.y + 182 }
        this.rightPoint = { x: this.x + 70, y: this.y + 197 }
        this.y += this.speed
    }



}

// draw(100, 100)
let fireList = []
window.addEventListener('click', event => {
    console.log('click')
    mouseInput.x = event.x
    mouseInput.y = event.y
    console.log(mouseInput)
    // console.log(mouseInput.x, mouseInput.y)
    // draw(mouseInput.x, mouseInput.y)
    for (let i = 0; i < waveLength; i++) {
        fireList.push(new Fire(mouseInput.x, mouseInput.y, hue))
    }
    // console.log(fireList.length)

})

window.addEventListener('mousemove', event => {
    mouseInput.x = event.x
    mouseInput.y = event.y

    // for (let i = 0; i < waveLength; i++) {
    //     fireList.push(new Fire(mouseInput.x, mouseInput.y))
    // }
    // console.log(fireList.length)
})
let rocket = new Rocket(canvas.width / 2 - 50, canvas.height - 250)


function animate() {
    // console.log("fire lenght: " + fireList.length)

    let percent = fireList.length / 6000
    if (percent > 1) percent = 1

    // console.log("P: " + percent)



    if (time < rocket.heatTime) {
        minFireSize = 2
        maxFireSize = 4


        if (light > 55) light = 30
        hue = 0
        sat = 0
        color = 'hsl(' + hue + ',' + sat + '%,' + light + '%)'

        for (let i = 0; i < 4; i++) {
            fireList.push(new Fire(rocket.middlePoint.x, rocket.middlePoint.y, color, minFireSize, maxFireSize))
            fireList.push(new Fire(rocket.leftPoint.x, rocket.leftPoint.y, color, minFireSize, maxFireSize))
            fireList.push(new Fire(rocket.rightPoint.x, rocket.rightPoint.y, color, minFireSize, maxFireSize))
        }
    }

    if (time >= rocket.heatTime && time < rocket.heatTime + rocket.burnTime) {
        minFireSize = 4
        maxFireSize = 8
        if (hue > 30) hue = 0
        sat = 100
        light = 50
        color = 'hsl(' + hue + ',' + sat + '%,' + light + '%)'
        fireList.push(new Fire(rocket.middlePoint.x, rocket.middlePoint.y, color, minFireSize, maxFireSize))
        fireList.push(new Fire(rocket.leftPoint.x, rocket.leftPoint.y, color, minFireSize, maxFireSize))
        fireList.push(new Fire(rocket.rightPoint.x, rocket.rightPoint.y, color, minFireSize, maxFireSize))
    }

    if (time >= rocket.heatTime + rocket.burnTime && time < rocket.heatTime + rocket.burnTime + rocket.startTime) {
        minFireSize = 16
        maxFireSize = 32
        rocket.speed = maxSpeed * percent
        rocket.update()

        if (light > 55) light = 30
        hue = 0
        sat = 0
        color = 'hsl(' + hue + ',' + sat + '%,' + light + '%)'

        for (let i = 0; i < 25; i++) {
            fireList.push(new Fire(rocket.middlePoint.x, rocket.middlePoint.y, color, minFireSize, maxFireSize))
            fireList.push(new Fire(rocket.leftPoint.x, rocket.leftPoint.y, color, minFireSize, maxFireSize))
            fireList.push(new Fire(rocket.rightPoint.x, rocket.rightPoint.y, color, minFireSize, maxFireSize))
        }
    }

    if (time >= rocket.heatTime + rocket.burnTime + rocket.startTime) {
        minFireSize = 8
        maxFireSize = 16
        rocket.speed = maxSpeed * percent
        rocket.update()

        if (hue < 52) hue = 52
        if (hue > 70) hue = 52
        sat = 100
        light = 50
        color = 'hsl(' + hue + ',' + sat + '%,' + light + '%)'

        for (let i = 0; i < 8; i++) {
            fireList.push(new Fire(rocket.middlePoint.x, rocket.middlePoint.y, color, minFireSize, maxFireSize))
            fireList.push(new Fire(rocket.leftPoint.x, rocket.leftPoint.y, color, minFireSize, maxFireSize))
            fireList.push(new Fire(rocket.rightPoint.x, rocket.rightPoint.y, color, minFireSize, maxFireSize))
        }
    }

    for (let i = 0; i < fireList.length; i++) {
        fireList[i].update()
        fireList[i].draw()
        // for (let j = i + 1; j < fireList.length; j++) {
        //     const dx = fireList[i].x - fireList[j].x
        //     const dy = fireList[i].y - fireList[j].y
        //     const distance = Math.sqrt(dx * dx + dy * dy)
        //     if (distance < 100) {
        //         ctx.beginPath()
        //         ctx.strokeStyle = 'hsl(' + fireList[i].color + ',100%, 50%)'
        //         ctx.lineWidth = fireList[i].size / 10
        //         ctx.moveTo(fireList[i].x, fireList[i].y)
        //         ctx.lineTo(fireList[j].x, fireList[j].y)
        //         ctx.stroke()
        //     }
        // }
        if (fireList[i].size <= 0.3) {
            fireList.splice(i, 1)
            i--
        }
    }


    rocket.draw()

    time = new Date().getSeconds() - initTime.getSeconds()
    // console.log(time)
}

function update() {
    // ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    animate()
    hue += 1
    sat += 1
    light += 1
    requestAnimationFrame(update)
}

update()