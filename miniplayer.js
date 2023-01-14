const { Player } = Spicetify;
let miniPlayerIsOpen = false;

const miniPlayer = document.createElement("video");
miniPlayer.muted = true;
miniPlayer.width = 200;
miniPlayer.height = 200;

miniPlayer.src = miniPlayerCanvas;

miniPlayer.addEventListener("enterpictureinpicture", () => {
    miniPlayerIsOpen = true;
    updateTrack();
});
miniPlayer.addEventListener("leavepictureinpicture", () => (miniPlayerIsOpen = false));

const miniPlayerCanvas = document.createElement("canvas");
miniPlayerCanvas.width = miniPlayer.width;
miniPlayerCanvas.height = miniPlayer.height;

const miniPlayerCtx = miniPlayerCanvas.getContext("2d");
miniPlayer.srcObject = miniPlayerCanvas.captureStream();

const miniPlayerButton = new Spicetify.Topbar.Button("Mini Player", "mini-player", () => {
    if (!miniPlayerIsOpen) {
        miniPlayer.requestPictureInPicture();
    } else {
        document.exitPictureInPicture();
    }
});

const coverCanvas = document.createElement("canvas");
coverCanvas.width = miniPlayer.width;
coverCanvas.height = miniPlayer.height;
const coverCtx = coverCanvas.getContext("2d");
const meta = Player.data.track.metadata;
const largeImage = new Image();
largeImage.src = meta.image_url;
largeImage.onload = () => {
    coverCtx.drawImage(largeImage, 0, 0, coverCtx.canvas.width, coverCtx.canvas.height);
};

let currentTrack = {};

Player.addEventListener("songchange", updateTrack);

function updateTrack() {
    if (!miniPlayerIsOpen) {
        return;
    }
    currentTrack = Player.data.track;
    drawTrackInfo(miniPlayerCtx);
}

function drawBackground(ctx, image) {
    const { width, height } = ctx.canvas;
    ctx.drawImage(image, 0, 0, width, height);
}

function drawTrackInfo(ctx) {
    drawBackground(ctx, coverCanvas);
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.font = "16px sans-serif";
    ctx.fillText(currentTrack.metadata.artist_name, ctx.canvas.width/2, 20);
	ctx.drawImage(largeImage, 0, 0, ctx.canvas.width, ctx.canvas.height);
}

miniPlayer.play();
