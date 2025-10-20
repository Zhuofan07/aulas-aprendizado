document.addEventListener("DOMContentLoaded", () => {
            const gameBoard = document.getElementById("gameBoard");
            const movesDisplay = document.getElementById("moves");
            const timerDisplay = document.getElementById("timer");
            const pairsDisplay = document.getElementById("pairs");
            const restartBtn = document.getElementById("restartBtn");
            const hintBtn = document.getElementById("hintBtn");
            const message = document.getElementById("message");
            const messageText = document.getElementById("messageText");
            const closeMessage = document.getElementById("closeMessage");

            let cards = [];
            let flippedCards = [];
            let moves = 0;
            let matchedPairs = 0;
            let timer = 0;
            let timerInterval;
            let canFlip = true;
            let hints = 3;

            const emojis = ["😒", "☠️", "👽", "🖕", "👀", "🫦", "👌", "💩"];

            // Inicializar o jogo
            function initGame() {
                gameBoard.innerHTML = "";
                cards = [];
                flippedCards = [];
                moves = 0;
                matchedPairs = 0;
                timer = 0;
                hints = 3;
                canFlip = true;

                movesDisplay.textContent = moves;
                pairsDisplay.textContent = `${matchedPairs}/${emojis.length}`;
                timerDisplay.textContent = `${timer}s`;
                hintBtn.textContent = `Dica (${hints})`;

                clearInterval(timerInterval);
                timerInterval = setInterval(updateTimer, 1000);

                // Duplicar e embaralhar os emojis
                const gameCards = [...emojis, ...emojis];
                shuffleArray(gameCards);

                // Criar as cartas
                gameCards.forEach((emoji, index) => {
                    const card = document.createElement("div");
                    card.className = "card";
                    card.dataset.index = index;
                    card.dataset.emoji = emoji;

                    const cardFront = document.createElement("div");
                    cardFront.className = "card-front";
                    cardFront.textContent = emoji;

                    const cardBack = document.createElement("div");
                    cardBack.className = "card-back";
                    cardBack.textContent = "?";

                    card.appendChild(cardFront);
                    card.appendChild(cardBack);

                    card.addEventListener("click", () => flipCard(card));

                    gameBoard.appendChild(card);
                    cards.push(card);
                });

                message.classList.remove("show");
            }

            // Embaralhar array
            function shuffleArray(array) {
                for (let i = array.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [array[i], array[j]] = [array[j], array[i]];
                }
                return array;
            }

            // Virar carta
            function flipCard(card) {
                if (
                    !canFlip ||
                    card.classList.contains("flipped") ||
                    card.classList.contains("matched")
                ) {
                    return;
                }

                card.classList.add("flipped");
                flippedCards.push(card);

                if (flippedCards.length === 2) {
                    canFlip = false;
                    moves++;
                    movesDisplay.textContent = moves;

                    checkForMatch();
                }
            }

            // Verificar se as cartas viradas formam um par
            function checkForMatch() {
                const card1 = flippedCards[0];
                const card2 = flippedCards[1];

                if (card1.dataset.emoji === card2.dataset.emoji) {
                    // Cartas combinam - aplicar fundo verde
                    card1.classList.add("matched");
                    card2.classList.add("matched");
                    matchedPairs++;
                    pairsDisplay.textContent = `${matchedPairs}/${emojis.length}`;

                    flippedCards = [];
                    canFlip = true;

                    // Verificar se o jogo terminou
                    if (matchedPairs === emojis.length) {
                        setTimeout(endGame, 500);
                    }
                } else {
                    // Cartas não combinam - virar de volta
                    setTimeout(() => {
                        card1.classList.remove("flipped");
                        card2.classList.remove("flipped");
                        flippedCards = [];
                        canFlip = true;
                    }, 1000);
                }
            }

            // Atualizar o temporizador
            function updateTimer() {
                timer++;
                timerDisplay.textContent = `${timer}s`;
            }

            // Finalizar o jogo
            function endGame() {
                clearInterval(timerInterval);

                // Criar efeito de confete
                createConfetti();

                // Mostrar mensagem de parabéns
                messageText.textContent = `Você completou o jogo em ${moves} movimentos e ${timer} segundos!`;
                setTimeout(() => {
                    message.classList.add("show");
                }, 1000);
            }

            // Criar efeito de confete
            function createConfetti() {
                const colors = [
                    "#ff0000",
                    "#00ff00",
                    "#0000ff",
                    "#ffff00",
                    "#ff00ff",
                    "#00ffff",
                ];

                for (let i = 0; i < 100; i++) {
                    const confetti = document.createElement("div");
                    confetti.className = "confetti";
                    confetti.style.backgroundColor =
                        colors[Math.floor(Math.random() * colors.length)];
                    confetti.style.left = `${Math.random() * 100}vw`;
                    confetti.style.width = `${Math.random() * 10 + 5}px`;
                    confetti.style.height = `${Math.random() * 10 + 5}px`;

                    const animationDuration = Math.random() * 3 + 2;
                    confetti.style.animation = `confetti-fall ${animationDuration}s linear forwards`;

                    document.body.appendChild(confetti);

                    // Remover confete após a animação
                    setTimeout(() => {
                        confetti.remove();
                    }, animationDuration * 1000);
                }
            }

            // Dar dica
            function giveHint() {
                if (hints <= 0) return;

                hints--;
                hintBtn.textContent = `Dica (${hints})`;

                // Encontrar cartas não viradas e não combinadas
                const unflippedCards = cards.filter(
                    (card) =>
                        !card.classList.contains("flipped") &&
                        !card.classList.contains("matched")
                );

                if (unflippedCards.length < 2) return;

                // Encontrar um par para dar dica
                const emojiCount = {};
                unflippedCards.forEach((card) => {
                    const emoji = card.dataset.emoji;
                    emojiCount[emoji] = (emojiCount[emoji] || 0) + 1;
                });

                let hintEmoji = null;
                for (const emoji in emojiCount) {
                    if (emojiCount[emoji] >= 2) {
                        hintEmoji = emoji;
                        break;
                    }
                }

                if (!hintEmoji) return;

                // Mostrar as cartas com a dica
                const hintCards = unflippedCards
                    .filter((card) => card.dataset.emoji === hintEmoji)
                    .slice(0, 2);

                hintCards.forEach((card) => {
                    card.classList.add("flipped");

                    setTimeout(() => {
                        if (!card.classList.contains("matched")) {
                            card.classList.remove("flipped");
                        }
                    }, 1500);
                });
            }

            // Event listeners
            restartBtn.addEventListener("click", initGame);
            hintBtn.addEventListener("click", giveHint);
            closeMessage.addEventListener("click", initGame);

            // Iniciar o jogo
            initGame();
        });