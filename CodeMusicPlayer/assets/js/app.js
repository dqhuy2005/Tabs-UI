const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const heading = $("header h2");
const cdThumb = $(".cd-thumb");
const audio = $("#audio");
const playBtn = $(".btn-toggle-play");
const player = $(".player");
const progress = $("#progress");
const repeatBtn = $(".btn-repeat");
const prevBtn = $(".btn-prev");
const nextBtn = $(".btn-next");
const randomBtn = $(".btn-random");
const playlist = $(".playlist");

const app = {
  currentIndex: 0,
  isRandom: false,
  isRepeat: false,
  songs: [
    {
      name: "Yorushika - Haru",
      singer: "Yorushika",
      path: "./assets/music/haru.mp3",
      image: "./assets/img/logo2.png",
    },
    {
      name: "Itte",
      singer: "Yorushika",
      path: "./assets/music/itte.mp3",
      image: "./assets/img/logo2.png",
    },
    {
      name: "Forget It",
      singer: "Yorushika",
      path: "./assets/music/forgetit.mp3",
      image: "./assets/img/logo2.png",
    },
    {
      name: "Heart Beat",
      singer: "Emi Nitta",
      path: "./assets/music/NittaEmi_HeartBeat.mp3",
      image: "./assets/img/logo2.png",
    },
    {
      name: "Summer Light",
      singer: "Nao, Isui",
      path: "./assets/music/summerLight.mp3",
      image: "./assets/img/logo2.png",
    },
    {
      name: "We Could Get More Machinegun Psystyle!",
      singer: "Camellia",
      path: "./assets/music/WeCouldGetMoreMachineGun.mp3",
      image: "./assets/img/logo2.png",
    },
    {
      name: "Blackmagik Blazing",
      singer: "Camellia",
      path: "./assets/music/BlackmagikBlazing.mp3",
      image: "./assets/img/logo2.png",
    },
    {
      name: "Villain Virus",
      singer: "Kobaryo, Camellia",
      path: "./assets/music/VillainVirus.mp3",
      image: "./assets/img/logo2.png",
    },
    {
      name: "Sound Chimera",
      singer: "Laur",
      path: "./assets/music/SoundChimera.mp3",
      image: "./assets/img/logo2.png",
    },
    {
      name: "Big Dawgs",
      singer: "Hanumankind,Kalmi ",
      path: "./assets/music/BigDawgs.mp3",
      image: "./assets/img/logo2.png",
    },
  ],

  scrollToIntoView: function () {
    setTimeout(() => {
      $(".song.active").scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 300);
  },

  render: function () {
    const htmls = this.songs.map((song, index) => {
      return `
          <div class="song ${
            index === this.currentIndex ? "active" : ""
          }" data-index="${index}">
                <div class="thumb"
                    style="background-image: url('${song.image}')">
                </div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                    <i class="fa-solid fa-ellipsis"></i>
                </div>
            </div>
        `;
    });

    playlist.innerHTML = htmls.join("");
  },

  // Định nghĩa thuộc tính cho object: song
  defineProperties: function () {
    Object.defineProperty(this, "currentSong", {
      get: function () {
        return this.songs[this.currentIndex];
      },
    });
  },

  handleEvent: function () {
    // Handle CD
    const _this = this;

    //console.log(_this);

    const cd = $(".cd");
    const cdWidth = cd.offsetWidth;
    document.onscroll = function () {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      // console.log(scrollTop);
      const newCdWidth = cdWidth - scrollTop;

      cd.style.width = newCdWidth > 0 ? newCdWidth + "px" : 0;
      //cd.style.opacity = newCdWidth / cdWidth + "px";
    };

    const cdThumbAnimate = cdThumb.animate([{ transform: "rotate(360deg)" }], {
      duration: 10000,
      iterations: Infinity,
    });

    // Pause cdThumb
    cdThumbAnimate.pause();

    // Checking if song is playing -> icon change?
    function isPause() {
      if (audio.paused) {
        audio.play();
        player.classList.add("playing");
        cdThumbAnimate.play();
      } else {
        audio.pause();
        player.classList.remove("playing");
        cdThumbAnimate.pause();
      }
    }

    // Play music
    playBtn.onclick = function () {
      // If song still playing -> Pause
      isPause();
    };

    audio.ontimeupdate = function () {
      if (audio.duration) {
        const progressPercent = (audio.currentTime / audio.duration) * 100;
        progress.value = progressPercent;
      }

      progress.oninput = function (e) {
        const seekTime = (audio.duration / 100) * e.target.value;
        //console.log(progress.value);
        audio.currentTime = seekTime;
        //progress.value = seekTime;
      };
    };

    // Next button
    nextBtn.onclick = function () {
      if (_this.isRandom) {
        _this.randomSong();
        isPause();
      } else {
        _this.nextSong();
        isPause();
      }
      audio.play();
      _this.render();
      _this.scrollToIntoView();
    };

    // Previous button
    prevBtn.onclick = function () {
      if (_this.isRandom) {
        _this.randomSong();
        isPause();
      } else {
        _this.prevSong();
        isPause();
      }
      audio.play();
      _this.render();
      _this.scrollToIntoView();
    };

    randomBtn.onclick = function () {
      _this.isRandom = !_this.isRandom;
      randomBtn.classList.toggle("active", _this.isRandom);
    };

    repeatBtn.onclick = function () {
      _this.isRandom = !_this.isRandom;
      repeatBtn.classList.toggle("active", _this.isRandom);
    };

    audio.onended = function () {
      if (_this.isRandom) {
        _this.randomSong();
        isPause();
      } else {
        nextBtn.click();
      }
      audio.play();
    };
    /*
    else if (_this.isRandom && _this.isRepeat) {
        _this.randomSong();
      }
        */
    playlist.onclick = function (e) {
      const songNode = e.target.closest(".song:not(.active)");
      if (songNode || e.target.closest(".option")) {
        if (songNode) {
          _this.currentIndex = Number(songNode.dataset.index);
          _this.loadCurrentSong();
          _this.render();

          isPause();
        }
      }
    };
  },

  // Running music
  loadCurrentSong: function () {
    heading.textContent = this.currentSong.name;
    cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
    audio.src = this.currentSong.path;
  },

  nextSong: function () {
    this.currentIndex++;
    if (this.currentIndex >= this.songs.length - 1) {
      this.currentIndex = 0;
    }
    this.loadCurrentSong();
  },

  prevSong: function () {
    this.currentIndex--;
    if (this.currentIndex < 0) {
      this.currentIndex = this.songs.length - 1;
    }
    this.loadCurrentSong();
  },

  randomSong: function () {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * this.songs.length);
    } while (newIndex === this.currentIndex);
    //console.log(newIndex);

    this.currentIndex = newIndex;
    this.loadCurrentSong();
  },

  start: function () {
    // Định nghĩa các thuộc tính cho Object
    this.defineProperties();

    // Xử lý các sự kiện DOM
    this.handleEvent();

    // Running song when web opening
    this.loadCurrentSong();

    // Render playlist
    this.render();
  },
};

app.start();
