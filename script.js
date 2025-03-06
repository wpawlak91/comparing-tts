var synth = window.speechSynthesis;

var inputTxt = document.querySelector('.txt');

var voiceSelect = document.querySelector('select');
var pitch = document.querySelector('#pitch');
var pitchValue = document.querySelector('.pitch-value');
var rate = document.querySelector('#rate');
var rateValue = document.querySelector('.rate-value');
var playButton = document.querySelector('#play')

var voices = [];

var googleVoiceSelect = document.querySelector('.select-google');
var googlePitch = document.querySelector('#pitch-google');
var googlePitchValue = document.querySelector('.pitch-value-google');
var googleRate = document.querySelector('#rate-google');
var googleRateValue = document.querySelector('.rate-value-google');
var audio = document.querySelector('#audio')
var playGoogleButton = document.querySelector('#play-google')

var googleVoices = [];

function populateVoiceList() {
  voices = synth.getVoices()
  .filter(voice => voice.lang.includes('en'))
  .sort(function (a, b) {
      const aname = a.name.toUpperCase(), bname = b.name.toUpperCase();
      if ( aname < bname ) return -1;
      else if ( aname == bname ) return 0;
      else return +1;
  });
  var selectedIndex = voiceSelect.selectedIndex < 0 ? 0 : voiceSelect.selectedIndex;
  voiceSelect.innerHTML = '';
  for(i = 0; i < voices.length ; i++) {
    var option = document.createElement('option');
    option.textContent = voices[i].name + ' (' + voices[i].lang + ')';
    
    if(voices[i].default) {
      option.textContent += ' -- DEFAULT';
    }

    option.setAttribute('data-lang', voices[i].lang);
    option.setAttribute('data-name', voices[i].name);
    voiceSelect.appendChild(option);
  }
  voiceSelect.selectedIndex = selectedIndex;
}

populateVoiceList();
if (speechSynthesis.onvoiceschanged !== undefined) {
  speechSynthesis.onvoiceschanged = populateVoiceList;
}

async function populateGoogleVoiceList() {
    const url = 'https://texttospeech.googleapis.com/v1/voices?key=AIzaSyAntvmjFBAlnkOyYyQE1I8Ef6EnhQaIVU8&languageCode=en-US'
    const result = await(await fetch(url, {method: 'GET'})).json();
    const listOfVoices = await result.voices
    var selectedIndex = googleVoiceSelect.selectedIndex < 0 ? 0 : googleVoiceSelect.selectedIndex;
    googleVoiceSelect.innerHTML = '';
    for(i = 0; i < listOfVoices.length ; i++) {
      var option = document.createElement('option');
      option.textContent = listOfVoices[i].name + '-' + listOfVoices[i].ssmlGender;
      option.setAttribute('data-lang-google', listOfVoices[i].languageCodes);
      option.setAttribute('data-name-google', listOfVoices[i].name);
      option.setAttribute('data-gender-google', listOfVoices[i].ssmlGender);
      googleVoiceSelect.appendChild(option);
    }
    googleVoiceSelect.selectedIndex = selectedIndex;
}

populateGoogleVoiceList();

function speak(){
    if (synth.speaking) {
        console.error('speechSynthesis.speaking');
        return;
    }
    if (inputTxt.value !== '') {
    var utterThis = new SpeechSynthesisUtterance(inputTxt.value);
    utterThis.onend = function (event) {
        console.log('SpeechSynthesisUtterance.onend');
    }
    utterThis.onerror = function (event) {
        console.error('SpeechSynthesisUtterance.onerror');
    }
    var selectedOption = voiceSelect.selectedOptions[0].getAttribute('data-name');
    for(i = 0; i < voices.length ; i++) {
      if(voices[i].name === selectedOption) {
        utterThis.voice = voices[i];
        break;
      }
    }
    utterThis.pitch = pitch.value;
    utterThis.rate = rate.value;
    synth.speak(utterThis);
  }
}

async function googleSpeak(){
    if (inputTxt.value !== '') {
        const url = 'https://texttospeech.googleapis.com/v1/text:synthesize?key=AIzaSyAntvmjFBAlnkOyYyQE1I8Ef6EnhQaIVU8'
        const selectedCode = googleVoiceSelect.selectedOptions[0].getAttribute('data-lang-google');
        const selectedName = googleVoiceSelect.selectedOptions[0].getAttribute('data-name-google');
        const selectedGender = googleVoiceSelect.selectedOptions[0].getAttribute('data-gender-google');
        const reqBody = {
            'audioConfig': {
              'audioEncoding': 'MP3',
              'speakingRate': +googleRate.value,
              'pitch': +googlePitch.value
            },
            'input': {
              'text': inputTxt.value
            },
            'voice': {
              'languageCode': selectedCode,
              'name': selectedName,
              'ssmlGender': selectedGender
            }
        }
        const result = await(await fetch(url, {
            method: 'POST',
            body: JSON.stringify(reqBody)
        })).json()
        const audioContent = await result.audioContent
        const audioUrl = 'data:audio/mp3;base64,' + audioContent;
        audio.src = audioUrl
        audio.play()
    }
}

playGoogleButton.onclick = function(event) {
  event.preventDefault();

  googleSpeak();
}

googlePitch.onchange = function() {
  googlePitchValue.textContent = googlePitch.value;
}

googleRate.onchange = function() {
  googleRateValue.textContent = googleRate.value;
}

googleVoiceSelect.onchange = function(){
  googleSpeak();
}

playButton.onclick = function(event) {
    event.preventDefault();

    speak();
}

pitch.onchange = function() {
    pitchValue.textContent = pitch.value;
}

rate.onchange = function() {
    rateValue.textContent = rate.value;
}

voiceSelect.onchange = function(){
    speak();
}

console.log('Test');