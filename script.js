// 2023.04.15 - v1.0.1-release1 (2023.04.30)
// BGM and SFX
const bgmMain = getObject("MainBGM")
bgmMain.stopAudio()
const sfxOver = getObject("sfx_over")
sfxOver.stopAudio()
const sfxKey = getObject("sfx_coin")
sfxKey.stopAudio()
const bgmWinning = getObject("BGM_Winning")
bgmWinning.stopAudio()
const sfxWinning = getObject("SFX_Winning")
sfxWinning.stopAudio()


//  변수 - 0계층
let isPlayerTouchingFoothold = true;
let isGameOvered = false;
const objFoothold = [];
//  GUI
// Lobby GUI
const gui_lobby_bg = getObject("GUI_LobbyBG")
const gui_play_btn = getObject("GUI_PlayBtn")
const gui_help_btn = getObject("GUI_HelpBtn")
const gui_helpRight_btn = getObject("GUI_HelpRightBtn")
const gui_helpLeft_btn = getObject("GUI_HelpLeftBtn")
gui_helpRight_btn.hide()
gui_helpLeft_btn.hide()
// Lobby - Help GUI
const gui_help_play2_btn = getObject("GUI_Play2Btn")
gui_help_play2_btn.hide()
const gui_help_bg1 = getObject("GUI_HelpBG_1")
const gui_help_bg2 = getObject("GUI_HelpBG_2")
const gui_help_bg3 = getObject("GUI_HelpBG_3")
const gui_help_bg4 = getObject("GUI_HelpBG_4")
const gui_help_bg5 = getObject("GUI_HelpBG_5")
const gui_help_bg6 = getObject("GUI_HelpBG_6")

GUIHelpAllHide()

// Main GUI
const gui_timer_ui = getObject("GUI_TimerUI") // 현재 제한 시간까지 몇 초 경과 되었는지 알려주는 UI.
const gui_round_ui = getObject("GUI_RoundUI") // 현재 라운드 수를 알려주는 UI.
const gui_keyspawn_ui = getObject("GUI_KeyspawnUI") // 열쇠 스폰 위치 알려주는 UI.
const gui_keyhave_ui = getObject("GUI_KeyhaveUI") // 현재 key를 가지고 있는지 여부를 알려주는 UI.
const gui_nowpos_ui = getObject("GUI_NowposUI")
const gui_replay_btn = getObject("GUI_ReplayBtn")
gui_replay_btn.setText("")
gui_replay_btn.hide()

// Winning GUI
const gui_winning_ui = getObject("GUI_Winning")
gui_winning_ui.hide()

// Help BG 넘기는 페이지 변수
let nowPage = 1;

// Player Setting
let player = getObject("player")

// Obj (최상위)
const spawnPoint = getObject("Obj_SpawnPoint")
const game_over_spawn_obj = getObject("GMOverSpawnOBJ") // 게임 오버시 등장하는 발판(맨 아래)

const obj_cloud1 = getObject("Cloud_OBJ1")
const obj_cloud2 = getObject("Cloud_OBJ2")
const obj_cloud3 = getObject("Cloud_OBJ3")
const obj_cloud4 = getObject("Cloud_OBJ4")

const obj_cloud_bright_1 = getObject("Cloud_bright_1")
const obj_cloud_bright_2 = getObject("Cloud_bright_2")

const obj_key = getObject("Key")

// Bgm Setting
bgmMain.setVolume(0.3)

// Testting


// // 타이머 메서드

let timerCount = 21; // 제한 시간
let roundNum = 1; // 현재 라운드
let maxRoundNum = 30; // 게임 종료 라운드
let isTimeOut = false; 
let aryFoothold = [0, 0, 0, 0, 0, 0, 0]; // 7가지 발판의 랜덤값 비교용 (메인)

let keySpawnPos = 0;
let isKeyHave = false;
let selectHoldNum = -1; // 발판 gui에 표시할 변수임 (플레이어가 현재 밟고 있는 발판의 이름과 여부를 띄우는 용도의 변수) 
//, -1이 기본 값 (0부터 빨강색)

