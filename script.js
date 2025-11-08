// --- 미션 데이터 정의 및 상태 관리 ---
const shadows = [
    // 설문대할망이 제주를 빚은 '창조의 시간'
    { id: 'shadow-1', collected: false, name: '창조의 그림자', image: 'images/halmang_creation.png' }, 
    // 제주인의 간절한 '소망의 시간' (돌문화공원)
    { id: 'shadow-2', collected: false, name: '소망의 그림자', image: 'images/halmang_wishes.png' },  
    // 4.3을 통한 '평화의 시간' (4.3 평화공원)
    { id: 'shadow-3', collected: false, name: '평화의 그림자', image: 'images/halmang_peace.png' }   
];

const missionDetails = {
    'shadow-1': {
        location: '설문대여성문화센터 (OT/편지 수신)',
        data: "나, 설문대할망이 너희를 부른다. 제주의 역사를 배우고 지켜낼 '할망의 후예'를 찾기 위해서지. 이곳에서 나의 부름에 응답하는 편지를 받거라. 이 편지가 너희의 첫 번째 그림자, '창조의 정신'이다.",
        mission_text: "할망의 편지를 받는 순간을 셀카로 남겨, 너희 가족이 여정을 시작함을 알려라!",
    },
    'shadow-2': {
        location: '돌문화공원',
        data: "내가 제주 섬을 만들 때 사용한 돌들. 돌 하나하나에 제주 사람들의 간절한 소망이 담겨 있단다. 너희도 이곳에서 소원의 돌담을 쌓고, 그 소망의 정신을 너희의 그림자로 담아가거라.",
        mission_text: "가장 소중한 소원을 빌며 쌓은 '소원의 돌담' 앞에서 가족 사진을 찍어라!",
    },
    'shadow-3': {
        location: '4.3 평화공원',
        data: "내가 섬을 빚었으나, 제주에는 아픔의 바람도 불었다. 수많은 아이들이 평화롭게 살기를 바라는 마음으로 이곳에 잠들어 있단다. 그들의 '영속적인 평화'를 기억하고 그 염원을 담아라.",
        mission_text: "평화의 바람개비가 돌아가는 곳에서, 조용히 평화를 다짐하는 가족의 모습을 담아라!",
    }
};

// 최종 아티팩트 이미지 경로 (바우처 제공 완료 시)
const ARTIFACT_IMAGE_URL = 'images/voucher_final.png'; // <-- 시장 바우처 이미지 등으로 교체하세요.

let currentMissionId = null;
let currentStream = null; 

// DOM 요소 참조
// ... (이전 코드의 DOM 요소 참조 유지) ...
const artifactDisplay = document.getElementById('artifact-display');
const viewArExhibitionButton = document.getElementById('view-ar-exhibition');
const modal = document.getElementById('mission-modal');
const finalArtifactImage = document.getElementById('final-artifact-image');
const artifactMessage = document.getElementById('artifact-message');

const shadowImageStep1 = document.getElementById('step1-shadow-image');
const overlayShadowImage = document.getElementById('overlay-shadow-image'); 

const missionStep1 = document.getElementById('mission-step-1');
const missionStep2 = document.getElementById('mission-step-2');
const cameraFeed = document.getElementById('camera-feed');
const photoCanvas = document.getElementById('photo-canvas');
const captureButton = document.getElementById('capture-button');
const submitButton = document.getElementById('submit-button');
const retakeButton = document.getElementById('retake-button');
const photoFeedback = document.getElementById('photo-feedback');

// --- 미션 진행 로직 (이전 코드와 동일) ---
// (stopCameraStream, closeModal, updateMissionStatus 함수 유지)

