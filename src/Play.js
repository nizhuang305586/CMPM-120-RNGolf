class Play extends Phaser.Scene {
    constructor() {
        super('playScene')
    }

    init() {
        this.SHOT_VELOCITY_X = 400
        this.SHOT_VELOCITY_Y_MIN = 700
        this.SHOT_VELOCITY_Y_MAX = 1100

        // score tracking
        this.shots = 0
        this.made = 0
    }

    preload() {
        this.load.path = './assets/img/'
        this.load.image('grass', 'grass.jpg')
        this.load.image('cup', 'cup.jpg')
        this.load.image('ball', 'ball.png')
        this.load.image('wall', 'wall.png')
        this.load.image('oneway', 'one_way_wall.png')
    }

    create() {
        this.grass = this.add.image(0, 0, 'grass').setOrigin(0)

        this.cup = this.physics.add.sprite(width / 2, height / 10, "cup")
        this.cup.body.setCircle(this.cup.width / 4)
        this.cup.body.setOffset(this.cup.width / 4)
        this.cup.body.setImmovable(true)

        // ball
        this.ball = this.physics.add.sprite(width / 2, height - height / 10, "ball")
        this.ball.body.setCircle(this.ball.width / 2)
        this.ball.setCollideWorldBounds(true)
        this.ball.setBounce(0.5)
        this.ball.setDamping(true).setDrag(0.5)

        // walls
        let wallA = this.physics.add.sprite(
            Phaser.Math.Between(50, width - 50),
            height / 4,
            "wall"
        )
        wallA.body.setImmovable(true)

        let wallB = this.physics.add.sprite(
            Phaser.Math.Between(50, width - 50),
            height / 2,
            "wall"
        )
        wallB.body.setImmovable(true)

        // moving wall (FEATURE)
        wallB.body.setVelocityX(150)
        wallB.body.setCollideWorldBounds(true)
        wallB.body.setBounce(1, 0)

        this.walls = [wallA, wallB]

        // one-way wall
        this.oneWay = this.physics.add.sprite(
            Phaser.Math.Between(50, width - 50),
            height * 0.75,
            "oneway"
        )
        this.oneWay.body.setImmovable(true)
        this.oneWay.body.checkCollision.down = false

        // UI text (FEATURE)
        this.uiText = this.add.text(10, 10, '', {
            fontSize: '18px',
            fill: '#fff'
        })

        // pointer shot logic (FEATURE)
        this.input.on("pointerdown", (pointer) => {
            let dx = pointer.x - this.ball.x
            let dy = pointer.y <= this.ball.y ? 1 : -1

            this.ball.body.setVelocityX(
                Phaser.Math.Clamp(dx * 3, -this.SHOT_VELOCITY_X, this.SHOT_VELOCITY_X)
            )

            this.ball.body.setVelocityY(
                Phaser.Math.Between(this.SHOT_VELOCITY_Y_MIN, this.SHOT_VELOCITY_Y_MAX) * dy
            )

            this.shots++
        })

        // ball hits cup (FEATURE)
        this.physics.add.collider(this.ball, this.cup, () => {
            this.made++
            this.resetBall()
        })

        this.physics.add.collider(this.ball, this.walls)
        this.physics.add.collider(this.ball, this.oneWay)
    }

    update() {
        // update UI
        let pct = this.shots > 0 ? Math.round((this.made / this.shots) * 100) : 0
        this.uiText.text = `Shots: ${this.shots}\nMade: ${this.made}\nSuccess: ${pct}%`
    }

    // ball reset logic (FEATURE)
    resetBall() {
        this.ball.setVelocity(0)
        this.ball.setPosition(width / 2, height - height / 10)
    }
}
