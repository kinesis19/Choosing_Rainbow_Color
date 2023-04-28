// 2023.04.15 - v1.0.0-beta1 (최종 완성작)
// BGM and SFX
const bgmMain = getObject("MainBGM")
const sfxOver = getObject("sfx_over")
const sfxCoin = getObject("sfx_coin")
//  변수 - 0계층
let isPlayerTouchingFoothold = true;
//  GUI
//Lobby GUI
const gui_lobby_bg = getObject("GUI_LobbyBG")
const gui_play_btn = getObject("GUI_PlayBtn")
const gui_help_btn = getObject("GUI_HelpBtn")

// oldVer
const startbtn = getObject("gui_splash_start2")
const timerboard = getObject("gui_timer_board")
const roundNumber = getObject("gui_round")
const gui_coin = getObject("gui_coin")
const gui_spawn = getObject("gui_spawn") // Coin의 스폰 위치를 표시하는 gui임.
const gui_fooldHold = getObject("gui_FootHold") // Player가 현재 어떤 발판 위에 있는지 표시하는 gui임.
const objFoothold = [];

// Player Setting
let player = getObject("player")

// Obj (최상위)
const spawnPoint = getObject("Obj_SpawnPoint")

const obj_cloud1 = getObject("Cloud_OBJ1")
const obj_cloud2 = getObject("Cloud_OBJ2")
const obj_cloud3 = getObject("Cloud_OBJ3")
const obj_cloud4 = getObject("Cloud_OBJ4")

const obj_cloud_bright_1 = getObject("Cloud_bright_1")
const obj_cloud_bright_2 = getObject("Cloud_bright_2")

const obj_key = getObject("Key")

// Bgm Setting
bgmMain.setVolume(0.3)

gui_fooldHold.setText(" ")
gui_fooldHold.hide()
gui_spawn.setText(" ")
gui_spawn.hide()
gui_coin.setText("")
gui_coin.hide()
startbtn.setText(" ")

// startbtn.hide()
startbtn.setPosition(0, -520)

// // 타이머 메서드

let timerCount = 20; // 제한 시간
let roundNum = 1;
let stageNum = 1;
let isTimeOut = false; 
let aryFoothold = [0, 0, 0, 0, 0, 0, 0]; // 7가지 발판의 랜덤값 비교용 (메인)

let coinSpawnPos = 0;
let isCoinHave = false;
let selectHoldNum = -1; // 발판 gui에 표시할 변수임 (플레이어가 현재 밟고 있는 발판의 이름과 여부를 띄우는 용도의 변수) 
//, -1이 기본 값 (0부터 빨강색)

function Setup() {
    player.spawn(spawnPoint) // Player를 SavePoint로 소환.
    enableKeyControl(false)
    // gui_lobby_pn.onClick(function() {
    //     gui_lobby_pn.setTextSize(50)
    //     gui_lobby_pn.setText(" ")
    //     gui_lobby_pn.hide()
    //     enableKeyControl(true)
    //     startbtn.setText("")
    //     startbtn.hide()
    //     for(let j = 0; j < 7; j++){
    //         objFoothold[j] = getObject("FootHold_" + (j+1));
    //     }
    //     player.goTo(13, 0, 0)
    //     obj_cloud_bright_1.goTo(0, 5, 0)
    //     obj_cloud_bright_2.goTo(0, 5, 0)
    //     ResettingData();
    //     countFunction();  
    // })
    gui_play_btn.onClick(function() { // PlayBtn 클릭 시
        AnimationGuiClickToPlayBtn();
        
        enableKeyControl(true)

        for(let j = 0; j < 7; j++){ // 발판 오브젝트를 변수로 지정함.
            objFoothold[j] = getObject("FootHold_" + (j+1));
        }
        player.goTo(9, 0, 0)
        
        obj_cloud_bright_1.goTo(0, 5, 0) // 라운드 생존 시 나타나는 구름 초기화
        obj_cloud_bright_2.goTo(0, 5, 0)
        wait(1.5)
        ResettingData();
        countFunction();  
    })
    startbtn.onClick(function() { // 다시하기 버튼 클릭 시
        // gui_lobby_pn.setTextSize(50)
        // gui_lobby_pn.setText(" ")
        // gui_lobby_pn.hide()
        enableKeyControl(true)
        startbtn.setText("")
        startbtn.hide()
        for(let j = 0; j < 7; j++){
            objFoothold[j] = getObject("FootHold_" + (j+1));
        }
        player.goTo(9, 0, 0)
        
        obj_cloud_bright_1.goTo(0, 5, 0)
        obj_cloud_bright_2.goTo(0, 5, 0)
        ResettingData();
        countFunction();  
    })
}

