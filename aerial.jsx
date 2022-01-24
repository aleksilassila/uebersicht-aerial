export const className = `
    div#main {
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        z-index: -100;
        display: flex;
        position: fixed;
    }
    
    .hidden {
        opacity: 0 !important;
    }

    video {
        flex: 1 0 auto;
        object-fit: cover;
        width: 100vw;
        height: 100vh;
        top: 0;
        left: 0;
        position: fixed;
        z-index: 0;
        transition: opacity 2s;
        opacity: 1;
    }
`;

const play = (urls, index) => {
    const video = document.getElementById("video" + (index % 2));
    video.setAttribute("src", urls[index]);
    video.autoplay = true;
    video.load();

    console.log("Playing now index", index, urls)
}

export const render = (urls) => {
    return (
        <div id="main">
            <video id="video0" playsInline autoPlay/>
            <video id="video1" playsInline autoPlay/>
        </div>
    );
};

export const init = async (dispatch) => {
    await fetch("http://127.0.0.1:41417/https://bzamayo.com/extras/apple-tv-screensavers.json").then(res => res.json()).then(res => {
        dispatch(res.data);
    });

    const listen = (el1, el2) => {
        el1.addEventListener('canplay', (e) => {
            el1.className = "";
            console.log("Called canplay", e, "Next in", (e.target.duration - 5));

            setTimeout(() => {
                el2.className = "hidden";
                el2.setAttribute("src", "");
            }, 5000);
            setTimeout(() => dispatch(null), (e.target.duration - 5) * 1000)
        }, false);
    }

    const video0 = document.getElementById("video0");
    const video1 = document.getElementById("video1");

    listen(video0, video1);
    listen(video1, video0);
}

export const updateState = (data, previousState) => {
    if (data) {
        let urls = [];
        data.forEach(place => {
            urls = urls.concat(place?.screensavers?.map(u => u?.videoURL));
        });

        // Shuffle urls
        for (let i = urls.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [urls[i], urls[j]] = [urls[j], urls[i]];
        }

        if (urls?.length) play(urls, 0);
        return {
            index: 0,
            urls,
        }
    }

    play(previousState.urls, previousState.index + 1)
    return {
        ...previousState,
        index: previousState.index + 1,
    }
};

export const initialData = {
    urls: [],
    index: 0,
}
