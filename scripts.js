
const startStoryBtn = document.getElementById('start-story');
const storyText = document.getElementById('story-text');

startStoryBtn.addEventListener('click', () => {
  const stories = [
    "You discover a hidden temple in the mountains...",
    "A mysterious voice invites you to a cultural festival...",
    "An ancient artifact grants you the power to speak with ancestors..."
  ];
  const randomStory = stories[Math.floor(Math.random() * stories.length)];
  storyText.innerText = randomStory;

  
  const speech = new SpeechSynthesisUtterance(randomStory);
  speech.lang = 'en-US';
  window.speechSynthesis.speak(speech);
});


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('avatar'), alpha: true });
renderer.setSize(300, 300);

const geometry = new THREE.SphereGeometry(1, 32, 32);
const material = new THREE.MeshStandardMaterial({ color: 0xff6347 });
const avatar = new THREE.Mesh(geometry, material);
scene.add(avatar);

const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5,5,5);
scene.add(light);

camera.position.z = 3;

function animate() {
  requestAnimationFrame(animate);
  avatar.rotation.y += 0.01;
  renderer.render(scene, camera);
}
animate();


const joinBtn = document.getElementById('join-call');
const localVideo = document.getElementById('localVideo');
const remoteVideo = document.getElementById('remoteVideo');

let localStream;
let peerConnection;
const configuration = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };

joinBtn.addEventListener('click', async () => {
  localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
  localVideo.srcObject = localStream;

  peerConnection = new RTCPeerConnection(configuration);
  localStream.getTracks().forEach(track => peerConnection.addTrack(track, localStream));

  peerConnection.ontrack = (event) => {
    remoteVideo.srcObject = event.streams[0];
  };

  
  const dataChannel = peerConnection.createDataChannel('avatar');
  dataChannel.onmessage = (event) => {
    alert("Avatar says: " + event.data);
  };

  const offer = await peerConnection.createOffer();
  await peerConnection.setLocalDescription(offer);

  
  console.log("SDP Offer (send to remote peer):", offer.sdp);
});