function countFunction() {
    bgmMain.setVolume(0.3)
    // 구름 정리
    obj_cloud1.goTo(-1000, 0, 0)
    obj_cloud2.goTo(-1000, 0, 0)
    obj_cloud3.goTo(-1000, 0, 0)
    obj_cloud4.goTo(-1000, 0, 0)
    
    obj_cloud_bright_1.goTo(-1000, 0, 0)
    obj_cloud_bright_2.goTo(-1000, 0, 0)
    
    bgmMain.stopAudio()
    bgmMain.playAudio()
    roundNumber.setText("라운드 : " + roundNum, true);
    for(let jj = 0; jj < 7; jj++){
        if(aryFoothold[jj] > 7){
            objFoothold[jj].revive()
        }
    }
    gui_fooldHold.show()
    CoinRandomSpawning();
    
    enableKeyControl(true)
    resetTimer()
    startTimer()
    const startCount = setInterval(() => {
        for(let k = 0; k < 7; k++){
            // 접촉 감지 코드
            objFoothold[k].onCollide(player, function() {
                selectHoldNum = k; // 현재 플레이어가 밟고 있는 발판의 값을 넣음(0은 빨강 ~~ 6은 보라색)
            })
            objFoothold[k].onCollideEnd(player, function() {
                selectHoldNum = -1; // 현재 플레이어가 색깔 발판을 밟고 있지 않은 상태면, -1 값을 줌. (= Nothing)
            })

        }
        
        if(floor(getTimer()) == timerCount){ // 제한 시간 20초가 끝났을 때,
            clearInterval(startCount)
            
            for(let i = 0; i<7; i++){ // 발판에 랜덤으로 숫자 부여 => 랜덤 제거에 영향.
                aryFoothold[i] = getRandom(1, 11);
            }
            
            for(let ii = 0; ii < 7; ii++){ // 발판 랜덤으로 제거
                if(aryFoothold[ii] > 7){
                    objFoothold[ii].kill()
                }
            }
            timerboard.setText("Timer Over!", true)
            enableKeyControl(false) // Player 움직임 금지.
            wait(2)
            
            for(let k = 0; k < 7; k++){
                objFoothold[k].onContact(player, function() {
                    selectHoldNum = k; // 현재 플레이어가 밟고 있는 발판의 값을 넣음(0은 빨강 ~~ 6은 보라색)
                    isPlayerTouchingFoothold = true;
                })
            }
            wait(2)
            if(isPlayerTouchingFoothold == false){
                GameOver();
            }else if(isPlayerTouchingFoothold == true){
                if(isCoinHave == false){
                    GameOver();
                }else{ // 다음 라운드로 진행
                    MovingClound();
                    wait(3)
                    roundNum++;
                    countFunction();
                }
            }
            
        }else if(floor(getTimer()) != timerCount){
            if(player.getPosition().y == -100){
                timerboard.setText("GameOver!!", true)  
            }else{
                isPlayerTouchingFoothold = false; // 플레이어가 FootHold와 닿아 있지 않을 때, false 값으로 지정함.
                timerboard.setText(floor(getTimer())+"Sec", true)  
                ChangingFootHoldName();
                gui_coin.setText("Coin Value : " + isCoinHave)
            }
        }    
    }, 1000)
}

function AnimationGuiClickToPlayBtn(){ // Play Btn 클릭시, GUI 애니메이션 효과
    gui_play_btn.move(-500, 0, 500)
    gui_help_btn.move(-500, 0, 500)
    wait(1)
    gui_lobby_bg.move(0, -1500, 1000)
}



function RevivingFootHold(){ // FootHold의 Revive가 안 될때 사용하는 함수
    for(let jj = 0; jj < 7; jj++){
        if(aryFoothold[jj] > 7){
            objFoothold[jj].revive()
        }
    }
}

function MovingClound(){
    obj_cloud_bright_1.goTo(player.getPosition().x-10, player.getPosition().y+5, player.getPosition().z+4)
    obj_cloud_bright_2.goTo(player.getPosition().x+10, player.getPosition().y+5, player.getPosition().z-4)
    obj_cloud_bright_1.moveX(40, 4)
    obj_cloud_bright_2.moveX(-40, 4)
    wait(3)
    obj_cloud_bright_1.moveX(0, 0)
    obj_cloud_bright_2.moveX(0, 0)
    obj_cloud_bright_1.goTo(-1000, 0, 0)
    obj_cloud_bright_2.goTo(-1000, 0, 0)
}