function Setup() {
    player.spawn(spawnPoint) // Player를 SavePoint로 소환.
    enableKeyControl(false)
}
// Button Clicking 관련
gui_play_btn.onClick(function() { // PlayBtn 클릭 시
    AnimationGuiClickToPlayBtn();

    PlayandReplayBtnClicking();
})
gui_replay_btn.onClick(function() { // 다시하기 버튼 클릭 시
    roundNum = 1;
    gui_replay_btn.setText("")
    gui_replay_btn.hide()

    PlayandReplayBtnClicking();
})
gui_help_play2_btn.onClick(function() { // Play 2 Btn 클릭 시
    GUIHelpAllHide();   

    gui_lobby_bg.move(0, -1500, 1000)

    PlayandReplayBtnClicking();
})
gui_help_btn.onClick(function() { // Help Btn 클릭 시
    AnimationGuiClickToHelpBtn();
    ShowingHelpPage()
})
function GUIHelpAllHide(){
    gui_help_bg1.hide()
    gui_help_bg2.hide()
    gui_help_bg3.hide()
    gui_help_bg4.hide()
    gui_help_bg5.hide()
    // gui_help_bg6.setPosition(0, 10)
    gui_help_bg6.hide()
    gui_help_play2_btn.hide()
    gui_helpLeft_btn.hide()
}
function ShowingHelpPage(){
    GUIHelpAllHide();
    if(nowPage == 1){
        gui_help_bg1.show()
        gui_helpRight_btn.show()
        gui_helpLeft_btn.hide()
        gui_help_play2_btn.hide()
    }else if(nowPage == 2){
        gui_help_bg2.show()
        gui_helpRight_btn.show()
        gui_helpLeft_btn.show()
        gui_help_play2_btn.hide()
    }else if(nowPage == 3){
        gui_help_bg3.show()
        gui_helpRight_btn.show()
        gui_helpLeft_btn.show()
        gui_help_play2_btn.hide()
    }else if(nowPage == 4){
        gui_help_bg4.show()
        gui_helpRight_btn.show()
        gui_helpLeft_btn.show()
        gui_help_play2_btn.hide()
    }else if(nowPage == 5){
        gui_help_bg5.show()
        gui_helpRight_btn.show()
        gui_helpLeft_btn.show()
        gui_help_play2_btn.hide()
    }else if(nowPage == 6){
        gui_help_bg6.show()
        gui_helpRight_btn.hide()
        gui_helpLeft_btn.show()
        gui_help_play2_btn.show()
    }
}
gui_helpRight_btn.onClick(function() {
    nowPage++;
    ShowingHelpPage();
})
gui_helpLeft_btn.onClick(function() {
    nowPage--;
    ShowingHelpPage();
})

function PlayandReplayBtnClicking(){ // Play Btn과 RePlay Btn의 공통 기능
    enableKeyControl(true)

    for(let j = 0; j < 7; j++){
        objFoothold[j] = getObject("FootHold_" + (j+1));
    }
    player.goTo(9, 0, 0)
    
    obj_cloud_bright_1.goTo(0, 5, 0)
    obj_cloud_bright_2.goTo(0, 5, 0)
    ResettingData();
    countFunction();  
}

