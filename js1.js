const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const playlist= $(".playlist")
const heading = $("header h2");
const cdThumb = $(".cd-thumb");
const audio = $("#audio");
const cd = $(".cd");
const playBtn = $(".btn-toggle-play");
const player = $(".player");
const progress = $("#progress");
const nextbtn = $(".btn-next");
const prevbtn = $(".btn-prev");
const randbtn = $(".btn-random");
const rebtn = $(".btn-repeat");

const app = {
    currentIndex: 0,

    isPlaying: false,
    isActiveRand: false,
    isRepeat: false,
    songs: [
        {
            name: "Bai hat 1",
            singer: "Singer 1",
            path: "./assets/music/baihat1.mp3",
            image: "./assets/img/avt1.jpg",
        },
        {
            name: "Bai hat 2",
            singer: "Singer 2",
            path: "./assets/music/baihat2.mp3",
            image: "./assets/img/avt2.jpg",
        },
        {
            name: "Bai hat 3",
            singer: "Singer 3",
            path: "./assets/music/baihat3.mp3",
            image: "./assets/img/avt3.jpg",
        },
        {
            name: "Bai hat 4",
            singer: "Singer 4",
            path: "./assets/music/baihat4.mp3",
            image: "./assets/img/avt4.jpg",
        },
        {
            name: "Bai hat 5",
            singer: "Singer 5",
            path: "./assets/music/baihat5.mp3",
            image: "./assets/img/avt5.jpg",
        },
        {
            name: "Bai hat 6",
            singer: "Singer 6",
            path: "./assets/music/baihat6.mp3",
            image: "./assets/img/avt6.jpg",
        },
    ],
    render() {
        const htmls = this.songs.map((song,index) => {
            return `
                    <div class="song ${index===this.currentIndex ? 'active':''} " data-index=${index}>
            <div class="thumb" style="background-image: url('${song.image}')">
            </div>
            <div class="body">
            <h3 class="title">${song.name}</h3>
            <p class="author">${song.singer}</p>
            </div>
            <div class="option">
            <i class="fas fa-ellipsis-h"></i>
            </div>
        </div>
    `;
        });
        
        $(".playlist").innerHTML = htmls.join(" ");
    },
    defineProperties: function () {
        Object.defineProperty(this, "currentSong", {
            get: function () {
                return this.songs[this.currentIndex];
            },
        });
    },
    handleEvents() {
        const _this = this;

        // xu li CD rotate
        const cdThumbAnimate = cdThumb.animate(
            [{ transform: "rotate(360deg)" }],
            {
                duration: 10000,
                iterations: Infinity,
            }
        );
        cdThumbAnimate.pause();
        //xu ly phong to thu nho
        const cdWidth = cd.offsetWidth;
        document.onscroll = function () {
            const scrollTop = document.documentElement.scrollTop;
            // console.log(scrollTop)

            const newWidth = cdWidth - scrollTop;
            cd.style.width = newWidth > 0 ? newWidth + "px" : 0;
            cd.style.opacity = newWidth / cdWidth;
        };

        //xu ly play pause
        playBtn.onclick = function () {
            if (!_this.isPlaying) {
                audio.play();
            } else {
                audio.pause();
            }
            audio.onplay = function () {
                player.classList.add("playing");
                _this.isPlaying = true;
                cdThumbAnimate.play();
            };
            audio.onpause = function () {
                player.classList.remove("playing");
                _this.isPlaying = false;
                cdThumbAnimate.pause();
            };

            // xu li thanh tua
            progress.onmousedown=function(){
                audio.pause()
                progress.onmouseup=function(){
                    audio.play()
                }
            }
            
        
            audio.ontimeupdate = function () {
                if (audio.duration) {
                    progressPercent = Math.floor(
                        (audio.currentTime / audio.duration) * 100
                    );
                    progress.value = progressPercent;
                }
            };

            progress.oninput = function (e) {
                audio.currentTime =
                    (e.target.value / 100) * audio.duration;
            };
           
        };

        //xu li next pre
        nextbtn.onclick = function () {
            if (_this.isActiveRand) {
                _this.randomSong();
            } else {
                _this.nextSong();
            }

            audio.play();
        };
        //prev
        prevbtn.onclick = function () {
            if (_this.isActiveRand) {
                _this.randomSong();
            } else {
                _this.prevSong();
            }

            audio.play();
        };
        //random
        randbtn.onclick = function () {
            if (!_this.isActiveRand) {
                randbtn.classList.add("active");
                _this.isActiveRand = true;
                if(_this.isRepeat){rebtn.classList.remove("active");
                _this.isRepeat = !_this.isRepeat;}
                
            } else {
                randbtn.classList.remove("active");
                _this.isActiveRand = false;
            }
        };
        //xu li khi end
        audio.onended = function () {
            if (_this.isRepeat) {
                audio.play();
            } else {
                nextbtn.click();
            }

            // audio.play()
        };
        //xu li repeat
        rebtn.onclick = function () {
            if (_this.isRepeat) {
                rebtn.classList.remove("active");
            } else {
                rebtn.classList.add("active");
                if(_this.isActiveRand){randbtn.classList.remove("active");
                _this.isActiveRand = false;}
                
            }
            _this.isRepeat = !_this.isRepeat;
        };
        //khi nhan vao song trong playlist  
        playlist.onclick=function(e){
            const choose=e.target.closest(".song:not(.active)")
            if(choose||e.target.closest(".option")){
                
                if(choose){
                _this.currentIndex=Number(choose.dataset.index)
                _this.loadCurrentSong()
                audio.play()

                }
                if(e.target.closest(".option")){

                }
            }
        }

        
    },
    scrollCurrentSong(){
        if(this.currentIndex<=1)
        {$('.song.active').scrollIntoView({
            behavior:'smooth',
            block:'end',

        })}
        else{
            $('.song.active').scrollIntoView({
            behavior:'smooth',
            block:'nearest',

        })
        }
        
    },
    loadCurrentSong() {
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = this.currentSong.path;
        this.render()
        this.scrollCurrentSong()
    },
    nextSong() {
        
        if (this.currentIndex >= this.songs.length - 1) {
            this.currentIndex = 0;
        } else {
            this.currentIndex++;
        }
        this.loadCurrentSong();
    },
    prevSong() {
        if (this.currentIndex <= 0) {
            this.currentIndex = this.songs.length - 1;
        } else {
            this.currentIndex--;
        }
        this.loadCurrentSong();
    },
    randomSong() {
        let a = this.currentIndex;
        while (this.currentIndex === a) {
            a = Math.floor(Math.random() * this.songs.length);
        }
        this.currentIndex = a;
        this.loadCurrentSong();
    },

    start: function () {
        // dinh nghia cac thuoc tinh cua object app currentSong
        this.defineProperties();
        // lang nghe su kien cua dom document
        this.handleEvents();

        // tai thong tin bai hat khi vao
        this.loadCurrentSong();
        //render playlist
        this.render();
        //
    },
};

app.start();