function ChangingFootHoldName(){ // 플레이어가 밟고 있는 발판의 값을 string형으로 바꿔주는 메서드
    if(selectHoldNum == -1){
        gui_fooldHold.setText("Area : Nothing")
    }else if(selectHoldNum == 0){
        gui_fooldHold.setText("Area : Red")
    }else if(selectHoldNum == 1){
        gui_fooldHold.setText("Area : Orange")
    }else if(selectHoldNum == 2){
        gui_fooldHold.setText("Area : Yellow")
    }else if(selectHoldNum == 3){
        gui_fooldHold.setText("Area : Green")
    }else if(selectHoldNum == 4){
        gui_fooldHold.setText("Area : Blue")
    }else if(selectHoldNum == 5){
        gui_fooldHold.setText("Area : Indigo")
    }else if(selectHoldNum == 6){
        gui_fooldHold.setText("Area : Violet")
    }
}

function CoinRandomSpawning(){
    obj_key.revive()
    isCoinHave = false
    gui_coin.show()
    coinSpawnPos = getRandom(1, 7) // 일곱 가지 발판(Area) 구역 정하기
    let conSpawnPosDetail = getRandom(1, 3) // 해당 Area의 세부 위치
    
    if(coinSpawnPos == 1){ // 1번 발판 구역
        if(conSpawnPosDetail == 1){
            obj_key.goTo(35, 3, -56)
        }else if(conSpawnPosDetail == 2){
            obj_key.goTo(52, 1, -35)
        }else if(conSpawnPosDetail == 3){
            obj_key.goTo(33, 1, -36)
        }
        gui_spawn.setText("Coin Spawn : Red")
    }else if(coinSpawnPos == 2){
        if(conSpawnPosDetail == 1){
            obj_key.goTo(11, 3, -55)
        }else if(conSpawnPosDetail == 2){
            obj_key.goTo(-8, 1, -50)
        }else if(conSpawnPosDetail == 3){
            obj_key.goTo(1, 1, -41)
        }
        gui_spawn.setText("Coin Spawn : Orange")
    }else if(coinSpawnPos == 3){
        if(conSpawnPosDetail == 1){
            obj_key.goTo(-32, 2, -52)
        }else if(conSpawnPosDetail == 2){
            obj_key.goTo(-52, 2, -52)
        }else if(conSpawnPosDetail == 3){
            obj_key.goTo(-52, 2, -38)
        }
        gui_spawn.setText("Coin Spawn : Yellow")
    }else if(coinSpawnPos == 4){
        if(conSpawnPosDetail == 1){
            obj_key.goTo(-10, 2, -3)
        }else if(conSpawnPosDetail == 2){
            obj_key.goTo(-10, 1, 10)
        }else if(conSpawnPosDetail == 3){
            obj_key.goTo(10, 1, 5)
        }
        gui_spawn.setText("Coin Spawn : Green")
    }else if(coinSpawnPos == 5){
        if(conSpawnPosDetail == 1){
            obj_key.goTo(55, 2, 38)
        }else if(conSpawnPosDetail == 2){
            obj_key.goTo(48, 1, 55)
        }else if(conSpawnPosDetail == 3){
            obj_key.goTo(39, 1, 35)
        }
        gui_spawn.setText("Coin Spawn : Blue")
    }else if(coinSpawnPos == 6){
        if(conSpawnPosDetail == 1){
            obj_key.goTo(-8, 1, 40)
        }else if(conSpawnPosDetail == 2){
            obj_key.goTo(-8, 1, 50)
        }else if(conSpawnPosDetail == 3){
            obj_key.goTo(10, 3, 37)
        }
        gui_spawn.setText("Coin Spawn : Indigo")
    }else if(coinSpawnPos == 7){
        if(conSpawnPosDetail == 1){
            obj_key.goTo(-31, 1, 50)
        }else if(conSpawnPosDetail == 2){
            obj_key.goTo(-54, 1, 55)
        }else if(conSpawnPosDetail == 3){
            obj_key.goTo(-54, 1, 33)
        }
        gui_spawn.setText("Coin Spawn : Violet")
    }
    gui_spawn.show()
}