// **주의**: startPhotoMission 함수는 2단계 미션 텍스트가 추가되어야 합니다.
function startPhotoMission() {
    missionStep1.style.display = 'none';
    missionStep2.style.display = 'block';

    // 2단계 미션 텍스트 업데이트 (추가)
    const currentDetail = missionDetails[currentMissionId];
    document.getElementById('modal-title-2').textContent = `[${shadows.find(s => s.id === currentMissionId).name}] 인증 미션`;
    document.querySelector('#mission-step-2 .mission-guide').textContent = currentDetail.mission_text;


    // UI 초기화
    cameraFeed.style.display = 'block';
    photoCanvas.style.display = 'none';
    captureButton.style.display = 'block';
    submitButton.style.display = 'none';
    retakeButton.style.display = 'none';
    photoFeedback.textContent = '';
    
    // **오버레이 이미지 보이기**
    overlayShadowImage.style.display = 'block'; 
    
    // 카메라 스트림 요청 (전면 카메라 선호)
    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } })
        .then(stream => {
            currentStream = stream;
            cameraFeed.srcObject = stream;
        })
        .catch(err => {
            document.getElementById('modal-title-2').textContent = '카메라 접근 오류 ❌';
            photoFeedback.textContent = '카메라 접근 권한이 필요합니다. 모바일 환경에서만 지원될 수 있습니다.';
            captureButton.style.display = 'none';
            overlayShadowImage.style.display = 'none';
        });
}

// ... (capturePhoto, retakePhoto, submitPhotoAndComplete 함수 유지) ...
// ... (openLearningMode, triggerNextMission 함수 유지) ...

function completeArtifact() {
    artifactMessage.style.display = 'none'; 
    
    finalArtifactImage.src = ARTIFACT_IMAGE_URL; 
    finalArtifactImage.style.display = 'block';

    if (!artifactDisplay.querySelector('.artifact-complete')) {
        artifactDisplay.insertAdjacentHTML('beforeend', `
            <div class="artifact-complete" style="margin-top: 15px;">
                <p>✨ **미션 완료!** 설문대할망의 모든 그림자를 수집했습니다!</p>
                <p><strong>[시장 바우처]</strong> 교환권을 수령하고 야시장으로 향하세요!</p>
            </div>
        `);
    }

    viewArExhibitionButton.disabled = false;
    viewArExhibitionButton.textContent = '바우처 교환 안내 보기';
    viewArExhibitionButton.style.backgroundColor = '#28a745'; // 완료 강조
}


