window.onload = function () {
    document.body.addEventListener("keydown", arrowControls);

    let game = true;
    let level = 1;
    let score = 0;

    // načtení kanvasu a vytvoření kontextu
    let playingArea = document.getElementById("playingArea");
    let context = playingArea.getContext("2d");

    // kulička
    let ball = {
        x: playingArea.width / 2,
        y: playingArea.height / 2,
        radius: 50,
        color: "#ABB2B9",
        moveX: 0,
        moveY: 0,
        move: 1
    }

    // jídlo
    let food = {
        x: generateRandomPositionX(),
        y: generateRandomPositionY(),
        radius: 50,
        color: "#2ECC71",
        time: 0
    }

    // jed
    let poisen = {
        x: generateRandomPositionX(),
        y: generateRandomPositionY(),
        radius: 5,
        color: "#A93226",
        time: 0
    }

    // překreslení hrací plochy a hlavní cyklus
    function redraw() {
        if (ball.radius <= 1)
            game = false;
        if (game) {

            context.clearRect(0, 0, playingArea.width, playingArea.height);
            context.fillStyle = "#E9F7EF";
            context.fillRect(0, 0, playingArea.width, playingArea.height);
            context.save();

            generatePoisen();
            generateFood();

            moveBall();
            context.beginPath();
            context.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
            context.fillStyle = ball.color;
            context.fill();
            context.closePath();


            eating();
            changeRadius();
        }
        else {
            document.getElementById("end").textContent = "Konec hry"
        }
    };


    //ovládání šipkama
    function arrowControls(event) {
        if (event.key === "ArrowLeft") {
            ball.moveX = - ball.move;
        }
        if (event.key === "ArrowRight") {
            ball.moveX = + ball.move;
        }
        if (event.key === "ArrowUp") {
            ball.moveY = - ball.move;
        }
        if (event.key === "ArrowDown") {
            ball.moveY = + ball.move;
        }
        moveBall();
    }

    //pohyb kuličky
    function moveBall() {
        if ((ball.x - ball.radius < 0) || (ball.x + ball.radius > playingArea.width)) {
            game = false;
        }
        if ((ball.y - ball.radius < 0) || (ball.y + ball.radius > playingArea.height)) {
            game = false;
        }
        else {
            ball.x = ball.x + ball.moveX;
            ball.y = ball.y + ball.moveY;
        }

    }

    //změna velikosti objektů
    function changeRadius() {
        if (ball.radius > 1)
            ball.radius = ball.radius - 0.05;
        if (poisen.radius < 500)
            poisen.radius = poisen.radius + 0.02;
        if (food.radius > 2)
            food.radius = food.radius - 0.01;
    }

    //snězení jídla nebo jedu kuličkou
    function eating() {
        if ((ball.x - ball.radius / 1.5 < food.x + food.radius) && (food.x - food.radius < ball.x + ball.radius / 1.5)
            && (ball.y - ball.radius / 1.5 < food.y + food.radius) && (food.y - food.radius < ball.y + ball.radius / 1.5)) {
            food.x = generateRandomPositionX();
            food.y = generateRandomPositionY();
            if (ball.radius > 85 && ball.radius < 100) {
                ball.radius = 100;
            }
            else { ball.radius = ball.radius + 15 };
            food.time = 0;

            // přepočet skore po snězení
            score++;
            document.getElementById("skore").textContent = "score: " + score;
        }
        if ((ball.x - ball.radius / 1.5 < poisen.x + poisen.radius) && (poisen.x - poisen.radius < ball.x + ball.radius / 1.5)
            && (ball.y - ball.radius / 1.5 < poisen.y + poisen.radius) && (poisen.y - poisen.radius < ball.y + ball.radius / 1.5)) {
            poisen.x = generateRandomPositionX();
            poisen.y = generateRandomPositionY();
            if (ball.radius < 15) {
                ball.radius = 1;
            }
            else { ball.radius = ball.radius - 15 };
            poisen.time = 0;
        }
        if (poisen.time > 1000) {
            poisen.x = generateRandomPositionX();
            poisen.y = generateRandomPositionY();
            poisen.time = 0;
        }
        if (food.time > 500) {
            food.x = generateRandomPositionX();
            food.y = generateRandomPositionY();
            food.time = 0;
        }
    }

    //generování nového jídla
    function generateFood() {
        context.beginPath();
        context.arc(food.x, food.y, food.radius, 0, Math.PI * 2);
        context.fillStyle = food.color;
        context.fill();
        context.closePath();
        food.time++;
    }

    //generování jedu
    function generatePoisen() {
        context.beginPath();
        context.arc(poisen.x, poisen.y, poisen.radius, 0, Math.PI * 2);
        context.fillStyle = poisen.color;
        context.fill();
        context.closePath();
        poisen.time++;
    }

    //generování pozice v ose X
    function generateRandomPositionX() {
        return Math.floor(Math.random() * (playingArea.width - 100)) + 50;
    }

    //generování pozice v ose y
    function generateRandomPositionY() {
        return Math.floor(Math.random() * (playingArea.height - 100)) + 50;
    }5

    //změna levelu
    function changeLevel() {
        if (game) {
            level++;
            document.getElementById("level").textContent = "level: " + level;
            ball.move = ball.move + 0.2;
        }


    }

    //hlavní interval pro překlesení hrací plochy
    setInterval(redraw, 1000 / 60);
    //interval pro změnu levelu
    setInterval(changeLevel, 10000);
};