obj_key.onCollide(player, function() { //  Player가 Coin을 획득했을 때
    sfxCoin.playAudio()
    isCoinHave = true;
    obj_key.kill()
})
function ResettingData(){
    roundNum = 1;
    stageNum = 1;
    bgmMain.stopAudio()
}

function GameOver(){
    bgmMain.stopAudio()
    sfxOver.playAudio()
    pauseTimer()
    isPlayerTouchingFoothold = false;
    enableKeyControl(false)
    timerboard.setText("GameOver!!", true)   
    player.goTo(0, -100, 0)
    
    // gui_lobby_pn.setTextSize(50)
    // gui_lobby_pn.setText("생존 라운드 : " + roundNum + "\n\n")
    
    startbtn.setText("다시하기")
    startbtn.show()
    
    obj_cloud1.goTo(-7, -88, -3)
    obj_cloud2.goTo(0, 0, 3)
    obj_cloud3.goTo(0, -97, -15)
    obj_cloud4.goTo(15, -98, 0)
}

// Trap_A Action Scripts
// 배열 가져오는 함수

// 오브젝트 (장애물) 선언
const testTrapA = getObject("testTrapA_1")
const trapsA_1 = getObjectsByName("TrapA_1")
const traps_b_1 = getObjectsByName("Trap_B_1")
const traps_c_1 = getObjectsByName("Trap_C_1")
const traps_d_1 = getObjectsByName("Trap_D_1")
const traps_e_1 = getObjectsByName("Trap_E_1")
const traps_f_1 = getObjectsByName("Trap_F_1")
const traps_f_2 = getObjectsByName("Trap_F_2")
// 오브젝트 (건축물) 선언
const obj_speed = getObjectsByName("OBJ_SPEED")
const game_over_obj = getObject("GameOverObj")
const obj_fallthing = getObjectsByName("OBJ_Fallthing")
const game_over_spawn_obj = getObject("GMOverSpawnOBJ")

// 오브젝트 (자동차) 선언
const objCar_1 = getObject("Car1")
const objCar_2 = getObject("Car2")
const objCar_3 = getObject("Car3")
const objCar_4 = getObject("Car4")
const objCar_5 = getObject("Car5")
const objCar_6 = getObject("Car6")
const objCar_7 = getObject("Car7")
const objCar_8 = getObject("Car8")
const objCar_9 = getObject("Car9")

testTrapA.moveY(10,1)

// trap 배열 순회하면서 코드 실행합니다.
trapsA_1.forEach((TrapA_1) => {
    setInterval(() => {
        const pos_trapsA_1 = TrapA_1.getPosition();
        if (pos_trapsA_1.y >= -0.5) {
            TrapA_1.moveY(-1, 1)
        }
        else if(pos_trapsA_1.y <= -1.5){
            TrapA_1.moveY(1, 1)
        }
    })
    TrapA_1.onCollide(player, function() { // 장애물 밟을 시, 디버프 효과 부여함. (5초간 이속 감소)
        player.changePlayerSpeed(0.5)
        wait(5)
        player.changePlayerSpeed(1)    
    })
})

traps_b_1.forEach((Trap_B_1) => {
    setInterval(() => {
        Trap_B_1.rotateY(-1)
    })
    Trap_B_1.onCollide(player, function() {
        player.changeAxisSpeed(5, 0, 0)
        wait(1)
        player.changeAxisSpeed(0, 0, 0)
    })
})

traps_c_1.forEach((Trap_C_1) => {
    setInterval(() => {
        Trap_C_1.rotateY(1)
    })
    Trap_C_1.onCollide(player, function() {
        
    })
})
traps_d_1.forEach((Trap_D_1) => {
    setInterval(() => {
        const pos_traps_d_1 = Trap_D_1.getPosition();
        if (pos_traps_d_1.y >= 2.4) {
            wait(1)
            Trap_D_1.moveY(-5, 4)
        }
        else if(pos_traps_d_1.y <= -3.4){
            wait(1)
            Trap_D_1.moveY(5, 4)
        }
    })
})
traps_e_1.forEach((Trap_E_1) => {
    Trap_E_1.onCollide(player, function() {
        const traps_c_random_number = getRandom(1, 5)
        if(traps_c_random_number == 1){ // 1번 : 파란 발판으로 이동 및 이속 감소 부여.
            player.goTo(55, 0.6, 55)
            player.changePlayerSpeed(0.5)
            wait(3)
            player.changePlayerSpeed(1)
        }else if(traps_c_random_number == 2){ // 2번 : 보라 발판으로 이동
            player.goTo(-55, 0.6, 55)
        }else if(traps_c_random_number == 3){ // 3번 : 빨간 발판으로 이동
            player.goTo(55, 0.6, -55)
        }else if(traps_c_random_number == 4){ // 4번 : 초록 발판으로 이동
            player.goTo(0, 0.6, 0)
        }else if(traps_c_random_number == 5){ // 5번 : 노란 발판으로 이동
            player.goTo(-55, 0.6, -55)
        }
    })
    
})