// --- 페이지 로드 및 이벤트 처리 (이전 코드와 동일) ---
document.addEventListener('DOMContentLoaded', () => {
    updateMissionStatus();

    window.onclick = function(event) {
        if (event.target == modal) {
            closeModal();
        }
    }
    
    viewArExhibitionButton.addEventListener('click', () => {
        alert("바우처 교환처 상세 위치 및 사용 안내 페이지로 이동합니다. (구현 필요)");
    });
});
```eof

### 2. `index.html` (HTML 구조)

* `mission-step-2`의 미션 가이드 문구를 `script.js`에서 동적으로 변경할 수 있도록 ID를 부여했습니다. (나머지는 이전 코드와 동일)

```html:Selfie Mission Timeline Walker:index.html
<main>
        <section id="project-intro">
            <h2>프로젝트 개요</h2>
            <p>설문대할망이 내린 **비밀 편지**를 따라 제주 창조의 정신, 소망, 평화의 그림자를 수집하는 몰입형 가족 학습 여행입니다.</p>
        </section>

        <hr>

        <section id="mission-status">
            <h2>할망의 그림자 수집 현황 (1일차 여정)</h2>
            <div class="shadow-collection">
                <div id="shadow-1" class="shadow-item">
                    <h3>창조의 그림자</h3>
                    <p class="location">장소: 설문대여성문화센터 (OT/편지 수신)</p>
                    <div class="status-indicator incomplete">미수집</div>
                </div>
                <div id="shadow-2" class="shadow-item">
                    <h3>소망의 그림자</h3>
                    <p class="location">장소: 돌문화공원</p>
                    <div class="status-indicator incomplete">미수집</div>
                </div>
                <div id="shadow-3" class="shadow-item">
                    <h3>평화의 그림자</h3>
                    <p class="location">장소: 4.3 평화공원</p>
                    <div class="status-indicator incomplete">미수집</div>
                </div>
            </div>
            <button id="trigger-next-mission" onclick="triggerNextMission()">다음 '미수집' 그림자 미션 시작</button>
        </section>

        <hr>

        <section id="final-artifact">
            <h2>✨ 최종 보상: 야시장 바우처</h2>
            <div id="artifact-display">
                <p id="artifact-message" class="message">세 시대의 '역사적 그림자'를 모두 모으면, **야시장에서 사용할 수 있는 바우처** 교환권이 여기에 나타납니다.</p>
                <img id="final-artifact-image" src="" alt="야시장 바우처 이미지" style="display: none;">
            </div>
            <button id="view-ar-exhibition" disabled>바우처 교환 안내 보기</button>
        </section>
    </main>

    <footer>
        <p>&copy; 설문대할망의 비밀 편지 (가족 학습 여행)</p>
    </footer>

    <div id="mission-modal" class="modal">
        <div class="modal-content">
            <span class="close-button" onclick="closeModal()">&times;</span>
            
            <div id="mission-step-1">
                <h3 id="modal-title-1"></h3>
                <p class="mission-guide">당신은 **<span id="modal-location-1"></span>**에 도착했습니다. 할망의 메시지를 확인하세요.</p>
                
                <div class="shadow-image-container">
                    <img id="step1-shadow-image" src="" alt="역사적 그림자" class="shadow-effect">
                </div>

                <div class="historical-data-box">
                    <h4>📜 할망의 메시지 (현장 사료)</h4>
                    <p id="historical-data"></p>
                </div>
                
                <button id="start-photo-mission" onclick="startPhotoMission()">할망의 뜻 확인 완료 및 인증 시작</button>
            </div>

            <div id="mission-step-2" style="display: none;">
                <h3 id="modal-title-2" class="text-xl font-bold">인증 사진 촬영 (셀카 미션)</h3>
                <p id="mission-step-2-guide" class="mission-guide">현장의 영속적인 정신을 담아 **인증 사진**을 촬영하고 '그림자'를 수집하세요.</p>

                <div class="camera-container">
                    <video id="camera-feed" autoplay playsinline></video>
                    <img id="overlay-shadow-image" src="" alt="오버레이 그림자" class="overlay-effect">
                    <canvas id="photo-canvas" style="display:none;"></canvas>
                </div>

                <div class="camera-controls">
                    <button id="capture-button" onclick="capturePhoto()">📸 사진 찍기</button>
                    <button id="submit-button" onclick="submitPhotoAndComplete()" disabled style="display:none; background-color: #28a745;">✅ 그림자 수집하기</button>
                    <button id="retake-button" onclick="retakePhoto()" style="display:none; margin-top: 10px; background-color: #ffaa33;">🔄 다시 찍기</button>
                </div>

                <p id="photo-feedback" class="feedback"></p>
            </div>
            
        </div>
    </div>
</body>
</html>
```eof

### 3. `style.css` (스타일)

이전 코드와 **동일한 스타일**을 사용하며, 설문대할망 컨셉에 맞게 약간의 문구만 수정되었습니다.

```css:Selfie Mission Styles:style.css
/* 기본 리셋 및 폰트 설정 */
body {
    font-family: 'Inter', sans-serif;
    line-height: 1.6;
    margin: 0;
    padding: 0;
    background-color: #f4f7f9;
    color: #333;
    text-align: center;
}

header {
    background-color: #1a5c88; 
    color: white;
    padding: 25px 0;
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);
}

main {
    padding: 20px;
    max-width: 950px;
    margin: 20px auto;
    background: white;
    border-radius: 12px;
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
}

h1, h2, h3 {
    color: #2c3e50;
}

hr {
    border: 0;
    height: 1px;
    background: #ccc;
    margin: 30px 0;
}

/* 진행 상황 카드 스타일 */
.shadow-collection {
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
    gap: 20px;
}

