export function displayDialogue(text, onDisplayEnd) {
    const dialogueUI = document.getElementById("dialogue-container");
    const dialogue = document.getElementById("dialogue-content");

    dialogueUI.classList.toggle("hidden");

    let index = 0;
    let currentText = "";
    const intervalRef = setInterval(()=> {
        if (index < text.length) {
            currentText += text[index];
            dialogue.innerHTML = currentText;
            index ++;
            return;
        }

        clearInterval(intervalRef);
    }, 10);

    const closeBtn = document.getElementById("close");

    function onCloseBtnClick() {
        onDisplayEnd();
        dialogueUI.classList.toggle("hidden");
        clearInterval(intervalRef);
        dialogue.innerHTML = "";
        closeBtn.removeEventListener("click", onCloseBtnClick);
    }

    closeBtn.addEventListener("click", onCloseBtnClick);
}

export function setCamScale(k) {
    const resizeFactor = k.width() / k.height();
    if (resizeFactor < 1) {
        k.camScale(k.vec2(1));
        return;
    }
    k.camScale(k.vec2(1.5));
}

export function stopAnimation(player) {
    if (player.direction === "up") {
        player.play("idle-up");
        return;
    } else if (player.direction === "down") {
        player.play("idle-down");
        return;
    } else if (player.direction === "right") {
        player.play("idle-right-side");
        return;
    } else if (player.direction === "left") {
        player.play("idle-left-side");
        return;
    }
}