function countFunction() { // 타이머 시작 함수
    let hasMovedCloud = false;
    let hasIncreasedRoundNum = false;
    // ResettingData();

    bgmMain.playAudio()
    gui_round_ui.setText("Round : " + roundNum, true);
    RevivingFootHold();
    KeyRandomSpawning();
    
    enableKeyControl(true)
    if(roundNum == maxRoundNum){ // 플레이어의 roundNum이 30라운드(maxRoundNum)이 되면, 엔딩으로 이동.
        YouWinning();
        
        return 0; // countFunction() 종료.
        
    }else if(roundNum < maxRoundNum){
        resetTimer()
        startTimer()

        const startCount = setInterval(() => { // 매 초 마다 실행
            for(let k = 0; k < 7; k++){
                // 접촉 감지 코드
                objFoothold[k].onCollide(player, function() {
                    selectHoldNum = k; // 현재 플레이어가 밟고 있는 발판의 값을 넣음(0은 빨강 ~~ 6은 보라색)
                    isPlayerTouchingFoothold = true; 
                })
                objFoothold[k].onCollideEnd(player, function() {
                    selectHoldNum = -1; // 현재 플레이어가 색깔 발판을 밟고 있지 않은 상태면, -1 값을 줌. (= Nothing)
                    isPlayerTouchingFoothold = false;
                })

            }
            if(floor(getTimer()) == 20){
                enableKeyControl(false) // Player 움직임 금지.
            }
            if(floor(getTimer()) == timerCount){ // 제한 시간 20초가 끝났을 때,
                pauseTimer()
                clearInterval(startCount)
                
                gui_timer_ui.setText("Timer Over!", true)
                enableKeyControl(false) // Player 움직임 금지.
                

                selectHoldNum = -1; // 현재 플레이어가 색깔 발판을 밟고 있지 않은 상태면, -1 값을 줌. (= Nothing)
                isPlayerTouchingFoothold = false;

                // selectHoldNum = -1;
                for(let i = 0; i < 7; i++){ // 발판 랜덤으로 제거
                    aryFoothold[i] = getRandom(1, 11);
                    if(aryFoothold[i] > 7){
                        objFoothold[i].kill()
                    }
                    objFoothold[i].onContact(player, function() { //현재 플레이어가 밟고 있는 발판이 사라지지 않았을 떄
                        selectHoldNum = i; // 현재 플레이어가 밟고 있는 발판의 값을 넣음(0은 빨강 ~~ 6은 보라색)
                        ChangingFootHoldName();
                        isPlayerTouchingFoothold = true; 
                    })
                    // objFoothold[i].onCollideEnd(player, function() {
                    //     selectHoldNum = -1; // 현재 플레이어가 색깔 발판을 밟고 있지 않은 상태면, -1 값을 줌. (= Nothing)
                    //     isPlayerTouchingFoothold = false;
                    // })
                }
                wait(4)
                
                // for(let k = 0; k < 7; k++){
                //     objFoothold[k].onContact(player, function() { //현재 플레이어가 밟고 있는 발판이 사라지지 않았을 떄
                //         selectHoldNum = k; // 현재 플레이어가 밟고 있는 발판의 값을 넣음(0은 빨강 ~~ 6은 보라색)
                //         isPlayerTouchingFoothold = true; 
                //     })
                // }

                // ChangingFootHoldName();
                wait(2)

                if(isKeyHave == false){ // Key를 가지고 있지 않을 시
                    if(isGameOvered == false){
                        GameOver();
                    }else{
                
                    }
                }else if(isKeyHave == true){ //Key를 가지고 있을 시
                    if(isPlayerTouchingFoothold == false){ // 발판을 밟고 있지 않을 시
                        if(isGameOvered == false){
                            GameOver();
                        }else{
                    
                        }
                    }else if(isPlayerTouchingFoothold == true){ // 발판을 밟고 있을 시, 다음 라운드로 이동.
                        if(!hasMovedCloud) { // 구름이 이동한 적이 없다면 실행
                            hasMovedCloud = true; // 구름 이동 여부 체크
                            MovingClound(); // 다음 라운드 진출 전에 구름 나타내기.
                        }
                        if(!hasIncreasedRoundNum) { // 라운드 수가 증가한 적이 없다면 실행
                            roundNum++; // 라운드 수 1 증가.
                            hasIncreasedRoundNum = true; // 라운드 수 증가 여부 체크
                            gui_round_ui.setText("Round : " + roundNum, true);
                        }
                        clearInterval(startCount)
                        countFunction(); // 함수 재귀호출.

                        // roundNum ++; // 라운드 수 1 증가.
                        // gui_round_ui.setText("Round : " + roundNum, true);
                        // MovingClound(); // 다음 라운드 진출 전에 구름 나타내기.
                        // clearInterval(startCount)
                        // countFunction(); // 함수 재귀호출.
                    }
                }

                
            }else if(floor(getTimer()) != timerCount){
                // isPlayerTouchingFoothold = false; // 플레이어가 FootHold와 닿아 있지 않을 때, false 값으로 지정함.
                gui_timer_ui.setText(floor(getTimer())+"Sec", true)  
                ChangingFootHoldName();
                gui_keyhave_ui.setText("Key Value : " + isKeyHave)
                
            }    
        }, 1000)
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

function YouWinning(){
    pauseTimer()
    gui_winning_ui.show()
    bgmMain.stopAudio()
    bgmWinning.setVolume(1)
    bgmWinning.playAudio()
    bgmWinning.setVolume(1)
    sfxWinning.playAudio()
    player.goTo(0, 220, 0)
}

function AnimationGuiClickToPlayBtn(){ // Play Btn 클릭시, GUI 애니메이션 효과
    gui_play_btn.move(-500, 0, 500)
    wait(0.4)
    gui_help_btn.move(-500, 0, 500)
    wait(0.5)
    gui_lobby_bg.move(0, -1500, 1000)
}

function AnimationGuiClickToHelpBtn(){
    gui_help_btn.move(-500, 0, 500)
    wait(0.4)
    gui_play_btn.move(-500, 0, 500)
    wait(0.5)

}



function RevivingFootHold(){ // FootHold의 Revive를 하는 함수
    for(let i = 0; i < 3; i++){ // 3번동안 Rebive를 함.
        for(let jj = 0; jj < 7; jj++){ 
            objFoothold[jj].revive()
        }
    }
}


function ChangingFootHoldName(){ // 플레이어가 밟고 있는 발판의 값을 string형으로 바꿔주는 메서드
    if(selectHoldNum == -1){
        gui_nowpos_ui.setText("Area : Nothing")
    }else if(selectHoldNum == 0){
        gui_nowpos_ui.setText("Area : Red")
    }else if(selectHoldNum == 1){
        gui_nowpos_ui.setText("Area : Orange")
    }else if(selectHoldNum == 2){
        gui_nowpos_ui.setText("Area : Yellow")
    }else if(selectHoldNum == 3){
        gui_nowpos_ui.setText("Area : Green")
    }else if(selectHoldNum == 4){
        gui_nowpos_ui.setText("Area : Blue")
    }else if(selectHoldNum == 5){
        gui_nowpos_ui.setText("Area : Indigo")
    }else if(selectHoldNum == 6){
        gui_nowpos_ui.setText("Area : Violet")
    }
}

function KeyRandomSpawning(){
    obj_key.revive()
    isKeyHave = false
    keySpawnPos = getRandom(1, 7) // 일곱 가지 발판(Area) 구역 정하기
    let conSpawnPosDetail = getRandom(1, 3) // 해당 Area의 세부 위치
    
    if(keySpawnPos == 1){ // 1번 발판 구역
        if(conSpawnPosDetail == 1){
            obj_key.goTo(35, 3, -56)
        }else if(conSpawnPosDetail == 2){
            obj_key.goTo(52, 1, -35)
        }else if(conSpawnPosDetail == 3){
            obj_key.goTo(33, 1, -36)
        }
        gui_keyspawn_ui.setText("Key Spawn : Red")
    }else if(keySpawnPos == 2){
        if(conSpawnPosDetail == 1){
            obj_key.goTo(11, 3, -55)
        }else if(conSpawnPosDetail == 2){
            obj_key.goTo(-8, 1, -50)
        }else if(conSpawnPosDetail == 3){
            obj_key.goTo(1, 1, -41)
        }
        gui_keyspawn_ui.setText("Key Spawn : Orange")
    }else if(keySpawnPos == 3){
        if(conSpawnPosDetail == 1){
            obj_key.goTo(-32, 2, -52)
        }else if(conSpawnPosDetail == 2){
            obj_key.goTo(-52, 2, -52)
        }else if(conSpawnPosDetail == 3){
            obj_key.goTo(-52, 2, -38)
        }
        gui_keyspawn_ui.setText("Key Spawn : Yellow")
    }else if(keySpawnPos == 4){
        if(conSpawnPosDetail == 1){
            obj_key.goTo(-10, 2, -3)
        }else if(conSpawnPosDetail == 2){
            obj_key.goTo(-10, 1, 10)
        }else if(conSpawnPosDetail == 3){
            obj_key.goTo(10, 1, 5)
        }
        gui_keyspawn_ui.setText("Key Spawn : Green")
    }else if(keySpawnPos == 5){
        if(conSpawnPosDetail == 1){
            obj_key.goTo(55, 2, 38)
        }else if(conSpawnPosDetail == 2){
            obj_key.goTo(48, 1, 55)
        }else if(conSpawnPosDetail == 3){
            obj_key.goTo(39, 1, 35)
        }
        gui_keyspawn_ui.setText("Key Spawn : Blue")
    }else if(keySpawnPos == 6){
        if(conSpawnPosDetail == 1){
            obj_key.goTo(-8, 1, 40)
        }else if(conSpawnPosDetail == 2){
            obj_key.goTo(-8, 1, 50)
        }else if(conSpawnPosDetail == 3){
            obj_key.goTo(10, 3, 37)
        }
        gui_keyspawn_ui.setText("Key Spawn : Indigo")
    }else if(keySpawnPos == 7){
        if(conSpawnPosDetail == 1){
            obj_key.goTo(-31, 1, 50)
        }else if(conSpawnPosDetail == 2){
            obj_key.goTo(-54, 1, 55)
        }else if(conSpawnPosDetail == 3){
            obj_key.goTo(-54, 1, 33)
        }
        gui_keyspawn_ui.setText("Key Spawn : Violet")
    }
    gui_keyspawn_ui.show()
}

obj_key.onCollide(player, function() { //  Player가 Coin을 획득했을 때
    sfxKey.playAudio()
    isKeyHave = true;
    obj_key.kill()
})
function ResettingData(){
    isGameOvered = false;
    bgmMain.stopAudio()
    bgmMain.setVolume(0.3)
    // 구름 정리
    obj_cloud1.goTo(-1000, 0, 0)
    obj_cloud2.goTo(-1000, 0, 0)
    obj_cloud3.goTo(-1000, 0, 0)
    obj_cloud4.goTo(-1000, 0, 0)
    
    obj_cloud_bright_1.goTo(-1000, 0, 0)
    obj_cloud_bright_2.goTo(-1000, 0, 0)
    game_over_spawn_obj.kill()
}

function GameOver(){
    isGameOvered = true;
    game_over_spawn_obj.revive()
    // roundNum = 1;
    bgmMain.stopAudio()
    sfxOver.playAudio()
    pauseTimer()
    isPlayerTouchingFoothold = false;
    enableKeyControl(false)
    gui_timer_ui.setText("Game Over!!", true)   
    player.goTo(0, -70, 0)
    
    // 다시하기 버튼 구현 필요.

    gui_replay_btn.setText("Re Play")
    gui_replay_btn.show()

    obj_cloud1.goTo(-7, -88, -3)
    obj_cloud2.goTo(0, 0, 3)
    obj_cloud3.goTo(0, -97, -15)
    obj_cloud4.goTo(15, -98, 0)

}

// Trap_A Action Scripts
// 배열 가져오는 함수

// 오브젝트 (장애물) 선언
const trapsA_1 = getObjectsByName("TrapA_1")
const traps_c_1 = getObjectsByName("Trap_C_1")
const traps_e_1 = getObjectsByName("Trap_E_1")
const traps_f_1 = getObjectsByName("Trap_F_1")
const traps_f_2 = getObjectsByName("Trap_F_2")
// 오브젝트 (건축물) 선언
const obj_speed = getObjectsByName("OBJ_SPEED")
const game_over_obj = getObject("GameOverObj")
const obj_fallthing = getObjectsByName("OBJ_Fallthing")

// 오브젝트 (자동차) 선언
// const objCar_1 = getObjectsByName("Car1") // 자동차들은 ByName이 안됨.
const objCar_1 = getObject("Car1")
const objCar_2 = getObject("Car2")
const objCar_3 = getObject("Car3")
const objCar_4 = getObject("Car4")
const objCar_5 = getObject("Car5")
const objCar_6 = getObject("Car6")
const objCar_7 = getObject("Car7")
const objCar_8 = getObject("Car8")
const objCar_9 = getObject("Car9")


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


traps_c_1.forEach((Trap_C_1) => {
    setInterval(() => {
        Trap_C_1.rotateY(1)
    })
    Trap_C_1.onCollide(player, function() {
        
    })
})

traps_e_1.forEach((Trap_E_1) => {
    Trap_E_1.onCollide(player, function() {
        const traps_c_random_number = getRandom(1, 5)
        if(traps_c_random_number == 1){ // 1번 : 파란 발판으로 이동 및 이속 감소 부여.
            player.goTo(55, 1, 55)
            player.changePlayerSpeed(0.5)
            wait(3)
            player.changePlayerSpeed(1)
        }else if(traps_c_random_number == 2){ // 2번 : 보라 발판으로 이동
            player.goTo(-55, 1, 55)
        }else if(traps_c_random_number == 3){ // 3번 : 빨간 발판으로 이동
            player.goTo(55, 1, -55)
        }else if(traps_c_random_number == 4){ // 4번 : 초록 발판으로 이동
            player.goTo(0, 1, 0)
        }else if(traps_c_random_number == 5){ // 5번 : 노란 발판으로 이동
            player.goTo(-55, 1, -55)
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
        player.goTo(-23.5, round(player.getPosition().y, 0)-5, 45)
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
    if(objCar_1.getPosition().x > 110){
        objCar_1.goTo(-110, objCar_1.getPosition().y, objCar_1.getPosition().z)
    }else if(objCar_1.getPosition().x <= 110){
        objCar_1.moveX(221, 30)
    }
    if(objCar_2.getPosition().x > 110){
        objCar_2.goTo(-110, objCar_2.getPosition().y, objCar_2.getPosition().z)
    }else if(objCar_2.getPosition().x <= 110){
        objCar_2.moveX(221, 30)
    }
    if(objCar_3.getPosition().x > 110){
        objCar_3.goTo(-110, objCar_3.getPosition().y, objCar_3.getPosition().z)
    }else if(objCar_3.getPosition().x <= 110){
        objCar_3.moveX(221, 30)
    }

    if(objCar_4.getPosition().x < -110){
        objCar_4.goTo(110, objCar_4.getPosition().y, objCar_4.getPosition().z)
    }else if(objCar_4.getPosition().x >= -110){
        objCar_4.moveX(-221, 30)
    }
    if(objCar_5.getPosition().x < -110){
        objCar_5.goTo(110, objCar_5.getPosition().y, objCar_5.getPosition().z)
    }else if(objCar_5.getPosition().x >= -110){
        objCar_5.moveX(-221, 30)
    }
    
    if(objCar_6.getPosition().x > 110){
        objCar_6.goTo(-110, objCar_6.getPosition().y, objCar_6.getPosition().z)
    }else if(objCar_6.getPosition().x <= 110){
        objCar_6.moveX(221, 30)
    }
    if(objCar_7.getPosition().x > 110){
        objCar_7.goTo(-110, objCar_7.getPosition().y, objCar_7.getPosition().z)
    }else if(objCar_7.getPosition().x <= 110){
        objCar_7.moveX(221, 30)
    }

    if(objCar_8.getPosition().x < -110){
        objCar_8.goTo(110, objCar_8.getPosition().y, objCar_8.getPosition().z)
    }else if(objCar_8.getPosition().x >= -110){
        objCar_8.moveX(-221, 30)
    }
    if(objCar_9.getPosition().x < -110){
        objCar_9.goTo(110, objCar_9.getPosition().y, objCar_9.getPosition().z)
    }else if(objCar_9.getPosition().x >= -110){
        objCar_9.moveX(-221, 30)
    }
}

game_over_obj.onCollide(player, function() { // 플레이어가 라운드 종료 전에 떨어진 경우.
    if(isGameOvered == false){
        GameOver();
    }else{

    }
})

onKeyDown("KeyR", function() {
    RevivingFootHold();
})
onKeyDown("Slash", function() {
})
