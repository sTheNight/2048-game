const gameObject = {
    board: [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ],
    score: 0
};

window.addEventListener('DOMContentLoaded', () => {
    initGame();
    bindEvents();
});

function initGame() {
    generateNewNumber();
    generateNewNumber();
    renderBoard();
}

function bindEvents() {
    document.querySelectorAll('.control-button.available').forEach(btn =>
        btn.addEventListener('click', () => {
            switch (btn.innerText) {
                case '↑':
                    verticalMove(true);
                    break;
                case '↓':
                    verticalMove(false);
                    break;
                case '←':
                    horizontalMove(true);
                    break;
                case '→':
                    horizontalMove(false);
                    break;
            }
        })
    );
    document.addEventListener('keydown', e => {
        switch (e.key) {
            case 'ArrowUp':
                verticalMove(true);
                break;
            case 'ArrowDown':
                verticalMove(false);
                break;
            case 'ArrowLeft':
                horizontalMove(true);
                break;
            case 'ArrowRight':
                horizontalMove(false);
                break;
        }
    });
}


function generateNewNumber() {
    // 遍历棋盘数组将空 block 对象存储到 emptyBlock 数组中
    const emptyBlock = []
    for (let y = 0; y < 4; y++) {
        for (let x = 0; x < 4; x++) {
            if (gameObject.board[y][x] === 0) {
                emptyBlock.push({ y, x })
            }
        }
    }
    if (emptyBlock.length === 0)
        return

    const { y, x } = emptyBlock[Math.floor(Math.random() * emptyBlock.length)]
    gameObject.board[y][x] = Math.random() < 0.9 ? 2 : 4
    console.log(gameObject.board) //开发调试使用[待修改]
}

function renderBoard() {
    for (let y = 0; y < 4; y++) {
        for (let x = 0; x < 4; x++) {
            const cell = document.getElementById(`${y}-${x}`);
            const v = gameObject.board[y][x];
            if (v !== 0) {
                cell.innerText = v;
                cell.className = `block block-${v}`;
            } else {
                cell.innerText = '';
                cell.className = 'block';
            }
        }
    }
    document.getElementById('h2-score').innerText = `得分：${gameObject.score}`;
}

function mergeLine(array) {
    // 使用 filter 滤去值为 0 的 block，变相达成移动的目的
    const filtedArray = array.filter(item => item != 0)
    for (let i = 0; i < filtedArray.length - 1; i++) {
        if (filtedArray[i] == filtedArray[i + 1]) {
            // 检查格子是否是可合并的
            filtedArray[i] *= 2
            filtedArray[i + 1] = 0
            gameObject.score += filtedArray[i]
        }
    }
    // 在完成合并后，再进行一次滤去值为 0 的 block
    filtedArray.filter(item => item != 0);
    while (filtedArray.length != 4) {
        // 过滤完后倘若数组长度不足则 4，补齐数组长度
        filtedArray.push(0)
    }
    return filtedArray;
}

// 后续处理
function postMove(changed) {
    if (!changed)
        return;
    generateNewNumber()
    renderBoard()
    if (isGameOver())
        alert(`游戏结束，得分：${gameObject.score}`)
}

function verticalMove(isPositiveDirection) {
    // 向上为正方向
    let isMoved = false;
    for (let x = 0; x < 4; x++) {
        let originalColumn = []
        for (let i = 0; i < 4; i++) {
            originalColumn.push(gameObject.board[i][x])
        }

        if (!isPositiveDirection)
            originalColumn = originalColumn.reverse()

        let mergedColumn = mergeLine(originalColumn);
        if (!isPositiveDirection)
            mergedColumn = mergedColumn.reverse()

        for (let i = 0; i < 4; i++) {
            if (gameObject.board[i][x] != mergedColumn[i])
                isMoved = true
            gameObject.board[i][x] = mergedColumn[i]
        }
    }
    postMove(isMoved);
}
function horizontalMove(isPositiveDirection) {
    // 向左为正方向
    let isMoved = false;
    for (let y = 0; y < 4; y++) {
        let originalRow = gameObject.board[y]
        let mergedRow = isPositiveDirection ? mergeLine(originalRow) : mergeLine(originalRow.reverse());
        if (mergedRow != gameObject.board[y])
            isMoved = true
        gameObject.board[y] = isPositiveDirection ? mergedRow : mergedRow.reverse()
    }
    postMove(isMoved)
}

function isGameOver() {
    for (let y = 0; y < 4; y++) {
        for (let x = 0; x < 4; x++) {
            // 倘若存在某个 block 的值为 0 则标记为可以继续合并
            if (gameObject.board[y][x] === 0)
                return false;
            // 倘若存在某个块的值与右边或下边的块的值相同则标记为可以继续合并
            // 由于是从 左上角开始遍历因此不需要考虑左边和上边的块的值是否相同
            if (x < 3 && gameObject.board[y][x] === gameObject.board[y][x + 1])
                return false;
            if (y < 3 && gameObject.board[y][x] === gameObject.board[y + 1][x])
                return false;
        }
    }
    return true;
}