const imgMusic = document.querySelector(".img-portada");
const titleMusic = document.getElementById("title");
const authorMusic = document.getElementById("author");

const song = document.querySelector(".song");
const endDuration = document.querySelector(".end");
const startDuration = document.querySelector(".start");
const progressBar = document.querySelector(".bar");
const progressMusic = document.querySelector(".line-progress");
const btnPlayPause = document.querySelector(".btn-play-pause");
const btnPrevious = document.querySelector(".btn-previous");
const btnNext = document.querySelector(".btn-next");

const library = document.querySelector(".library");
const btnClose = document.querySelector("#btn-close");
const btnRepeat = document.querySelector("#btn-repeat");
const btnLibrary = document.querySelector("#btn-library");
const libraryList = document.querySelector(".library-list");

let index = 0;
let isPlay = false;

//carga inicial
window.addEventListener("load", () => {
	//carga de cancion
	loadMusic(index);

	//carga de lista de canciones
	for (let i = 0; i < listMusic.length; i++) {
		let item = document.createElement("li");
		item.setAttribute("li-index", i);
		item.addEventListener("click", () => {
			libraryList.children[index].classList.remove("item-playing");
			index = i;
			isPlay = false;
			loadMusic(index);
			handlePlay();
			handleToggleLibrary();
			item.classList.add("item-playing");
		});

		let divRow = document.createElement("div");
		divRow.classList.add("row");

		let itemTitle = document.createElement("span");
		itemTitle.classList.add("item-title");
		itemTitle.innerText = listMusic[i].title;

		let itemAuthor = document.createElement("span");
		itemAuthor.classList.add("item-author");
		itemAuthor.innerText = listMusic[i].author;

		let itemAudio = document.createElement("audio");
		itemAudio.src = `assets/music/${listMusic[i].src}.mp3`;

		let itemDuration = document.createElement("span");
		itemDuration.classList.add("item-duration");
		itemAudio.addEventListener("loadeddata", () => {
			itemDuration.innerText = formatDuraction(itemAudio.duration);
		});

		divRow.append(itemTitle, itemAuthor);
		item.append(divRow, itemDuration, itemAudio);
		libraryList.appendChild(item);
	}
});

//genera un indice aleatorio distinto de la cancion actual
const shuffle = () => {
	let randIndex;
	do {
		randIndex = Math.floor(Math.random() * listMusic.length);
	} while (index == randIndex);
	return randIndex;
};

// formatea la duracion de una cancion en minutos y segundos
const formatDuraction = (d) => {
	let totalMin = Math.floor(d / 60);
	let totalSec = Math.floor(d % 60);
	if (totalSec < 10) {
		totalSec = `0${totalSec}`;
	}
	return `${totalMin}:${totalSec}`;
};

// carga una nueva cancion
const loadMusic = (i) => {
	imgMusic.src = `assets/images/${listMusic[i].img}`;
	imgMusic.alt = `portada de cancion ${listMusic[i].title}`;
	titleMusic.textContent = listMusic[i].title;
	authorMusic.textContent = listMusic[i].author;
	progressMusic.style.width = "0%";
	song.src = `assets/music/${listMusic[i].src}.mp3`;
	song.addEventListener("loadeddata", () => {
		endDuration.innerText = formatDuraction(song.duration);
	});

	if (isPlay) {
		libraryList.children[i].classList.add("item-playing");
		song.play();
	}
};

// cancion previa
const handlePrevious = () => {
	libraryList.children[index].classList.remove("item-playing");
	if (btnRepeat.innerText === "shuffle") {
		index = shuffle();
	} else {
		index > 0 ? index-- : (index = listMusic.length - 1);
	}
	loadMusic(index);
};

// play y pausa
const handlePlay = () => {
	if (!isPlay) {
		btnPlayPause.setAttribute("src", "assets/images/Pause_fill.svg");
		song.play();
		libraryList.children[index].classList.add("item-playing");
	} else {
		btnPlayPause.setAttribute("src", "assets/images/Play_fill.svg");
		song.pause();
		libraryList.children[index].classList.remove("item-playing");
	}
	isPlay = !isPlay;
};

// siguiente cancion
const handleNext = () => {
	libraryList.children[index].classList.remove("item-playing");
	if (btnRepeat.innerText === "shuffle") {
		index = shuffle();
	} else {
		index < listMusic.length - 1 ? index++ : (index = 0);
	}
	loadMusic(index);
};

// muestra panel de lista de canciones
const handleToggleLibrary = () => {
	library.classList.toggle("show");
};

// manejador de barra progreso cuando se reproduce una cancion
song.addEventListener("timeupdate", (e) => {
	const currentTime = e.target.currentTime;
	const duration = e.target.duration;
	let progressWidth = (currentTime / duration) * 100;

	progressMusic.style.width = `${progressWidth}%`;
	startDuration.innerText = formatDuraction(currentTime);
});

// manejador de evento click en barra de progreso
progressBar.addEventListener("click", (e) => {
	let progressWidth = progressBar.clientWidth;
	let clickedOffsetX = e.offsetX;
	let songDuration = song.duration;

	song.currentTime = (clickedOffsetX / progressWidth) * songDuration;
	song.play();
});

// manejador de evento cuando una cancion acaba
song.addEventListener("ended", () => {
	let getText = btnRepeat.innerText;
	switch (getText) {
		case "repeat":
			handleNext();
			break;
		case "repeat_one":
			loadMusic(index);
			break;
		case "shuffle":
			index = shuffle();
			loadMusic(index);
			break;
	}
});

// manejador de evento de boton repetir
btnRepeat.addEventListener("click", () => {
	let getText = btnRepeat.innerText;
	switch (getText) {
		case "repeat":
			btnRepeat.innerText = "repeat_one";
			btnRepeat.setAttribute("title", "Song looped");
			break;
		case "repeat_one":
			btnRepeat.innerText = "shuffle";
			btnRepeat.setAttribute("title", "Playback shuffled");
			break;
		case "shuffle":
			btnRepeat.innerText = "repeat";
			btnRepeat.setAttribute("title", "Playlist looped");
			break;
	}
});

btnLibrary.addEventListener("click", handleToggleLibrary);
btnClose.addEventListener("click", handleToggleLibrary);
btnPrevious.addEventListener("click", handlePrevious);
btnPlayPause.addEventListener("click", handlePlay);
btnNext.addEventListener("click", handleNext);