traps_f_1.forEach((Trap_F_1) => {
    Trap_F_1.onCollide(player, function() {
        player.goTo(-23.5, round(player.getPosition().y, 0)+11, 45)
    })
})
traps_f_2.forEach((Trap_F_2) => {
    Trap_F_2.onCollide(player, function() {
        player.goTo(-23.5, round(player.getPosition().y, 0)-8, 45)
    })
})


// 오브젝트 (건축물) 관련 메서드
obj_speed.forEach((OBJ_SPEED) => {
    OBJ_SPEED.onCollide(player, function() {
        player.changePlayerSpeed(8)
        wait(1)
        player.changePlayerSpeed(1)
    })
})

obj_fallthing.forEach((OBJ_Fallthing) => {
    setInterval(() => {
        const pos_obj_fallthing = OBJ_Fallthing.getPosition();
        if (pos_obj_fallthing.y >= 20) {
            OBJ_Fallthing.moveY(-16, 10)
        }
        else if(pos_obj_fallthing.y <= 4){
            OBJ_Fallthing.moveY(16, 10)
        } 
    })
    // movingObjFallthing();
    OBJ_Fallthing.onCollide(player, function() {
        player.changePlayerSpeed(8)
        wait(1)
        player.changePlayerSpeed(1)
    })
})

onSecond(1, function() {
    MovingCars();
    obj_key.rotateY(90) // 동전 애니메이션
})

function MovingCars(){
    if(objCar_1.getPosition().z > 130){
        objCar_1.goTo(objCar_1.getPosition().x, objCar_1.getPosition().y, -130)
    }else if(objCar_1.getPosition().z <= 130){
        objCar_1.moveZ(261, 30)
    }
    if(objCar_2.getPosition().z > 130){
        objCar_2.goTo(objCar_2.getPosition().x, objCar_2.getPosition().y, -130)
    }else if(objCar_2.getPosition().z <= 132){
        objCar_2.moveZ(131, 30)
    }
    if(objCar_3.getPosition().z > 130){
        objCar_3.goTo(objCar_3.getPosition().x, objCar_3.getPosition().y, -130)
    }else if(objCar_3.getPosition().z <= 140){
        objCar_3.moveZ(31, 30)
    }
    
    if(objCar_4.getPosition().z < -130){
        objCar_4.goTo(objCar_4.getPosition().x, objCar_4.getPosition().y, 130)
    }else if(objCar_4.getPosition().z >= -130){
        objCar_4.moveZ(-180, 30)
    }
    if(objCar_5.getPosition().z < -130){
        objCar_5.goTo(objCar_5.getPosition().x, objCar_5.getPosition().y, 130)
    }else if(objCar_5.getPosition().z >= -130){
        objCar_5.moveZ(-31, 30)
    }
    
    if(objCar_6.getPosition().x > 130){
        objCar_6.goTo(-130, objCar_6.getPosition().y, objCar_6.getPosition().z)
    }else if(objCar_6.getPosition().x <= 130){
        objCar_6.moveX(180, 30)
    }
    if(objCar_7.getPosition().x > 130){
        objCar_7.goTo(-130, objCar_7.getPosition().y, objCar_6.getPosition().z)
    }else if(objCar_7.getPosition().x <= 130){
        objCar_7.moveX(31, 30)
    }
    
    if(objCar_8.getPosition().x < -130){
        objCar_8.goTo(130, objCar_8.getPosition().y, objCar_8.getPosition().z)
    }else if(objCar_8.getPosition().x >= -130){
        objCar_8.moveX(-100, 30)
    }
    if(objCar_9.getPosition().x < -130){
        objCar_9.goTo(130, objCar_9.getPosition().y, objCar_9.getPosition().z)
    }else if(objCar_9.getPosition().z >= -130){
        objCar_9.moveX(-101, 30)
    }
}

game_over_obj.onCollide(player, function() { // 맨 아래 바닥
    GameOver();
})

onKeyDown("KeyR", function() {
    RevivingFootHold();
})