.shadow-item {
    background: #eef3f7;
    padding: 15px;
    border-radius: 8px;
    width: 30%;
    min-width: 250px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s;
}

.shadow-item:hover {
    transform: translateY(-3px);
}

.status-indicator {
    padding: 6px 12px;
    border-radius: 4px;
    font-weight: bold;
    margin-top: 10px;
    display: inline-block;
    letter-spacing: 0.5px;
}

.incomplete {
    background-color: #ffaa33; 
    color: white;
}

.complete {
    background-color: #28a745; 
    color: white;
}

/* 최종 아티팩트 스타일 */
#artifact-display {
    min-height: 250px;
    background-color: #f8f9fa;
    border: 2px dashed #aeb8c4;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-top: 20px;
    padding: 20px;
}

#final-artifact-image {
    max-width: 80%;
    height: auto;
    border-radius: 8px;
    margin-bottom: 15px;
}

.artifact-complete {
    font-size: 1.2em;
    font-weight: bold;
    color: #cc3333; 
}

/* 버튼 스타일 */
button {
    background-color: #4a90e2;
    color: white;
    border: none;
    padding: 12px 25px;
    margin-top: 20px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 1.05em;
    font-weight: 600;
    box-shadow: 0 4px #357bd9;
    transition: all 0.2s ease;
}

button:hover:not(:disabled) {
    background-color: #357bd9;
    box-shadow: 0 2px #2d68b6;
    transform: translateY(2px);
}

button:disabled {
    background-color: #adb5bd;
    box-shadow: 0 4px #90979e;
    cursor: not-allowed;
}

footer {
    margin-top: 40px;
    padding: 15px 0;
    background-color: #343a40;
    color: white;
    font-size: 0.9em;
}

/* --- 모달 (미션 팝업) 스타일 --- */
.modal {
    display: none;
    position: fixed;
    z-index: 1000;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    background-color: rgba(0,0,0,0.8);
    backdrop-filter: blur(5px);
}

.modal-content {
    background-color: #fefefe;
    margin: 5% auto;
    padding: 30px;
    border-radius: 10px;
    width: 90%;
    max-width: 650px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.5);
    text-align: center;
    animation: fadeIn 0.3s;
}

/* 현장 사료 박스 */
.historical-data-box {
    background-color: #e6f7ff;
    border: 1px solid #b3e0ff;
    padding: 15px;
    margin: 20px 0;
    border-radius: 8px;
    text-align: left;
}

/* 그림자 이미지 스타일 (1단계) */
.shadow-effect {
    width: 150px;
    height: 150px;
    opacity: 0.85; 
    border-radius: 50%;
    border: 4px solid #4a90e2; 
    box-shadow: 0 0 20px rgba(74, 144, 226, 0.8); 
    animation: pulse 2s infinite alternate; 
    object-fit: cover;
}

/* 카메라/비디오 스타일 (2단계) */
.camera-container {
    width: 100%;
    max-width: 400px; /* 카메라 피드 최대 크기 */
    margin: 20px auto;
    border: 5px solid #2c3e50;
    border-radius: 8px;
    overflow: hidden;
    position: relative; 
}

#camera-feed, #photo-canvas {
    width: 100%;
    height: auto;
    display: block;
    aspect-ratio: 4/3; /* 4:3 비율 유지 */
}

/* 오버레이 이미지 스타일 */
.overlay-effect {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%); 
    width: 150px; 
    height: 150px;
    opacity: 0.85; 
    border-radius: 50%;
    border: 4px solid #f9d71c; /* 오버레이 강조 색상 */
    box-shadow: 0 0 25px rgba(249, 215, 28, 0.9); 
    animation: pulse 1.5s infinite alternate; 
    z-index: 10; 
    display: none; 
}

@keyframes pulse {
    from {
        opacity: 0.7;
        transform: scale(1) translate(-50%, -50%); 
    }
    to {
        opacity: 1;
        transform: scale(1.05) translate(-50%, -50%); 
    }
}

/* 기타 스타일... */
```eof