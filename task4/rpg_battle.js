'use strict';

const readlineSync = require('readline-sync');

const monster = {
    maxHealth: 10,
    name: "Лютый",
    moves: [
        {
            "name": "Удар когтистой лапой",
            "physicalDmg": 3, // физический урон
            "magicDmg": 0,    // магический урон
            "physicArmorPercents": 20, // физическая броня
            "magicArmorPercents": 20,  // магическая броня
            "cooldown": 0     // ходов на восстановление
        },
        {
            "name": "Огненное дыхание",
            "physicalDmg": 0,
            "magicDmg": 4,
            "physicArmorPercents": 0,
            "magicArmorPercents": 0,
            "cooldown": 3
        },
        {
            "name": "Удар хвостом",
            "physicalDmg": 2,
            "magicDmg": 0,
            "physicArmorPercents": 50,
            "magicArmorPercents": 0,
            "cooldown": 2
        },
    ]
}

const player = {
    moves: [
        {
            "name": "Удар боевым кадилом",
            "physicalDmg": 2,
            "magicDmg": 0,
            "physicArmorPercents": 0,
            "magicArmorPercents": 50,
            "cooldown": 0
        },
        {
            "name": "Вертушка левой пяткой",
            "physicalDmg": 4,
            "magicDmg": 0,
            "physicArmorPercents": 0,
            "magicArmorPercents": 0,
            "cooldown": 4
        },
        {
            "name": "Каноничный фаербол",
            "physicalDmg": 0,
            "magicDmg": 5,
            "physicArmorPercents": 0,
            "magicArmorPercents": 0,
            "cooldown": 3
        },
        {
            "name": "Магический блок",
            "physicalDmg": 0,
            "magicDmg": 0,
            "physicArmorPercents": 100,
            "magicArmorPercents": 100,
            "cooldown": 4
        },
    ]
}

const userHpInput = parseInt(readlineSync.question('Evstafiy hp: '));
// Проверка корректности ввода hp
if (userHpInput > 0) {
    player.hp = userHpInput;
    console.log('Get Over Here! © Scorpion');
} else {
    // Если получаем некорректный ввод, дадим игроку 10 hp
    console.log("Let's assume it's 10\n");
    player.hp = 10;
}

monster.hp = monster.maxHealth;

const allMoves = player.moves.concat(monster.moves);

// Создадим и занулим действующие кулдауны для player
for (let move in player.moves) {
    player.moves[move].actualCooldown = 0;
}
// Создадим и занулим действующие кулдауны для monster
for (let move in monster.moves) {
    monster.moves[move].actualCooldown = 0;
}

// Основной цикл битвы
for (let round = 1; !checkDead(); round++) {
    console.log(`\nround ${round}:`)

    let monsterRandomMove = getMonsterRandomAllowedMove();
    console.log(`monster move: ${monsterRandomMove.name}`)
    
    let playerSelectedMove = selectPlayerMove();
    
    applyMoves(monsterRandomMove, playerSelectedMove);

    let deadAfterCalculation = checkDead()
    switch(deadAfterCalculation) {
        case 'player':
            console.log('\nLutiy wins\n');
            break;
        case 'monster':
            console.log('\nEvstafiy wins\n');
            break;
        case 'both':
            console.log('\ndead heat\n');
            break;
        default:
            setCooldowns(monsterRandomMove, playerSelectedMove);
    }
}

function getMonsterRandomAllowedMove() {
    let allowedMoves             = getAvailableMoves(monster);
    let randomMoveIndex          = Math.floor(Math.random() * allowedMoves.length);
    return allowedMoves[randomMoveIndex];
}

function selectPlayerMove() {
    let allowedMoves = getAvailableMoves(player);
    let i = 1;
    console.log('available actions:')
    for (let move of allowedMoves) {
        console.log(`${i}. ${move.name}`);
        i++
    }
    return allowedMoves[getUserInput(allowedMoves.length) - 1];
    
}

function setCooldowns (monsterMove, playerMove) {
    for (let move of allMoves){
        if (move.actualCooldown > 0) move.actualCooldown--
    }

    monsterMove.actualCooldown = monsterMove.cooldown;
    playerMove.actualCooldown  = playerMove.cooldown;
}

function getAvailableMoves (creature) {
    return creature.moves.filter(move => move.actualCooldown === 0)
}

function applyMoves (monsterMove, playerMove) {
    let monsterPhysicDmg = monsterMove.physicalDmg * (1 - playerMove.physicArmorPercents / 100);
    let monsterMagicDmg  = monsterMove.magicDmg * (1 - playerMove.magicArmorPercents / 100);
    let playerPhysicDmg  = playerMove.physicalDmg * (1 - monsterMove.physicArmorPercents / 100);
    let playerMagicDmg   = playerMove.magicDmg * (1 - monsterMove.magicArmorPercents / 100);
    let monsterAllDmg    = +(monsterPhysicDmg + monsterMagicDmg).toFixed();
    let playerAllDmg     = +(playerPhysicDmg + playerMagicDmg).toFixed();

    player.hp  -= monsterAllDmg;
    monster.hp -= playerAllDmg;

    console.log(`player: dmg = ${playerAllDmg}, hp = ${player.hp}`);
    console.log(`monster: dmg = ${monsterAllDmg}, hp = ${monster.hp}`)
}

function checkDead () {
    if (player.hp <= 0 && monster.hp <= 0) return 'both';
    if (player.hp <= 0) return 'player';
    if (monster.hp <= 0) return 'monster';
}

function getUserInput(amountOptions) {
    while (true) {
        let input = parseInt(readlineSync.question('Evstafiy move (number): '));
        if (input > 0 && input <= amountOptions) {
            return input;
        } else {
            console.log('incorrect option, try again');
        }
    }
}